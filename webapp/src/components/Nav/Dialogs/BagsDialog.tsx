"use client";
import { useSettings } from "@/utils/SettingsProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useNavButtons } from "../NavButtonsProvider";
import OpenCloseDialog from "@/components/Utils/OpenCloseDialog";
import BagAPI from "@/utils/BagApi";
import IBagInfo from "@/utils/interfaces/IBagInfo";

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
    const [bags, setBags] = useState<IBagInfo[]>([]);

    useEffect(() => {
        const btn = <BagsDialogButton />;
        AddButton("bags", btn);

        const fetchBags = async () => {
            try {

                const bags_from_api = await BagAPI.getBags();

                setBags(bags_from_api);

            } catch (error) {
                console.error("Error fetching bags:", error);
            }
        }

        fetchBags();

        const bagInterval = setInterval(() => {
            fetchBags();
        }, 10000)

        return () => {
            RemoveButton("bags");
            clearInterval(bagInterval);
        };
    }, []);

    return (
        <dialog className='border p-3 shade rounded' id="bags-dialog">
            <h1>Bags</h1>
            <div className='mt-3'>

                {bags.map((bag) => {
                    return (
                        <div key={bag.pid} className='border p-2 shade rounded mt-2'>
                            <h2>{bag.bag_name}</h2>
                            <p>Topics: {bag.topics.join(", ")}</p>
                            <p>Status: {bag.status}</p>
                        </div>
                    );
                })}

            </div>
        </dialog>
    );
}