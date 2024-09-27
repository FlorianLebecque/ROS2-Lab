"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";

export default function GPSBombList() {

    const locations = {
        "convoy1": {
            "obus1": [4.6999864, 50.81719663],
            "atk2": [4.69992263, 50.81724714],
            "bidon1": [4.69988194, 50.81736318],
            "apers1": [4.69983045, 50.81741438],
            "pp1": [4.69983408, 50.81747902],
            "atk1": [4.69996497, 50.8171344]
        },
        "track": {
            "ark1": [4.69942839, 50.81690077],
            "apers": [4.69938539, 50.81699645],
            "pp": [4.6993391, 50.81704397],
            "bidon1": [4.69937191, 50.81710809],
            "atk2": [4.69932001, 50.81715827],
            "obus": [4.699302, 50.81723788],
            "apers2": [4.69923993, 50.81727325]
        },
        "road": {
            "atk1": [4.700308, 50.81713813],
            "ap1": [4.7003064, 50.81718757],
            "106mm": [4.70037962, 50.81724477],
            "pp1": [4.70046896, 50.81730523],
            "bidon1": [4.70057197, 50.81731758],
            "side1": [4.7004028, 50.81731234]
        }
    }

    return (
        <>
            {Object.entries(locations).map(([topic, bombs]) => (
                Object.entries(bombs).map(([key, location], index) => (
                    <Marker
                        key={index}
                        icon={L.icon({
                            iconUrl: "https://api.dicebear.com/8.x/icons/svg?backgroundColor=FF0000&radius=50&icon=sun",
                            iconSize: [15, 15],
                        })}
                        position={new LatLng(location[1], location[0])}
                    />
                ))
            ))}
        </>
    );
}