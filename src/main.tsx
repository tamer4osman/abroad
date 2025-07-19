import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import { AppWithErrorHandling } from './components/AppWithErrorHandling';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWithErrorHandling />
    </Provider>
  </StrictMode>,
);
