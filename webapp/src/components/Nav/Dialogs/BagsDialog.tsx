"use client";
import { useEffect, useState } from "react";
import { useNavButtons } from "../NavButtonsProvider";
import OpenCloseDialog from "@/components/Utils/OpenCloseDialog";
import BagAPI from "@/utils/BagApi";
import IBagInfo from "@/utils/interfaces/IBagInfo";
import Bag from "@/components/Bags/Bag";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BagsList from "../Bags/BagsList";
import BagRecoder from "../Bags/BagRecorder";

function BagsDialogButton() {

    return (
        <OpenCloseDialog dialogId={"bags-dialog"} >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-backpack4" viewBox="0 0 16 16">
                <path d="M4 9.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm1 .5v3h6v-3h-1v.5a.5.5 0 0 1-1 0V10z" />
                <path d="M8 0a2 2 0 0 0-2 2H3.5a2 2 0 0 0-2 2v1c0 .52.198.993.523 1.349A.5.5 0 0 0 2 6.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.5a.5.5 0 0 0-.023-.151c.325-.356.523-.83.523-1.349V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2-2m0 1a1 1 0 0 0-1 1h2a1 1 0 0 0-1-1M3 14V6.937q.24.062.5.063h4v.5a.5.5 0 0 0 1 0V7h4q.26 0 .5-.063V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1m9.5-11a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            </svg>
        </OpenCloseDialog>
    );
}

export default function BagsDialog() {

    const { AddButton, RemoveButton } = useNavButtons();

    useEffect(() => {
        const btn = <BagsDialogButton />;
        AddButton("bags", btn);



        return () => {
            RemoveButton("bags");
        };
    }, []);

    return (
        <dialog className='border p-3 shade rounded' id="bags-dialog">
            <h1>ROS Bags</h1>
            <Tabs
                defaultActiveKey="bags"
                className="mb-3"
            >
                <Tab eventKey="bags" title="ROS Bags">
                    <BagsList />
                </Tab>

                <Tab eventKey="register" title="Record">
                    <BagRecoder />
                </Tab>

            </Tabs>

        </dialog>
    );
}