'use client';

import { useData } from "@/components/Topics/topicProvider";
import { useEffect, useRef } from "react";
import ScrollContainer from "@/components/Utils/ScrollContainer";

export default function BasicDisplay(props: { name: string, list: boolean }) {

    const { list } = props;
    const { data } = useData();

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            {list && <ScrollContainer>
                {data.map((message, index) => {
                    return (
                        <div key={index}>
                            <p>{new Date(message.time).toLocaleString()}</p>
                            <hr />
                            <pre>{JSON.stringify(message.ros, null, 2)}</pre>
                        </div>
                    );
                })}
            </ScrollContainer>}

            {!list && data[data.length - 1] && (
                <div>
                    <p>{new Date(data[data.length - 1].time).toLocaleString()}</p>
                    <hr />
                    <pre>{JSON.stringify(data[data.length - 1].ros, null, 2)}</pre>
                </div>
            )}
        </div >
    );
}
