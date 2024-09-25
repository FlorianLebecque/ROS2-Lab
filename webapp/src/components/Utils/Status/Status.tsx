'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRosWeb } from '@/components/RosContext';
import Spinner from '../Spinner/Spinner';


export default function Status() {

    const rosWeb = useRosWeb();

    const [connected, setConnected] = useState(false);
    const [time, setTime] = useState("");


    useEffect(() => {

        const interval = setInterval(() => {
            setConnected(rosWeb.connected);
        }, 5000);

        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);


        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="bg-light d-flex gap-3 justify-content-end align-items-center p-3">
            <Suspense fallback={<Spinner />} >
                <div className="">Status: <span className={connected ? "" : "text-danger"}>{connected ? "Connected" : "Disconnected"}</span></div>
                <div className="">ROS<span>2 Humble</span></div>
                <div className="">Version: <span>0.0.2</span></div>
                <div className=""><span>{time}</span></div>
            </Suspense>
        </div>
    );
}
