"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";
import { useData } from "../../../topicProvider";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import GPSHeat from "./private/GPSHeat";

export default function GPSMapHeatMapFiltered(props: { robot: string }) {

    return (
        <MapContainer center={[0, 0]} zoom={5} scrollWheelZoom={true}>

            <TileLayer maxZoom={25} maxNativeZoom={20} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GPSHeat robot={props.robot} />
        </MapContainer>
    );
}