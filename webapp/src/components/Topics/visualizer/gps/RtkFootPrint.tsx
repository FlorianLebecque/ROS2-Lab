"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapPath from "./gps/RtkmsgPath";
import RobotMarker from "./gps/RobotMarker";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import GPSHeat from "./gps/private/GPSHeat";
import GPSBombList from "./gps/private/GPSBombList";
import GPSPath from "./gps/private/GPSPath";
import { MultiTopicProvider } from "../../multiTopicProvider";
import GPSColorPath from "./gps/private/GPSColorPath";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean, position_topic: string, detection_topic: string, emi_avg_topic: string }) {
    const { settings } = useSettings();

    const topics = new Map<string, string>();
    topics.set("position", props.position_topic);
    topics.set("detection", props.detection_topic);
    topics.set("emi_avg", props.emi_avg_topic);

    return (
        <MapContainer center={[0, 0]} zoom={18} maxZoom={50} scrollWheelZoom={true}>
            <TileLayer maxZoom={25} maxNativeZoom={20} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <TopicProvider topicName={props.position_topic} >
                <GPSPath robot={settings().robot_name} />
            </TopicProvider>

            <MultiTopicProvider topicsNames={topics}>
                <GPSColorPath robot={settings().robot_name} />
            </MultiTopicProvider>

            <GPSBombList />
        </MapContainer>
    );
}