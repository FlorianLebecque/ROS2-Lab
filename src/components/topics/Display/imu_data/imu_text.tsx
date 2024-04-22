import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/topics/topicProvider/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation

import { Text } from '@react-three/drei'


export default function ImuDataDisplayText(props: { name: string }) {
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
        if (latestData && latestData.ros && latestData.ros) {
            meshRef.current.text = JSON.stringify(latestData.ros, null, 4);
        }
    });

    return (
        <Text ref={meshRef} position={[-2.5, 0, 0]} scale={[0.09, 0.09, 0.1]}>
            Hello World!
        </Text>
    );
}
