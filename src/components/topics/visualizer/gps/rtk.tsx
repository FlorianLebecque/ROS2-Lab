"use client";

import GPSMap from "../../Display/gps/rtkmsg";
import { TopicProvider } from "../../topicProvider/topicProvider";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMap />
        </TopicProvider>
    );
}