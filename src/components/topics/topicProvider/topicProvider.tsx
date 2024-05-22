import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface DataItem {
    time: string;
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

    useEffect(() => {
        const handleData = (message: any) => {

            const new_data: DataItem = {
                time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                ros: message,
            };

            setData((prevData) => [...prevData.slice(-100), new_data]);
        };

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
                console.log("Unsubscribe");
                if (pause) {
                    setData([]);
                }

                topic_listeners.unsubscribe();
            };

            return () => {
                Disconnect();
            };
        }

        setData((prevData) => prevData.slice(-100)); // Keep only last 100 elements

    }, [rosWeb, topicName, pause]); // Dependency on both rosWeb and topicName

    return (
        <DataContext.Provider value={{ data, setData, pause, setPause }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
