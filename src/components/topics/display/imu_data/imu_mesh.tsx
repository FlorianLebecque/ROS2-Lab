import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/topics/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation

export default function ImuDataDisplayMesh(props: { name: string }) {
    const { data } = useData();

    const meshRef = useRef<any>(null);

    if (!data) {
        return (<div>Waiting for data</div>);
    }

    useFrame(() => {

        const latestData = data[data.length - 1];

        if (latestData && latestData.ros && latestData.ros.orientation) {
            const { x, y, z, w } = latestData.ros.orientation;
            meshRef.current.quaternion.set(x, y, z, w);
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
