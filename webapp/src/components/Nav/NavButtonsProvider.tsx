import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export interface IButton {
    id: string,
    button: JSX.Element,
    priority: number
}

interface INavButtonContext {

    buttons: Map<string, IButton>,

    AddButton(id: string, button: JSX.Element, priority?: number): void,
    RemoveButton(id: string): void,
}


const NavButtonContext = createContext<INavButtonContext>({

    buttons: new Map<string, IButton>(),

    AddButton: () => { },
    RemoveButton: () => { },

});


export const NavButtonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [buttons, setButtons] = useState<Map<string, IButton>>(new Map<string, IButton>());

    const AddButton = (id: string, button: JSX.Element, priority: number = 0) => {

        setButtons((prev) => {
            const newButtons = new Map(prev);
            newButtons.set(id, { id, button, priority });
            return newButtons;
        });
    }

    const RemoveButton = (id: string) => {

        setButtons((prev) => {
            const newButtons = new Map(prev);
            newButtons.delete(id);
            return newButtons;
        });
    }

    return (
        <NavButtonContext.Provider value={{ buttons, AddButton, RemoveButton }}>{children}</NavButtonContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useNavButtons: () => INavButtonContext = () => {
    const context = useContext(NavButtonContext);
    if (!context) {
        throw new Error('useNavButtons must be used within DashboardProvider');
    }
    return context;
};