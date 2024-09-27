'use client';

import { useData } from "@/components/Topics/topicProvider";
import { useEffect, useRef } from "react";


export default function BasicProgress(props: { name: string, dataset: string, title: string, max: number }) {


    const { data } = useData();


    return (
        <div style={{ height: "100%", overflowY: "auto" }} className="d-flex flex-column justify-content-center align-items-center gap-3">
            <h1>{props.title}</h1>
            {data && data[data.length - 1] && data[data.length - 1].ros && data[data.length - 1].ros[props.dataset] && <progress value={data[data.length - 1].ros[props.dataset]} max={props.max} />}
        </div >
    );
}
