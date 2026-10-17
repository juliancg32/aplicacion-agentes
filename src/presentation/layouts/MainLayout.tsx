/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useNavigation } from '../context/NavigationContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentRoute } = useNavigation();

  // For authentication views, render standalone full-screen split layout
  if (currentRoute === 'login' || currentRoute === 'registro') {
    return <div className="min-h-screen bg-background font-sans">{children}</div>;
  }

  return (
    <div className="bg-background font-sans text-on-surface antialiased min-h-screen flex">
      {/* 280px Fixed Obsidian Sidebar */}
      <Sidebar />

      {/* Main Content View with 72 (18rem / 288px) padding-left */}
      <div className="pl-72 flex flex-col min-h-screen w-full">
        {/* Fixed Topbar */}
        <Header />

        {/* Dynamic Workspace Container */}
        <main className="relative pt-16 w-full flex-1 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
