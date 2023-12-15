import { useColorScheme } from '@mui/joy';
import { useEffect, useLayoutEffect } from 'react';
import { RootContainer } from './RootContainer';

export const App = () => {
  // TODO restore logic for detecting dark mode
  const isDark = false;

  useLayoutEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.dataset.darkMode = isDark ? 'true' : 'false';
    }
  }, [isDark]);

  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(isDark ? 'dark' : 'light');
  }, [isDark, setMode]);

  return <RootContainer />;
};
