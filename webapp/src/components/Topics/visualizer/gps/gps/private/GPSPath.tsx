import { Polyline } from "react-leaflet";
import RobotMarker from "../RobotMarker";
import { useEffect, useState } from "react";
import { useData } from "@/components/Topics/topicProvider";

export default function GPSPath(props: { robot: string }) {
    const { data } = useData();
    const [locations, setLocations] = useState<any>([]);

    useEffect(() => {

        if (data.length > 0) {
            const lastData = data[data.length - 1].ros;

            //check if location is already in the list or less than 0.5m away, location is latitude and longitude
            if (locations.length > 0) {
                const lastLocation = locations[locations.length - 1];
                let dist = distance(lastData.latitude, lastData.longitude, lastLocation[0], lastLocation[1]);
                if (dist > 1) {
                    setLocations([...locations, [lastData.latitude, lastData.longitude]]);
                }
            } else {
                setLocations([...locations, [lastData.latitude, lastData.longitude]]);
            }
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
        <>
            <Polyline positions={locations} />
            <RobotMarker robot={props.robot} scale={0.5} />
        </>
    );
}