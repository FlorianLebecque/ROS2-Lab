import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet"

import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";

export default function RobotMarker() {

    // use map
    const map = useMap();

    const [location, setLocation] = useState([50.843941, 4.3930369]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLocation([location[0] + Math.random() * 0.00001, location[1] + Math.random() * 0.00001]);
            map.setView([location[0], location[1]]);
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <Marker icon={L.icon({ iconUrl: "http://news.blr.com/app/uploads/sites/3/2016/10/Llama-1.jpg", iconSize: [30, 30] })} position={new LatLng(location[0], location[1])}>
            <Popup>
                <span>A robot</span>
            </Popup>
        </Marker>
    );
}