'use client';

import React from 'react';
import { TopicProvider } from './topicProvider';
import ControlBar from '../Utils/ControlBar/ControlBar';
import TopicVisualizerFactory from './topicVisualizerFactory';

export default function BasicTopic(props: { name: string, type: string }) {

    const { name, type } = props;

    return (
        <TopicProvider topicName={name}>
            <div className="d-flex flex-column" style={{ height: "100%" }}>
                <ControlBar topicName={name} topicType={type} />
                <TopicVisualizerFactory topicName={name} topicType={type} />
            </div>
        </TopicProvider>
    );
}
