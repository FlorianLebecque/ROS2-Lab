import BasicDisplay from "../../display/basicDisplay/basicDisplay";
import ControlBar from "../../controlbar/controlbar";
import { TopicProvider } from "../../topicProvider";
import BasicProgress from "../../display/basicDisplay/basicProgress";

export default function BasicVisualizer(props: { topic: string, type: string, dataset: string, title: string, max: number }) {

    return (
        <TopicProvider topicName={props.topic} >
            <BasicProgress name={props.topic} dataset={props.dataset} title={props.title} max={props.max} />
        </TopicProvider>
    );
}