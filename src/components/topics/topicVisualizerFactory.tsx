import React from 'react';
import BasicDisplay from '@/components/topics/Display/basicDisplay/basicDisplay';
import ImuDataDisplay from './Display/imu_data/imu_data';

interface ComponentFactoryProps {
    topicName: string;
    topicType: string;
}

const TopicVisualizerFactory = ({ topicName, topicType }: ComponentFactoryProps) => {

    // Define the components that can be displayed 
    const components: { [key: string]: JSX.Element } = {
        'sensor_msgs/msg/Imu': (<ImuDataDisplay name={topicName} />),
        'default': (<BasicDisplay name={topicName} />)
    };


    if (!components[topicType]) return components['default'];

    return components[topicType];
};

export default TopicVisualizerFactory;
