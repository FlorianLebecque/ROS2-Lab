import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';


interface INavButtonContext {

    buttons: JSX.Element[],

    AddButton(button: JSX.Element): void,
}


const NavButtonContext = createContext<INavButtonContext>({

    buttons: [],

    AddButton: () => { },

});


export const NavButtonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [buttons, setButtons] = useState<JSX.Element[]>([]);

    const AddButton = (button: JSX.Element) => {
        setButtons([...buttons, button]);
    }

    return (
        <NavButtonContext.Provider value={{ buttons, AddButton }}>{children}</NavButtonContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useNavButtons = () => {
    const context = useContext(NavButtonContext);
    if (!context) {
        throw new Error('useNavButtons must be used within DashboardProvider');
    }
    return context;
};