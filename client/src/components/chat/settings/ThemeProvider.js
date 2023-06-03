import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState();

    const toggleTheme = (mode) => {
        const updatedTheme = createTheme({
            palette: {
                mode: mode,
            },
        });
        setTheme(updatedTheme);
        localStorage.setItem('theme', mode);
    };

    const plainTheme = createTheme(theme);

    useEffect(() => {
        const saveTheme = localStorage.getItem('theme');
        if (saveTheme) {
            toggleTheme(saveTheme);
        } else {
            toggleTheme('light');
            localStorage.setItem('theme', 'light');
        }

    }, []);

    return (
        <MuiThemeProvider theme={plainTheme}>
            <ThemeContext.Provider value={{ theme: plainTheme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        </MuiThemeProvider>
    );
};

export const useChatTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useChatTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;