'use client';

import { useData } from "@/components/Topics/topicProvider";
import { cp } from "fs";
import { useEffect, useRef, useState } from "react";

export function VideoDisplayJPEG(props: { name: string }) {

    const { data } = useData();
    const canvas = useRef<HTMLCanvasElement>(null);

    const processImage = (imageMessage: any, canvas: HTMLCanvasElement) => {
        if (!(imageMessage && imageMessage.ros)) return;
        const base64Image = `data:image/jpeg;base64,${imageMessage.ros.data}`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };

        image.src = base64Image;
    }

    useEffect(() => {
        if (!canvas.current) return;
        processImage(data[data.length - 1], canvas.current)
    }, [data]);

    return (
        <div>
            <canvas ref={canvas} style={{ width: "100%" }} />
        </div>
    );
}

export function VideoDisplayUncompressed(props: { name: string }) {

    const { data, setData } = useData();
    const [imageUrl, setImageUrl] = useState("");
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }
        convertDataToImage(data[data.length - 1], canvas.current);
    }, [data]);

    return (
        <div>
            <canvas ref={canvas} style={{ width: "100%" }} />
        </div>
    );
}

// Helper function to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Helper function to convert message to dataurl
const convertDataToImage = (imageMessage: any, canvas: HTMLCanvasElement): any => {
    if (!(imageMessage && imageMessage.ros &&
        imageMessage.ros.width && imageMessage.ros.height)) return;

    const { width, height, data, encoding } = imageMessage.ros;
    const imageData = base64ToArrayBuffer(data);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(width, height);
    encodeRawImage(imageData, imgData, encoding)
    ctx.putImageData(imgData, 0, 0);
};

const encodeRawImage = (imageData: any, imgData: any, encoding: string) => {
    let dataBuf;
    switch (encoding) {
        case "rgb8":
            // Convert RGB to RGBA
            dataBuf = new Uint8ClampedArray(imageData);
            for (let i = 0, j = 0; i < dataBuf.length; i += 3, j += 4) {
                // Normalize 16-bit data to 8-bit for display
                imgData.data[j] = dataBuf[i];     // Red
                imgData.data[j + 1] = dataBuf[i + 1]; // Green
                imgData.data[j + 2] = dataBuf[i + 2]; // Blue
                imgData.data[j + 3] = 255;       // Alpha
            }
            break;
        case "16UC1":
            dataBuf = new Uint16Array(imageData);
            // Find min and max values in the 16-bit data
            let minVal = 65535;
            let maxVal = 0;
            dataBuf.forEach(value => {
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            });
            // Edge case: avoid division by zero if all pixel values are the same
            if (minVal === maxVal) return;
            const range = maxVal - minVal;
            // Scale and transfer the 16-bit data to 8-bit image data
            for (let i = 0, j = 0; i < dataBuf.length; i += 1, j += 4) {
                let scaledValue = ((dataBuf[i] - minVal) / range) * 255; // Scale the value
                imgData.data[j] = scaledValue;      // Red
                imgData.data[j + 1] = scaledValue;  // Green
                imgData.data[j + 2] = scaledValue;  // Blue
                imgData.data[j + 3] = 255;          // Alpha
            }
            break;
        default:
            dataBuf = new Uint8ClampedArray(imageData);
            // Convert RGB to RGBA
            for (let i = 0, j = 0; i < dataBuf.length; i += 3, j += 4) {
                imgData.data[j] = dataBuf[i];     // Red
                imgData.data[j + 1] = dataBuf[i + 1]; // Green
                imgData.data[j + 2] = dataBuf[i + 2]; // Blue
                imgData.data[j + 3] = 255;       // Alpha
            }
            break;
    }
};