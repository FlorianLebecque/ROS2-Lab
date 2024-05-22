import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface IBox {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    content: any;
}

interface IDashboardContext {
    layout: IBox[];
    setLayout: React.Dispatch<React.SetStateAction<IBox[]>>;

    nextBoxId?: number;
    setNextBoxId?: React.Dispatch<React.SetStateAction<number>>;

    getNextYPosition?: () => number;
}


const DashboardContext = createContext<IDashboardContext>({
    layout: [],
    setLayout: () => { },
    nextBoxId: 0,
    setNextBoxId: () => { },
    getNextYPosition: () => 0,
})


export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<IBox[]>([]);
    const [nextBoxId, setNextBoxId] = useState(0);

    const getNextYPosition = () => {
        const maxY = layout.reduce((acc, curr) => {
            const bottomY = curr.y + curr.h;
            return bottomY > acc ? bottomY : acc;
        }, 0);
        return maxY;
    };

    return (
        <DashboardContext.Provider value={{ layout, setLayout, nextBoxId, setNextBoxId, getNextYPosition }}>{children}</DashboardContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};