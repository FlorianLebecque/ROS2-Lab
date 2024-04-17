'use client';
import NodeDiagnostic from "@/components/nodes/node_diagnostic/node_diagnostic";
import NodesGrid from "@/components/nodes/nodes_grid/nodes_grid";

export default function Page({ params }: { params: { robot: string } }) {

    const { robot } = params; // Extract the node name from the URL -> node name with '/' replaced by '@' (%40)


    return (
        <main>
            <h1>{robot}</h1>
            <div className="overflow-x mb-3 pb-4">
                <NodesGrid banner={true} namespace={robot} />
            </div>
            <div>

            </div>
        </main>
    );
}