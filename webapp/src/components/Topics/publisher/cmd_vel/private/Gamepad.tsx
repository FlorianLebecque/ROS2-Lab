import { usePublisher } from "@/components/Topics/topicPublisher";
import { useEffect, useState } from "react";

import Gamepad from "react-gamepad";

export default function GamepadControl(props: { topicName: string }) {
    const [max_speed, set_max_speed] = useState<number>(20);
    const [enable, setEnable] = useState<boolean>(false);


    const [leftJoystick, setLeftJoystick] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [triggerLeft, setTriggerLeft] = useState<number>(0);
    const [triggerRight, setTriggerRight] = useState<number>(0);
    const [rightJoystick, setRightJoystick] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [buttonA, setButtonA] = useState<boolean>(false);

    const [isConnected, setIsConnected] = useState<string>("red");

    const { publish } = usePublisher();

    useEffect(() => {

        const publisherInterval = setInterval(() => {

            let rotation = 0;
            let speed = 0;

            // use the rigth and left triggers to control the speed
            // right trigger -> forward
            // left trigger -> backward

            let speedValue = Math.abs((triggerRight - triggerLeft)) > 0.05 ? (triggerRight - triggerLeft) * max_speed : 0;
            speed = speedValue / 100;

            // use the y axis of the left joystick to control the rotation
            rotation = (Math.abs(leftJoystick.y) > 0.25) ? -1 * leftJoystick.y * max_speed / 100 : 0;

            //console.log("speed", speed, "rotation", rotation, "moving", buttonA);

            // publish the message
            if ((rotation != 0 || speed != 0) && (enable || buttonA)) {
                publish({
                    linear: {
                        x: speed,
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: rotation
                    }
                });
            }
        }, 16);

        return () => {
            clearInterval(publisherInterval);
        }

    });


    useEffect(() => {

        const inputSpeed = document.getElementById("speedInput") as HTMLInputElement;

        const updateSpeedInterval = setInterval(() => {

            if (inputSpeed) {

                let inc = (Math.abs(rightJoystick.y) > 0.3) ? rightJoystick.y : 0;

                let speed = max_speed + inc;

                // round speed to 2 decimal places
                speed = parseFloat(speed.toFixed(2));

                if (speed < 0) {
                    speed = 0;
                }

                if (speed > 500) {
                    speed = 500;
                }

                inputSpeed.value = speed.toString();

                set_max_speed(speed);
            }

        }, 16);

        return () => {
            clearInterval(updateSpeedInterval);
        }

    });

    const handleSliderChange = (event: any) => {
        set_max_speed(event.target.value);
    }

    const handleGamepadConnect = () => {
        setIsConnected("green");
    }

    const handleGamepadDisconnect = () => {
        setIsConnected("red");
    }

    const handleButtonChange = (buttonName: string, value: boolean) => {
        if (buttonName === "A") {
            setButtonA(value);
        }
    }

    const handleJoystickChange = (joystickName: string, x: number, y: number) => {

        if (joystickName === "LeftStickX") {
            setLeftJoystick({ x, y });
        }

        // triggerLeft
        if (joystickName === "LeftTrigger") {
            setTriggerLeft(x);
        }

        // triggerRight
        if (joystickName === "RightTrigger") {
            setTriggerRight(x);
        }

        if (joystickName === "RightStickY") {
            setRightJoystick({ x, y });
        }
    }

    const checkBoxChange = (event: any) => {
        setEnable(event.target.checked);
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "100%" }}>
            <div>
                <p>{max_speed}%</p>
                <input id="speedInput" onChange={handleSliderChange} type="range" min="1" max="500" defaultValue={20} />
            </div>
            <div className="form-check form-switch">
                <input onChange={checkBoxChange} className="form-check-input" type="checkbox" id="GamePadEnable" />
                <label className="form-check-label" htmlFor="GamePadEnable">Enable</label>
            </div>

            <Gamepad onAxisChange={handleJoystickChange} onButtonChange={handleButtonChange} onConnect={handleGamepadConnect} onDisconnect={handleGamepadDisconnect}  >
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill={isConnected} className="bi bi-controller" viewBox="0 0 16 16">
                    <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z" />
                    <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27" />
                </svg>
            </Gamepad>

        </div>
    );
}