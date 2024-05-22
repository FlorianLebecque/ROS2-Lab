'use client';
import NodeDiagnostic from "@/components/nodes/node_diagnostic/node_diagnostic";
import NodesGrid from "@/components/nodes/nodes_grid/nodes_grid";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from "react-leaflet";

export default function Page({ params }: { params: { robot: string } }) {

    const { robot } = params; // Extract the node name from the URL -> node name with '/' replaced by '@' (%40)


    return (
        <main>
            <h1>{robot}</h1>
            <div className="overflow-x mb-3 pb-4">
                <NodesGrid banner={true} namespace={robot} />
            </div>
            <div>
                <MapContainer>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </main>
    );
}