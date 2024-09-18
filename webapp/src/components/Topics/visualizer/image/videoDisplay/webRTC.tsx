import React, { useEffect, useRef } from 'react';

const WebrtcRos2VideoStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

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
                console.log("Starting negotiation");

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                // Wait for ICE gathering to complete
                await new Promise<void>((resolve) => {
                    if (pc.iceGatheringState === 'complete') {
                        resolve();
                    } else {
                        const checkState = () => {
                            if (pc.iceGatheringState === 'complete') {
                                pc.removeEventListener('icegatheringstatechange', checkState);
                                resolve();
                            }
                        };
                        pc.addEventListener('icegatheringstatechange', checkState);
                    }
                });

                console.log("Sending offer to server");

                const response = await fetch('http://192.168.11.112:8080/offer', {
                    method: 'POST',
                    body: JSON.stringify({
                        sdp: pc.localDescription?.sdp,
                        type: pc.localDescription?.type,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const answer = await response.json();
                console.log("Received answer from server");

                await pc.setRemoteDescription(answer);
                console.log("Set remote description");
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
                playsInline
                ref={videoRef}
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    );
};

export default WebrtcRos2VideoStream;
