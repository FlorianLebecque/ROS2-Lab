import { useFrame } from "@react-three/fiber";
import { useData } from "../../topicProvider";
import * as THREE from 'three';
import { Points } from "three";
import { use, useEffect, useRef, useState } from "react";

export default function PointsDataDisplay() {

    const { data } = useData();

    const pointRef = useRef<Points>(null);

    const [nbrOfPoints, setNbrOfPoints] = useState(0);
    const [objectBuffer, setObjectBuffer] = useState<any>(null);
    const [possitionBuffer, setPossitionBuffer] = useState(new Float32Array(0));

    useEffect(() => {
        if (data.length > 0) {
            const lastData = data[data.length - 1];

            const ObjectSize = lastData.ros.point_step;
            const byteData = lastData.ros.data;
            const nbrOfPoints = lastData.ros.width * lastData.ros.height;

            // number of points rounded to the 1000 : 8728 -> 9000, 10000 -> 10000 , 10001 -> 11000 
            const roundedNbrOfPoint = Math.ceil(nbrOfPoints / 1000) * 1000;
            if (!objectBuffer) {
                setObjectBuffer(createObjectBuffer(ObjectSize, byteData, roundedNbrOfPoint));
            }

            setNbrOfPoints(nbrOfPoints);
            setObjectBuffer(objectBuffer);
        }
    }, [data]);


    useFrame(() => {

        // for each update upload a new object buffer
        if (pointRef.current) {
            const lastData = data[data.length - 1];

            // update the object buffer data with the new ros.data
            let nbrOfPoints = lastData.ros.width * lastData.ros.height;
            updateObjectBuffer(objectBuffer, lastData.ros.data, nbrOfPoints);

            // update the number of objects
            const material = pointRef.current.material as THREE.ShaderMaterial; // Cast the material to ShaderMaterial
            material.uniforms.objects.value = objectBuffer;
            material.uniforms.numObjects.value = nbrOfPoints;
        }

    });

    if (!objectBuffer) return null;

    return (
        <points ref={pointRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={possitionBuffer.length / 3}
                    array={possitionBuffer}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-object"
                    count={objectBuffer.count}
                    array={objectBuffer.array}
                    itemSize={objectBuffer.itemSize}
                />
            </bufferGeometry>
            <shaderMaterial
                depthWrite={false}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={{
                    objectSize: { value: objectBuffer.itemSize },
                    x_offset: { value: 0 },
                    y_offset: { value: 4 },
                    z_offset: { value: 8 },
                    coord_length: { value: 4 },
                    numObjects: { value: nbrOfPoints },
                    objects: { value: objectBuffer },
                }}
            />
        </points>
    );
}

function updateObjectBuffer(objectBuffer: THREE.Uint32BufferAttribute, byteData: Uint8Array, numObjects: number) {
    // Ensure byteData.length is a multiple of objectSize
    const paddedLength = numObjects * objectBuffer.itemSize;
    const paddedData = new Uint8Array(paddedLength);

    let bytesSlice = byteData.slice(0, paddedLength);

    paddedData.set(bytesSlice);

    objectBuffer.set(paddedData);

    return objectBuffer;

}

function createObjectBuffer(objectSize: number, byteData: Uint8Array, numObjects: number) {
    // Ensure byteData.length is a multiple of objectSize
    const paddedLength = numObjects * objectSize;
    const paddedData = new Uint8Array(paddedLength);

    let bytesSlice = byteData.slice(0, paddedLength);

    paddedData.set(bytesSlice);

    const objectBuffer = new THREE.Uint32BufferAttribute(paddedData, objectSize / 4); // Divide by 4 for uint32 elements

    return objectBuffer;
}


const vertexShader = `
    attribute vec3 position;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    struct ObjectData {
        uint data[];
    };
      
    StructuredBuffer<ObjectData> objects : REGISTER(t0); // Bind the object buffer
    uint objectSize : REGISTER(c0); // Pass object size as a uniform
    uint x_offset : REGISTER(c1); // Pass x offset as a uniform
    uint y_offset : REGISTER(c2); // Pass y offset as a uniform
    uint z_offset : REGISTER(c3); // Pass z offset as a uniform
    uint coord_length : REGISTER(c4); // Pass coord length as a uniform
    uint numObjects : REGISTER(c5); // Pass the number of objects as a uniform    

    void main() {

        // vertex Id  -> should be the same as the index of the object in the buffer
        uint vertexId = gl_VertexID;

        // Get the object data
        // check if the vertexId is within the bounds of the object buffer
        if (vertexId >= numObjects ) {
            gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        }

        ObjectData object = objects[vertexId];

        // Get the object position, the position is stored as 4 uints to be a converted into a float32
        float x = 0;
        float y = 0;
        float z = 0;

        // Set the vertex position to the object position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
    }
`;

const fragmentShader = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

