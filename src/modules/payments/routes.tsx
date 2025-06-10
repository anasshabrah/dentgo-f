// src/modules/payments/routes.tsx
import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const Wallet = lazy(() => import('./Wallet'));
const SubscribeWizard = lazy(() => import('./SubscribeWizard'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const paymentRoutes = [
  {
    path: 'wallet',
    element: withSuspense(Wallet),
  },
  {
    path: 'subscribe',
    element: withSuspense(SubscribeWizard),
  },
  // Redirects from legacy paths
  { path: 'payment-method', element: <Navigate to="wallet" replace /> },
  { path: 'bank-cards', element: <Navigate to="wallet" replace /> },
  { path: 'add-new-card', element: <Navigate to="wallet" replace /> },
];

export default paymentRoutes;
