import React from 'react';
import BasicDisplay from '@/components/Topics/visualizer/basic/basicDisplay/basicDisplay';
import ImuDataDisplay from './visualizer/imu/imu_data/imu_data';
import { VideoDisplayJPEG, VideoDisplayUncompressed } from './visualizer/image/videoDisplay/videoDisplay';
import ThreadHandleDisplay from './visualizer/emi/emi/thread_handle';
import PulseRaw from './visualizer/emi/emi/PulseRaw';
import DiodeTemp from './visualizer/emi/emi/DiodeTemp';

interface ComponentFactoryProps {
    topicName: string;
    topicType: string;
}

const TopicVisualizerFactory = ({ topicName, topicType }: ComponentFactoryProps) => {

    const componentsByName: { [key: string]: JSX.Element } = {
        'ime_thread_handle': (<ThreadHandleDisplay name={topicName} />),
        'ime_diode_adc_temperatur': (<DiodeTemp name={topicName} />),
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
        'vmc4_msgs/msg/PulseRaw': (<PulseRaw name={topicName} />),
        'default': (<BasicDisplay name={topicName} list={false} />)
    };


    if (!componentsByType[topicType]) return componentsByType['default'];

    return componentsByType[topicType];
};

export default TopicVisualizerFactory;
