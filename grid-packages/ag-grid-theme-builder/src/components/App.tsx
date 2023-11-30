import { useColorScheme } from '@mui/joy';
import { VariableDescriptions, useUpdateVariableDescriptions } from 'atoms/variableDescriptions';
import { registerFeatureModules } from 'model/features';
import { useEffect, useLayoutEffect } from 'react';
import { RootContainer } from './RootContainer';

export type ThemeBuilderAppProps = {
  variableDescriptions: VariableDescriptions;
};

export const App = ({ variableDescriptions }: ThemeBuilderAppProps) => {
  useUpdateVariableDescriptions()(variableDescriptions);
  useEffect(registerFeatureModules, []);

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
