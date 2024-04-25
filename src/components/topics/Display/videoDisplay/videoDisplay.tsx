'use client';

import { useData } from "@/components/topics/topicProvider/topicProvider";
import { useEffect, useRef, useState } from "react";

export function VideoDisplayJPEG(props: { name: string }) {

    const { data, setData } = useData();
    const [imageUrl, setImageUrl] = useState("");

    const processImage = (imageMessage: any) => {
        if (!(imageMessage && imageMessage.ros)) {
            return
        }
        const base64Image = `data:image/jpeg;base64,${imageMessage.ros.data}`;
        setImageUrl(base64Image);
    }

    useEffect(() => {
        processImage(data[data.length - 1])
    }, [data]);

    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="Video Stream" />}
        </div>
    );
}

export function VideoDisplayUncompressed(props: { name: string }) {

    const { data, setData } = useData();
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        convertDataToImage(data[data.length - 1])
    }, [data]);

    const convertDataToImage = (imageMessage: any) => {
        if (!(imageMessage && imageMessage.ros)) {
            return
        }
        const width = imageMessage.ros.width;
        const height = imageMessage.ros.height;
        const imageData = base64ToArrayBuffer(imageMessage.ros.data);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const imgData = ctx.createImageData(width, height);
        encodeImage(imageData, imgData, imageMessage.ros.encoding)

        ctx.putImageData(imgData, 0, 0);
        setImageUrl(canvas.toDataURL('image/jpeg'));
    };

    const encodeImage = (imageData: any, imgData: any, encoding: string) => {
        let dataBuf;
        switch (encoding) {
            case "rgb8":
                // Convert RGB to RGBA
                dataBuf = new Uint8ClampedArray(imageData);
                for (let i = 0, j = 0; i < dataBuf.length; i += 3, j += 4) {
                    imgData.data[j] = dataBuf[i];     // Red
                    imgData.data[j + 1] = dataBuf[i + 1]; // Green
                    imgData.data[j + 2] = dataBuf[i + 2]; // Blue
                    imgData.data[j + 3] = 255;       // Alpha
                }
                break;
            case "16UC1":
                // Convert RGB to 16uc1
                dataBuf = new Uint16Array(imageData);
                for (let i = 0, j = 0; i < dataBuf.length; i += 1, j += 4) {
                    imgData.data[j] = dataBuf[i]>>8;
                    imgData.data[j + 1] = dataBuf[i]>>8;
                    imgData.data[j + 2] = dataBuf[i]>>8;
                    imgData.data[j + 3] = 255;
                }
                break;
            default:
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

    // Helper function to convert base64 to ArrayBuffer
    const base64ToArrayBuffer = (base64: string) => {
        //console.log(base64)
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    return (
        <div>
            <img src={imageUrl} alt="Video Stream" style={{ maxWidth: '100%' }} />
        </div>
    );
}
