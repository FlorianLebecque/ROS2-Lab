"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapPath from "./gps/RtkmsgPath";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean }) {
    const { settings } = useSettings();

    return (
        <TopicProvider topicName={props.topic} >
            <GPSMapPath robot={settings().robot_name} />
        </TopicProvider>
    );
}