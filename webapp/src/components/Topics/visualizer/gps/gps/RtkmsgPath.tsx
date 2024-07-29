"use client";

import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import GPSPath from "./private/GPSPath";


export default function GPSMapPath(props: { robot: string }) {

    return (
        <MapContainer center={[0, 0]} zoom={5} maxZoom={50} scrollWheelZoom={true}>
            <TileLayer maxZoom={25} maxNativeZoom={20} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GPSPath robot={props.robot} />
        </MapContainer>
    );
}