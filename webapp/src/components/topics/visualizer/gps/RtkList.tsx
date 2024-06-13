"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapList from "../../display/gps/RtkmsgList";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMapList robot={settings.robot} />
        </TopicProvider>
    );
}