import { usePublisher } from "@/components/topics/topicPublisher";
import { useState } from "react";
import { Joystick, JoystickShape } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

export default function JoystickXY(props: { topicName: string, lock_x: boolean, lock_y: boolean, map_x_to: string, map_y_to: string, factor_x: number, factor_y: number }) {

    const [max_speed, set_max_speed] = useState<number>(20);
    const { publish } = usePublisher();

    /*
        Map the joystick data to the cmd_vel message, for example:
            map_x_to: "angular.z",
            map_y_to: "linear.x",

        {
            "linear": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "angular": {
                "x": 0,
                "y": 0,
                "z": 0
            }
        }
    */


    const update_cmd_vel_from_value = (value: number, cmd_vel_data: any, map: string) => {

        if (map == "none") {
            return;
        }

        // use map to update cmd_vel_data
        const linear_or_angular = map.split(".")[0];
        const axis = map.split(".")[1];

        cmd_vel_data[linear_or_angular][axis] = value;
    }



    const handleMove = (event: IJoystickUpdateEvent) => {
        let { x, y } = event;

        let cmd_vel_data = {
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
        }

        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }

        // normalize the value vector to the max_speed
        x *= max_speed / 100;
        y *= max_speed / 100;

        // forward is x in ros2
        console.log("x: ", x, "factor_x: ", props.factor_x, "map_x_to: ", props.map_x_to);

        update_cmd_vel_from_value(x * props.factor_x, cmd_vel_data, props.map_x_to);
        update_cmd_vel_from_value(y * props.factor_y, cmd_vel_data, props.map_y_to);

        console.log("cmd_vel_data: ", cmd_vel_data);

        publish(cmd_vel_data);
    }

    const handleSliderChange = (event: any) => {
        set_max_speed(event.target.value);
    }

    const get_lock_axis = () => {
        if (props.lock_x) {
            return JoystickShape.AxisY;
        }

        if (props.lock_y) {
            return JoystickShape.AxisX;
        }

        return JoystickShape.Circle;
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "100%" }}>
            <p>{max_speed}%</p>
            <input onChange={handleSliderChange} type="range" min="1" max="100" defaultValue={20} />
            <Joystick throttle={16} controlPlaneShape={get_lock_axis()} size={100} sticky={false} baseColor="#778899" stickColor="#b2cbe5" move={handleMove} />
        </div>
    )
}