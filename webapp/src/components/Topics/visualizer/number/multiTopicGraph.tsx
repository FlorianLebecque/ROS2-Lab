import { MultiTopicProvider } from "../../multiTopicProvider";
import MultiGraph from "./private/multiGraph";

export default function MultiTopicGraph(props: { topic: string, type: string, colors: Map<string, string>, topics: Map<string, string> }) {

    // convert props.topics to a map
    const topics_map = new Map<string, string>(Object.entries(props.topics));
    const colors_map = new Map<string, string>(Object.entries(props.colors));

    return (
        <MultiTopicProvider topicsNames={topics_map} >
            <MultiGraph colors={colors_map} topics={topics_map} />
        </MultiTopicProvider>
    )

}