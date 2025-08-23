import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { MantineColorScheme } from '@mantine/core';

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: MantineColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<MantineColorScheme>('light');

  // 从localStorage加载主题设置
  useEffect(() => {
    const savedScheme = localStorage.getItem('mantine-color-scheme') as MantineColorScheme;
    if (savedScheme === 'light' || savedScheme === 'dark') {
      setColorSchemeState(savedScheme);
      document.documentElement.setAttribute('data-mantine-color-scheme', savedScheme);
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialScheme = prefersDark ? 'dark' : 'light';
      setColorSchemeState(initialScheme);
      document.documentElement.setAttribute('data-mantine-color-scheme', initialScheme);
    }
  }, []);

  // 保存主题设置到localStorage
  const setColorScheme = (scheme: MantineColorScheme) => {
    setColorSchemeState(scheme);
    localStorage.setItem('mantine-color-scheme', scheme);
    // 同时更新HTML元素的data属性
    document.documentElement.setAttribute('data-mantine-color-scheme', scheme);
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}