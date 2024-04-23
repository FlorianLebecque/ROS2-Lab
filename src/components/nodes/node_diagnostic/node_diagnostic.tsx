'use client';

import style from './node_diagnostic.module.css';
import React from 'react';

import { useRosWeb } from "@/components/RosContext";
import { NodeDetail } from "@/js/RosWeb";
import { useState, useEffect } from "react";
import ComponentFactory from './node_componentFactory';


export default function NodeDiagnostic(props: { name: string }) {

    const { name } = props;
    const rosWeb = useRosWeb();
    const [nodeDetails, setNodeDetails] = useState<NodeDetail>({ subscribers: [], topics: [], services: [] });

    const [activeComponentType, setActiveComponentType] = useState(null as string | null);
    const [activeComponentProp, setActiveComponentProp] = useState(null) as any;

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

        const interval = setInterval(() => {
            fetchNodeDetails();
        }, 2000);

        return () => { clearInterval(interval); }

    }, [name, rosWeb]);

    const handleTopicClick = (topic: string) => {
        setActiveComponentType("topic");
        setActiveComponentProp({ topic: topic });
    };



    return (
        <div className='row' style={{ height: "100%" }}>
            <div className="col-lg-3" style={{ height: "100%" }}>
                <div className={style.LeftPanel}>
                    <div className={style.Card + " d-flex justify-content-center align-items-center border"}>
                        <h2>{name}</h2>
                    </div>
                    <div id="SubscribersList" className={style.Card + " border"}>
                        <ul>
                            {nodeDetails.subscribers.map((sub: string) => {
                                return <li key={sub}>{sub}</li>;
                            })}
                        </ul>
                    </div>
                    <div id="TopicsList" className={style.Card + " d-flex flex-column gap-1 border"}>
                        {nodeDetails.topics.map((topic: string) => {
                            return <button onClick={() => handleTopicClick(topic)} className="btn btn-outline-secondary" key={topic}>{topic}</button>;
                        })}
                    </div>
                    <div id="ServicesList" className={style.Card + " border"}>
                        <ul>
                            {nodeDetails.services.map((service: string) => {
                                return <li key={service}>{service}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='col-lg-9' style={{ height: "100%" }}>
                <div id="node_container" className={style.Card + " border"} style={{ height: "100%" }}>
                    {activeComponentType && (
                        <ComponentFactory type={activeComponentType} props={activeComponentProp} />
                    )}
                </div>
            </div>
        </div >

    );
}