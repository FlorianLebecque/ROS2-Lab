"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapHeatMap from "./gps/RtkmsgHeatmap";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMapHeatMap robot={settings().robot_name} />
        </TopicProvider>
    );
}