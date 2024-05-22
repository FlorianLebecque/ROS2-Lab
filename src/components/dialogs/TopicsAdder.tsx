'use client';

import React, { useEffect, useState } from 'react';
import { useRosWeb } from '../RosContext';

import { IVisualizerDefinition, TopicVisualizerLink } from '../topics/topicVisualizerLink';

export default function TopicAdder(props: { robot: string }) {

    const robot = props.robot;

    const rosWeb = useRosWeb();
    const [topics, setTopics] = useState<string[]>([]);
    const [topicFilterInput, setTopicFilterInput] = useState<string>(""); // Add this line

    const [activeComponentId, setActiveComponentId] = useState(null as string | null);
    const [possibleVisualizers, setActivePossibleVisualizer] = useState<IVisualizerDefinition[]>([]);


    useEffect(() => {

        const fetchTopics = async () => {
            try {
                const topics = await rosWeb.GetTopicsList();

                // sort topics by robot name
                const robotTopics = topics.filter(topic => topic.startsWith("/" + robot));
                const otherTopics = topics.filter(topic => !topic.startsWith("/" + robot));

                // filter topics by filter input
                const filteredRobotTopics = robotTopics.filter(topic => topic.includes(topicFilterInput));
                const filteredOtherTopics = otherTopics.filter(topic => topic.includes(topicFilterInput));

                setTopics([...filteredRobotTopics, ...filteredOtherTopics]);

            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();

        const interval = setInterval(() => {
            fetchTopics();
        }, 2000);

        return () => { clearInterval(interval); }

    }, [robot, topicFilterInput]);

    useEffect(() => {
        // close dialog when clicking outside
        document.addEventListener('click', (e) => {
            const dialog = document.getElementById('topics-adder') as HTMLDialogElement;
            if (e.target == dialog) {
                dialog.close();
            }
        });

        return () => {
            // cleanup event listener
            document.removeEventListener('click', (e) => {
                const dialog = document.getElementById('topics-adder') as HTMLDialogElement;
                if (e.target == dialog) {
                    dialog.close();
                }
            });
        };
    }, []);

    const onTopicFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicFilterInput(e.target.value);
    }

    const getTopicClass = (topic: string) => {
        return topic.includes(robot) ? "btn btn-outline-success" : "btn btn-outline-secondary";
    }

    const getTextAlign = (topic: string) => {
        return topic.includes(robot) ? "left" : "right";
    }

    const handleTopicClick = async (topicName: string) => {
        const topicType = await rosWeb.GetTopicType(topicName);

        SetActiveClass(topicName);
        setActiveComponentId(topicName);

        const visualizers = TopicVisualizerLink(topicName, topicType);
        setActivePossibleVisualizer(visualizers);
    };

    const SetActiveClass = (id: string) => {

        let old_button = document.getElementById(activeComponentId!);
        let button = document.getElementById(id);

        if (old_button) {
            old_button.classList.remove("active");
        }

        if (button) {
            button.classList.add("active");
        }
    }

    return (
        <dialog id="topics-adder" className='border p-3 shade rounded'>
            <h1>Add topic visualization</h1>
            <div className='row mt-3'>
                <div className='col'>
                    <div className="form-floating mb-3">
                        <input autoComplete='off' onChange={onTopicFilterChange} type="text" className="form-control" id="topicFilter" placeholder="Type to filter topics" />
                        <label htmlFor="topicFilter">Type to filter topics</label>
                    </div>
                    <div className='d-flex flex-column gap-1' style={{ maxHeight: "40dvh", overflow: "auto" }}>
                        {topics.map(topic => (
                            <button onClick={() => handleTopicClick(topic)} key={topic} id={topic} className={getTopicClass(topic)} style={{ textAlign: getTextAlign(topic) }}>{topic}</button>
                        ))}

                    </div>
                </div>
                <div className='col'>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="visualizerFilter" placeholder="Type to filter visualizer" />
                        <label htmlFor="visualizerFilter">Type to filter visualizer</label>
                    </div>
                    <div className='d-flex flex-column gap-1' style={{ maxHeight: "40dvh", overflow: "auto" }}>
                        {possibleVisualizers.map(visualizer => (
                            <div>
                                <input type="checkbox" className="btn-check" key={visualizer.id} id={visualizer.id} />
                                <label className="btn btn-outline-primary" style={{ width: "100%" }} htmlFor={visualizer.id}>{visualizer.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='mt-3 d-flex flex-row-reverse'>
                <button className='btn btn-primary' style={{ width: "5rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                    </svg>
                </button>
            </div>
        </dialog>
    );
}
