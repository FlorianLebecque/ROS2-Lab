'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRosWeb } from '@/components/RosContext';

import Robot from '@/utils/Robot';
import RobotCart from '../RobotCart/RobotCart';
import { useSettings } from '@/utils/SettingsProvider';
import Spinner from '@/components/Utils/Spinner/Spinner';

export default function RobotsGrid() {

    const rosWeb = useRosWeb();

    const [robots, setRobots] = useState<Robot[]>([]);
    const [connected, setConnected] = useState(false);
    const { settings } = useSettings();

    useEffect(() => {
        const fetchRobots = async () => {
            try {
                const robots = await rosWeb.GetRobotsList();

                setRobots([...settings().workspaces.map((value: string) => {
                    return new Robot(rosWeb, value);
                }), ...robots,
                ]);
            } catch (error) {
                console.error("Error fetching robots:", error);
            }
        };

        const fetchConnectionStatus = () => {
            setConnected(rosWeb.connected);
        }


        fetchConnectionStatus();

        fetchRobots();

        const update_interval = setInterval(() => {
            fetchConnectionStatus();
            fetchRobots();
        }, 2000);

        return () => {
            clearInterval(update_interval);
        }

    }, [rosWeb, settings]);

    return (
        <div className="d-flex flex-wrap justify-content-evenly gap-3">
            <Suspense fallback={<Spinner />} >
                {!connected && <div className="alert alert-danger" role="alert"> No connection to ROSBridge server </div>}

                {connected && robots.length === 0 && <div className="alert alert-warning" role="alert"> No robots found... </div>}

                {connected && robots.map((robot, index) => {
                    return <RobotCart key={index} name={robot.name} />
                })}
            </Suspense>

        </div>
    );
}