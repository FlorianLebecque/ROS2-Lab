"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { LeafletMouseEvent } from "leaflet";
import { use, useEffect, useState } from "react";
import { LatLng } from "leaflet";
import RobotMarker from "./RobotMarker";

// import "leaflet-defaulticon-compatibility"
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

function MapClickHandler() {
    const map = useMapEvents({
        click: (ev: LeafletMouseEvent) => {
            console.log('map clicked:', ev.latlng);
        }
    })
    return null
}


export default function GPSMap(props: { robot: string }) {

    return <MapContainer center={[50.843941, 4.3930369]} zoom={20} scrollWheelZoom={true}>
        <MapClickHandler />

        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RobotMarker robot={props.robot} />
    </MapContainer>
}