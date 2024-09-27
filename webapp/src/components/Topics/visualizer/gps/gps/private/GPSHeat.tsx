"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import { useData } from "@/components/Topics/topicProvider";

export default function GPSHeat(props: { robot: string }) {

    const { data } = useData();
    const [locations, setLocations] = useState<any>([]);

    const map = useMap();

    const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

    useEffect(() => {

        if (data.length > 0) {
            const lastData = data[data.length - 1].ros;

            //check if location is already in the list or less than 0.5m away, location is latitude and longitude
            if (locations.length > 0) {

                //for each location in the list
                for (let i = 0; i < locations.length; i++) {
                    let dist = distance(lastData.latitude, lastData.longitude, locations[i][0], locations[i][1]);
                    if (dist < 1) {
                        return;
                    }
                }

                // pan to the last location
                map.panTo(new LatLng(lastData.latitude, lastData.longitude), { animate: true, duration: 1 });

                setLocations([...locations, [lastData.latitude, lastData.longitude]]);

            } else {
                setLocations([...locations, [lastData.latitude, lastData.longitude]]);
            }


            // append new location
            //setLocations([...locations, [lastData.latitude, lastData.longitude]]);
        }

    }, [data]);


    const distance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3; // Earth's radius in meters

        function radians(degrees: number) {
            return degrees * Math.PI / 180;
        }

        // Convert decimal degrees to radians
        const lat1Rad = radians(lat1);
        const lon1Rad = radians(lon1);
        const lat2Rad = radians(lat2);
        const lon2Rad = radians(lon2);

        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.asin(Math.sqrt(a));

        return R * c;
    }

    return (
        <HeatmapLayer
            radius={10}
            blur={10}
            max={1}
            points={locations}
            longitudeExtractor={(m: any[]) => m[1]}
            latitudeExtractor={(m: any[]) => m[0]}
            intensityExtractor={(m: any[]) => 1} />
    );
}