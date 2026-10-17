/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Negotiation } from '../../domain/entities/Negotiation';

export const NegociacionesPage: React.FC = () => {
  const { navigate, setActiveNegotiationId } = useNavigation();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNegotiations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/negotiations');
      if (!res.ok) throw new Error('Error al cargar la cartera de negociaciones');
      const json = await res.json();
      if (json.success) {
        setNegotiations(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con /api/negotiations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNegotiations();
  }, []);

  const openRoom = (id: string) => {
    setActiveNegotiationId(id);
    navigate('centro-de-negociacion');
  };

  const filtered = negotiations.filter((neg) => {
    if (selectedStatusTab === 'en_curso' && neg.status !== 'en_curso') return false;
    if (selectedStatusTab === 'esperando' && neg.status !== 'esperando_aprobacion') return false;
    if (selectedStatusTab === 'finalizada' && neg.status !== 'finalizada_acuerdo') return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        neg.folio.toLowerCase().includes(q) ||
        neg.title.toLowerCase().includes(q) ||
        neg.description.toLowerCase().includes(q) ||
        neg.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full px-space-lg py-space-lg space-y-space-xl">
      {/* Header Section with Distinct Spatial Framing */}
      <section className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm overflow-hidden">
        <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-surface-container-high/40 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="space-y-1">
            <div className="flex items-center gap-space-xs">
              <span className="font-mono-data text-mono-data uppercase tracking-wider text-secondary font-semibold text-xs">
                Orquestación Multiagente
              </span>
              <span className="text-outline-variant font-label-sm">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
                3 Sesiones en Enclave Cuántico Activo
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              Gestión de Negociaciones
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Monitoreo en tiempo real, gestión de sesiones activas y repositorio de consenso presupuestal multiarea.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => navigate('configuracion')}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-all font-label-md text-label-md shadow-sm cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
              <span>Filtros Avanzados</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('nueva-negociacion')}
              className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-primary transition-all font-label-md text-label-md shadow-md hover:shadow-lg cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>+ Nueva Negociación</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg pt-space-md bg-surface-container-low/60 rounded-lg p-space-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
                Volumen Negociado
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">$348.5M USD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
                Agentes Desplegados
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">24 Autónomos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container shadow-sm">
              <span className="material-symbols-outlined text-[22px]">trending_up</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
                Convergencia Media
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">89.4%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary-container shadow-sm">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
                Ratio Consenso
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">91.6% Exitoso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters, States and Search Command Strip */}
      <section className="space-y-space-md">
        {/* Status Tabs Navigation */}
        <div className="flex items-center overflow-x-auto pb-1 gap-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedStatusTab('all')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
              selectedStatusTab === 'all'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span>Todas</span>
            <span className="px-1.5 py-0.5 rounded-full bg-secondary text-on-secondary font-mono-data text-[11px] font-bold">
              18
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatusTab('en_curso')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
              selectedStatusTab === 'en_curso'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>En Curso</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-[11px] font-semibold">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatusTab('esperando')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
              selectedStatusTab === 'esperando'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Esperando Aprobación</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-[11px] font-semibold">
              2
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatusTab('finalizada')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
              selectedStatusTab === 'finalizada'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Finalizadas con Acuerdo</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono-data text-[11px] font-semibold">
              11
            </span>
          </button>
        </div>

        {/* Search and Deep Criteria Dropdowns */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, ID (#NEG-...), o área convocada..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="relative min-w-[170px] flex-1 sm:flex-initial">
              <select className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container-lowest cursor-pointer text-xs font-semibold">
                <option>Año Fiscal: 2026</option>
                <option>Año Fiscal: 2025</option>
                <option>Año Fiscal: Multianual</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="relative min-w-[210px] flex-1 sm:flex-initial">
              <select className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container-lowest cursor-pointer text-xs font-semibold">
                <option>Tipo: Distribución Presupuestal</option>
                <option>Tipo: Compras Estratégicas</option>
                <option>Tipo: Optimización SLA TI</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              title="Limpiar Filtros"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>
      </section>

      {/* Highlighted Active Negotiations: 3 Columns Grid */}
      <section className="space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Sesiones en Marcha Prioritaria</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">
            Actualización en Vivo (12s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {/* Negotiation Card 1 */}
          <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-surface-container-low">
            <div className="space-y-space-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono-data text-mono-data text-secondary font-bold tracking-tight text-xs">
                    #NEG-2026-001
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mt-1 font-bold">
                    Distribución Presupuestal 2026
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-label-sm text-label-sm shrink-0 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>En Negociación • Ronda 2/5</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-space-md bg-surface-container-low/70 rounded-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Tope Presupuestal</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">$100M</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Total Solicitado</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$120M</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Brecha Actual</span>
                  <span className="font-mono-data text-mono-data text-error font-semibold text-xs">-$8.4M (Contrayendo)</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Convergencia Pareto</span>
                  <span className="font-mono-data text-mono-data text-secondary font-bold text-xs">82%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant text-xs">
                  <span>Trayectoria de Convergencia</span>
                  <span className="font-mono-data font-semibold text-primary">82% Alcanzado</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-label-sm text-on-surface-variant">Agentes (5 Activos + Coordinador):</span>
                  <span className="font-mono-data text-secondary text-[10px]">Iterando función utilidad</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Finanzas AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Mkt AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Tech AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">RRHH AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary font-mono-data text-[11px] font-semibold">+Orquestador</span>
                </div>
              </div>
            </div>

            <div className="pt-space-lg">
              <button
                type="button"
                onClick={() => openRoom('neg-2026-001')}
                className="w-full flex items-center justify-center gap-2 px-space-md py-3 rounded-lg bg-secondary text-on-secondary hover:bg-primary transition-colors font-label-md text-label-md shadow-sm cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">hub</span>
                <span>Entrar al Centro de Negociación</span>
              </button>
            </div>
          </div>

          {/* Negotiation Card 2 */}
          <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-surface-container-low">
            <div className="space-y-space-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono-data text-mono-data text-secondary font-bold tracking-tight text-xs">
                    #NEG-2026-004
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mt-1 font-bold">
                    Tecnología e Infraestructura Cloud
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-label-sm text-label-sm shrink-0 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Esperando Aprobación • Ronda 4/5</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-space-md bg-surface-container-low/70 rounded-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Tope Presupuestal</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">$50M</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Solicitado Inicial</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$58M</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Brecha Acordada</span>
                  <span className="font-mono-data text-mono-data text-emerald-700 font-semibold text-xs">$51.2M (-$6.8M)</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Margen SLA Mínimo</span>
                  <span className="font-mono-data text-mono-data text-primary font-bold text-xs">99.99%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant text-xs">
                  <span>Alineación de Concesiones</span>
                  <span className="font-mono-data font-semibold text-emerald-700">96% Validación</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-on-surface-variant">Agentes Negociadores:</span>
                  <span className="font-mono-data text-emerald-800 text-[10px]">Consenso Preliminar</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Cloud Architect AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Procurement AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">CFO Delegate AI</span>
                </div>
              </div>
            </div>

            <div className="pt-space-lg">
              <button
                type="button"
                onClick={() => openRoom('neg-2026-004')}
                className="w-full flex items-center justify-center gap-2 px-space-md py-3 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Inspeccionar Acuerdo</span>
              </button>
            </div>
          </div>

          {/* Negotiation Card 3 */}
          <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-surface-container-low">
            <div className="space-y-space-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono-data text-mono-data text-secondary font-bold tracking-tight text-xs">
                    #NEG-2026-009
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mt-1 font-bold">
                    Marketing y Expansión LatAm
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 font-label-sm text-label-sm shrink-0 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>Última Ronda • Ronda 3/3</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-space-md bg-surface-container-low/70 rounded-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Presupuesto Tope</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">$30M</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Solicitado</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$32M</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Brecha Residual</span>
                  <span className="font-mono-data text-mono-data text-error font-semibold text-xs">-$0.8M</span>
                </div>
                <div className="pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">Probabilidad Cierre</span>
                  <span className="font-mono-data text-mono-data text-primary font-bold text-xs">94%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant text-xs">
                  <span>Vector de Concesión Residual</span>
                  <span className="font-mono-data font-semibold text-purple-800">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-on-surface-variant">Agentes Participantes:</span>
                  <span className="font-mono-data text-purple-800 text-[10px]">Equilibrio de Nash</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">CMO LatAm AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Growth Tech AI</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-mono-data text-[11px] font-medium">Control Presupuesto AI</span>
                </div>
              </div>
            </div>

            <div className="pt-space-lg">
              <button
                type="button"
                onClick={() => openRoom('neg-2026-009')}
                className="w-full flex items-center justify-center gap-2 px-space-md py-3 rounded-lg bg-surface-container-high text-primary hover:bg-secondary hover:text-on-secondary transition-colors font-label-md text-label-md cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Ver Negociación</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Data Table Section */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden space-y-space-md p-space-lg border border-surface-container-low">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container-low pb-3">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Repositorio Global de Negociaciones</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Matriz completa de instancias computacionales y acuerdos de gobernanza.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Exportando repositorio a formato CSV / Excel')}
              className="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* High-Density Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider text-[11px]">
                <th className="py-3 px-space-md">ID</th>
                <th className="py-3 px-space-md">Título y Objeto de Consenso</th>
                <th className="py-3 px-space-md font-semibold text-right">Presupuesto Tope</th>
                <th className="py-3 px-space-md font-semibold text-right">Solicitado vs Final</th>
                <th className="py-3 px-space-md text-center">Rondas</th>
                <th className="py-3 px-space-md">Convergencia</th>
                <th className="py-3 px-space-md">Estado</th>
                <th className="py-3 px-space-md text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface text-sm">
              {filtered.map((neg) => (
                <tr key={neg.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-space-md font-mono-data text-mono-data text-secondary font-bold whitespace-nowrap text-xs">
                    {neg.folio}
                  </td>
                  <td className="py-3.5 px-space-md min-w-[220px]">
                    <div className="font-label-md text-label-md text-primary font-bold text-xs">{neg.title}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 text-xs">
                      {neg.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-space-md font-mono-data text-mono-data font-bold text-primary text-right text-xs">
                    ${neg.totalBudgetLimit.toFixed(1)}M
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap text-right text-xs">
                    <span className="font-mono-data text-mono-data line-through text-outline">
                      ${neg.totalRequestedInitial.toFixed(1)}M
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-outline align-middle mx-1">
                      arrow_forward
                    </span>
                    <span className="font-mono-data text-mono-data text-on-surface font-bold">
                      ${neg.totalCurrentRequested.toFixed(1)}M
                    </span>
                  </td>
                  <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                    <span className="font-mono-data text-mono-data px-2 py-0.5 rounded bg-surface-container text-primary font-semibold text-xs">
                      R{neg.currentRound} / {neg.maxRounds}
                    </span>
                  </td>
                  <td className="py-3.5 px-space-md min-w-[130px]">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono-data text-[11px]">
                        <span className="text-secondary font-semibold">{neg.convergenceRate}%</span>
                        <span className="text-outline">Nash</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full"
                          style={{ width: `${neg.convergenceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold text-xs ${
                        neg.status === 'en_curso'
                          ? 'bg-amber-50 text-amber-900'
                          : neg.status === 'esperando_aprobacion'
                          ? 'bg-blue-50 text-blue-900'
                          : 'bg-emerald-50 text-emerald-900'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          neg.status === 'en_curso'
                            ? 'bg-amber-500'
                            : neg.status === 'esperando_aprobacion'
                            ? 'bg-secondary'
                            : 'bg-emerald-600'
                        }`}
                      />
                      {neg.statusLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-space-md text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openRoom(neg.id)}
                        className="p-1.5 rounded-md hover:bg-surface-container text-secondary hover:text-primary transition-colors cursor-pointer"
                        title="Ver Negociación"
                      >
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('propuestas')}
                        className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Auditoría Criptográfica"
                      >
                        <span className="material-symbols-outlined text-[18px]">history_edu</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-md bg-surface-container-low/40 rounded-lg p-space-md">
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Mostrando <span className="font-bold text-primary">1 - {filtered.length}</span> de{' '}
              <span className="font-bold text-primary">{filtered.length}</span> negociaciones
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-mono-data text-[11px] text-secondary">3 activas en memoria</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-md bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex items-center justify-center shadow-sm"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
