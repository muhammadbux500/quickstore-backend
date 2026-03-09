import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { theme, setTheme } = context;

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  // Get current theme
  const getCurrentTheme = () => {
    if (!mounted) return 'light';
    return theme;
  };

  // Check if dark mode
  const isDarkMode = mounted && theme === 'dark';
  const isLightMode = mounted && theme === 'light';

  // Get theme colors
  const getThemeColors = () => {
    return {
      primary: isDarkMode ? '#3b82f6' : '#2563eb',
      secondary: isDarkMode ? '#8b5cf6' : '#7c3aed',
      accent: isDarkMode ? '#ec4899' : '#db2777',
      background: isDarkMode ? '#111827' : '#ffffff',
      foreground: isDarkMode ? '#f9fafb' : '#111827',
      card: isDarkMode ? '#1f2937' : '#ffffff',
      border: isDarkMode ? '#374151' : '#e5e7eb',
    };
  };

  // Get CSS variables
  const getCSSVariables = () => {
    const colors = getThemeColors();
    return Object.entries(colors).reduce((acc, [key, value]) => {
      acc[`--${key}`] = value;
      return acc;
    }, {});
  };

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  return {
    // State
    theme,
    mounted,
    isDarkMode,
    isLightMode,
    
    // Actions
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    
    // Getters
    getCurrentTheme,
    getThemeColors,
    getCSSVariables,
    
    // Theme utilities
    colors: getThemeColors(),
    variables: getCSSVariables(),
  };
};

// Hook for theme-aware styling
export const useThemedStyles = (styles) => {
  const { isDarkMode } = useTheme();
  
  return typeof styles === 'function' 
    ? styles(isDarkMode)
    : styles;
};

// Hook for theme transition
export const useThemeTransition = (duration = 300) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        transition: background-color ${duration}ms ease, 
                    border-color ${duration}ms ease,
                    color ${duration}ms ease,
                    fill ${duration}ms ease,
                    stroke ${duration}ms ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [duration]);
};

// Hook for theme media query
export const useThemeMediaQuery = () => {
  const [systemTheme, setSystemTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return systemTheme;
};

export default useTheme;