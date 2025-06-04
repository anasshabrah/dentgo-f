import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default PublicLayout;
