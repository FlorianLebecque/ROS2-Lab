"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import { use, useEffect, useState } from "react";
import { LatLng } from "leaflet";
import RobotMarker from "./RobotMarker";

// import "leaflet-defaulticon-compatibility"
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function GPSMap(props: { robot: string }) {

    return <MapContainer center={[50.843941, 4.3930369]} zoom={20} scrollWheelZoom={true}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RobotMarker robot={props.robot} />
    </MapContainer>
}