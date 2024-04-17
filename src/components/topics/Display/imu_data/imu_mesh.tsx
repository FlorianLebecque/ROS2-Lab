import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/topics/topicProvider/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation

export default function ImuDataDisplayMesh(props: { name: string }) {
    const dataRef = useRef<any[]>([]);
    const { data } = useData();

    useEffect(() => {
        // Update data reference on data change (optional)
        if (data) {
            dataRef.current = data;
        }
    }, [data]);

    const meshRef = useRef<any>(null);

    useFrame(() => {
        const latestData = dataRef.current[dataRef.current.length - 1];
        if (latestData && latestData.ros && latestData.ros.orientation) {
            const { x, y, z, w } = latestData.ros.orientation;
            meshRef.current.quaternion.set(x, y, z, w);
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} /> {/* Replace with your desired geometry */}
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
