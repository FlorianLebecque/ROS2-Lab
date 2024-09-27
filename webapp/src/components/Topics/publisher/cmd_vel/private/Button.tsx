import { usePublisher } from "@/components/Topics/topicPublisher";
import { useEffect, useState } from "react";
import { Joystick, JoystickShape } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

export default function ButtonZero(props: { topicName: string }) {

    const [publishing, set_publishing] = useState<boolean>(false);
    const { publish } = usePublisher();


    const startMove = (event: any) => {
        set_publishing(true);
    }

    const stopMove = (event: any) => {
        set_publishing(false);
    }

    useEffect(() => {

        const publish_to_topic = () => {

            if (publishing) {
                publish({
                    linear: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                });
            }

        }

        const interval = setInterval(publish_to_topic, 5);

        return () => {
            clearInterval(interval);
        }

    }, [publishing])



    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "100%" }}>
            <button className="btn btn-danger" style={{ height: "100%", width: "100%" }} onMouseDown={startMove} onMouseUp={stopMove} onTouchStart={startMove} onTouchEnd={stopMove} >Stop</button>
        </div>
    )
}