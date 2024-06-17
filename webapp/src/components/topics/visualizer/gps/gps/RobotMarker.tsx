import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet"

import { useContext, useEffect, useState } from "react";
import L, { LatLng } from "leaflet";
import Link from "next/link";
import { useData } from "../../../topicProvider";

export default function RobotMarker(props: { robot: string }) {

    // use map
    const map = useMap();

    const { data, setData, setPause, pause } = useData();

    const [location, setLocation] = useState([50.843941, 4.3930369]);

    useEffect(() => {

        if (data.length > 0) {
            const lastData = data[data.length - 1].ros;
            setLocation([lastData.latitude, lastData.longitude]);
        }

        if (location[0] > map.getBounds().getNorth() || location[0] < map.getBounds().getSouth() || location[1] > map.getBounds().getEast() || location[1] < map.getBounds().getWest()) {
            map.panTo(new LatLng(location[0], location[1]), { animate: true, duration: 1 });
        }

    }, [data]);

    return (
        <Marker icon={L.icon({ iconUrl: "https://api.dicebear.com/8.x/bottts/svg?seed=" + props.robot, iconSize: [30, 30] })} position={new LatLng(location[0], location[1])} >
            <Popup>
                <Link className="btn btn-primary" href={"/" + props.robot}> {props.robot} </Link>
            </Popup>
        </Marker>
    );
}