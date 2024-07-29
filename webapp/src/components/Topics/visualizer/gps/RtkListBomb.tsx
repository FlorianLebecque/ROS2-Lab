"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapListBomb from "./gps/RtkmsgListBomb";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMapListBomb robot={settings().robot_name} />
        </TopicProvider>
    );
}