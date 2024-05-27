import { VideoDisplayJPEG } from "../../display/videoDisplay/videoDisplay";
import { TopicProvider } from "../../topicProvider";

export default function JPEGVisualizer(props: { topic: string, type: string }) {

    return (
        <TopicProvider topicName={props.topic} >
            <VideoDisplayJPEG name={props.topic} />
        </TopicProvider>
    );
}