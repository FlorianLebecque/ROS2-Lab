import { VideoDisplayUncompressed } from "../../display/videoDisplay/videoDisplay";
import { TopicProvider } from "../../topicProvider";

export default function UncompressVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <VideoDisplayUncompressed name={props.topic} />
        </TopicProvider>
    );
}