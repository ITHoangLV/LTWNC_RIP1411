import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider bọc toàn bộ app để Redux store hoạt động */}
    {/* Zustand KHÔNG cần Provider — đó là một trong những ưu điểm của nó */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
