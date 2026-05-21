import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n/index';
import './styles/tokens.css';
import './styles/tokens-dark.css';
import './styles/styles.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

type ColorMode = 'light' | 'dark';

// Chakra's ColorModeProvider writes data-theme on <html>, which overrides our
// CSS variable system. This manager bridges it to our own 'ui' localStorage key
// so Chakra reads the correct value instead of defaulting to 'light'.
const chakraColorModeManager = {
  type: 'localStorage' as const,
  ssr: false,
  get: (fallback?: ColorMode): ColorMode | undefined => {
    try {
      const stored = JSON.parse(localStorage.getItem('ui') || 'null');
      const theme = stored?.state?.theme;
      return theme === 'dark' || theme === 'light' ? theme : fallback;
    } catch {
      return fallback;
    }
  },
  set: (_: ColorMode | 'system'): void => {},
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider colorModeManager={chakraColorModeManager}>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
