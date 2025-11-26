'use client';

import { useState } from 'react';
import Header from '../components/layout/header';
import Sidebar from '../components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Header onMenuClick={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}