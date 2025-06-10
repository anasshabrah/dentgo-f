// src/app/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from '@context/ModalContext';
import RoutesConfig from './routes';
import Loader from '@components/ui/Loader';
import ErrorBoundary from '@components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        <ErrorBoundary>
          {/* Use fullscreen loader here to cover the entire viewport */}
          <Suspense fallback={<Loader fullscreen />}>
            <RoutesConfig />
          </Suspense>
        </ErrorBoundary>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
