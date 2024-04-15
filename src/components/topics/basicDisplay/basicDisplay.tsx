'use client';

import { useData } from "../topicProvider/topicProvider";


export default function BasicDisplay(props: { name: string }) {

    const { data, setData } = useData();

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            <div>
                {data.map((message, index) => {
                    return (
                        <div key={index}>
                            <p>{message.time}</p>
                            <hr />
                            <pre>{JSON.stringify(message.ros, null, 2)}</pre>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
