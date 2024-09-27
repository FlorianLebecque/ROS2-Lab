import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface DataItem {
    time: number;
    ros: any;
}

interface DataContextValue {
    data: DataItem[];
    setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
    setPause: React.Dispatch<React.SetStateAction<boolean>>;
    pause: boolean;
}

const DataContext = createContext<DataContextValue>({
    data: [],
    setData: () => { },
    setPause: () => { },
    pause: false,
});

export const TopicProvider: React.FC<{ children: React.ReactNode; topicName: string }> = ({
    children,
    topicName,
}) => {
    const [data, setData] = useState<DataItem[]>([]);
    const rosWeb = useRosWeb(); // Assuming useRosWeb provides ROS access
    const [pause, setPause] = useState(false);
    const [lasttopic, setLastTopic] = useState<string | null>(null);

    const handleData = (message: any) => {

        // check the header of the message, if it is older than 2 seconds, ignore it
        if (message.header && message.header.stamp) {
            const message_time = new Date(message.header.stamp.secs * 1000 + message.header.stamp.nsecs / 1000000);
            const current_time = new Date();
            if (current_time.getTime() - message_time.getTime() > 2000) {
                return;
            }
        }

        const new_data: DataItem = {
            time: Date.now(),
            ros: message,
        };

        setData((prevData) => [...prevData.slice(-100), new_data]);
    };

    useEffect(() => {
        if (rosWeb && topicName) {

            if (pause) {
                return;
            }

            if (lasttopic && lasttopic !== topicName) {
                setData([]);
            }

            const topic_listeners = rosWeb.SubscribeToTopic(topicName, handleData);

            setLastTopic(topicName);

            const Disconnect = () => {
                if (pause) {
                    setData([]);
                }

                topic_listeners.unsubscribe();
            };

            return () => {
                Disconnect();
            };
        }

        // setData((prevData) => prevData.slice(-100)); // Keep only last 100 elements

    }, [rosWeb, topicName, pause]); // Dependency on both rosWeb and topicName

    return (
        <DataContext.Provider value={{ data, setData, pause, setPause }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
}
