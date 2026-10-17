/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationProvider, useNavigation } from './presentation/context/NavigationContext';
import { MainLayout } from './presentation/layouts/MainLayout';

import { DashboardPage } from './presentation/pages/DashboardPage';
import { NuevaNegociacionPage } from './presentation/pages/NuevaNegociacionPage';
import { CentroNegociacionPage } from './presentation/pages/CentroNegociacionPage';
import { AgentesPage } from './presentation/pages/AgentesPage';
import { NegociacionesPage } from './presentation/pages/NegociacionesPage';
import { PropuestasPage } from './presentation/pages/PropuestasPage';
import { ReportesPage } from './presentation/pages/ReportesPage';
import { HistorialPage } from './presentation/pages/HistorialPage';
import { ConfiguracionPage } from './presentation/pages/ConfiguracionPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RegisterPage } from './presentation/pages/RegisterPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useNavigation();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'nueva-negociacion':
        return <NuevaNegociacionPage />;
      case 'centro-de-negociacion':
      case 'centro-de-negociacion-en-vivo':
        return <CentroNegociacionPage />;
      case 'agentes':
        return <AgentesPage />;
      case 'negociaciones':
        return <NegociacionesPage />;
      case 'propuestas':
        return <PropuestasPage />;
      case 'reportes':
        return <ReportesPage />;
      case 'historial':
        return <HistorialPage />;
      case 'configuracion':
        return <ConfiguracionPage />;
      case 'login':
        return <LoginPage />;
      case 'registro':
        return <RegisterPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <MainLayout>{renderCurrentPage()}</MainLayout>;
};

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
