import { TopicPublisher } from "@/components/Topics/topicPublisher";
import GamepadControl from "./private/Gamepad";

export default function JoystickCMDVEL(props: { topic: string, type: string }) {

    return (
        <TopicPublisher topicName={props.topic} topicType={props.type}>
            <GamepadControl topicName={props.topic} />
        </TopicPublisher>
    );
}