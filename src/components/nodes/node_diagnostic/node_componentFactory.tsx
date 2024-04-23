import React from 'react';
import BasicTopic from '@/components/topics/basic';
import { RosWebProvider } from '@/components/RosContext';


const ComponentFactory = ({ type, props }: { type: string, props: any }) => {

    const components: { [key: string]: JSX.Element } = {
        'topic': (<BasicTopic name={props.topicName} type={props.topicType} />),
    };

    return components[type];
};

export default ComponentFactory;
