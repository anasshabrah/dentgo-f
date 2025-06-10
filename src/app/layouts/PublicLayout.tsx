// src/layouts/PublicLayout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '@components/AppHeader';

const NO_HEADER_PATHS = ['/', '/login'];

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (NO_HEADER_PATHS.includes(pathname)) {
    return <main><Outlet /></main>;
  }

  const titleMap: Record<string, string> = {
    '/allow-push': 'Enable Notifications',
  };
  const title = titleMap[pathname] ?? 'Dentgo';

  return (
    <>
      <AppHeader
        title={title}
        showBack
        onBack={() => navigate(-1)}
      />
      <main><Outlet /></main>
    </>
  );
};

export default PublicLayout;
