import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface DataItem {
    time: string;
    ros: any;
}

interface DataContextValue {
    data: DataItem[];
    setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
}

const DataContext = createContext<DataContextValue>({
    data: [],
    setData: () => { },
});

export const TopicProvider: React.FC<{ children: React.ReactNode; topicName: string }> = ({
    children,
    topicName,
}) => {
    const [data, setData] = useState<DataItem[]>([]);
    const rosWeb = useRosWeb(); // Assuming useRosWeb provides ROS access

    useEffect(() => {
        const handleData = (message: any) => {

            const new_data: DataItem = {
                time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                ros: message,
            };

            setData((prevData) => [...prevData.slice(-100), new_data]);
        };

        if (rosWeb && topicName) {
            const topic_listeners = rosWeb.SubscribeToTopic(topicName, handleData);

            const Disconnect = () => {
                topic_listeners.unsubscribe();
            };

            return () => {
                Disconnect();
            };
        }

        setData((prevData) => prevData.slice(-100)); // Keep only last 100 elements

    }, [rosWeb, topicName]); // Dependency on both rosWeb and topicName

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
