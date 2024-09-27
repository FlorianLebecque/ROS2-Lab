import BasicDisplay from "./basicDisplay/basicDisplay";
import ControlBar from "../../../Utils/ControlBar/ControlBar";
import { TopicProvider } from "../../topicProvider";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {

    return (
        <TopicProvider topicName={props.topic} >
            <div className="m-3 d-grid gap-3" style={{ height: "calc(100% - 2rem)", gridAutoRows: "min-content 1fr" }}>
                <ControlBar topicName={props.topic} topicType={props.type} />
                <BasicDisplay name={props.topic} list={props.list} />
            </div>

        </TopicProvider>
    );
}