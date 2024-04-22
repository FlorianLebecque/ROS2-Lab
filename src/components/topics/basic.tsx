'use client';

import React from 'react';
import { TopicProvider } from './topicProvider/topicProvider';
import ControlBar from './controlbar/controlbar';
import TopicVisualizerFactory from './topicVisualizerFactory';

export default function BasicTopic(props: { name: string }) {
    const { name } = props;

    return (
        <TopicProvider topicName={name}> {/* Pass topicName as a prop */}
            <div className="d-flex flex-column" style={{ height: "100%" }}>
                <ControlBar name={name} />
                <TopicVisualizerFactory topic={name} />
            </div>
        </TopicProvider>
    );
}
