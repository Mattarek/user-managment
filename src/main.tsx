import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store.ts';
import AppThemeProvider from './theme/AppThemeProvider.tsx';
import App from './App.tsx';
import './i18n';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </AppThemeProvider>
  </StrictMode>,
);
