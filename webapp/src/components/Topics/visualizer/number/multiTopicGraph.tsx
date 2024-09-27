import { MultiTopicProvider } from "../../multiTopicProvider";
import MultiGraph from "./private/multiGraph";

const generatePastelColorFromTopicName = (topic: string) => {

    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
        hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }

    const c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c;

}

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

    // if topics_map is empty, add the topic
    if (topics_map.size === 0) {
        topics_map.set(props.topic, props.topic);
    }

    for (let [key, value] of topics_map) {
        if (namespace !== "") {
            // check if the topic has already a first '/' if not add it
            if (!value.startsWith("/")) {
                value = "/" + value;
            }
            topics_map.set(key, "/" + namespace + value);
        }
    }

    let colors_map = new Map<string, string>(Object.entries(props.colors));

    // add color to the topic that is not in the map
    for (let [key, value] of topics_map) {
        if (!colors_map.has(key)) {
            colors_map.set(key, generatePastelColorFromTopicName(value));
        }
    }

    return (
        <MultiTopicProvider topicsNames={topics_map} >
            <MultiGraph colors={colors_map} topics={topics_map} />
        </MultiTopicProvider>
    )

}