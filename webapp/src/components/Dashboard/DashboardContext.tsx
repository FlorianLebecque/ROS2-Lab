import IDynamicComponent from '@/utils/interfaces/IDynamicComponent';
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
}


const DashboardContext = createContext<IDashboardContext>({
    layout: [],
    setLayout: () => { },

    boxes: new Map(),
    setBoxes: () => { },

    nextBoxId: 0,
    setNextBoxId: () => { },
})


export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<IBox[]>([]);
    const [nextBoxId, setNextBoxId] = useState(0);
    const [boxes, setBoxes] = useState<Map<string, IBoxContent>>(new Map());

    return (
        <DashboardContext.Provider value={{ layout, setLayout, boxes, setBoxes, nextBoxId, setNextBoxId }}>{children}</DashboardContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};