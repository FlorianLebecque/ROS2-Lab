import { usePublisher } from "@/components/Topics/topicPublisher";
import { useEffect, useState } from "react";
import { Joystick, JoystickShape } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

import style from "./keyboard.module.css";

export default function GamepadControl(props: { topicName: string }) {
    const [publishing, setPublishing] = useState<boolean>(false);

    const [forward, setForward] = useState<boolean>(false);
    const [backward, setBackward] = useState<boolean>(false);
    const [left, setLeft] = useState<boolean>(false);
    const [right, setRight] = useState<boolean>(false);


    const [max_speed, set_max_speed] = useState<number>(20);

    const { publish } = usePublisher();

    const KEY_MAP = {
        "forward": ["Z", "ARROWUP", "W"],
        "backward": ["S", "ARROWDOWN"],
        "left": ["Q", "ARROWLEFT", "A"],
        "right": ["D", "ARROWRIGHT", "D"]
    }



    useEffect(() => {
        const publishToTopic = () => {

            let x = 0;
            let y = 0;

            if (forward) {
                y = max_speed / 100;
            }

            if (backward) {
                y = - max_speed / 100;
            }

            if (left) {
                x = max_speed / 80;
            }

            if (right) {
                x = -max_speed / 80;
            }

            if (publishing) {
                publish({
                    linear: {
                        x: y,
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: x
                    }
                });
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {

            let key = event.key.toUpperCase();

            if (KEY_MAP["forward"].includes(key) || KEY_MAP["backward"].includes(key) || KEY_MAP["left"].includes(key) || KEY_MAP["right"].includes(key)) {

                setPublishing(true);

                if (KEY_MAP["forward"].includes(key)) {
                    setForward(true);
                }

                if (KEY_MAP["backward"].includes(key)) {
                    setBackward(true);
                }

                if (KEY_MAP["left"].includes(key)) {
                    setLeft(true);
                }

                if (KEY_MAP["right"].includes(key)) {
                    setRight(true);
                }

            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {

            let key = event.key.toUpperCase();

            if (KEY_MAP["forward"].includes(key) || KEY_MAP["backward"].includes(key) || KEY_MAP["left"].includes(key) || KEY_MAP["right"].includes(key)) {
                setPublishing(false);

                if (KEY_MAP["forward"].includes(key)) {
                    setForward(false);
                }

                if (KEY_MAP["backward"].includes(key)) {
                    setBackward(false);
                }

                if (KEY_MAP["left"].includes(key)) {
                    setLeft(false);
                }

                if (KEY_MAP["right"].includes(key)) {
                    setRight(false);
                }

            }
        };



        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const interval = setInterval(publishToTopic, 5);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);

            clearInterval(interval);
        };
    }, [publishing, publish]);

    const handleSliderChange = (event: any) => {
        set_max_speed(event.target.value);
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "100%" }}>
            <div>
                <p>{max_speed}%</p>
                <input onChange={handleSliderChange} type="range" min="1" max="500" defaultValue={20} />
            </div>
            <div className="gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr", display: "grid", gridTemplateRows: "1fr 1fr" }}>
                <span></span>
                <span data-active={forward} className={style.key}>Z</span>
                <span> </span>
                <span data-active={left} className={style.key}>Q</span>
                <span data-active={backward} className={style.key}>S</span>
                <span data-active={right} className={style.key}>D</span>
            </div>
        </div>
    );
}