'use client';

import { useData } from "@/components/topics/topicProvider/topicProvider";
import { useEffect, useRef } from "react";


export default function BasicDisplay(props: { name: string }) {

    const { data, setData } = useData();

    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [data]);


    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            {data.map((message, index) => {
                return (
                    <div key={index}>
                        <p>{message.time}</p>
                        <hr />
                        <pre>{JSON.stringify(message.ros, null, 2)}</pre>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div >
    );
}
