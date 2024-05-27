import BasicDisplay from "../../display/basicDisplay/basicDisplay";
import ControlBar from "../../controlbar/controlbar";
import { TopicProvider } from "../../topicProvider";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {

    return (
        <TopicProvider topicName={props.topic} >
            <ControlBar topicName={props.topic} topicType={props.type} />
            <BasicDisplay name={props.topic} list={props.list} />
        </TopicProvider>
    );
}