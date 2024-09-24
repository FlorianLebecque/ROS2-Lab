import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';


interface ISettingsContext {

    settings: any;

    exportToJson: () => void;
    importFromJson: (json: any) => void;
    saveSettings: (json: any) => void;
}


const SettingsContext = createContext<ISettingsContext>({

    settings: {},

    exportToJson: () => { },
    importFromJson: () => { },
    saveSettings: (json: any) => { },
});


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [settings_store, setSettings] = useState<any>({});
    //const settingsRef = useRef<any>({});

    // Load settings from local storage when component mounts
    useEffect(() => {
        const localSettings = localStorage.getItem('settings');
        if (localSettings) {
            setSettings(JSON.parse(localSettings));
        }
    }, []);

    const exportToJson = () => {
        const json = JSON.stringify(settings_store);
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

    const saveSettings = (new_settings: any) => {
        setSettings(new_settings);
        localStorage.setItem('settings', JSON.stringify(new_settings));
    };

    const importFromJson = (json: any) => {
        saveSettings(json);
    };

    const settings = () => {
        return settings_store;
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