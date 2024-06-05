import IDynamicComponent from "@/utils/interfaces/iDynamicComponent";
import TwoColumnAdderDialog from "./TwoColumnAdder";
import { useRosWeb } from "../RosContext";
import IDialogDefinition from "./DialogDefinition";

export function PublisherAdder(props: { robot: string }) {

    const rosWeb = useRosWeb();


    const ElementGetter = async () => {

        return rosWeb.GetTopicsList();
    }

    const ComponentGetter = async (topicName: string): Promise<IDynamicComponent[]> => {
        const topicType = await rosWeb.GetTopicType(topicName);



        return [];
    }

    const DynamicComponentParamsSetter = (topicName: string, params: any) => {
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
