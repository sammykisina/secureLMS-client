import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Layout } from '@/components';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <React.StrictMode>
          <Layout />
        </React.StrictMode>
      </RecoilRoot>
    </QueryClientProvider>
  </BrowserRouter>
);
