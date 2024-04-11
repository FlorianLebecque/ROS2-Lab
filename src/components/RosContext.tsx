import { RosWeb, RosWebSingleton } from '@/js/RosWeb';
import React, { createContext, useState, useEffect, useContext } from 'react';

const RosWebContext = createContext<RosWebSingleton | null>(null);

export const RosWebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [rosWeb, setRosWeb] = useState<RosWebSingleton | null>(null);

    // useEffect(() => {
    //     console.log("Initializing ROS connection...");
    //     try {
    //         if (!rosWeb) {
    //             setRosWeb(RosWeb.Instance());
    //         }
    //     } catch (error) {
    //         console.error("Error initializing ROS connection:", error);
    //     }
    // }, [rosWeb]);

    // ... rest of the component

    const rosWeb = RosWeb.Instance();

    return (
        <RosWebContext.Provider value={rosWeb}>{children}</RosWebContext.Provider>
    );
};

export const useRosWeb = () => {
    const context = useContext(RosWebContext);
    if (!context) {
        throw new Error('useRosWeb must be used within RosWebProvider');
    }
    return context;
};