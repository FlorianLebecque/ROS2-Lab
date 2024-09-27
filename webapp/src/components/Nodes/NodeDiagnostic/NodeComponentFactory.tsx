import React from 'react';
import BasicTopic from '@/components/Topics/basic';
import { RosWebProvider } from '@/components/RosContext';
import BasicService from '@/components/services/basic';


const NodeComponentFactory = ({ type, props }: { type: string, props: any }) => {

    const components: { [key: string]: JSX.Element } = {
        'topic': (<BasicTopic name={props.topicName} type={props.topicType} />),
        'service': (<BasicService name={props.serviceName} type={props.serviceType} details={props.details} />)
    };

    return components[type];
};

export default NodeComponentFactory;
