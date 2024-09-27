import React, { useEffect, useRef } from 'react';

const WebrtcRos2VideoStream = (props: { topic: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const host = window.location.origin.replace("https://", "").replace("http://", "").split(":")[0];

    const topic = props.topic;

    useEffect(() => {

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.addTransceiver('video', { direction: 'recvonly' });

        pc.ontrack = (event: RTCTrackEvent) => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
            }
        };

        const negotiate = async () => {
            try {

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                // Wait for ICE gathering to complete with a timeout
                await new Promise<void>((resolve) => {
                    const timeout = setTimeout(() => {
                        console.warn('ICE gathering timed out');
                        resolve();
                    }, 1000); // Adjust timeout as needed

                    if (pc.iceGatheringState === 'complete') {
                        clearTimeout(timeout);
                        resolve();
                    } else {
                        const checkState = () => {
                            if (pc.iceGatheringState === 'complete') {
                                pc.removeEventListener('icegatheringstatechange', checkState);
                                clearTimeout(timeout);
                                resolve();
                            }
                        }
                        pc.addEventListener('icegatheringstatechange', checkState);
                    }
                });


                const response = await fetch(`http://${host}:8080/offer`, {
                    method: 'POST',
                    body: JSON.stringify({
                        sdp: pc.localDescription?.sdp,
                        type: pc.localDescription?.type,
                        topic: topic,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const answer = await response.json();

                await pc.setRemoteDescription(answer);
            } catch (error) {
                console.error("Negotiation failed:", error);
            }
        };

        negotiate();

        return () => {
            pc.close();
        };
    }, []);

    return (
        <div>
            <video
                id="video"
                autoPlay
                muted
                playsInline
                ref={videoRef}
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    );
};

export default WebrtcRos2VideoStream;
