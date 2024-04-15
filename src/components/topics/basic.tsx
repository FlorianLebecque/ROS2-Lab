'use client';

import React from 'react';
import BasicDisplay from './basicDisplay/basicDisplay';
import { TopicProvider } from './topicProvider/topicProvider';
import ControlBar from './controlbar/controlbar';

export default function BasicTopic(props: { name: string }) {
    const { name } = props;

    return (
        <TopicProvider topicName={name}> {/* Pass topicName as a prop */}
            <div className="d-flex flex-column" style={{ height: "100%" }}>
                <ControlBar name={name} />
                <BasicDisplay name={name} />
            </div>
        </TopicProvider>
    );
}
