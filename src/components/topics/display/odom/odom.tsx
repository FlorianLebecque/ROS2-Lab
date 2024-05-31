import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // Hook for animation
import { OrbitControls } from '@react-three/drei';
import OdomDataDisplayMesh from './odom_mesh';

export default function OdomDisplay(props: { name: string }) {

    const OrbitControl = useRef<any>(null);

    return (
        <Canvas shadows>
            <ambientLight intensity={Math.PI / 2} />
            <directionalLight position={[0, 3, 2]} intensity={1} castShadow />
            <OdomDataDisplayMesh OrbitRef={OrbitControl} name={props.name} />
            <gridHelper args={[100, 100]} position-y={-0.25} />
            <OrbitControls ref={OrbitControl} />
        </Canvas>
    );
}
