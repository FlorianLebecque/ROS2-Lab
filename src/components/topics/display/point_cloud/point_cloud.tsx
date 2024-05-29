// display a 3D point cloud using tree js
// based on sensor_msgs/msg/PointCloud2 topic type

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // Hook for animation
import PointsDataDisplay from './points';
import { OrbitControls } from '@react-three/drei';

export default function PointCloudDisplay(props: { name: string }) {

    return (
        <Canvas>
            <OrbitControls />
            <PointsDataDisplay name={props.name} />
            <gridHelper args={[10, 10]} />

        </Canvas>
    );
}
