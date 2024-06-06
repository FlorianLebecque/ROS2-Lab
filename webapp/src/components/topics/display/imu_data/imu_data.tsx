import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // Hook for animation
import ImuDataDisplayMesh from './imu_mesh';
import { OrbitControls } from '@react-three/drei';
import OriginMesh from '@/utils/meshes/origin';

export default function ImuDataDisplay(props: { name: string }) {

    return (
        <Canvas shadows>
            <ambientLight intensity={Math.PI / 2} />
            <directionalLight position={[0, 3, 2]} intensity={1} castShadow />
            <ImuDataDisplayMesh name={props.name} />
            <gridHelper args={[10, 10]} position-y={-0.25} />
            <OrbitControls />
            <OriginMesh />

        </Canvas>
    );
}
