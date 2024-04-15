'use client';
import { useState, useEffect } from 'react';
import NodeCart from "../node_cart/node_cart";

import { useRosWeb } from '@/components/RosContext';

export default function NodesGrid() {

    const rosWeb = useRosWeb();

    const [nodes, setNodes] = useState([]);
    const [connected, setConnected] = useState(rosWeb.connected);

    useEffect(() => {

        const fetchNodes = async () => {
            try {
                const nodes = await rosWeb.GetNodesList();
                setNodes(nodes);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        fetchNodes();

        setInterval(() => {
            fetchNodes();
        }, 2000);

    }, [rosWeb]);

    useEffect(() => {

        const handleConnectionStatusChangeGrid = (isConnected: boolean) => {
            console.log("Connection status changed:", isConnected);
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

            {connected && nodes.length === 0 && <div className="alert alert-warning" role="alert"> Loading... </div>}

            {connected && nodes.map((node, index) => {
                return <NodeCart key={index} name={node} />
            })}
        </div>
    );
}