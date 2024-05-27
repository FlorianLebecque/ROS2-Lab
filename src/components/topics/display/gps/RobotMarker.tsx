import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet"

import { useContext, useEffect, useState } from "react";
import L, { LatLng } from "leaflet";
import Link from "next/link";
import { useData } from "../../../topics/topicProvider";

export default function RobotMarker(props: { robot: string }) {

    // use map
    const map = useMap();

    const { data, setData, setPause, pause } = useData();

    //const [location, setLocation] = useState([50.843941, 4.3930369]);

    useEffect(() => {

        let location = [0, 0];

        if (data.length > 0) {
            const lastData = data[data.length - 1].ros;
            location = [lastData.latitude, lastData.longitude];
        }

        if (location[0] > map.getBounds().getNorth() || location[0] < map.getBounds().getSouth() || location[1] > map.getBounds().getEast() || location[1] < map.getBounds().getWest()) {
            map.panTo(new LatLng(location[0], location[1]), { animate: true, duration: 1 });
        }

        // const interval = setInterval(() => {

        //     let dx = Math.random() * 0.00001;
        //     let dy = Math.random() * 0.00001;
        //     let dir_x = Math.random() > 0.5 ? 1 : -1;
        //     let dir_y = Math.random() > 0.5 ? 1 : -1;

        //     location[0] += dx * dir_x;
        //     location[1] += dy * dir_y;

        //     setLocation([location[0], location[1]]);

        //     // move the map if the robot is out of the view
        //     


        // }, 200);
        // return () => clearInterval(interval);

    }, [data]);

    return (
        <Marker icon={L.icon({ iconUrl: "https://api.dicebear.com/8.x/bottts/svg?seed=" + props.robot, iconSize: [30, 30] })} position={new LatLng(0, 0)} >
            <Popup>
                <Link className="btn btn-primary" href={"/" + props.robot}> {props.robot} </Link>
            </Popup>
        </Marker>
    );
}