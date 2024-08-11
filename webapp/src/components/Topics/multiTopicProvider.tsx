import { useRosWeb } from '@/components/RosContext';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface DataItem {
    time: string;
    ros: any;
}

interface DataContextValue {
    data: Map<string, DataItem[]>;
    setData: React.Dispatch<React.SetStateAction<Map<string, DataItem[]>>>;
    setPause: React.Dispatch<React.SetStateAction<boolean>>;
    pause: boolean;
}

const DataContext = createContext<DataContextValue>({
    data: new Map<string, DataItem[]>(),
    setData: () => { },
    setPause: () => { },
    pause: false,
});

export const MultiTopicProvider: React.FC<{ children: React.ReactNode; topicsNames: Map<string, string> }> = ({
    children,
    topicsNames,
}) => {
    const [data, setData] = useState<Map<string, DataItem[]>>(new Map());
    const rosWeb = useRosWeb(); // Assuming useRosWeb provides ROS access
    const [pause, setPause] = useState(false);
    const [lasttopics, setLastTopics] = useState<Map<string, string> | null>(null);

    useEffect(() => {
        const handleData = (name: string, message: any) => {

            // check the header of the message, if it is older than 2 seconds, ignore it
            if (message.header && message.header.stamp) {
                const message_time = new Date(message.header.stamp.secs * 1000 + message.header.stamp.nsecs / 1000000);
                const current_time = new Date();
                if (current_time.getTime() - message_time.getTime() > 2000) {
                    return;
                }
            }

            const new_data: DataItem = {
                time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                ros: message,
            };

            setData((prevData) => {
                const prevDataCopy = new Map(prevData);
                const prevDataArray = prevDataCopy.get(name) || [];
                return prevDataCopy.set(name, [...prevDataArray.slice(-100), new_data]);
            });
        };

        if (rosWeb && topicsNames) {

            if (pause) {
                return;
            }

            if (lasttopics && lasttopics !== topicsNames) {
                setData(new Map());
            }

            // key -> name, value -> topic
            const topic_listeners = new Map<string, any>();
            topicsNames.forEach((topic, name) => {

                const handle = (message: any) => {
                    handleData(name, message);
                }

                topic_listeners.set(name, rosWeb.SubscribeToTopic(topic, handle));
            });

            setLastTopics(topicsNames);

            const Disconnect = () => {
                if (pause) {
                    setData(new Map());
                }

                topic_listeners.forEach((listener) => {
                    listener.unsubscribe();
                });
            };

            return () => {
                Disconnect();
            };
        }

        setData((prevData) => {
            const prevDataCopy = new Map(prevData);
            prevDataCopy.forEach((value, key) => {
                prevDataCopy.set(key, value.slice(-100));
            });
            return prevDataCopy;
        }); // Keep only last 100 elements

    }, [rosWeb, topicsNames, pause]); // Dependency on both rosWeb and topicName

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
