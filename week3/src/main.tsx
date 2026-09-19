import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider bọc toàn bộ app để mọi component con đều truy cập được Redux store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
