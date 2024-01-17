import { useColorScheme } from '@mui/joy';
import { useAtomValue } from 'jotai';
import { renderedThemeAtom } from 'model/rendered-theme';
import { useEffect } from 'react';
import { RootContainer } from './RootContainer';

export const App = () => {
  const { isDark } = useAtomValue(renderedThemeAtom);
  const { setMode } = useColorScheme();
  useEffect(() => {
    setMode(isDark ? 'dark' : 'light');
  }, [isDark, setMode]);

  return <RootContainer />;
};
