import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';


interface ISettingsContext {

    settings: any;

    exportToJson: () => void;
    importFromJson: (json: any) => void;
    saveSettings: () => void;
}


const SettingsContext = createContext<ISettingsContext>({

    settings: {},

    exportToJson: () => { },
    importFromJson: () => { },
    saveSettings: () => { },
});


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    //const [settings, setSettings] = useState<any>({});
    const settingsRef = useRef<any>({});

    // Load settings from local storage when component mounts
    useEffect(() => {
        const localSettings = localStorage.getItem('settings');
        if (localSettings) {
            settingsRef.current = JSON.parse(localSettings);
        }
    }, []);

    const exportToJson = () => {
        const json = JSON.stringify(settingsRef.current);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Set the file name as settings.json + timestamp
        const date = new Date();
        const timestamp = date.toISOString();
        a.download = `settings_${timestamp}.json`;

        a.click();
    };

    const saveSettings = () => {
        localStorage.setItem('settings', JSON.stringify(settingsRef.current));
    };

    const importFromJson = (json: any) => {
        settingsRef.current = json;
        saveSettings();
    };

    const settings = () => {
        return settingsRef.current;
    }

    return (
        <SettingsContext.Provider value={{ settings, saveSettings, exportToJson, importFromJson }}>{children}</SettingsContext.Provider> // Use DashboardContext.Provider instead of DashboardProvider.Provider
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within DashboardProvider');
    }
    return context;
};