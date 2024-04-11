'use client';

import { useState, useEffect } from 'react';
import { useRosWeb } from '@/components/RosContext';


export default function Status() {

    const rosWeb = useRosWeb();


    const [connected, setConnected] = useState(rosWeb.connected);
    const [time, setTime] = useState("");


    useEffect(() => {

        const handleConnectionStatusChange = (isConnected: boolean) => {
            setConnected(isConnected);
        };

        rosWeb.subscribeToConnection(handleConnectionStatusChange);

        return () => {
            rosWeb.unsubscribeFromConnection(handleConnectionStatusChange);
        };
    }, [rosWeb]);

    useEffect(() => {

        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, []);

    return (
        <div className="bg-dark d-flex gap-3 justify-content-end align-items-center p-3">
            <div className="text-white">Status: <span className={connected ? "" : "text-danger"}>{connected ? "Connected" : "Disconnected"}</span></div>
            <div className="text-white">ROS<span>2 Humble</span></div>
            <div className="text-white"><span>{time}</span></div>
        </div>
    );
}
