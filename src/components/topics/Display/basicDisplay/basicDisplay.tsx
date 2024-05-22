'use client';

import { useData } from "@/components/topics/topicProvider/topicProvider";
import { useEffect, useRef } from "react";


export default function BasicDisplay(props: { name: string, list: boolean }) {

    const { name, list } = props;

    const { data, setData } = useData();

    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (!list) {
            return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [data]);


    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            {list && data.map((message, index) => {
                return (
                    <div key={index}>
                        <p>{message.time}</p>
                        <hr />
                        <pre>{JSON.stringify(message.ros, null, 2)}</pre>
                    </div>
                );
            })}

            {!list && data[data.length - 1] && (
                <div>
                    <p>{data[data.length - 1].time}</p>
                    <hr />
                    <pre>{JSON.stringify(data[data.length - 1].ros, null, 2)}</pre>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div >
    );
}
