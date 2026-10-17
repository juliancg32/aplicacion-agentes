/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export const NuevaNegociacionPage: React.FC = () => {
  const { navigate, setActiveNegotiationId } = useNavigation();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form fields
  const [negotiationName, setNegotiationName] = useState('Distribución presupuestal 2026');
  const [budgetLimit, setBudgetLimit] = useState(100.0);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [startDate, setStartDate] = useState('30 de Septiembre, 2026');
  const [maxRounds, setMaxRounds] = useState(5);
  const [description, setDescription] = useState(
    'Distribución del presupuesto disponible entre las diferentes áreas de la empresa garantizando viabilidad técnica, operativa y comercial.'
  );

  // Step 2 Agents Selection
  const [selectedAgents, setSelectedAgents] = useState<Record<string, boolean>>({
    finanzas: true,
    marketing: true,
    tecnologia: true,
    rrhh: true,
    operaciones: true
  });

  const agentDemandsConfig: Record<string, { name: string; code: string; demand: number; priority: string; desc: string; icon: string }> = {
    finanzas: {
      name: 'Finanzas',
      code: 'FIN-AGENT-01',
      demand: 25.0,
      priority: 'Alta',
      desc: 'Controlar la distribución y viabilidad financiera institucional con estrictas salvaguardas.',
      icon: 'account_balance'
    },
    marketing: {
      name: 'Marketing',
      code: 'MKT-AGENT-02',
      demand: 25.0,
      priority: 'Media',
      desc: 'Financiar campañas y estrategias de posicionamiento para captura de nuevos mercados.',
      icon: 'campaign'
    },
    tecnologia: {
      name: 'Tecnología',
      code: 'TECH-AGENT-03',
      demand: 30.0,
      priority: 'Alta',
      desc: 'Infraestructura, software y proyectos tecnológicos críticos para modernización.',
      icon: 'terminal'
    },
    rrhh: {
      name: 'Recursos Humanos',
      code: 'HR-AGENT-04',
      demand: 20.0,
      priority: 'Media',
      desc: 'Personal, capacitación y programas de bienestar para retención del talento clave.',
      icon: 'group'
    },
    operaciones: {
      name: 'Operaciones',
      code: 'OPS-AGENT-05',
      demand: 20.0,
      priority: 'Alta',
      desc: 'Mantener y mejorar la eficiencia en líneas operativas de suministro y logística diaria.',
      icon: 'precision_manufacturing'
    }
  };

  const toggleAgent = (key: string) => {
    setSelectedAgents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = (val: boolean) => {
    setSelectedAgents({
      finanzas: val,
      marketing: val,
      tecnologia: val,
      rrhh: val,
      operaciones: val
    });
  };

  // Calculations
  const totalRequested = Object.keys(agentDemandsConfig).reduce((acc, key) => {
    return selectedAgents[key] ? acc + agentDemandsConfig[key].demand : acc;
  }, 0);

  const deficit = +(totalRequested - budgetLimit).toFixed(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLaunchNegotiation = async () => {
    const demandsToInclude = Object.keys(agentDemandsConfig)
      .filter((k) => selectedAgents[k])
      .map((k) => ({
        departmentId: k,
        departmentName: agentDemandsConfig[k].name,
        agentCode: agentDemandsConfig[k].code,
        initialDemand: agentDemandsConfig[k].demand,
        priority: agentDemandsConfig[k].priority
      }));

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: negotiationName,
          description,
          totalBudgetLimit: budgetLimit,
          currency,
          maxRounds,
          startDate,
          demands: demandsToInclude
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Error al crear negociación');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setActiveNegotiationId(json.data.id);
        navigate('centro-de-negociacion');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error inesperado al conectar con /api/negotiations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-space-lg max-w-7xl mx-auto w-full flex flex-col gap-y-space-lg">
      {/* Top Action Breadcrumb & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono-data text-mono-data text-secondary uppercase tracking-wider font-semibold">
              Orquestación Multi-Agente v4.2
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-mono-data text-mono-data text-on-surface-variant">Sesión activa ID: #NEG-2026-X91</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1 font-bold">
            Configurar Nueva Negociación
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low px-space-md py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Motor de Consenso: <strong className="text-on-surface font-semibold">Pareto-Optimized NASH</strong>
            </span>
          </div>
          <button
            type="button"
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">drafts</span>
            <span>Borrador</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
          {/* Step 1 Button */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`w-full text-left p-space-sm rounded-lg transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
              currentStep === 1 ? 'bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-headline-sm shadow-sm transition-transform group-hover:scale-105 ${
                currentStep === 1
                  ? 'bg-secondary text-on-secondary'
                  : currentStep > 1
                  ? 'bg-primary-fixed text-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider ${
                    currentStep === 1 ? 'text-secondary' : 'text-outline'
                  }`}
                >
                  Paso 01
                </span>
                <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                Configuración General
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Bases, divisas y límites</span>
            </div>
          </button>

          {/* Step 2 Button */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`w-full text-left p-space-sm rounded-lg transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
              currentStep === 2 ? 'bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-headline-sm shadow-sm transition-transform group-hover:scale-105 ${
                currentStep === 2
                  ? 'bg-secondary text-on-secondary'
                  : currentStep > 2
                  ? 'bg-primary-fixed text-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider ${
                    currentStep === 2 ? 'text-secondary' : 'text-outline'
                  }`}
                >
                  Paso 02
                </span>
                <span className="font-mono-data text-mono-data text-secondary text-[11px] font-semibold">
                  {Object.values(selectedAgents).filter(Boolean).length + 1} Agentes
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                Selección de Agentes
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Estrategias y prioridades</span>
            </div>
          </button>

          {/* Step 3 Button */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`w-full text-left p-space-sm rounded-lg transition-all duration-200 flex items-center gap-3.5 group cursor-pointer ${
              currentStep === 3 ? 'bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-headline-sm shadow-sm transition-transform group-hover:scale-105 ${
                currentStep === 3
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">balance</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider ${
                    currentStep === 3 ? 'text-secondary' : 'text-outline'
                  }`}
                >
                  Paso 03
                </span>
                <span className={`font-mono-data text-mono-data text-[11px] font-semibold ${deficit > 0 ? 'text-error' : 'text-secondary'}`}>
                  {deficit > 0 ? `Δ -$${deficit}M` : 'Equilibrado'}
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                Resumen y Despliegue
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Auditoría presupuestaria</span>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PASO 1: CONFIGURACIÓN GENERAL                                  */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <section className="flex flex-col gap-y-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Primary Form Fields (8 Cols) */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Parámetros Fundacionales</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Establezca los techos fiscales y la ventana operativa de consenso autónomo.
                    </p>
                  </div>
                </div>
                <span className="bg-surface-container-high text-primary font-mono-data text-mono-data px-2.5 py-1 rounded-full text-xs font-semibold">
                  Fase 1/3
                </span>
              </div>

              {/* Field: Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold">
                  <span>Nombre Oficial de la Negociación</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Identificador único</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    badge
                  </span>
                  <input
                    type="text"
                    value={negotiationName}
                    onChange={(e) => setNegotiationName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>

              {/* Row: Presupuesto & Divisa */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold">
                    <span>Presupuesto Límite Asignado</span>
                    <span className="font-label-sm text-label-sm text-outline-variant font-mono-data">Monto Tope Global</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                      payments
                    </span>
                    <input
                      type="text"
                      value={currency === 'USD' ? `$${budgetLimit.toFixed(0)}.000.000` : `€${budgetLimit.toFixed(0)}.000.000`}
                      onChange={(e) => {
                        const numeric = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) / 1_000_000 || 100;
                        setBudgetLimit(numeric);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low font-headline-sm text-headline-sm text-on-surface rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Selector Divisa */}
                <div className="md:col-span-4 flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Divisa del Fondo</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container-low rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`py-2 rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer font-semibold ${
                        currency === 'USD'
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('EUR')}
                      className={`py-2 rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer font-semibold ${
                        currency === 'EUR'
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      EUR (€)
                    </button>
                  </div>
                </div>
              </div>

              {/* Row: Fecha y Rondas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Fecha de Inicio Programada
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      calendar_today
                    </span>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>
                </div>

                {/* Control Slider Rondas */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">
                      Número Máximo de Rondas
                    </label>
                    <span className="font-mono-data text-mono-data px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs">
                      {maxRounds} Rondas
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-mono-data text-body-sm text-outline">1</span>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      value={maxRounds}
                      onChange={(e) => setMaxRounds(Number(e.target.value))}
                      className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                    />
                    <span className="font-mono-data text-body-sm text-outline">15</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  Descripción y Mandato Institucional
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Side Telemetry Card (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-3">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Simulador Preliminar
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">neurology</span>
                </div>
                {/* Mini SVG Graph of Convergence Curve */}
                <div className="w-full h-32 bg-surface-container-low rounded-lg p-2 relative flex flex-col justify-end">
                  <div className="absolute top-2 left-3 font-mono-data text-[11px] text-on-surface-variant flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Curva proyectada de convergencia
                  </div>
                  <svg className="w-full h-20 overflow-visible" viewBox="0 0 240 70">
                    <defs>
                      <linearGradient id="grad-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#316bf3" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#316bf3" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0,60 C 40,55 70,35 120,40 C 170,45 200,20 240,15" fill="none" stroke="#d3e4fe" strokeWidth="3" />
                    <path d="M 0,60 C 40,55 70,35 120,40 C 170,45 200,20 240,15 L 240,70 L 0,70 Z" fill="url(#grad-area)" />
                    <path d="M 0,20 C 50,25 90,45 140,40 C 180,35 210,18 240,15" fill="none" stroke="#0051d5" strokeDasharray="4 2" strokeWidth="2.5" />
                    <circle cx="240" cy="15" fill="#0051d5" r="4" />
                  </svg>
                  <div className="flex justify-between items-center px-1 font-mono-data text-[10px] text-outline">
                    <span>Ronda 1</span>
                    <span>Ronda 3 (Cruce)</span>
                    <span>Ronda 5 (Punto Nash)</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant">Protocolo de Cierre</span>
                    <span className="font-mono-data font-semibold text-on-surface">Hard-Stop en Ronda 5</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant">Tolerancia de desvío</span>
                    <span className="font-mono-data font-semibold text-secondary">± 1.8%</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant">Consenso esperado</span>
                    <span className="font-mono-data font-semibold text-primary">89.4% Probabilidad</span>
                  </div>
                </div>
              </div>

              {/* Agent Ready Notice */}
              <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-[26px]">smart_toy</span>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-primary font-bold">5 Agentes Listos</h4>
                    <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
                      Se han precargado los perfiles institucionales habituales para esta sesión.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1 Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center gap-2 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Cancelar y Volver</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-space-lg py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-md hover:bg-primary transition-all flex items-center gap-2 group cursor-pointer font-semibold"
            >
              <span>Continuar a Selección de Agentes</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* PASO 2: SELECCIÓN DE AGENTES                                   */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <section className="flex flex-col gap-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary-fixed text-on-secondary-fixed font-mono-data text-mono-data px-2 py-0.5 rounded-md font-semibold text-xs">
                  Configuración de Flota
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Agentes y Peticiones Presupuestarias
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Revise las metas departamentales y defina las restricciones de negociación de cada entidad autónoma.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectAll(true)}
                className="font-label-sm text-label-sm text-secondary hover:underline cursor-pointer font-semibold"
              >
                Seleccionar todos
              </button>
              <span className="text-outline-variant">•</span>
              <button
                type="button"
                onClick={() => selectAll(false)}
                className="font-label-sm text-label-sm text-outline hover:text-on-surface cursor-pointer"
              >
                Desmarcar optativos
              </button>
            </div>
          </div>

          {/* 6 AGENT CARDS BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {Object.keys(agentDemandsConfig).map((key) => {
              const agent = agentDemandsConfig[key];
              const isChecked = !!selectedAgents[key];
              return (
                <div
                  key={key}
                  className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md flex flex-col justify-between border ${
                    isChecked ? 'border-transparent' : 'border-dashed border-outline-variant opacity-50'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[24px]">{agent.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                            {agent.name}
                          </h3>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono-data text-xs">
                            {agent.code}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAgent(key)}
                        className="w-5 h-5 rounded accent-secondary cursor-pointer"
                      />
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{agent.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 bg-surface-container-low/60 rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Solicitud Inicial:</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        ${agent.demand}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Prioridad Estratégica:</span>
                      <span
                        className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold ${
                          agent.priority === 'Alta'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-surface-variant text-on-surface'
                        }`}
                      >
                        {agent.priority}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 6. AGENTE COORDINADOR IA (DESTACADO Y OBLIGATORIO) */}
            <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-secondary rounded-full blur-2xl opacity-40 pointer-events-none" />
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-md">
                      <span className="material-symbols-outlined text-[24px]">psychology</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-primary leading-tight font-bold">
                        Coordinador IA
                      </h3>
                      <span className="font-label-sm text-label-sm text-secondary-fixed-dim font-mono-data text-xs">
                        ARBITRO-CENTRAL-00
                      </span>
                    </div>
                  </div>
                  <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-secondary text-on-secondary">
                    Automático
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary-container/70 text-surface-container-high w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim animate-ping" />
                  <span className="font-label-sm text-label-sm text-xs">Obligatorio / No Desactivable</span>
                </div>
                <p className="font-body-sm text-body-sm text-surface-variant leading-relaxed">
                  Coordinar el proceso, analizar propuestas y buscar un acuerdo conjunto mediante algoritmos de teoría de juegos y consenso distributivo.
                </p>
              </div>

              <div className="pt-4 mt-4 bg-tertiary/60 rounded-lg p-3 flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center justify-between font-body-sm">
                  <span className="text-tertiary-fixed-dim">Rol de Intervención:</span>
                  <span className="font-mono-data text-surface-container-lowest font-medium">Mediador Nash Puro</span>
                </div>
                <div className="flex items-center justify-between font-body-sm">
                  <span className="text-tertiary-fixed-dim">Solapamiento Permitido:</span>
                  <span className="font-mono-data text-secondary-fixed-dim font-semibold">0% Arbitrario</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 Footer Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center gap-2 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Atrás: Configuración</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-space-lg py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-md hover:bg-primary transition-all flex items-center gap-2 group cursor-pointer font-semibold"
            >
              <span>Avanzar a Resumen y Despliegue</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* PASO 3: RESUMEN ANTES DE INICIAR                               */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <section className="flex flex-col gap-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-error-container text-on-error-container font-mono-data text-mono-data px-2 py-0.5 rounded-md font-semibold text-xs">
                  Auditoría Pre-Inicio
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Validación de Saldo y Factibilidad
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                El sistema ha computado las ofertas iniciales frente a la restricción presupuestaria declarada.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
              <span className="font-mono-data text-body-sm text-secondary font-semibold">
                Orquestador Listo para Despliegue
              </span>
            </div>
          </div>

          {/* KPI Metrics Ribbon (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-outline">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Presupuesto Disponible
                </span>
                <span className="material-symbols-outlined text-secondary text-[22px]">account_balance_wallet</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">${budgetLimit}M</span>
                <span className="font-mono-data text-body-sm text-on-surface-variant">USD Tope</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-body-sm text-secondary font-medium">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="font-label-sm text-label-sm">Fondo cerrado e inmutable</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-outline">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Total Solicitado
                </span>
                <span className="material-symbols-outlined text-primary text-[22px]">request_quote</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">${totalRequested}M</span>
                <span className="font-mono-data text-body-sm text-outline">
                  Suma de {Object.values(selectedAgents).filter(Boolean).length} agentes
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                <span className="font-label-sm text-label-sm font-medium">
                  {((totalRequested / budgetLimit) * 100).toFixed(1)}% del presupuesto disponible
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div
              className={`rounded-xl p-space-md shadow-sm flex flex-col justify-between ${
                deficit > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between opacity-80">
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  {deficit > 0 ? 'Déficit Inicial' : 'Superávit / Holgura'}
                </span>
                <span className="material-symbols-outlined text-[22px]">
                  {deficit > 0 ? 'warning' : 'check_circle'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl font-bold">
                  {deficit > 0 ? `-$${deficit}M` : `+$${Math.abs(deficit)}M`}
                </span>
                <span className="font-mono-data text-body-sm opacity-90">
                  {deficit > 0 ? 'Brecha a negociar' : 'Factible sin poda'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-body-sm">
                <span className="material-symbols-outlined text-[16px]">sync_problem</span>
                <span className="font-label-sm text-label-sm font-semibold">
                  {deficit > 0 ? 'Requiere poda competitiva' : 'Consenso directo factible'}
                </span>
              </div>
            </div>
          </div>

          {/* Comparative Progress Bar & Breakdown Visualization */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Comparación de Asignación vs Capacidad Fiscal
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Visualización gráfica de la sobrecarga presupuestaria antes de iniciar las rondas.
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono-data text-body-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-secondary" />
                  <span className="text-on-surface">Disponible (${budgetLimit}M)</span>
                </div>
                {deficit > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-error" />
                    <span className="text-error font-semibold">Excedente (${deficit}M)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stacked Bar Visual */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full h-8 bg-surface-container rounded-lg overflow-hidden flex">
                <div
                  className="h-full bg-secondary transition-all flex items-center justify-between px-3 text-on-secondary font-mono-data text-mono-data font-semibold text-xs"
                  style={{ width: `${Math.min(100, (budgetLimit / totalRequested) * 100)}%` }}
                >
                  <span>FONDO BASE CAPTURADO</span>
                  <span>${budgetLimit}.000.000</span>
                </div>
                {deficit > 0 && (
                  <div
                    className="h-full bg-error-container text-on-error-container transition-all flex items-center justify-center font-mono-data text-mono-data font-bold px-2 text-xs"
                    style={{ width: `${((deficit / totalRequested) * 100).toFixed(2)}%` }}
                  >
                    <span>+${deficit}M</span>
                  </div>
                )}
              </div>

              {/* Departmental distribution preview breakdown bar */}
              <div className="w-full h-3 rounded-md bg-surface-container overflow-hidden flex gap-0.5 mt-1">
                {selectedAgents.finanzas && <div className="bg-primary h-full" style={{ width: '20.8%' }} title="Finanzas: $25M" />}
                {selectedAgents.marketing && <div className="bg-secondary-container h-full" style={{ width: '20.8%' }} title="Marketing: $25M" />}
                {selectedAgents.tecnologia && <div className="bg-surface-tint h-full" style={{ width: '25.0%' }} title="Tecnología: $30M" />}
                {selectedAgents.rrhh && <div className="bg-primary-fixed-dim h-full" style={{ width: '16.7%' }} title="RRHH: $20M" />}
                {selectedAgents.operaciones && <div className="bg-tertiary-container h-full" style={{ width: '16.7%' }} title="Operaciones: $20M" />}
              </div>
            </div>

            {/* Warning Banner Card */}
            {deficit > 0 && (
              <div className="bg-error-container/40 rounded-xl p-space-md flex items-start gap-space-md border border-error-container">
                <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">report_problem</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-headline-sm text-headline-sm text-on-error-container font-bold">
                    Superávit de Peticiones Detectado
                  </h4>
                  <p className="font-body-md text-body-md text-on-error-container/90 mt-1">
                    Las solicitudes superan el presupuesto disponible en <strong>${deficit}M</strong>. Los agentes deberán negociar para alcanzar un acuerdo equitativo dentro de las {maxRounds} rondas configuradas. En caso de no converger, el Coordinador IA aplicará penalizaciones de utilidad proporcional.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3 Footer Action Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center gap-2 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>← Volver al Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Modificar agentes</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleLaunchNegotiation}
              className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm shadow-md hover:bg-primary transition-all flex items-center justify-center gap-3 group text-center cursor-pointer font-bold"
            >
              <span>Iniciar negociación</span>
              <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-1.5">
                rocket_launch
              </span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
