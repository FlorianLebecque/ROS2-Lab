import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useContext, useEffect } from 'react';


interface TopicPublisherContextValue {
    publish: (message: any) => void;
}

const TopicPublisherContext = createContext<TopicPublisherContextValue>({
    publish: (message: any) => { },
});


const TopicPublisher: React.FC<{ children: React.ReactNode; topicName: string, topicType: string }> = ({
    children,
    topicName,
    topicType
}) => {
    const rosWeb = useRosWeb(); // Assuming useRosWeb provides ROS access

    let publish = (message: any) => { };

    useEffect(() => {

        if (rosWeb && topicName && topicType) {
            const topicPublisher = rosWeb.CreateTopicPublisher(topicName, topicType);

            publish = (message: any) => {
                topicPublisher.publish(message);
            }

            return () => {
                topicPublisher.unadvertise();
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