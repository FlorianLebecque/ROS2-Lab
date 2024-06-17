'use client';
import NodeDiagnostic from "@/components/Nodes/NodeDiagnostic/node_diagnostic";

export default function Page({ params }: { params: { node: string } }) {

    const { node } = params; // Extract the node name from the URL -> node name with '/' replaced by '@' (%40)

    const node_name = node.replaceAll(/@/g, '/').replaceAll("%40", '/'); // Replace '@' with '/' to get the original node name

    return (
        <main>
            <NodeDiagnostic name={node_name} />
        </main>
    );
}