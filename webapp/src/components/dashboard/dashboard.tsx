'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import style from './dashboard.module.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useRosWeb } from '@/components/RosContext';
import { TopicProvider } from '../topics/topicProvider';
import TopicVisualizerFactory from '../topics/topicVisualizerFactory';
// import { exportToJson, handleFileUpload } from './export';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DashboardGrid() {

    const rosWeb = useRosWeb();
    const [nodes, setNodes] = useState<string[]>([]);
    const [topics, setTopics] = useState<string[]>([]);


    useEffect(() => {

        const fetchTopics = async () => {
            try {
                const topics = await rosWeb.GetTopicsList();
                setTopics(topics);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();

        const interval = setInterval(() => {
            fetchTopics();
        }, 2000);

        return () => { clearInterval(interval); }

    });

    const LAYOUT_KEY = 'dashboard_layout';
    const BOX_CONTENT_KEY = 'dashboard_box_content';

    const [layout, setLayout] = useState([]);
    const [boxContent, setboxContent] = useState({});
    const [nextBoxId, setNextBoxId] = useState(3);

    const SaveLayout = () => {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
        localStorage.setItem(BOX_CONTENT_KEY, JSON.stringify(boxContent));
    }

    const LoadLayout = (loaded_layout: any, loaded_content: any) => {
        setLayout(loaded_layout);
        setboxContent(loaded_content);
    }

    const LoadFromLocalStorage = () => {
        const loaded_layout = localStorage.getItem(LAYOUT_KEY);
        const loaded_content = localStorage.getItem(BOX_CONTENT_KEY);

        if (loaded_layout !== null && loaded_content !== null) {
            LoadLayout(JSON.parse(loaded_layout), JSON.parse(loaded_content));
        }
    }

    const ImportLayout = async (e: any) => {
        // const parsedJson = await handleFileUpload(e);
        LoadLayout(parsedJson.layout, parsedJson.boxContent);
    }

    const getNextYPosition = () => {
        const maxY = layout.reduce((acc, curr) => {
            const bottomY = curr.y + curr.h;
            return bottomY > acc ? bottomY : acc;
        }, 0);
        return maxY;
    };

    const addBox = async () => {

        console.log(boxContent);

        const topicSelect = document.getElementById('TopicSelect') as HTMLSelectElement;
        const selectedTopic = topicSelect.value;
        const topicType = await rosWeb.GetTopicType(selectedTopic);

        const newBox = {
            i: `box${nextBoxId}`,
            x: (layout.length * 2) % (12 / 2),
            y: getNextYPosition(), // puts it at the bottom
            w: 2,
            h: 4,

        };

        const newBoxContent = {
            ...boxContent,
            [newBox.i]: { topic: selectedTopic, type: topicType }
        };

        setLayout([...layout, newBox]);
        setboxContent(newBoxContent);
        setNextBoxId(nextBoxId + 1); // Increment the ID for the next box
        SaveLayout()
    };

    const removeBox = (id: string, event: any) => {
        event.stopPropagation(); // Stop the propagation of the event
        setLayout(prevLayout => prevLayout.filter(box => box.i !== id)); // Filter out the box from layout

        setboxContent(prevBoxContent => {
            const { [id]: _, ...remainingBoxes } = prevBoxContent; // Use destructuring to exclude the removed box
            return remainingBoxes; // Return the remaining boxes
        });
        SaveLayout()
    };

    const onLayoutChange = (l: any) => {
        // Update the layout state when resizing or dragging occurs
        console.log(l);
        setLayout(l);
        SaveLayout()
    };

    return (
        <div>
            <div className="input-group mb-3" >
                <select defaultValue={0} className="form-select" id="TopicSelect">
                    <option value={0}>Select a topic</option>
                    {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
                <button className='btn btn-outline-success' onClick={addBox}>Add Box</button>
                <label className="input-group-text"> --- </label>
                <button className='btn btn-outline-primary' onClick={() => exportToJson(layout, boxContent)}>Export to JSON</button>
                <input type="file" className="form-control" onChange={ImportLayout} />
            </div>
            <ResponsiveReactGridLayout
                className="layout"
                layout={layout}
                onLayoutChange={onLayoutChange}
                draggableHandle={`.${style.dragHandle}`}
                compactType={null}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}>
                {layout.map(box => (
                    <div key={box.i} data-grid={box} className={"d-flex card border shadow"}>
                        <div className='d-flex flex-row justify-content-between border-bottom p-1'>
                            <div className={style.dragHandle}>{boxContent[box.i].topic}</div>
                            <button onClick={(e) => removeBox(box.i, e)} className={"btn btn-outline-danger"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>
                        </div>
                        <div className={style.content + " p-3"}>
                            <TopicProvider topicName={boxContent[box.i].topic}>
                                <TopicVisualizerFactory topicName={boxContent[box.i].topic} topicType={boxContent[box.i].type} />
                            </TopicProvider>
                        </div>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
}