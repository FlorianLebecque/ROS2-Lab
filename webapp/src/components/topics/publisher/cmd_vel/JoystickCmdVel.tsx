import { TopicPublisher } from "@/components/topics/topicPublisher";
import Joystick from "./private/JoystickXY";

export default function JoystickCMDVEL(props: { topic: string, type: string, lock_x: boolean, lock_y: boolean, map_x_to: string, map_y_to: string, factor_x: number, factor_y: number }) {

    return (
        <TopicPublisher topicName={props.topic} topicType={props.type}>
            <Joystick topicName={props.topic} lock_x={props.lock_x} lock_y={props.lock_y} map_x_to={props.map_x_to} map_y_to={props.map_y_to} factor_x={props.factor_x} factor_y={props.factor_y} />
        </TopicPublisher>
    );
}