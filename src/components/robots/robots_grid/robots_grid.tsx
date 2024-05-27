'use client';
import { useState, useEffect } from 'react';
import { useRosWeb } from '@/components/RosContext';

import Robot from '@/utils/Robot';
import RobotCart from '../robot_card/robot_cart';

export default function RobotsGrid() {

    const rosWeb = useRosWeb();

    const [robots, setRobots] = useState<Robot[]>([]);
    const [connected, setConnected] = useState(rosWeb.connected);

    useEffect(() => {

        const fetchRobots = async () => {
            try {
                const robots = await rosWeb.GetRobotsList();
                setRobots(robots);
            } catch (error) {
                console.error("Error fetching robots:", error);
            }
        };

        fetchRobots();

        setInterval(() => {
            fetchRobots();
        }, 2000);

    }, [rosWeb]);

    useEffect(() => {

        const handleConnectionStatusChangeGrid = (isConnected: boolean) => {
            setConnected(isConnected);
        };

        rosWeb.subscribeToConnection(handleConnectionStatusChangeGrid);

        return () => {
            rosWeb.unsubscribeFromConnection(handleConnectionStatusChangeGrid);
        };

    }, [rosWeb]);


    return (
        <div className="d-flex flex-wrap justify-content-evenly gap-3">
            {!connected && <div className="alert alert-danger" role="alert"> No connection to ROSBridge server </div>}

            {connected && robots.length === 0 && <div className="alert alert-warning" role="alert"> No robots found... </div>}

            <RobotCart name="Global Dashboard" />

            {connected && robots.map((robot, index) => {
                return <RobotCart key={index} name={robot.name} />
            })}

        </div>
    );
}