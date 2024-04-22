import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // Hook for animation
import ImuDataDisplayMesh from './imu_mesh';
import ImuDataDisplayText from './imu_text';

export default function ImuDataDisplay(props: { name: string }) {

    return (
        <Canvas shadows>
            <ambientLight intensity={Math.PI / 2} />
            <directionalLight position={[0, 3, 2]} intensity={1} castShadow />

            <ImuDataDisplayMesh name={props.name} />
            <ImuDataDisplayText name={props.name} />

        </Canvas>
    );
}
