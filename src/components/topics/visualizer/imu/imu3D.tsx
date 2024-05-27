import ImuDataDisplay from "../../Display/imu_data/imu_data";
import { TopicProvider } from "../../topicProvider/topicProvider";

export default function Imu3DVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic}>
            <ImuDataDisplay name={props.topic} />
        </TopicProvider>
    );
}