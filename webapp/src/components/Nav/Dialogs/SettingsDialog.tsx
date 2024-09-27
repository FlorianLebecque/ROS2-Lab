import { useSettings } from "@/utils/SettingsProvider";
import Link from "next/link";
import { useEffect } from "react";
import { useNavButtons } from "../NavButtonsProvider";
import OpenCloseDialog from "@/components/Utils/OpenCloseDialog";


function SettingsDialogButton() {

    return (
        <OpenCloseDialog dialogId={"settings-dialog"} >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-sliders" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z" />
            </svg>
        </OpenCloseDialog>
    );
}

export default function SettingsDialog() {

    const { exportToJson, importFromJson } = useSettings();
    const { AddButton, RemoveButton } = useNavButtons();


    const ExportClick = () => {
        exportToJson();
    }

    const ImportLayout = async (e: any) => {

        if (e.target.files.length == 0) return;

        const parsedJson = await handleFileUpload(e);
        importFromJson(parsedJson);

        // clear input
        const input = document.getElementById('settingsFileInput') as HTMLInputElement;
        input.value = '';


        // close dialog
        const dialog = document.getElementById('settings-dialog') as HTMLDialogElement;
        dialog.close();
    }

    const handleFileUpload = (event: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (event === null || event.target === null) {
                reject(new Error("No file selected."));
                return;
            }

            const fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = (e: any) => {
                try {
                    const parsedJson = JSON.parse(e.target.result);
                    resolve(parsedJson);
                } catch (err) {
                    console.error("Error parsing JSON:", err);
                    reject(err);
                }
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    useEffect(() => {
        const btn = <SettingsDialogButton />;

        AddButton("settings", btn, Infinity);

        return () => {
            RemoveButton("settings");
        }
    }, []);

    return (
        <dialog className='border p-3 shade rounded' id="settings-dialog">
            <h1>Settings</h1>
            <div className='mt-3'>

                <div className='mb-3'>
                    <h2>Pages</h2>
                    <Link href="/diagnostic" className='btn btn-primary' >Diagnostic</Link>
                </div>

                <div className='mb-3'>
                    <h2>Export/Import</h2>
                    <div className='input-group mb-3'>
                        <button onClick={() => ExportClick()} className='btn btn-outline-primary' >Export to JSON</button>
                    </div>

                    <div className="input-group mb-3">
                        <label className="input-group-text">Import</label>
                        <input onChange={ImportLayout} type="file" className="form-control" id="settingsFileInput" />
                    </div>
                </div>

            </div>
        </dialog>
    );
}