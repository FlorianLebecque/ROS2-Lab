"use client";

import { useSettings } from "@/utils/SettingsProvider";
import GPSMap from "../../display/gps/rtkmsg";
import { TopicProvider } from "../../topicProvider";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMap robot={settings.robot} />
        </TopicProvider>
    );
}