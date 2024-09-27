'use client';
import { useState, useEffect } from 'react';
import NodeCart from "../NodeCart/NodeCart";

import { useRosWeb } from '@/components/RosContext';

interface NodesGridProps {
    namespace?: string;
    banner: boolean;
}

export default function NodesGrid({ namespace = '', banner = false }: NodesGridProps) {

    const rosWeb = useRosWeb();

    const [nodes, setNodes] = useState<string[]>([]);
    const [connected, setConnected] = useState(rosWeb.connected);

    useEffect(() => {

        const fetchNodes = async () => {
            try {
                const nodes = await rosWeb.GetNodesList();

                if (namespace !== '') {
                    const filteredNodes = nodes.filter((node: string) => node.includes(namespace));
                    setNodes(filteredNodes);
                    return;
                }

                setNodes(nodes);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        fetchNodes();

        const interval = setInterval(() => {
            fetchNodes();
        }, 2000);

        return () => { clearInterval(interval); }

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

    const css_class = banner ? "d-iflex gap-3" : "d-flex flex-wrap justify-content-evenly gap-3";


    return (
        <div>
            <div className={css_class}>
                {!connected && <div className="alert alert-danger" role="alert"> No connection to ROSBridge server </div>}

                {connected && nodes.length === 0 && <div className="alert alert-warning" role="alert"> Loading... </div>}

                {connected && nodes.map((node, index) => {
                    return <NodeCart key={index} name={node} />
                })}
            </div>
        </div>
    );
}