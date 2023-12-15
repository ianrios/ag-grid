import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy';
// import { initStore } from 'atoms/store';
import { App } from 'components/App';
// import { Provider } from 'jotai';
// import { useMemo } from 'react';

const theme = extendTheme({
  components: {
    JoyStack: {
      defaultProps: {
        useFlexGap: true,
        gap: 2,
      },
    },
  },
});

export const ThemeBuilder = () => {
  // const store = useMemo(initStore, []);
  return (
    // <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
    // </Provider>
  );
};
