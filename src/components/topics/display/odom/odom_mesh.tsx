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

    useFrame(() => {

        const latestData = data[data.length - 1];

        if (latestData && latestData.ros && latestData.ros.pose) {

            const { rot_x, rot_y, rot_z, rot_w } = latestData.ros.pose.pose.orientation;
            const { x, y, z } = latestData.ros.pose.pose.position;


            // In three js , x is right, y is up, z is forward

            // Convert the quaternion to euler angles
            const euler = new THREE.Euler();

            euler.setFromQuaternion(new THREE.Quaternion(rot_x, rot_y, rot_z, rot_w));

            // Transform the euler angles to the correct orientation
            meshRef.current.rotation.x = - euler.x;
            meshRef.current.rotation.y = - euler.z;
            meshRef.current.rotation.z = - euler.y;

            // Transform the position
            meshRef.current.position.x = x;
            meshRef.current.position.y = z;
            meshRef.current.position.z = y;

            if (props.OrbitRef.current) {
                //move the camera to the new position
                props.OrbitRef.current.target.set(x, z, y);
            }
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 0.5, 2]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
