import React from 'react';
import BasicDisplay from '@/components/topics/Display/basicDisplay/basicDisplay';
import ImuDataDisplay from './Display/imu_data/imu_data';
import { VideoDisplayJPEG, VideoDisplayUncompressed } from './Display/videoDisplay/videoDisplay';
import ThreadHandleDisplay from './Display/ime/thread_handle';

interface ComponentFactoryProps {
    topicName: string;
    topicType: string;
}

const TopicVisualizerFactory = ({ topicName, topicType }: ComponentFactoryProps) => {

    const componentsByName: { [key: string]: JSX.Element } = {
        'ime_thread_handle': (<ThreadHandleDisplay name={topicName} />),
    };

    // If the topic name is partially matched, return the component, if not check with the topic type
    for (const key in componentsByName) {
        if (topicName.includes(key)) {
            return componentsByName[key];
        }
    }

    // Define the components that can be displayed using the topic Type
    const componentsByType: { [key: string]: JSX.Element } = {
        'sensor_msgs/msg/Imu': (<ImuDataDisplay name={topicName} />),
        'sensor_msgs/msg/CompressedImage': (<VideoDisplayJPEG name={topicName} />),
        'sensor_msgs/msg/Image': (<VideoDisplayUncompressed name={topicName} />),
        'default': (<BasicDisplay name={topicName} list={false} />)
    };


    if (!componentsByType[topicType]) return componentsByType['default'];

    return componentsByType[topicType];
};

export default TopicVisualizerFactory;
