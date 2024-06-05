'use client';

import { useEffect, useState } from 'react';
import style from './page.module.css';

import { DashboardProvider } from '@/components/dashboard/dashboardContext';
import DynamicDashboard, { Clear } from '@/components/dashboard/dynamicDashboard';
import { useSettings } from '@/utils/SettingsProvider';

import IDialogDefinition from '@/components/dialogs/DialogDefinition';


import PublisherDialogDefinition from '@/components/dialogs/PublisherAdder';
import TopicSubscriberDialogDefinition from '@/components/dialogs/TopicsAdder';


export default function Page({ params }: { params: { robot: string } }) {

    const { settings, setSettings } = useSettings();
    settings.robot = params.robot;
    //setSettings(settings);

    let hidden = true;

    const currentRobot = params.robot;

    const OpenDialog = (dialogId: string) => {
        const dialog = document.getElementById(dialogId) as HTMLDialogElement;
        dialog?.showModal();
        HideShow();
    }

    // display categories buttons when click on the add button
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        HideShow();
    }

    const HideShow = () => {

        hidden = !hidden;

        const categories = document.getElementsByName("category");

        for (let i = 0; i < categories.length; i++) {

            let index = hidden ? i : categories.length - i - 1;

            let category = categories[index] as HTMLElement;

            setTimeout(() => {
                // trigger hide animation
                if (hidden) {
                    category.classList.remove("display");
                    category.classList.add("hide");
                }
                else {
                    category.classList.remove("hide");
                    category.classList.add("display");
                }
            }, 100 * i);
        }
    }

    const Dialogs: IDialogDefinition[] = [
        PublisherDialogDefinition,
        TopicSubscriberDialogDefinition
    ];

    return (
        <main>
            <DashboardProvider>
                <div className={style.addContainer + " d-flex flex-column justify-content-center align-items-center gap-3"}>
                    <div className='d-flex flex-column justify-content-center align-items-stretch gap-3'>
                        <Clear robot={params.robot} />

                        {Dialogs.map(dialog => (
                            <button key={dialog.dialog_id + dialog.btn_name} onClick={() => OpenDialog(dialog.dialog_id)} name="category" className={style.catbtn + " hide btn btn-outline-primary"}>{dialog.btn_name}</button>
                        ))}
                    </div>
                    <button onClick={handleClick} name="add" className={style.addbtn + " rounded-circle btn btn-primary shade"} style={{ width: "5rem", height: "5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </button>
                </div>
                <div>
                    {Dialogs.map(dialog => (
                        <div key={dialog.dialog_id + "_container"}>{dialog.dialogComponent({ robot: currentRobot })}</div>
                    ))}
                </div>
                <div>
                    <DynamicDashboard robot={currentRobot} />
                </div>
            </DashboardProvider>
        </main>
    );
}