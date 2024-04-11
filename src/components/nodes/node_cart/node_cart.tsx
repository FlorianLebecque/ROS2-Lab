'use client';
import React, { useEffect, useState } from 'react';
import { useRosWeb } from '@/components/RosContext';
import Link from 'next/link';

export default function NodeCart(props: { name: string }) {
    const { name } = props;
    const rosWeb = useRosWeb();

    const [nodeDetails, setNodeDetails] = useState({ subscribers: [], topics: [], services: [] });

    useEffect(() => {
        const fetchNodeDetails = async () => {
            try {
                const details = await rosWeb.GetNodeDetails(name);
                setNodeDetails(details);
            } catch (error) {
                console.error("Error fetching node details:", error);
            }
        };

        fetchNodeDetails();
    }, [name, rosWeb]);

    // ... rest of the component logic

    return (
        <div className="card shade" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td>Subscriber</td>
                            <td>{nodeDetails.subscribers.length}</td>
                        </tr>
                        <tr>
                            <td>Topics</td>
                            <td>{nodeDetails.topics.length}</td>
                        </tr>
                        <tr>
                            <td>Services</td>
                            <td>{nodeDetails.services.length}</td>
                        </tr>
                    </tbody>
                </table>
                <Link href={"diagnostic/" + name} className="btn btn-primary">Details</Link>
            </div>
        </div>
    );
}