import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create context
export const ThemeContext = createContext();

// Available themes
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Theme storage key
const THEME_STORAGE_KEY = 'theme';

// Get initial theme
const getInitialTheme = () => {
  // Check localStorage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
    return storedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
};

// Get system theme
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const [systemTheme, setSystemTheme] = useState(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  // Initialize theme
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setSystemTheme(getSystemTheme());
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const activeTheme = theme === THEMES.SYSTEM ? systemTheme : theme;

    // Remove previous theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    root.classList.add(`${activeTheme}-theme`);
    
    // Set color scheme meta tag
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', activeTheme);
    
    // Set theme color meta tag
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      activeTheme === THEMES.DARK ? '#111827' : '#ffffff'
    );

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, systemTheme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
      setSystemTheme(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set theme
  const setThemeMode = useCallback((newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === THEMES.LIGHT) return THEMES.DARK;
      if (prev === THEMES.DARK) return THEMES.LIGHT;
      return THEMES.LIGHT;
    });
  }, []);

  // Set light theme
  const setLightTheme = useCallback(() => {
    setTheme(THEMES.LIGHT);
  }, []);

  // Set dark theme
  const setDarkTheme = useCallback(() => {
    setTheme(THEMES.DARK);
  }, []);

  // Set system theme
  const setSystemThemeMode = useCallback(() => {
    setTheme(THEMES.SYSTEM);
  }, []);

  // Get current theme
  const getCurrentTheme = useCallback(() => {
    return theme === THEMES.SYSTEM ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Check if dark mode
  const isDarkMode = useCallback(() => {
    return getCurrentTheme() === THEMES.DARK;
  }, [getCurrentTheme]);

  // Check if light mode
  const isLightMode = useCallback(() => {
    return getCurrentTheme() === THEMES.LIGHT;
  }, [getCurrentTheme]);

  // Get theme colors
  const getThemeColors = useCallback(() => {
    const isDark = isDarkMode();
    
    return {
      // Primary colors
      primary: isDark ? '#3b82f6' : '#2563eb',
      primaryLight: isDark ? '#60a5fa' : '#3b82f6',
      primaryDark: isDark ? '#2563eb' : '#1d4ed8',
      
      // Secondary colors
      secondary: isDark ? '#8b5cf6' : '#7c3aed',
      secondaryLight: isDark ? '#a78bfa' : '#8b5cf6',
      secondaryDark: isDark ? '#7c3aed' : '#6d28d9',
      
      // Accent colors
      accent: isDark ? '#ec4899' : '#db2777',
      accentLight: isDark ? '#f472b6' : '#ec4899',
      accentDark: isDark ? '#db2777' : '#be185d',
      
      // Background colors
      background: isDark ? '#111827' : '#ffffff',
      backgroundAlt: isDark ? '#1f2937' : '#f9fafb',
      backgroundCard: isDark ? '#1f2937' : '#ffffff',
      
      // Text colors
      text: isDark ? '#f9fafb' : '#111827',
      textLight: isDark ? '#d1d5db' : '#6b7280',
      textLighter: isDark ? '#9ca3af' : '#9ca3af',
      
      // Border colors
      border: isDark ? '#374151' : '#e5e7eb',
      borderLight: isDark ? '#4b5563' : '#f3f4f6',
      borderDark: isDark ? '#1f2937' : '#d1d5db',
      
      // Status colors
      success: isDark ? '#10b981' : '#059669',
      warning: isDark ? '#f59e0b' : '#d97706',
      error: isDark ? '#ef4444' : '#dc2626',
      info: isDark ? '#3b82f6' : '#2563eb',
      
      // Gray scale
      gray50: isDark ? '#111827' : '#f9fafb',
      gray100: isDark ? '#1f2937' : '#f3f4f6',
      gray200: isDark ? '#374151' : '#e5e7eb',
      gray300: isDark ? '#4b5563' : '#d1d5db',
      gray400: isDark ? '#6b7280' : '#9ca3af',
      gray500: isDark ? '#9ca3af' : '#6b7280',
      gray600: isDark ? '#d1d5db' : '#4b5563',
      gray700: isDark ? '#e5e7eb' : '#374151',
      gray800: isDark ? '#f3f4f6' : '#1f2937',
      gray900: isDark ? '#f9fafb' : '#111827',
    };
  }, [isDarkMode]);

  // Get CSS variables
  const getCSSVariables = useCallback(() => {
    const colors = getThemeColors();
    return Object.entries(colors).reduce((acc, [key, value]) => {
      acc[`--${key}`] = value;
      return acc;
    }, {});
  }, [getThemeColors]);

  // Apply CSS variables to root
  useEffect(() => {
    if (!mounted) return;

    const variables = getCSSVariables();
    const root = document.documentElement;

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [mounted, getCSSVariables]);

  // Context value
  const value = {
    // State
    theme,
    systemTheme,
    mounted,
    
    // Available themes
    themes: THEMES,
    
    // Theme setters
    setTheme: setThemeMode,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme: setSystemThemeMode,
    
    // Getters
    getCurrentTheme,
    isDarkMode: isDarkMode(),
    isLightMode: isLightMode(),
    getThemeColors,
    getCSSVariables,
    
    // Colors (for direct access)
    colors: mounted ? getThemeColors() : {},
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Higher-order component for theme injection
export const withTheme = (Component) => {
  return function WrappedComponent(props) {
    return (
      <ThemeContext.Consumer>
        {(theme) => <Component {...props} theme={theme} />}
      </ThemeContext.Consumer>
    );
  };
};

export default ThemeContext;