"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";
import { useData } from "../../../topicProvider";
import GPSBombList from "./private/GPSBombList";


export default function GPSMapListBomb(props: { robot: string }) {


    return (
        <MapContainer center={[0, 0]} zoom={5} maxZoom={50} scrollWheelZoom={true}>
            <TileLayer maxNativeZoom={20} maxZoom={50} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GPSBombList />
        </MapContainer>
    );
}