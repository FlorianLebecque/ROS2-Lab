import PointCloudDisplay from "../../display/point_cloud/point_cloud";
import { TopicProvider } from "../../topicProvider";

export default function PointCloudVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <PointCloudDisplay name={props.topic} />
        </TopicProvider>
    );
}