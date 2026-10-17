/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { DashboardMetrics } from '../../application/use-cases/GetDashboardMetricsUseCase';
import { Negotiation } from '../../domain/entities/Negotiation';

export const DashboardPage: React.FC = () => {
  const { navigate, setActiveNegotiationId } = useNavigation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'priority' | 'final'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [metricsRes, negRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/negotiations')
        ]);

        if (!metricsRes.ok || !negRes.ok) {
          throw new Error('No se pudo cargar la información desde los endpoints REST.');
        }

        const metricsData = await metricsRes.json();
        const negData = await negRes.json();

        if (metricsData.success) {
          setMetrics(metricsData.data);
        }
        if (negData.success) {
          setNegotiations(negData.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado al conectar con el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const openNegotiationRoom = (id: string) => {
    setActiveNegotiationId(id);
    navigate('centro-de-negociacion');
  };

  const filteredNegotiations = negotiations.filter((n) => {
    if (filterType === 'priority') return n.totalBudgetLimit >= 50;
    if (filterType === 'final') return n.currentRound >= n.maxRounds - 1;
    return true;
  });

  return (
    <div className="relative w-full overflow-hidden px-space-lg py-space-lg space-y-space-lg">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Executive Hero Title Bar */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[11px] uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Orquestación Neuronal Activa
            </span>
            <span className="font-mono-data text-body-sm text-outline">LATAM-CORE-v4.2</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Bienvenido, Carlos Mendoza
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Monitoreo de toma de decisiones autónoma y consenso presupuestal en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => navigate('configuracion')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
            <span>Parámetros de IA</span>
          </button>
          <button
            onClick={() => navigate('nueva-negociacion')}
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-md hover:bg-primary transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Nueva negociación</span>
          </button>
        </div>
      </div>

      {/* Error & Loading States */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-body-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600">error</span>
            <span>{error}</span>
          </div>
          <button onClick={() => window.location.reload()} className="underline text-xs font-semibold">Reintentar</button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-mono-data text-secondary py-1">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
          <span>Sincronizando métricas en tiempo real mediante API REST...</span>
        </div>
      )}

      {/* Key Metrics Grid (4 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: Negociaciones Activas */}
        <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">NEGOCIACIONES ACTIVAS</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">
                  {metrics?.activeNegotiationsCount || 3}
                </span>
                <span className="font-label-sm text-label-sm text-secondary flex items-center font-medium">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  +1 esta semana
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-low">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Convergencia promedio: 74%</span>
            <span className="h-1.5 w-16 bg-surface-container rounded-full overflow-hidden">
              <span className="block h-full bg-secondary rounded-full" style={{ width: '74%' }} />
            </span>
          </div>
        </div>

        {/* Card 2: Negociaciones Finalizadas */}
        <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">NEGOCIACIONES FINALIZADAS</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">12</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                  +4 este mes
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-low">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Tiempo medio ciclo: 3.2 hrs</span>
            <span className="font-mono-data text-[11px] text-outline">IA vs Humano: -82%</span>
          </div>
        </div>

        {/* Card 3: Acuerdos Alcanzados */}
        <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">ACUERDOS ALCANZADOS</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">10</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container font-mono-data text-[11px] text-secondary font-semibold">
                  Tasa de éxito: 83.3%
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-surface-variant flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">handshake</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-low">
            <span className="font-body-sm text-body-sm text-on-surface-variant">2 acuerdos con escalamiento</span>
            <span className="font-mono-data text-body-sm text-outline">Pareto Opt.</span>
          </div>
        </div>

        {/* Card 4: Ahorro Presupuestal */}
        <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">AHORRO PRESUPUESTAL</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">$35M</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">savings</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high font-mono-data text-[11px] text-primary font-medium">
              <span className="material-symbols-outlined text-[14px]">insights</span>
              +14.2% vs presupuesto previo optimizado
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: 8 cols (Negociaciones) + 4 cols (Telemetry & Swarm Feed) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Active Negotiations (8 cols) */}
        <div className="xl:col-span-8 flex flex-col space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">gavel</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Negociaciones Activas</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-primary font-mono-data text-label-sm font-semibold">
                3 en curso
              </span>
            </div>
            {/* Filter toggles */}
            <div className="hidden sm:flex items-center bg-surface-container-low p-1 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todas (3)
              </button>
              <button
                onClick={() => setFilterType('priority')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                  filterType === 'priority'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Alta prioridad
              </button>
              <button
                onClick={() => setFilterType('final')}
                className={`px-3 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                  filterType === 'final'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Ronda final
              </button>
            </div>
          </div>

          {/* TARJETA 1 (Hero Card - High Stakes Primary) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md">
              <div className="space-y-1">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                    </span>
                    En negociación
                  </span>
                  <span className="font-mono-data text-body-sm text-outline">ID: #NEG-2026-001</span>
                  <span className="font-mono-data text-body-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Ronda 2 / 5
                  </span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface pt-1 font-bold">
                  Distribución presupuestal 2026
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Consenso multidepartamental para asignación de capital operativo y estratégico Q1-Q4.
                </p>
              </div>

              {/* Primary Action Callout */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
                <button
                  onClick={() => openNegotiationRoom('neg-2026-001')}
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary transition-all cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  <span>Continuar negociación</span>
                </button>
                <span className="font-mono-data text-[11px] text-outline">Última oferta de agente: hace 4 min</span>
              </div>
            </div>

            {/* Financial Allocation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md bg-surface-container-low rounded-xl my-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">Presupuesto disponible</span>
                <p className="font-headline-lg text-headline-lg text-on-surface font-bold mt-0.5">$100M</p>
                <span className="font-mono-data text-body-sm text-on-surface-variant">Límite vinculante corporativo</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">Solicitado por áreas</span>
                <p className="font-headline-lg text-headline-lg text-error font-bold mt-0.5">$120M</p>
                <span className="font-mono-data text-body-sm text-error font-medium">Déficit inicial: -$20M</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">Brecha restante en Ronda 2</span>
                <p className="font-headline-lg text-headline-lg text-secondary font-bold mt-0.5">-$8.4M</p>
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '58%' }} />
                </div>
              </div>
            </div>

            {/* Active Department Agents Multi-Bar Telemetry */}
            <div className="space-y-space-sm pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Agentes en la mesa (6 agentes autónomos)
                </span>
                <span className="font-mono-data text-[11px] text-outline">Protocolo: Nash Bargaining Solution</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {/* Agent 1: Finanzas */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Finanzas</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-on-surface font-bold">$22M</span>
                    <span className="block font-mono-data text-[10px] text-outline mt-0.5">Base: $25M (-12%)</span>
                  </div>
                </div>

                {/* Agent 2: Tecnología */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Tecnología</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-on-surface font-bold">$28M</span>
                    <span className="block font-mono-data text-[10px] text-outline mt-0.5">Base: $30M (-6.6%)</span>
                  </div>
                </div>

                {/* Agent 3: Marketing */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Marketing</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-on-surface font-bold">$20M</span>
                    <span className="block font-mono-data text-[10px] text-outline mt-0.5">Base: $25M (-20%)</span>
                  </div>
                </div>

                {/* Agent 4: RRHH */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">RRHH</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-on-surface font-bold">$16M</span>
                    <span className="block font-mono-data text-[10px] text-outline mt-0.5">Base: $20M (-20%)</span>
                  </div>
                </div>

                {/* Agent 5: Operaciones */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Operaciones</span>
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-on-surface font-bold">$14M</span>
                    <span className="block font-mono-data text-[10px] text-outline mt-0.5">Base: $20M (-30%)</span>
                  </div>
                </div>

                {/* Agent 6: Coordinador IA */}
                <div className="p-2.5 rounded-lg bg-primary-fixed flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-primary-fixed font-semibold">Orquestador</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">auto_mode</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-mono-data text-headline-sm text-primary font-bold">Activo</span>
                    <span className="block font-mono-data text-[10px] text-on-primary-fixed-variant mt-0.5 font-semibold">
                      Converg. 82%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA 2: Presupuesto de tecnología e Infraestructura Cloud */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Esperando aprobación
                </span>
                <span className="font-mono-data text-body-sm text-outline">ID: #NEG-2026-004</span>
                <span className="font-mono-data text-body-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  Ronda 4 / 5
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Presupuesto de tecnología e Infraestructura Cloud
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm font-body-sm text-on-surface-variant">
                <div>Presupuesto: <span className="font-mono-data font-bold text-on-surface">$50M</span></div>
                <div>Solicitado: <span className="font-mono-data font-bold text-primary">$58M</span></div>
                <div>Brecha acordada: <span className="font-mono-data font-semibold text-secondary">$51.2M</span></div>
                <div>Margen SLA: <span className="font-mono-data text-on-surface">99.99% AWS/GCP</span></div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-center">
              <button
                onClick={() => openNegotiationRoom('neg-2026-004')}
                className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
              >
                Inspeccionar acuerdo
              </button>
              <button
                onClick={() => openNegotiationRoom('neg-2026-004')}
                className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm hover:bg-primary transition-colors cursor-pointer font-semibold"
              >
                Ver negociación
              </button>
            </div>
          </div>

          {/* TARJETA 3: Optimización de Marketing y Expansión LatAm */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-secondary">hourglass_top</span>
                  Última ronda
                </span>
                <span className="font-mono-data text-body-sm text-outline">ID: #NEG-2026-009</span>
                <span className="font-mono-data text-body-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  Ronda 3 / 3
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Optimización de Marketing y Expansión LatAm
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm font-body-sm text-on-surface-variant">
                <div>Presupuesto: <span className="font-mono-data font-bold text-on-surface">$30M</span></div>
                <div>Solicitado: <span className="font-mono-data font-bold text-primary">$32M</span></div>
                <div>Alineación CAC/LTV: <span className="font-mono-data text-on-surface">Ratio 4.2x</span></div>
                <div>Agentes: <span className="font-mono-data text-secondary">MKT, Growth, Finanzas</span></div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-center">
              <button
                onClick={() => openNegotiationRoom('neg-2026-009')}
                className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer font-semibold"
              >
                Ver negociación
              </button>
            </div>
          </div>

          {/* Visual Analytics Card: Convergence Curvature */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Curva de Concesión y Consenso Colectivo
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Trayectoria de ofertas cruzadas en las últimas 5 rondas para Negociación #001
                </p>
              </div>
              <span className="font-mono-data text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-secondary font-semibold">
                Pareto Óptimo Estimado: Ronda 3
              </span>
            </div>
            {/* Inline Visual Vector / Chart */}
            <div className="w-full h-44 relative flex items-end pt-4 pb-2">
              <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 700 140">
                <line stroke="#e5eeff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20" />
                <line stroke="#e5eeff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="60" y2="60" />
                <line stroke="#e5eeff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="100" y2="100" />
                <line stroke="#ba1a1a" strokeDasharray="6 3" strokeWidth="1.5" x1="0" x2="700" y1="50" y2="50" />
                <text fill="#ba1a1a" fontFamily="Inter" fontSize="10" fontWeight="600" x="8" y="44">
                  Presupuesto Vinculante ($100M)
                </text>
                <path d="M 0 10 Q 180 50, 350 75 T 700 88 L 700 140 L 0 140 Z" fill="#0051d5" opacity="0.12" />
                <path d="M 0 10 Q 180 50, 350 75 T 700 88" stroke="#0051d5" strokeLinecap="round" strokeWidth="2.5" />
                <path d="M 0 130 Q 190 110, 350 95 T 700 89" stroke="#1e3a8a" strokeDasharray="3 3" strokeWidth="2" />
                <circle cx="680" cy="88" fill="#0051d5" r="6" />
                <circle cx="680" cy="88" opacity="0.4" r="10" stroke="#0051d5" strokeWidth="2" className="animate-ping" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-outline pt-2 border-t border-surface-container-low">
              <span>Ronda 1 (Inicio: $120M)</span>
              <span className="text-secondary font-medium font-semibold">Ronda 2 (Actual: $100M)</span>
              <span>Ronda 3 (Proyectado: $100M)</span>
              <span>Ronda 4 (Equilibrio: $100M)</span>
              <span>Ronda 5 (Cierre)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Swarm Activity Feed & Autonomous Status (4 cols) */}
        <div className="xl:col-span-4 flex flex-col space-y-space-md">
          {/* Live Agent Health / Telemetry Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">memory</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Red de Inteligencia</h3>
              </div>
              <span className="inline-flex items-center gap-1 font-mono-data text-[11px] text-secondary font-semibold bg-surface-container px-2 py-0.5 rounded">
                LLM Swarm v4
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface-variant">Conformidad con Reglas de Negocio</span>
                  <span className="font-mono-data text-on-surface font-semibold">98.4%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '98.4%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface-variant">Latencia de Inferencia Inter-Agente</span>
                  <span className="font-mono-data text-on-surface font-semibold">410 ms</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface-variant">Capacidad de Compromiso Presupuestal</span>
                  <span className="font-mono-data text-on-surface font-semibold">$180M / $200M</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary-container h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">Restricción dura activa:</span>
              </div>
              <span className="font-mono-data text-[11px] text-primary font-bold">Déficit &lt; 0% en R5</span>
            </div>
          </div>

          {/* Real-Time Swarm Activity Micro-Feed */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Actividad del Enjambre</h3>
              </div>
              <span className="font-mono-data text-[10px] uppercase text-outline">Feed en vivo</span>
            </div>
            <div className="space-y-3 mt-1">
              {/* Feed Item 1: Counter-offer */}
              <div
                onClick={() => navigate('propuestas')}
                className="p-3 rounded-lg bg-surface-container-low flex flex-col space-y-1.5 transition-colors hover:bg-surface-container cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Agente Tecnología</span>
                  </div>
                  <span className="font-mono-data text-[10px] text-outline">Hace 2 min</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Emitió contraoferta en <strong className="text-on-surface">Distribución 2026</strong>: Reduce solicitud de licencias SaaS a{' '}
                  <span className="font-mono-data text-primary font-bold">$28M</span> (concesión de -$2.0M).
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Estrategia: <span className="font-mono-data text-on-surface">Tit-for-Tat Adaptativo</span></span>
                  <span className="text-secondary font-mono-data font-semibold">Aceptado preliminarmente</span>
                </div>
              </div>

              {/* Feed Item 2: Concession */}
              <div
                onClick={() => navigate('propuestas')}
                className="p-3 rounded-lg bg-surface-container-low flex flex-col space-y-1.5 transition-colors hover:bg-surface-container cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Agente Operaciones</span>
                  </div>
                  <span className="font-mono-data text-[10px] text-outline">Hace 6 min</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Aprobó ajuste en rutas troncales. Cede <span className="font-mono-data text-primary font-bold">$6M</span> para equilibrio global.
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Utilidad percibida: <span className="font-mono-data text-on-surface">0.89 / 1.0</span></span>
                  <span className="font-mono-data text-secondary">Ronda 2</span>
                </div>
              </div>

              {/* Feed Item 3: Coordinator */}
              <div
                onClick={() => navigate('centro-de-negociacion')}
                className="p-3 rounded-lg bg-surface-container-low flex flex-col space-y-1.5 transition-colors hover:bg-surface-container cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">auto_mode</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Orquestador Central</span>
                  </div>
                  <span className="font-mono-data text-[10px] text-outline">Hace 14 min</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Calculó nueva frontera eficiente de Pareto en <strong className="text-on-surface">Infraestructura Cloud</strong>. La brecha se redujo a $1.2M. Disparando solicitud de aprobación humana.
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Vector: <span className="font-mono-data text-on-surface">[0.91, 0.88, 0.94]</span></span>
                  <span className="text-primary font-mono-data font-semibold">Listo para firma</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('propuestas')}
              className="mt-4 w-full py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
            >
              <span>Ver registro completo de auditoría</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Quick Autonomous Policy Banner */}
          <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-md flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 text-on-primary">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-surface-container-lowest font-semibold">
                Gobernanza Institucional
              </span>
              <span className="font-body-sm text-body-sm text-primary-fixed-dim truncate">
                Todos los agentes operan bajo directiva SOX-404 y consenso criptográfico auditado.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
