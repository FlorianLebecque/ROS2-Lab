import OpenCloseDialog from "@/components/Utils/OpenCloseDialog";
import { useSettings } from "@/utils/SettingsProvider";
import { useEffect, useState } from "react";
import { useNavButtons } from "../NavButtonsProvider";
import { useRosWeb } from "@/components/RosContext";

function WorkSpacesDialogButton() {
    return (
        <OpenCloseDialog dialogId={"workspaces-dialog"} >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-window-sidebar" viewBox="0 0 16 16">
                <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1zM1 13V6h4v8H2a1 1 0 0 1-1-1m5 1V6h9v7a1 1 0 0 1-1 1z" />
            </svg>
        </OpenCloseDialog>
    );
}

function WorkSpaceElement(props: { id: string, value?: string, onDelete: (e: any) => void }) {
    const rosWeb = useRosWeb();

    const isValid = async (e: HTMLInputElement, value: string): Promise<boolean> => {
        const robots = await rosWeb.GetRobotsList();

        if (robots.find((robot) => robot.name === value)) {
            return false;
        }

        // check if a workspace-input has the same value
        const workspaces = document.querySelectorAll("input[name='workspace-input']") as unknown as HTMLInputElement[];
        const input_id = "input_" + props.id;
        for (let i = 0; i < workspaces.length; i++) {

            if (workspaces[i].id === input_id) continue;

            if (workspaces[i].value === value) {
                return false;
            }
        }

        return true
    }

    const onChange = async (e: any) => {
        if (e.target.value === "") {
            e.target.classList.remove("is-invalid");
            return;
        }

        if (!await isValid(e, e.target.value)) {
            e.target.classList.add("is-invalid");
        } else {
            e.target.classList.remove("is-invalid");
        }
    }

    useEffect(() => {
        let input = document.getElementById("input_" + props.id) as HTMLInputElement;
        if (input) {
            input.value = props.value || "";
        }
    });

    return (
        <div className="input-group mb-3" id={"container_" + props.id}>
            <input onChange={onChange} type="text" name="workspace-input" id={"input_" + props.id} className="form-control" placeholder="Workspace name" aria-label="Workspace name" aria-describedby={props.id} />
            <button onClick={props.onDelete} className="btn btn-outline-danger" type="button" id={props.id}>
                <svg id={"svg_" + props.id} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path id={"path_" + props.id} d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </button>
        </div>
    );
}

export default function WorkSpacesDialog() {

    const { settings, saveSettings } = useSettings();
    const { AddButton, RemoveButton } = useNavButtons();

    const [workspaces, setWorkspaces] = useState<string[]>([]);

    useEffect(() => {

        let cur_settings = settings();

        if (cur_settings.workspaces === undefined) {
            cur_settings.workspaces = [];
        } else if (cur_settings.workspaces !== undefined) {
            setWorkspaces(cur_settings.workspaces);
        }

        saveSettings(cur_settings);

        // Code to add button on mount of the component
        AddButton("Workspaces", <WorkSpacesDialogButton />);

        // remove button on unmount of the component
        return () => {
            RemoveButton("Workspaces");
        }
    }, []);

    const onBtnAddClick = () => {

        setWorkspaces([...workspaces, ""]);

    }

    const onBtnSaveClick = () => {
        const workspaces = document.querySelectorAll("input[name='workspace-input']") as unknown as HTMLInputElement[];

        const newWorkspaces = Array.from(workspaces).map((input) => input.value);

        // remove empty string
        newWorkspaces.forEach((value, index) => {
            if (value === "") {
                newWorkspaces.splice(index, 1);
            }
        });

        // remove duplicates
        const unique = new Set(newWorkspaces);
        newWorkspaces.length = 0;
        unique.forEach((value) => newWorkspaces.push(value));

        let cur_settings = settings();
        cur_settings.workspaces = newWorkspaces;
        saveSettings(cur_settings);
        setWorkspaces(newWorkspaces);
    }

    const onDelete = (e: any) => {

        //if e.target is not a button:
        let id = e.target.id;
        if (!(e.target instanceof HTMLButtonElement)) {
            id = e.target.id.split("_")[1];
        }

        // remove from state
        const newWorkspaces = workspaces.filter((value, index) => {
            return index !== parseInt(id)
        });

        setWorkspaces(newWorkspaces);
    }

    return (
        <dialog id="workspaces-dialog" className='border p-3 shade rounded' style={{ height: "60dvh" }}>
            <div className="d-grid" style={{ height: "100%", gridAutoRows: "min-content 1fr min-content" }}>
                <div className="mb-3">
                    <h1>Workspaces</h1>
                    <p>Workspaces are user defined place to manage different dashboard layout, you can add and remove them, it doesn't affect the "robot" workspaces</p>
                </div>

                <div className="d-flex flex-column" id="workspace-container" style={{ overflowY: "auto", scrollbarGutter: "stable" }} >
                    {workspaces.map((value, index) => {
                        return <WorkSpaceElement onDelete={onDelete} key={index} id={index.toString()} value={value} />
                    })}
                </div>

                <div className="d-flex gap-3 justify-content-end align-self-end">
                    <button onClick={onBtnAddClick} className="btn btn-primary">Add</button>
                    <button onClick={onBtnSaveClick} className="btn btn-success">Save</button>
                </div>
            </div>
        </dialog>
    );

}