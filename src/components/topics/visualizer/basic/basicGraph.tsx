import BasicGraph from "../../Display/basicDisplay/basicGraph";
import { TopicProvider } from "../../topicProvider/topicProvider";

export default function BasicGraphVisualizer(props: { topic: string, type: string, dataset: string, title: string, min: number, max: number }) {

    return (
        <TopicProvider topicName={props.topic} >
            <BasicGraph name={props.topic} dataset={props.dataset} title={props.title} min={props.min} max={props.max} />
        </TopicProvider>
    );
}