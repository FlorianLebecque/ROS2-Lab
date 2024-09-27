import { VideoDisplayJPEG } from "./videoDisplay/videoDisplay";
import { TopicProvider } from "../../topicProvider";
import WebrtcRos2VideoStream from "./videoDisplay/webRTC";

export default function WebRTCVisualizer(props: { topic: string, type: string }) {

    return (
        <WebrtcRos2VideoStream topic={props.topic} />
    );
}