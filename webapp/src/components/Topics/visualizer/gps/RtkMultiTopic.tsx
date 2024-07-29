"use client";

import { useSettings } from "@/utils/SettingsProvider";
import { TopicProvider } from "../../topicProvider";
import GPSMapPath from "./gps/RtkmsgPath";
import RobotMarker from "./gps/RobotMarker";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import GPSHeat from "./gps/private/GPSHeat";
import GPSBombList from "./gps/private/GPSBombList";
import GPSPath from "./gps/private/GPSPath";

export default function BasicVisualizer(props: { topic: string, type: string, list: boolean, position_topic: string, detection_topic: string, emi_avg_topic: string }) {
    const { settings } = useSettings();

    return (
        <MapContainer center={[0, 0]} zoom={5} maxZoom={50} scrollWheelZoom={true}>
            <TileLayer maxZoom={25} maxNativeZoom={20} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <TopicProvider topicName={props.detection_topic} >
                <GPSHeat robot={settings().robot_name} />
            </TopicProvider>

            <TopicProvider topicName={props.position_topic} >
                <GPSPath robot={settings().robot_name} />
            </TopicProvider>

            <GPSBombList />
        </MapContainer>
    );
}