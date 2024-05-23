'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import style from './dashboard.module.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from './dashboardContext';
import DynamicFactory from '@/components/DynamicFactory'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DynamicDashboard() {

    const { layout, setLayout, boxes, setBoxes, nextBoxId, setNextBoxId, getNextYPosition } = useDashboard();

    const removeBox = (id: string, event: any) => {
        event.stopPropagation(); // Stop the propagation of the event
        setLayout(prevLayout => prevLayout.filter(box => box.i !== id)); // Filter out the box from layout

        boxes.delete(id); // Remove the box from the boxes map
        setBoxes(new Map(boxes)); // Update the boxes map
    };

    const onLayoutChange = (l: any) => {
        // Update the layout state when resizing or dragging occurs
        setLayout(l);
    };

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
                            <button onClick={(e) => removeBox(box.i, e)} className={"btn btn-outline-danger"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>
                        </div>
                        <div style={{ overflow: "clip" }} className={style.content + " p-3 mb-3"}>
                            {DynamicFactory(boxes.get(box.i)?.contentDef)}
                        </div>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
}