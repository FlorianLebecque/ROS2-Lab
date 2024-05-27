import React, { useRef, useState, useEffect } from 'react';
import { useData } from "@/components/topics/topicProvider";
import { useFrame } from '@react-three/fiber'; // Hook for animation

import * as THREE from 'three';
import { Points } from '@react-three/drei';
import { parse } from 'path';
import { buffer } from 'stream/consumers';

interface PointCloud {
    fields: Field[];

    geometry: THREE.BufferGeometry;

    positions: Float32Array | null;
    colors: Float32Array | null;
    size: number;
    little_endian: boolean;
}

interface Field {
    name: string;
    offset: number;
    datatypelen: number;
    count: number;
}

export default function PointsDataDisplay(props: { name: string }) {
    const { data } = useData();
    const pointCloudRef = useRef<any>();

    const dataTypeToByteLength = (type: number): number => {
        const typeToByteLength: { [key: number]: number } = {
            1: 1, // int8
            2: 1, // uint8
            3: 2, // int16
            4: 2, // uint16
            5: 4, // int32
            6: 4, // uint32
            7: 4, // float32
            8: 8, // float64
        };

        return typeToByteLength[type];
    }

    function convertUint8ArrayToDecimalFloat32(byteArray: Uint8Array, little_endian = true) {
        if (byteArray.length < 4) {
            throw new Error('Byte array must have at least 4 elements for a decimal value');
        }

        let value = 0;

        let sign = (byteArray[0] & 0x80) >> 7;
        let exponent = ((byteArray[0] & 0x7F) << 1) | ((byteArray[1] & 0x80) >> 7);
        let fraction = ((byteArray[1] & 0x7F) << 16) | (byteArray[2] << 8) | byteArray[3];

        if (little_endian) {
            let temp = exponent;
            exponent = fraction;
            fraction = temp;
        }

        if (exponent === 0 && fraction === 0) {
            return 0;
        }

        if (exponent === 0xFF) {
            if (fraction === 0) {
                return sign ? -Infinity : Infinity;
            }
            return NaN;
        }

        value = Math.pow(-1, sign) * Math.pow(2, exponent - 127) * (1 + fraction / Math.pow(2, 23));

        return value;
    }

    const parsePointCloud = (pointCloud: PointCloud, data: string, point_step: number) => {

        let data_len = data.length;

        // convert data to a uint8 array
        let udata = Buffer.from(data, "ascii");

        const geometry = pointCloud.geometry;
        const positions = new Float32Array(data.length / point_step * 3);
        const colors = new Float32Array(data.length / point_step * 3);

        for (let i = 0; i < udata.length; i += point_step) {

            let row_bytes = udata.slice(i, i + point_step);

            let x_bytes_len = pointCloud.fields[0].datatypelen;
            let y_bytes_len = pointCloud.fields[1].datatypelen;
            let z_bytes_len = pointCloud.fields[2].datatypelen;
            let rgb_bytes_len = pointCloud.fields[3].datatypelen;

            let x_offset = pointCloud.fields[0].offset;
            let y_offset = pointCloud.fields[1].offset;
            let z_offset = pointCloud.fields[2].offset;
            let rgb_offset = pointCloud.fields[3].offset;

            let x_bytes = row_bytes.slice(x_offset, x_offset + x_bytes_len) as unknown as Uint8Array;
            let y_bytes = row_bytes.slice(y_offset, y_offset + y_bytes_len) as unknown as Uint8Array;
            let z_bytes = row_bytes.slice(z_offset, z_offset + z_bytes_len) as unknown as Uint8Array;
            let rgb_bytes = row_bytes.slice(rgb_offset, rgb_offset + rgb_bytes_len) as unknown as Uint8Array;


            let x = convertUint8ArrayToDecimalFloat32(x_bytes);
            // let y = convertUint8ArrayToDecimalFloat32(y_bytes);
            // let z = convertUint8ArrayToDecimalFloat32(z_bytes);
            let y = new DataView(y_bytes.buffer).getFloat32(0, pointCloud.little_endian);
            let z = new DataView(z_bytes.buffer).getFloat32(0, pointCloud.little_endian);

            let r = rgb_bytes[0];
            let g = rgb_bytes[1];
            let b = rgb_bytes[2];

            // replace NaN values with 0
            if (isNaN(x)) x = 0;
            if (isNaN(y)) y = 0;
            if (isNaN(z)) z = 0;

            let index = i / point_step * 3;

            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;

            colors[index] = r / 255;
            colors[index + 1] = g / 255;
            colors[index + 2] = b / 255;
        }

        pointCloud.positions = positions;
        pointCloud.colors = colors;

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        pointCloudRef

    }

    const getPointCloudDescription = (ros_message: any): PointCloud => {

        let fields = [];
        for (const field of ros_message.fields) {
            fields.push({
                name: field.name,
                offset: field.offset,
                datatypelen: dataTypeToByteLength(field.datatype),
                count: field.count,
            });
        }

        return {
            fields: fields,
            geometry: new THREE.BufferGeometry(),
            positions: null,
            colors: null,
            size: ros_message.width,
            little_endian: !ros_message.is_bigendian,
        }

    }

    useEffect(() => {
        if (data) {
            const latestData = data[data.length - 1];
            if (latestData && latestData.ros) {
                pointCloudRef.current = getPointCloudDescription(latestData.ros);
                parsePointCloud(pointCloudRef.current, latestData.ros.data, latestData.ros.point_step);
            }
        }
    }, [data]);



    return (
        <Points ref={pointCloudRef} />
    );

}
