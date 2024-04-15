'use client';

import { useState, useEffect } from 'react';
import { useRosWeb } from '@/components/RosContext';
import style from './basic.module.css';

import ControlBar from '@/components/topics/controlbar/controlbar';

export default function BasicTopic(props: { name: string }) {

    const { name } = props;
    const rosWeb = useRosWeb();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {

        const handleData = (message: any) => {

            const new_data = {
                time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                ros: message,
            };

            setData((data) => [...data, new_data]);
        };

        const topic_listeners = rosWeb.SubscribeToTopic(name, (message: any) => {
            handleData(message);
        });

        const Disconnect = () => {
            console.log("Disconnecting from topic: ", name);
            topic_listeners.unsubscribe();
        }

        return () => {
            Disconnect();
        };

    }, [name, rosWeb]);

    return (
        <div className="d-flex flex-column" style={{ height: "100%" }}>
            <ControlBar name={name} />
            <div style={{ height: "100%", overflowY: "auto" }}>
                <div className={style.Card}>
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
            </div>
        </div >
    );
}
