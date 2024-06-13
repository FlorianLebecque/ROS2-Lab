import { TopicPublisher } from "@/components/topics/topicPublisher";
import ButtonZero from "./private/Button";

export default function ButtonCmdVelZero(props: { topic: string, type: string }) {

    return (
        <TopicPublisher topicName={props.topic} topicType={props.type}>
            <ButtonZero topicName={props.topic} />
        </TopicPublisher>
    );
}