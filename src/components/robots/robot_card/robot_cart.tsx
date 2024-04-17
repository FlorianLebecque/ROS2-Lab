'use client';
import React, { useEffect, useState } from 'react';
import { useRosWeb } from '@/components/RosContext';
import Link from 'next/link';

export default function RobotCart(props: { name: string }) {
    const { name } = props;
    // const rosWeb = useRosWeb();

    // const [nodeDetails, setNodeDetails] = useState({ subscribers: [], topics: [], services: [] });

    // useEffect(() => {
    //     const fetchNodeDetails = async () => {
    //         try {
    //             const details = await rosWeb.GetNodeDetails(name);
    //             setNodeDetails(details);
    //         } catch (error) {
    //             console.error("Error fetching node details:", error);
    //         }
    //     };

    //     fetchNodeDetails();

    //     setInterval(() => {
    //         fetchNodeDetails();
    //     }, 2000);

    // }, [name, rosWeb]);

    // const address = name.replace(/\/+/g, '@');

    // ... rest of the component logic

    return (
        <div className="card shade" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <Link href={"/waypoint/" + name} className="btn btn-primary">Navigate</Link>
            </div>
        </div>
    );
}