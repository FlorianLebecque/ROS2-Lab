import React from 'react';
import BasicDisplay from '@/components/topics/Display/basicDisplay/basicDisplay';
import ImuDataDisplay from './Display/imu_data/imu_data';

interface ComponentFactoryProps {
    topic: string;
}

const TopicVisualizerFactory = ({ topic }: ComponentFactoryProps) => {
    const components: { [key: string]: JSX.Element } = {
        '/imu/data': (<ImuDataDisplay name={topic} />),
        'default': (<BasicDisplay name={topic} />)
    };


    let key = 'default';

    // find the key that matches the topic (the topic contains the key)
    Object.keys(components).forEach((componentKey) => {
        if (topic.includes(componentKey)) {
            key = componentKey;
        }
    });

    if (!components[key]) return components['default'];

    return components[key];
};

export default TopicVisualizerFactory;
