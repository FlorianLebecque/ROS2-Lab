import { RosWeb, RosWebSingleton } from '@/utils/RosWeb';
import React, { createContext, useState, useEffect, useContext } from 'react';

const RosWebContext = createContext<RosWebSingleton | null>(null);

export const RosWebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const rosWeb = RosWeb.Instance();

    useEffect(() => {

        return () => {
            rosWeb.disconnect();  // Disconnect from ROS server on unmount
        };
    }, [rosWeb]);

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