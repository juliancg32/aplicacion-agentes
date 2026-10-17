/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigation, AppRoute } from '../context/NavigationContext';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();

  const navItems: { label: string; route: AppRoute; icon: string; badge?: string }[] = [
    { label: 'Dashboard', route: 'dashboard', icon: 'dashboard' },
    { label: 'Nueva negociación', route: 'nueva-negociacion', icon: 'add_circle' },
    { label: 'Centro de Negociación', route: 'centro-de-negociacion', icon: 'smart_toy', badge: 'En vivo' },
    { label: 'Agentes', route: 'agentes', icon: 'memory' },
    { label: 'Negociaciones', route: 'negociaciones', icon: 'handshake' },
    { label: 'Propuestas', route: 'propuestas', icon: 'rule' },
    { label: 'Reportes', route: 'reportes', icon: 'analytics' },
    { label: 'Historial', route: 'historial', icon: 'manage_history' },
    { label: 'Configuración', route: 'configuracion', icon: 'settings' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-tertiary z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div
          onClick={() => navigate('dashboard')}
          className="h-16 px-space-md flex items-center gap-space-sm bg-tertiary cursor-pointer hover:opacity-95 transition-opacity"
        >
          {/* Logo SVG with 3 interconnected orbital nodes */}
          <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center shrink-0 shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 40 40">
              <rect fill="#1e3a8a" height="40" rx="10" width="40" />
              <circle cx="20" cy="12" fill="#60a5fa" r="4.5" />
              <circle cx="12" cy="27" fill="#38bdf8" r="4" />
              <circle cx="28" cy="27" fill="#38bdf8" r="4" />
              <circle cx="20" cy="21" fill="#ffffff" r="3" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="20" x2="20" y1="12" y2="21" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="12" x2="20" y1="27" y2="21" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="28" x2="20" y1="27" y2="21" />
              <circle cx="20" cy="21" fill="#1e3a8a" r="1.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-surface-container-lowest leading-none tracking-tight font-bold">
              MultiAgent
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider text-[11px] font-semibold">
              Negotiation
            </span>
          </div>
        </div>

        {/* Status Indicator Chip */}
        <div className="px-space-md py-space-sm">
          <div className="flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-tertiary-container text-on-tertiary-container">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-high text-[11px] font-bold">
              Orquestador IA
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-space-md space-y-1 py-space-sm">
          {navItems.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'centro-de-negociacion' && currentRoute === 'centro-de-negociacion-en-vivo');
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-body-md transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-tertiary-fixed-dim hover:bg-tertiary-container hover:text-surface-container-lowest'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-secondary px-2 py-0.5 rounded-full font-label-sm text-[10px] text-on-secondary uppercase font-bold tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-space-md bg-tertiary-container/50 m-space-sm rounded-xl">
        <div className="flex items-center gap-space-sm mb-space-sm">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-label-md text-surface-container-lowest truncate font-semibold">
              Carlos Mendoza
            </span>
            <span className="font-label-sm text-label-sm text-surface-dim truncate text-[11px]">
              Administrador Corporativo
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('login')}
          className="w-full flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg text-tertiary-fixed-dim hover:bg-error hover:text-on-error transition-colors font-body-sm text-body-sm text-left"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
