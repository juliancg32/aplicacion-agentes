/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | 'dashboard'
  | 'nueva-negociacion'
  | 'centro-de-negociacion'
  | 'centro-de-negociacion-en-vivo'
  | 'agentes'
  | 'negociaciones'
  | 'propuestas'
  | 'reportes'
  | 'historial'
  | 'configuracion'
  | 'login'
  | 'registro';

interface NavigationContextType {
  currentRoute: AppRoute;
  params: Record<string, string>;
  navigate: (route: AppRoute, params?: Record<string, string>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeNegotiationId: string;
  setActiveNegotiationId: (id: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [params, setParams] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNegotiationId, setActiveNegotiationId] = useState('neg-2026-001');

  useEffect(() => {
    // Sync with window.location.hash if present
    const hash = window.location.hash.replace('#', '') as AppRoute;
    if (hash && ['dashboard', 'nueva-negociacion', 'centro-de-negociacion', 'centro-de-negociacion-en-vivo', 'agentes', 'negociaciones', 'propuestas', 'reportes', 'historial', 'configuracion', 'login', 'registro'].includes(hash)) {
      setCurrentRoute(hash === 'centro-de-negociacion-en-vivo' ? 'centro-de-negociacion' : hash);
    }
  }, []);

  const navigate = (route: AppRoute, newParams?: Record<string, string>) => {
    const normalizedRoute = route === 'centro-de-negociacion-en-vivo' ? 'centro-de-negociacion' : route;
    setCurrentRoute(normalizedRoute);
    if (newParams) setParams(newParams);
    window.location.hash = normalizedRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        params,
        navigate,
        searchQuery,
        setSearchQuery,
        activeNegotiationId,
        setActiveNegotiationId
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
