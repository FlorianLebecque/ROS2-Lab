import { TopicPublisher } from "@/components/Topics/topicPublisher";
import KeyboardControl from "./private/Keyboard";

export default function JoystickCMDVEL(props: { topic: string, type: string }) {

    return (
        <TopicPublisher topicName={props.topic} topicType={props.type}>
            <KeyboardControl topicName={props.topic} />
        </TopicPublisher>
    );
}