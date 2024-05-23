import { VideoDisplayUncompressed } from "../../Display/videoDisplay/videoDisplay";
import { TopicProvider } from "../../topicProvider/topicProvider";

export default function UncompressVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <VideoDisplayUncompressed name={props.topic} />
        </TopicProvider>
    );
}