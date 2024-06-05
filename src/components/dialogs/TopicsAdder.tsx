import IDynamicComponent from "@/utils/interfaces/iDynamicComponent";
import TwoColumnAdderDialog from "./TwoColumnAdder";
import { useRosWeb } from "../RosContext";
import IDialogDefinition from "./DialogDefinition";
import { TopicVisualizerLink } from "../topics/topicVisualizerLink";

export function TopicAdder(props: { robot: string }) {

    const rosWeb = useRosWeb();

    const ElementGetter = async () => {
        return rosWeb.GetTopicsList();
    }

    const ComponentGetter = async (topicName: string): Promise<IDynamicComponent[]> => {

        const topicType = await rosWeb.GetTopicType(topicName);

        return TopicVisualizerLink(topicName, topicType);
    }

    const DynamicComponentParamsSetter = async (topicName: string, params: any) => {

        let topicType = await rosWeb.GetTopicType(topicName);

        params.topic = topicName;
        params.type = topicType;

        return params;
    }

    return (
        <TwoColumnAdderDialog key={TopicSubscriberDialogDefinition.dialog_id} dialog_id={TopicSubscriberDialogDefinition.dialog_id} title={TopicSubscriberDialogDefinition.title} robot={props.robot} allow_custom_element={true} elementGetter={ElementGetter} componentGetter={ComponentGetter} dynamicComponentParamsSetter={DynamicComponentParamsSetter} />
    );

}

const TopicSubscriberDialogDefinition: IDialogDefinition = {
    dialog_id: "topic-subscriber-adder",
    title: "Add topic visualizers",
    btn_name: "Topics",

    dialogComponent: TopicAdder
}

export default TopicSubscriberDialogDefinition