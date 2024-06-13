import DiodeTemp from "./emi/DiodeTemp";
import { TopicProvider } from "../../topicProvider";

export default function DiodeTempVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <DiodeTemp name={props.topic} />
        </TopicProvider>
    );
}