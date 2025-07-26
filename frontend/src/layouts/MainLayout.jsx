import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full">
        <MainNav />
      </header>
      <main className="flex-grow w-full mx-auto px-0">
        {children || <Outlet />}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
};

export default MainLayout;
