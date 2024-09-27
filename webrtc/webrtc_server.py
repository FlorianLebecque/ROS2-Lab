import asyncio
import json
import logging
import os
import threading
import time
import fractions
import numpy as np

from aiohttp import web
import aiohttp_cors
from av import VideoFrame

from aiortc import (
    MediaStreamTrack,
    RTCPeerConnection,
    RTCSessionDescription,
    RTCConfiguration,
    RTCIceServer,
)

# ROS2 imports
import rclpy
from rclpy.node import Node
from rclpy.executors import MultiThreadedExecutor
from sensor_msgs.msg import Image, CompressedImage

import cv2

# Global variables
pcs = set()
logger = logging.getLogger("pc")
image_subscribers = {}  # Global dictionary to track subscribers per topic

# Parameters
HOST_IP = "0.0.0.0"
PORT = 8080
FPS = 15

# Video settings
VIDEO_CLOCK_RATE = 90000
VIDEO_PTIME = 1 / FPS  # Packetization time
VIDEO_TIME_BASE = fractions.Fraction(1, VIDEO_CLOCK_RATE)


class VideoStreamTrack(MediaStreamTrack):
    """
    A video stream track that sends frames from an ImageSubscriber.
    """
    kind = "video"

    def __init__(self, image_subscriber):
        super().__init__()
        self.image_subscriber = image_subscriber
        self.queue = asyncio.Queue(maxsize=1)
        # Get the event loop
        self.loop = asyncio.get_event_loop()
        # Pass the queue and loop to the image subscriber
        self.image_subscriber.set_queue(self.queue, self.loop)
        self.start = time.time()
        self.timestamp = 0

    async def recv(self):
        frame = await self.queue.get()

        # Create a VideoFrame to send via aiortc
        video_frame = VideoFrame.from_ndarray(frame, format='bgr24')

        video_frame.pts, video_frame.time_base = self.next_timestamp()
        return video_frame

        # New: go in bgr format directly
        # Create a VideoFrame to send via aiortc
        # video_frame = VideoFrame.from_ndarray(frame, format='rgb24')
        #video_frame = VideoFrame.from_ndarray(frame, format='bgr24')

        #pts, time_base = await self.next_timestamp()
        #video_frame.pts = pts
        #video_frame.time_base = time_base
        #video_frame.pts, video_frame.time_base = self.next_timestamp()
        #return video_frame


    # new Remove asyncio.sleep: Let the consumer control the pacing ??
    #async def next_timestamp(self):
        #self.timestamp += int(VIDEO_PTIME * VIDEO_CLOCK_RATE)
        #await asyncio.sleep(VIDEO_PTIME)
        #return self.timestamp, VIDEO_TIME_BASE

    #def next_timestamp(self):
        #self.timestamp += int(VIDEO_PTIME * VIDEO_CLOCK_RATE)
        #return self.timestamp, VIDEO_TIME_BASE

    # New: Use Actual Timestamps: Align PTS with actual frame capture times.
    def next_timestamp(self):
        # Use actual time for PTS
        now = time.time()
        self.timestamp = int(now * VIDEO_CLOCK_RATE)
        return self.timestamp, VIDEO_TIME_BASE


class ImageSubscriber(Node):
    def __init__(self, image_topic):
        super().__init__('image_subscriber_' + image_topic.replace('/', '_'))
        self.image_topic = image_topic
        self.peer_connections = set()
        self.queue = None
        self.loop = None

        # Determine the message type of the topic
        self.msg_type = self.get_topic_msg_type(image_topic)
        if self.msg_type is None:
            self.get_logger().error(f"Cannot determine message type for topic '{image_topic}'.")
            self.msg_type = 'sensor_msgs/msg/CompressedImage'
            #raise ValueError(f"Cannot determine message type for topic '{image_topic}'.")

        # Create subscription based on message type
        if self.msg_type == 'sensor_msgs/msg/Image':
            self.get_logger().info(f"Subscribing to '{image_topic}' as 'sensor_msgs/msg/Image'")
            self.subscription = self.create_subscription(
                Image,
                image_topic,
                self.listener_callback_image,
                10)
        elif self.msg_type == 'sensor_msgs/msg/CompressedImage':
            self.get_logger().info(f"Subscribing to '{image_topic}' as 'sensor_msgs/msg/CompressedImage'")
            self.subscription = self.create_subscription(
                CompressedImage,
                image_topic,
                self.listener_callback_compressed_image,
                10)
        else:
            self.get_logger().error(f"Unsupported message type '{self.msg_type}' for topic '{image_topic}'.")
            raise ValueError(f"Unsupported message type '{self.msg_type}' for topic '{image_topic}'.")

    def set_queue(self, queue, loop):
        self.queue = queue
        self.loop = loop

    def get_topic_msg_type(self, topic_name):
        #self.get_logger().error("TOPIC to get type")
        names_and_types = self.get_topic_names_and_types()
        #self.get_logger().error(topic_name)
        for (name, types) in names_and_types:
            #self.get_logger().error(f"{name} {types}")
            if name.lstrip('/') == topic_name.lstrip('/'):
                return types[0]
        return None

    def listener_callback_image(self, msg):
        image = self.ros_image_to_numpy(msg)
        if image is not None:
            future = asyncio.run_coroutine_threadsafe(
                self.queue_put_latest(image), self.loop)
            try:
                future.result()
            except Exception as e:
                self.get_logger().error(f'Error putting image into queue: {e}')
        else:
            self.get_logger().warning('Failed to convert Image message')

    def listener_callback_compressed_image(self, msg):
        image = self.ros_compressed_image_to_numpy(msg)
        if image is not None:
            future = asyncio.run_coroutine_threadsafe(
                self.queue_put_latest(image), self.loop)
            try:
                future.result()
            except Exception as e:
                self.get_logger().error(f'Error putting image into queue: {e}')
        else:
            self.get_logger().warning('Failed to convert CompressedImage message')

    async def queue_put_latest(self, image):
        if self.queue.full():
            try:
                self.queue.get_nowait()
            except asyncio.QueueEmpty:
                pass
        await self.queue.put(image)

    def ros_image_to_numpy(self, msg):
        import numpy as np
        # import cv2
        # New: no need for cv2 ?

        # Handle different encodings without converting to RGB
        if msg.encoding in ['rgb8', 'bgr8']:
            dtype = np.uint8
            channels = 3
        elif msg.encoding == 'bgra8':
            dtype = np.uint8
            channels = 4
        elif msg.encoding == 'mono8':
            dtype = np.uint8
            channels = 1
        else:
            self.get_logger().warning('Unsupported encoding: {}'.format(msg.encoding))
            return None

        # Convert data to numpy array
        data = np.frombuffer(msg.data, dtype=dtype)

        # Check for big endian
        if msg.is_bigendian:
            data = data.byteswap().newbyteorder()

        # Reshape data
        try:
            data = data.reshape((msg.height, msg.width, channels))
        except ValueError as e:
            self.get_logger().warning('Failed to reshape image array: {}'.format(e))
            return None

        # New: No need to convert color space ???

        ## Handle specific encodings
        #if msg.encoding == 'bgr8':
            #data = cv2.cvtColor(data, cv2.COLOR_BGR2RGB)
        #elif msg.encoding == 'bgra8':
            #data = cv2.cvtColor(data, cv2.COLOR_BGRA2RGB)

        ## Convert grayscale to RGB
        #if channels == 1:
            #data = cv2.cvtColor(data, cv2.COLOR_GRAY2RGB)

        return data

    def ros_compressed_image_to_numpy(self, msg):
        import numpy as np
        import cv2

        # Decompress the image
        np_arr = np.frombuffer(msg.data, np.uint8)
        image_np = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image_np is None:
            self.get_logger().warning('Failed to decompress image')
            return None

        # Convert BGR to RGB
        # image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        # New: No need to convert BGR to RGB ???

        return image_np


