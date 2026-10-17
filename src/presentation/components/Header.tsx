/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export const Header: React.FC = () => {
  const { currentRoute, navigate, searchQuery, setSearchQuery } = useNavigation();
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const routeTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Negociaciones', subtitle: 'Supervisión Global' },
    'nueva-negociacion': { title: 'Configuración', subtitle: 'Nueva Negociación' },
    'centro-de-negociacion': { title: 'Centro en Vivo', subtitle: 'Distribución 2026' },
    agentes: { title: 'Ecosistema IA', subtitle: 'Agentes Autónomos' },
    negociaciones: { title: 'Portafolio', subtitle: 'Gestión de Negociaciones' },
    propuestas: { title: 'Trazabilidad', subtitle: 'Propuestas y Contraofertas' },
    reportes: { title: 'Auditoría', subtitle: 'Reportes y Analítica de Consenso' },
    historial: { title: 'Auditoría Forense', subtitle: 'Historial y Resoluciones' },
    configuracion: { title: 'Control Kernel', subtitle: 'Configuración del Sistema' }
  };

  const currentInfo = routeTitles[currentRoute] || { title: 'Negociaciones', subtitle: 'Supervisión Global' };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
      {/* Breadcrumb & System State */}
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-2">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{currentInfo.title}</span>
          <span className="text-outline-variant font-label-md">/</span>
          <span className="font-body-md text-on-surface-variant">{currentInfo.subtitle}</span>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface">
          <span className="h-2 w-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="font-mono-data text-mono-data text-primary font-medium text-[11px]">
            Sistema IA Operativo - 6 Agentes en Red
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar negociación, agente o folio..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>

        {/* New Negotiation CTA Button */}
        <button
          onClick={() => navigate('nueva-negociacion')}
          className="hidden sm:flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm hover:bg-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nueva negociación</span>
        </button>

        {/* Notifications Icon with Interactive Dropdown */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error font-label-sm text-[10px] text-on-error font-semibold">
              3
            </span>
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl shadow-xl p-4 border border-surface-container-high z-50">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-low mb-3">
                <span className="font-headline-sm text-body-md text-on-surface font-bold">Alertas en Tiempo Real</span>
                <span className="text-[11px] font-mono-data text-secondary">3 pendientes</span>
              </div>
              <div className="space-y-2.5 text-body-sm">
                <div
                  onClick={() => {
                    navigate('centro-de-negociacion');
                    setShowNotificationPanel(false);
                  }}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-primary text-[12px]">Convergencia en #NEG-2026-001</p>
                  <p className="text-on-surface-variant text-[11px]">Déficit absorbido al 100% en Ronda 2.</p>
                </div>
                <div
                  onClick={() => {
                    navigate('propuestas');
                    setShowNotificationPanel(false);
                  }}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-secondary text-[12px]">Firma SHA-256 Validada</p>
                  <p className="text-on-surface-variant text-[11px]">Agente Tecnología aceptó propuesta #P-8921.</p>
                </div>
                <div
                  onClick={() => {
                    navigate('reportes');
                    setShowNotificationPanel(false);
                  }}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-on-surface text-[12px]">Cierre Auditado Q1</p>
                  <p className="text-on-surface-variant text-[11px]">Ahorro algorítmico neto de $40.5M certificado.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Status Profile */}
        <div
          onClick={() => navigate('configuracion')}
          className="flex items-center gap-space-sm pl-space-sm cursor-pointer group"
        >
          <div className="flex flex-col text-right hidden lg:block">
            <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold group-hover:text-primary transition-colors">
              Carlos Mendoza
            </span>
            <span className="font-label-sm text-label-sm text-secondary leading-none text-[11px]">
              En línea
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
