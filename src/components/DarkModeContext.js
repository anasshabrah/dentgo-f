import { jsx as _jsx } from "react/jsx-runtime";
// src/context/DarkModeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
const defaultValue = {
    isDarkMode: false,
    toggleDarkMode: () => { }
};
const DarkModeContext = createContext(defaultValue);
export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true';
        }
        return false;
    });
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDarkMode) {
            htmlElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        }
        else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };
    return (_jsx(DarkModeContext.Provider, { value: { isDarkMode, toggleDarkMode }, children: children }));
};
export const useDarkMode = () => useContext(DarkModeContext);
