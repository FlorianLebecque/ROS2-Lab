import IDynamicComponent from "@/utils/interfaces/IDynamicComponent";
import TwoColumnAdderDialog from "./TwoColumnAdder";
import { useRosWeb } from "../RosContext";
import IDialogDefinition from "./DialogDefinition";
import { TopicPublishersLink } from "../Topics/topicPublisherLink";

export function PublisherAdder(props: { robot: string }) {

    const rosWeb = useRosWeb();

    const ElementGetter = async () => {
        return rosWeb.GetTopicsList();
    }

    const ComponentGetter = async (topicName: string): Promise<IDynamicComponent[]> => {

        let topicType = "";

        // if topic name contain | , the right side is the type
        if (topicName.includes("|")) {
            const topicNameType = topicName.split("|");
            topicName = topicNameType[0];
            topicType = topicNameType[1];
        } else {
            topicType = await rosWeb.GetTopicType(topicName);
        }

        console.log(topicType);

        return TopicPublishersLink(topicName, topicType);
    }

    const DynamicComponentParamsSetter = async (topicName: string, params: any) => {

        let topicType = "";

        // if topic name contain | , the right side is the type
        if (topicName.includes("|")) {
            const topicNameType = topicName.split("|");
            topicName = topicNameType[0];
            topicType = topicNameType[1];
        } else {
            topicType = await rosWeb.GetTopicType(topicName);
        }

        params.topic = topicName;
        params.type = topicType;
        params.title = topicName;

        return params;
    }

    return (
        <TwoColumnAdderDialog key={PublisherDialogDefinition.dialog_id} dialog_id={PublisherDialogDefinition.dialog_id} title={PublisherDialogDefinition.title} robot={props.robot} allow_custom_element={true} elementGetter={ElementGetter} componentGetter={ComponentGetter} dynamicComponentParamsSetter={DynamicComponentParamsSetter} />
    );

}

const PublisherDialogDefinition: IDialogDefinition = {
    dialog_id: "publisher-adder",
    title: "Add publisher",
    btn_name: "Publisher",

    dialogComponent: PublisherAdder
}

export default PublisherDialogDefinition