async def index(request):
    content = open(os.path.join(os.path.dirname(__file__), "index.html"), "r").read()
    return web.Response(content_type="text/html", text=content)


async def offer(request):
    logger.info(await request.json())
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    topic = params.get("topic")

    if not topic:
        return web.Response(status=400, text="Missing 'topic' parameter")

    # Access the executor and loop from the app
    executor = request.app['executor']
    loop = request.app['loop']

    # Configure STUN server
    ice_servers = [RTCIceServer(urls=['stun:stun.l.google.com:19302'])]

    configuration = RTCConfiguration(iceServers=ice_servers)
    pc = RTCPeerConnection(configuration=configuration)
    pcs.add(pc)

    # Get or create the ImageSubscriber for the topic
    if topic not in image_subscribers:
        try:
            image_subscriber = ImageSubscriber(topic)
            image_subscribers[topic] = image_subscriber
            # Add the node to the executor
            executor.add_node(image_subscriber)
        except ValueError as e:
            return web.Response(status=400, text=str(e))
    else:
        image_subscriber = image_subscribers[topic]

    # Register this pc with the image_subscriber
    image_subscriber.peer_connections.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        logger.info(f"Connection state is {pc.connectionState}")
        if pc.connectionState in ["failed", "closed"]:
            await pc.close()
            pcs.discard(pc)
            # Remove pc from image_subscriber's peer_connections
            image_subscriber.peer_connections.discard(pc)
            if not image_subscriber.peer_connections:
                # No clients left, clean up the ImageSubscriber
                executor.remove_node(image_subscriber)
                image_subscriber.destroy_node()
                del image_subscribers[topic]

    # Create video track
    video_track = VideoStreamTrack(image_subscriber)

    # Add video track to the peer connection
    pc.addTrack(video_track)

    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    # Set RTP sender parameters to control bandwidth
    #for sender in pc.getSenders():
    #    if sender.track.kind == 'video':
    #        params = sender.getParameters()
    #        if not params.encodings:
    #            params.encodings = [{}]
    #        params.encodings[0]['maxBitrate'] = 500000  # 500 kbps
    #        params.encodings[0]['maxFramerate'] = FPS    # 15 fps
    #        await sender.setParameters(params)

    return web.Response(
        content_type="application/json",
        text=json.dumps(
            {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
        ),
    )


async def on_shutdown(app):
    # Close all peer connections
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)

    executor = app['executor']

    # Destroy all ImageSubscriber nodes
    for topic, image_subscriber in image_subscribers.items():
        executor.remove_node(image_subscriber)
        image_subscriber.destroy_node()

    # Shutdown the executor
    executor.shutdown()


def main(args=None):
    rclpy.init(args=args)

    # Create a MultiThreadedExecutor
    executor = MultiThreadedExecutor()

    # Start the executor in a separate thread
    executor_thread = threading.Thread(target=executor.spin, daemon=True)
    executor_thread.start()

    # Configure logging
    logging.basicConfig(level=logging.DEBUG)

    # Web server setup
    app = web.Application()
    app.on_shutdown.append(on_shutdown)
    app.router.add_get("/", index)
    app.router.add_post("/offer", offer)

    # Store the executor and loop in the app
    app['executor'] = executor
    app['loop'] = asyncio.get_event_loop()

    # Configure CORS
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    # Apply CORS to all routes
    for route in list(app.router.routes()):
        cors.add(route)

    # Run web server
    web.run_app(app, host=HOST_IP, port=PORT, ssl_context=None)

    # Shutdown executor and ROS2
    executor.shutdown()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
