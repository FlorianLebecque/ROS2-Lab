export default interface IDialogDefinition {
    dialog_id: string;
    title: string;
    btn_name: string;

    dialogComponent: (props: { robot: string }) => JSX.Element;
}