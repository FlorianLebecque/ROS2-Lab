"use client";

import WorkSpacesDialog from "@/components/Nav/Dialogs/WorkSpacesDialog";
import RobotsGrid from "@/components/Robots/RobotsGrid/RobotsGrid";

export default function Home() {
    return (
        <main className="mt-3">
            <RobotsGrid />
            <WorkSpacesDialog />
        </main>
    );
}
