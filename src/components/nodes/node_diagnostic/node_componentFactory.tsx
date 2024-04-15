import React from 'react';
import BasicTopic from '@/components/topics/basic';
import { RosWebProvider } from '@/components/RosContext';


const ComponentFactory = ({ type, props }: { type: string, props: any }) => {
    const components: { [key: string]: JSX.Element } = {
        'topic': (<BasicTopic key={props.topic} name={props.topic} />),
    };

    return components[type];
};

export default ComponentFactory;
