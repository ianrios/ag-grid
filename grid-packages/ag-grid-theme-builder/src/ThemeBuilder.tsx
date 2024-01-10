import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy';
import { App } from 'components/App';
import { Provider, createStore } from 'jotai';
import { useMemo } from 'react';

const theme = extendTheme({
  components: {
    JoyStack: {
      defaultProps: {
        useFlexGap: true,
        gap: 2,
      },
    },
    JoyMenuButton: {
      defaultProps: {
        sx: { gap: 1 },
      },
    },
    JoyTooltip: {
      defaultProps: {
        slotProps: {
          root: {
            sx: { maxWidth: '350px' },
          } as any,
        },
        arrow: true,
      },
    },
  },
});

export const ThemeBuilder = () => {
  const store = useMemo(createStore, []);
  return (
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <App />
      </CssVarsProvider>
    </Provider>
  );
};
