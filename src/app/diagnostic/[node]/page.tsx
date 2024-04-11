import NodeDiagnostic from "@/components/nodes/node_diagnostic/node_diagnostic";

export default function Page({ params }: { params: { node: string } }) {

    return (
        <main>
            <NodeDiagnostic name={params.node} />
        </main>
    );
}