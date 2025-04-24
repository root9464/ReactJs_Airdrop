import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TanstackProvider } from './providers/tanstack.tsx';
import { TonProvider } from './providers/ton.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackProvider>
      <TonProvider>
        <App />
      </TonProvider>
    </TanstackProvider>
  </StrictMode>,
);
