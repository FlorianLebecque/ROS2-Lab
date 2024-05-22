'use client';

import { useEffect, useState } from 'react';
import style from './page.module.css';

import { DashboardProvider } from '@/components/dashboard/dashboardContext';
import TopicAdder from '@/components/dialogs/TopicsAdder';


export default function Page({ params }: { params: { robot: string } }) {

    const [hidden, SetHidden] = useState(true);
    const currentRobot = params.robot;

    const OpenDialog = (dialogId: string) => {
        const dialog = document.getElementById(dialogId) as HTMLDialogElement;
        dialog?.showModal();
        SetHidden(true);
    }

    // display categories buttons when click on the add button
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        SetHidden(!hidden);
    }

    useEffect(() => {

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

    }, [hidden]);

    return (
        <main>
            <div className={style.addContainer + " d-flex flex-column justify-content-center align-items-center gap-3"}>
                <div className='d-flex flex-column justify-content-center align-items-stretch gap-3'>
                    <button onClick={() => OpenDialog("topics-adder")} name="category" className={style.catbtn + "hide btn btn-outline-primary"}>Topics</button>
                    <button name="category" className={style.catbtn + "hide btn btn-outline-primary"}>Publisher</button>
                </div>
                <button onClick={handleClick} name="add" className={style.addbtn + " rounded-circle btn btn-primary shade"} style={{ width: "5rem", height: "5rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                    </svg>
                </button>
            </div>
            <DashboardProvider>
                <div>
                    <TopicAdder robot={currentRobot} />
                </div>
            </DashboardProvider>
        </main>
    );
}