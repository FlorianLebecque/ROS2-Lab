// TopicDataProvider.tsx
import React, { createContext, useState } from 'react';

interface TopicData {
    time: string;
    ros: any;
}

interface TopicDataContextValue {
    data: TopicData[];
    setData: (newData: TopicData[]) => void;
}

const TopicDataContext = createContext<TopicDataContextValue>({
    data: [],
    setData: () => { },
});

export default function TopicDataProvider({ children }: React.PropsWithChildren<{ children: JSX.Element }>) {
    const [data, setData] = useState<TopicData[]>([]);

    return (
        <TopicDataContext.Provider value={{ data, setData }}>
            {children}
        </TopicDataContext.Provider>
    );
}