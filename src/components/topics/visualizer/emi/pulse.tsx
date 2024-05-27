import PulseRaw from "../../Display/emi/PulseRaw";
import { TopicProvider } from "../../topicProvider";

export default function EMIPulseVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <PulseRaw name={props.topic} />
        </TopicProvider>
    );
}