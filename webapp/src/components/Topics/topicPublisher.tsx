import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useContext, useEffect, useRef } from 'react';


interface TopicPublisherContextValue {
    publish: (message: any) => void;
}

const TopicPublisherContext = createContext<TopicPublisherContextValue>({
    publish: (message: any) => { },
});


export const TopicPublisher: React.FC<{ children: React.ReactNode; topicName: string, topicType: string }> = ({
    children,
    topicName,
    topicType
}) => {
    const rosWeb = useRosWeb(); // Assuming useRosWeb provides ROS access

    const topicPublisherRef = useRef<any>();

    const publish = (message: any) => {

        if (topicPublisherRef.current) {
            topicPublisherRef.current.advertise();

            topicPublisherRef.current.publish(message);
        }
    };

    useEffect(() => {

        if (rosWeb && topicName && topicType) {

            if (!topicPublisherRef.current) {
                topicPublisherRef.current = rosWeb.CreateTopicPublisher(topicName, topicType);
            }

            return () => {
                if (topicPublisherRef.current) {
                    topicPublisherRef.current.unadvertise();
                }
            }
        }

    }, [rosWeb, topicName, topicType]);

    return (
        <TopicPublisherContext.Provider value={{ publish }}>
            {children}
        </TopicPublisherContext.Provider>
    );
}

export const usePublisher = () => {
    const context = useContext(TopicPublisherContext);
    if (!context) {
        throw new Error('usePublisher must be used within TopicPublisherContext');
    }
    return context;
}