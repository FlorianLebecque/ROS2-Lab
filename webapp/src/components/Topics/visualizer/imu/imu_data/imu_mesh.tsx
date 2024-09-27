import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/Topics/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation
import * as THREE from 'three'; // Import the necessary package


export default function ImuDataDisplayMesh(props: { name: string }) {
    const { data } = useData();

    const meshRef = useRef<any>(null);

    if (!data) {
        return (<div>Waiting for data</div>);
    }

    useFrame(() => {

        const latestData = data[data.length - 1];

        if (latestData && latestData.ros && latestData.ros.orientation) {

            const { x, y, z, w } = latestData.ros.orientation;  // Z is up, X is forward, Y is left

            // In three js , x is right, y is up, z is forward

            // Convert the quaternion to euler angles
            const euler = new THREE.Euler();

            euler.setFromQuaternion(new THREE.Quaternion(x, y, z, w));

            // Transform the euler angles to the correct orientation
            meshRef.current.rotation.x = - euler.x;
            meshRef.current.rotation.y = - euler.z;
            meshRef.current.rotation.z = - euler.y;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 0.5, 2]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
