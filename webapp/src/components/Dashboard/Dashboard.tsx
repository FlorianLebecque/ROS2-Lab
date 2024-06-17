'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import style from './Dashboard.module.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from './DashboardContext';
import DynamicFactory from '@/components/DynamicFactory'
import { useSettings } from '@/utils/SettingsProvider';

import { jsonObjectToMap, mapToJsonObject } from '@/utils/JsonAndMap';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export function Clear(props: { robot: string, checkHidden: () => boolean }) {
    const { setLayout, setBoxes, setNextBoxId } = useDashboard();
    const { settings, setSettings, saveSettings } = useSettings();

    const clearDashboard = () => {

        if (props.checkHidden()) {
            return;
        }
        // ask for confirmation
        if (!window.confirm("Are you sure you want to clear the dashboard?")) return;

        setLayout([]);
        setBoxes(new Map());
        setNextBoxId(1);

        settings[props.robot].layout = [];
        settings[props.robot].boxes = [];
        settings[props.robot].nextBoxId = 1;

        setSettings(settings);
        saveSettings();
    }

    return (
        <button onClick={() => clearDashboard()} name="category" className={"hide btn btn-outline-danger"}>Clear</button>
    );
}

export default function Dashboard(props: { robot: string }) {

    const { layout, setLayout, boxes, setBoxes, nextBoxId, setNextBoxId } = useDashboard();
    const { settings, setSettings, saveSettings } = useSettings();

    useEffect(() => {
        if (settings[props.robot]) {
            setLayout(settings[props.robot].layout);
            setBoxes(jsonObjectToMap(settings[props.robot].boxes));
            setNextBoxId(settings[props.robot].nextBoxId);
        }
    }, [settings]);

    const handleRemoveBoxClick = (id: string, event: any) => {
        event.stopPropagation(); // Stop the propagation of the event
        setLayout(prevLayout => prevLayout.filter(box => box.i !== id)); // Filter out the box from layout

        boxes.delete(id); // Remove the box from the boxes map
        setBoxes(new Map(boxes)); // Update the boxes map

        updateSettings();
    };

    const onLayoutChange = (l: any) => {
        // Update the layout state when resizing or dragging occurs

        setLayout(l);
        updateSettings(l);
    };


    const updateSettings = (l: any = null) => {

        let current_layout = layout;
        if (l) {
            current_layout = l;
        }

        // settings[robot][layout] = layout;
        // settings[robot][boxes] = boxes;

        // check if settings[robot] exists
        if (!settings[props.robot]) settings[props.robot] = {};

        // update the layout and boxes in the settings, add the robot key if it doesn't exist
        if (!settings[props.robot].layout) settings[props.robot].layout = [];
        if (!settings[props.robot].boxes) settings[props.robot].boxes = new Map();
        if (!settings[props.robot].nextBoxId) settings[props.robot].nextBoxId = 1;
        console.log(boxes);

        settings[props.robot].layout = current_layout;
        settings[props.robot].boxes = mapToJsonObject(boxes);
        settings[props.robot].nextBoxId = nextBoxId;

        setSettings(settings);
        saveSettings();
    }

    return (
        <div>
            <ResponsiveReactGridLayout
                className="layout"
                layout={layout}
                onLayoutChange={onLayoutChange}
                draggableHandle={`.${style.dragHandle}`}
                compactType={null}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                preventCollision={true}
                rowHeight={30}>
                {layout.map(box => (
                    <div key={box.i} data-grid={box} className={"d-flex card border shadow"}>
                        <div className='d-flex flex-row justify-content-between border-bottom p-1'>
                            <div className={style.dragHandle}>{boxes.get(box.i)?.title}</div>
                            <button onClick={(e) => handleRemoveBoxClick(box.i, e)} className={"btn btn-outline-danger"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>
                        </div>
                        <div style={{ overflow: "clip" }} className={style.content}>
                            {DynamicFactory(boxes.get(box.i)?.contentDef)}
                        </div>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
}