'use client';

import { useEffect, useState } from 'react';
import style from './page.module.css';

import { DashboardProvider } from '@/components/Dashboard/DashboardContext';
import Dashboard, { Clear } from '@/components/Dashboard/Dashboard';
import { useSettings } from '@/utils/SettingsProvider';

import IDialogDefinition from '@/components/Dialogs/DialogDefinition';


import PublisherDialogDefinition from '@/components/Dialogs/PublisherAdder';
import TopicSubscriberDialogDefinition from '@/components/Dialogs/TopicsAdder';


export default function Page({ params }: { params: { robot: string } }) {

    const { settings } = useSettings();
    settings().robot_name = params.robot;

    let hidden = true;

    const currentRobot = params.robot;

    const checkHidden = (): boolean => {
        return hidden;
    }

    const handleOpenDialogBtn = (dialogId: string) => {
        if (checkHidden()) {
            return;
        }
        const dialog = document.getElementById(dialogId) as HTMLDialogElement;
        dialog?.showModal();
        hideShowBtns();
    }

    // display categories buttons when click on the add button
    const handleBtnHideShow = (e: React.MouseEvent<HTMLButtonElement>) => {
        hideShowBtns();
    }

    const hideShowBtns = () => {

        function inc(category_btn_container: any, i: number, length: number) {
            console.log(i, length, (i + 1) / length + "");
            category_btn_container.style.opacity = (i + 1) / length + "";
        }

        hidden = !hidden;

        const categories = document.getElementsByName("category");
        const category_btn_container = document.getElementById("dialog_btn_container");

        if (!category_btn_container) {
            return;
        }


        if (hidden) {
            // set invisible after animation
            setTimeout(() => {
                category_btn_container.style.display = "none";
                category_btn_container.style.opacity = "0";
            }, 100 * categories.length);

        } else {
            // set visible before animation
            category_btn_container.style.display = "flex";
            category_btn_container.style.opacity = "0";
        }

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
                    inc(category_btn_container, i, categories.length);
                }
            }, 100 * i);
        }


    }

    const dialogs: IDialogDefinition[] = [
        PublisherDialogDefinition,
        TopicSubscriberDialogDefinition
    ];

    return (
        <main>
            <DashboardProvider>
                <div className={style.addContainer + " d-flex flex-column justify-content-center align-items-center gap-3"} style={{ width: "6rem" }}>
                    <div id="dialog_btn_container" className='flex-column justify-content-center align-items-stretch gap-3'>
                        <Clear checkHidden={checkHidden} robot={params.robot} />

                        {dialogs.map(dialog => (
                            <button key={dialog.dialog_id + dialog.btn_name} onClick={() => handleOpenDialogBtn(dialog.dialog_id)} name="category" className={"hide btn btn-outline-primary"}>{dialog.btn_name}</button>
                        ))}
                    </div>
                    <button onClick={handleBtnHideShow} name="add" className={style.addbtn + " rounded-circle btn btn-primary shade"} style={{ width: "5rem", height: "5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </button>
                </div>
                <div>
                    {dialogs.map(dialog => (
                        <div key={dialog.dialog_id + "_container"}>{dialog.dialogComponent({ robot: currentRobot })}</div>
                    ))}
                </div>
                <div>
                    <Dashboard robot={currentRobot} />
                </div>
            </DashboardProvider>
        </main>
    );
}