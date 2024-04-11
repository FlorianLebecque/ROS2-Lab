'use client';

import style from './node_diagnostic.module.css';

import { useRosWeb } from "@/components/RosContext";
import { useState, useEffect } from "react";

export default function NodeDiagnostic(props: { name: string }) {

    const { name } = props;
    const rosWeb = useRosWeb();

    const [nodeDetails, setNodeDetails] = useState({ subscribers: [], topics: [], services: [] });

    useEffect(() => {
        const fetchNodeDetails = async () => {
            try {
                const details = await rosWeb.GetNodeDetails("/" + name);

                setNodeDetails(details);
            } catch (error) {
                console.error("Error fetching node details:", error);
            }
        };

        fetchNodeDetails();
    }, [name, rosWeb]);

    return (
        <div className='row' style={{ height: "100%" }}>
            <div className="col-lg-3" style={{ height: "100%" }}>
                <div className={style.LeftPanel}>
                    <div className={style.Card + " d-flex justify-content-center align-items-center"}>
                        <h2>{name}</h2>
                    </div>
                    <div id="SubscribersList" className={style.Card + " "}>
                        <ul>
                            {nodeDetails.subscribers.map((sub: string) => {
                                return <li key={sub}>{sub}</li>;
                            })}
                        </ul>
                    </div>
                    <div id="TopicsList" className={style.Card + " d-flex flex-column"}>
                        {nodeDetails.topics.map((topic: string) => {
                            return <button key={topic}>{topic}</button>;
                        })}
                    </div>
                    <div id="ServicesList" className={style.Card + " "}>
                        <ul>
                            {nodeDetails.services.map((service: string) => {
                                return <li key={service}>{service}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='col-lg-9' style={{ height: "100%" }}>
                <div className={style.Card} style={{ height: "100%" }}>

                </div>
            </div>
        </div>

    );
}