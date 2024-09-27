import { Circle, CircleMarker, Marker, Polyline, Popup, useMap } from "react-leaflet";
import RobotMarker from "../RobotMarker";
import { Key, useEffect, useState } from "react";
import { useData } from "@/components/Topics/multiTopicProvider";
import Link from "next/link";
import L, { LatLng } from "leaflet";
import { color } from "chart.js/helpers";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";

export default function GPSColorPath(props: { robot: string }) {
    const { data } = useData();
    const [locations, setLocations] = useState<any>([]);
    const [last_location, setLastLocation] = useState([0, 0]);
    const map = useMap();

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        let location_data = data.get("position");
        let emi_data = data.get("emi_avg");

        if (!location_data) {
            location_data = []
        }

        if (!emi_data) {
            emi_data = []
        }



        let current_working_location = {
            latitude: 0,
            longitude: 0,
            color: 0
        }



        if (location_data.length > 0) {
            const lastData = location_data[location_data.length - 1].ros;

            setLastLocation([lastData.latitude, lastData.longitude]);

            if (last_location[0] > map.getBounds().getNorth() || last_location[0] < map.getBounds().getSouth() || last_location[1] > map.getBounds().getEast() || last_location[1] < map.getBounds().getWest()) {
                map.panTo(new LatLng(last_location[0], last_location[1]), { animate: true, duration: 1 });
            }

            //check if location is already in the list or less than 0.5m away, location is latitude and longitude
            if (locations.length > 0) {
                const lastLocation = locations[locations.length - 1];
                let dist = distance(lastData.latitude, lastData.longitude, lastLocation[0], lastLocation[1]);
                if (dist > 1) {
                    current_working_location.latitude = lastData.latitude;
                    current_working_location.longitude = lastData.longitude;
                }
            } else {
                current_working_location.latitude = lastData.latitude;
                current_working_location.longitude = lastData.longitude;
            }
        }

        if (emi_data.length > 0) {
            current_working_location.color = emi_data[emi_data.length - 1].ros.data;
        }

        setLocations([...locations, [current_working_location.latitude, current_working_location.longitude, current_working_location.color]]);

    }, [data]);

    function getColor(value: number): string {
        // Ensure value is within the specified range
        value = Math.min(Math.max(value, 1000), 4000);

        // Color range: blue to red
        const colorStart = { r: 0, g: 0, b: 255 }; // Blue
        const colorEnd = { r: 255, g: 0, b: 0 }; // Red

        // Calculate the percentage of the value within the range
        const percentage = (value - 1000) / (4000 - 1000);

        // Interpolate the color values
        const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * percentage);
        const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * percentage);
        const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * percentage);

        // Return the color as a hex string
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }


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
        <>
            {locations.map((location: [number, number, number], i: Key | null | undefined) => (
                <Circle key={i} center={[location[0], location[1]]} radius={0.15} color={getColor(location[2])}>
                    <Popup>{location[2]}</Popup>
                </Circle>
            ))}

            <Marker icon={L.icon({ iconUrl: "https://api.dicebear.com/8.x/bottts/svg?seed=" + props.robot, iconSize: [15, 15] })} position={new LatLng(last_location[0], last_location[1])} >
                <Popup>
                    <Link className="btn btn-primary" href={"/" + props.robot}> {props.robot} </Link>
                </Popup>
            </Marker>
        </>
    );

    function calculateRadius(zoom: number): number {

        // Assuming 1cm = 10 pixels on the map
        const cmToPixels = 10;
        // Assuming 1cm = 0.00001 degrees on the map
        const cmToDegrees = 0.00001;
        // Radius in cm
        const radiusInCm = 50;
        // Convert radius to degrees
        const radiusInDegrees = radiusInCm * cmToDegrees;
        // Convert radius in degrees to pixels based on zoom level
        const radiusInPixels = radiusInDegrees * Math.pow(2, zoom) * cmToPixels;
        return radiusInPixels;
    }
}