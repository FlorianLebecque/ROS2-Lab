import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/topics/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation
import * as THREE from 'three'; // Import the necessary package


export default function OdomDataDisplayMesh(props: { name: string, OrbitRef: any }) {
    const { data } = useData();

    const meshRef = useRef<any>(null);

    if (!data) {
        return (<div>Waiting for data</div>);
    }

    const SetRotation = (RosPose: any) => {
        const { x, y, z, w } = RosPose.orientation;
        const euler = new THREE.Euler();

        euler.setFromQuaternion(new THREE.Quaternion(x, y, z, w));

        meshRef.current.rotation.x = - euler.x;
        meshRef.current.rotation.y = euler.z;
        meshRef.current.rotation.z = - euler.y;
    }

    useFrame(() => {

        const latestData = data[data.length - 1];

        if (latestData && latestData.ros && latestData.ros.pose) {

            const { x, y, z } = latestData.ros.pose.pose.position;


            // In three js , x is right, y is up, z is forward
            SetRotation(latestData.ros.pose.pose);

            // Transform the position
            meshRef.current.position.x = x;
            meshRef.current.position.y = z;
            meshRef.current.position.z = y;

            if (props.OrbitRef.current) {
                //move the camera to the new position
                props.OrbitRef.current.target.set(x, z, y);
                // move the camera position if distance is greater than 5
                let distance_to_target = meshRef.current.position.distanceTo(props.OrbitRef.current.object.position);
                if (distance_to_target > 10) {

                    let direction_to_target = new THREE.Vector3().subVectors(meshRef.current.position, props.OrbitRef.current.object.position).normalize();

                    let speed = (distance_to_target - 5) / 100;
                    // make the speed relative to the distance, so the camera will move faster if the distance is greater and slower if the distance is smaller


                    // move the camera using the direction to the target
                    props.OrbitRef.current.object.position.add(direction_to_target.multiplyScalar(speed));
                }


            }
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 0.5, 1]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
