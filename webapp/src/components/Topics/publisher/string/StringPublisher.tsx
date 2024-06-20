import { TopicPublisher } from "@/components/Topics/topicPublisher";
import String from "./private/String";

export default function ButtonCmdVelZero(props: { topic: string, type: string }) {

    return (
        <TopicPublisher topicName={props.topic} topicType={props.type}>
            <String topicName={props.topic} />
        </TopicPublisher>
    );
}