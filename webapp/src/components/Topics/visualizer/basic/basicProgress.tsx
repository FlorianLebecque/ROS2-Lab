import BasicDisplay from "./basicDisplay/basicDisplay";
import ControlBar from "../../../Utils/ControlBar/ControlBar";
import { TopicProvider } from "../../topicProvider";
import BasicProgress from "./basicDisplay/basicProgress";

export default function BasicVisualizer(props: { topic: string, type: string, dataset: string, title: string, max: number }) {

    return (
        <TopicProvider topicName={props.topic} >
            <BasicProgress name={props.topic} dataset={props.dataset} title={props.title} max={props.max} />
        </TopicProvider>
    );
}