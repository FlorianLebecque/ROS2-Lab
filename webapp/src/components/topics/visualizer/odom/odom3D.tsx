import OdomDisplay from "./odom/odom";
import { TopicProvider } from "../../topicProvider";

export default function Odom3DVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic}>
            <OdomDisplay name={props.topic} />
        </TopicProvider>
    );
}