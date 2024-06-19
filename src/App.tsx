import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

import { Router } from './Router';
import { CyclesContextProvider } from './contexts/CycleContext';

import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/global';

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <GlobalStyle />
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
