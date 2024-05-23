import IDynamicComponent from '@/js/interfaces/iDynamicComponent';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface IBox {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface IBoxContent {
    title: string;
    contentDef: IDynamicComponent;
}

interface IDashboardContext {
    layout: IBox[];
    setLayout: React.Dispatch<React.SetStateAction<IBox[]>>;

    boxes: Map<string, IBoxContent>;
    setBoxes: React.Dispatch<React.SetStateAction<Map<string, IBoxContent>>>;

    nextBoxId: number;
    setNextBoxId: React.Dispatch<React.SetStateAction<number>>;

    getNextYPosition: (currentLayout: any) => number;
}


const DashboardContext = createContext<IDashboardContext>({
    layout: [],
    setLayout: () => { },

    boxes: new Map(),
    setBoxes: () => { },

    nextBoxId: 0,
    setNextBoxId: () => { },
    getNextYPosition: (currentLayout: any) => 0,
})


export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<IBox[]>([]);
    const [nextBoxId, setNextBoxId] = useState(0);

    const [boxes, setBoxes] = useState<Map<string, IBoxContent>>(new Map());

    const getNextYPosition = (currentLayout: any) => {
        const maxY = currentLayout.reduce((acc: number, curr: { y: any; h: any; }) => {
            const bottomY = curr.y + curr.h;
            return bottomY > acc ? bottomY : acc;
        }, 0);
        return maxY;
    };

    return (
        <DashboardContext.Provider value={{ layout, setLayout, boxes, setBoxes, nextBoxId, setNextBoxId, getNextYPosition }}>{children}</DashboardContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};