import { MultiTopicProvider } from "../../multiTopicProvider";
import MultiGraph from "./private/multiGraph";

export default function MultiTopicGraph(props: { namespaceExtractor: string, topic: string, type: string, colors: Map<string, string>, topics: Map<string, string> }) {


    // using namespaceExtractor, extract the namespace from the topic
    // /robotaa/cmd_vel -> robotaa
    let namespace = "";
    if (props.namespaceExtractor) {
        const split = props.topic.split("/");

        if (split[1] !== props.namespaceExtractor) {
            namespace = split[1];
        }

    }


    // convert props.topics to a map
    let topics_map = new Map<string, string>(Object.entries(props.topics));

    for (let [key, value] of topics_map) {
        if (namespace !== "") {
            // check if the topic has already a first '/' if not add it
            if (!value.startsWith("/")) {
                value = "/" + value;
            }
            topics_map.set(key, "/" + namespace + value);
        }
    }

    const colors_map = new Map<string, string>(Object.entries(props.colors));

    return (
        <MultiTopicProvider topicsNames={topics_map} >
            <MultiGraph colors={colors_map} topics={topics_map} />
        </MultiTopicProvider>
    )

}