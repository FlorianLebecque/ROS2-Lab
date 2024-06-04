import { PI } from "chart.js/helpers";

export default function OriginMesh() {
    return (
        <>
            <mesh position-y={-0.25}>
                <boxGeometry args={[1, 0.05, 0.05]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh position={[0.5, -0.25, 0]} rotation={[0, PI, 0]}>
                <sphereGeometry args={[0.1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh position-y={-0.25}>
                <boxGeometry args={[0.05, 1, 0.05]} />
                <meshStandardMaterial color="blue" />
            </mesh>
            <mesh position-y={-0.25}>
                <boxGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </>
    );
}