"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapHeatMapFiltered from "../../display/gps/RtkmsgHeatmapFiltered";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMapHeatMapFiltered robot={settings.robot} />
        </TopicProvider>
    );
}