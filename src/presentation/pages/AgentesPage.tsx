/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Agent } from '../../domain/entities/Agent';

export const AgentesPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Sliders state
  const [finWeight, setFinWeight] = useState(0.35);
  const [techWeight, setTechWeight] = useState(0.30);
  const [opsWeight, setOpsWeight] = useState(0.20);
  const [paretoEpsilon, setParetoEpsilon] = useState(0.05);

  const loadAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agents');
      if (!res.ok) throw new Error('Error al cargar agentes desde la API REST');
      const json = await res.json();
      if (json.success) {
        setAgents(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el endpoint /api/agents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleSaveWeights = async () => {
    try {
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finance: finWeight,
          tech: techWeight,
          operations: opsWeight
        })
      });

      if (!res.ok) throw new Error('No se pudieron actualizar los pesos de los agentes');
      const json = await res.json();
      if (json.success) {
        setAgents(json.data);
        setShowUtilityModal(false);
        setFeedbackMsg('Ponderaciones de Pareto actualizadas exitosamente en el clúster.');
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-lg py-space-md space-y-space-lg">
        {/* Header Section with High-Impact Hierarchy */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-space-xs text-secondary font-mono-data text-mono-data uppercase tracking-wider text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Arquitectura Distribuida • Multi-Agent Consensus</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Ecosistema de Agentes Autónomos
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Supervisión, pesos de utilidad y estado operativo de agentes departamentales y el Agente Coordinador IA en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <button
              type="button"
              onClick={() => setShowUtilityModal(true)}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-all font-label-md text-label-md shadow-sm cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Ajustar Parámetros de Utilidad</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('nueva-negociacion')}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-primary transition-all font-label-md text-label-md shadow-md cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Desplegar Nuevo Agente</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-low rounded-full opacity-60 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Agentes Registrados
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface font-bold">6</span>
                  <span className="font-mono-data text-mono-data text-secondary font-semibold text-xs">Total activos</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-mono-data text-mono-data text-xs border-t border-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>5 Departamentales + 1 Coordinador</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-fixed/30 rounded-full opacity-60 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Estado de Red
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface font-bold">100%</span>
                  <span className="font-mono-data text-mono-data text-secondary font-semibold text-xs">Operativo</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">network_check</span>
              </div>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-mono-data text-mono-data text-xs border-t border-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              <span>Baja latencia promedio (42ms)</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-low rounded-full opacity-60 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Tasa de Concesión Promedio
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface font-bold">18.4%</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant text-xs">-2.1% v/s ciclo ant.</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]">waterfall_chart</span>
              </div>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-mono-data text-mono-data text-xs border-t border-surface-container-low">
              <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
              <span>Dentro de envolvente objetivo</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-low rounded-full opacity-60 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Conformidad con Gobernanza
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface font-bold">99.8%</span>
                  <span className="font-mono-data text-mono-data text-secondary font-semibold text-xs">Auditado</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-mono-data text-mono-data text-xs border-t border-surface-container-low">
              <span className="material-symbols-outlined text-[15px] text-secondary-container">shield</span>
              <span>Políticas FIPA-ACL verificadas</span>
            </div>
          </div>
        </div>

        {/* Agent Cards Grid (5 Departmental + 1 Featured Coordinator) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {agents
            .filter((a) => !a.isCoordinator)
            .map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col justify-between bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg space-y-space-md group"
              >
                <div className="space-y-space-md">
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[26px]">{agent.iconName}</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{agent.name}</h3>
                        <span className="font-mono-data text-mono-data text-outline text-xs">{agent.code}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm tracking-wide text-xs font-semibold ${
                        agent.priority === 'Alta'
                          ? 'bg-error-container text-error'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      Prioridad {agent.priority}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low">
                    {agent.status === 'activa' ? (
                      <>
                        <span className="flex h-2.5 w-2.5 relative shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
                        </span>
                        <span className="font-mono-data text-mono-data text-primary font-semibold text-xs">
                          En negociación activa
                        </span>
                      </>
                    ) : agent.status === 'aceptada' ? (
                      <>
                        <span className="material-symbols-outlined text-secondary text-[16px]">done_all</span>
                        <span className="font-mono-data text-mono-data text-primary font-semibold text-xs">
                          Propuesta aceptada
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-outline" />
                        <span className="font-mono-data text-mono-data text-on-surface-variant font-semibold text-xs">
                          En espera de turno
                        </span>
                      </>
                    )}
                  </div>

                  {/* Objective */}
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm">
                    {agent.description}
                  </p>

                  {/* Parameters Block */}
                  <div className="space-y-2 bg-surface-container-low/70 p-3 rounded-lg font-mono-data text-mono-data text-xs">
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Presupuesto base:</span>
                      <span className="font-bold text-on-surface">${agent.baseBudget}M USD</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Concesión típica:</span>
                      <span className="font-bold text-secondary">{agent.typicalConcession}%</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Función utilidad:</span>
                      <span className="font-semibold text-primary truncate max-w-[150px]">{agent.utilityFunction}</span>
                    </div>
                  </div>

                  {/* Mini Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm border border-surface-container-low">
                      <span className="font-label-sm text-label-sm text-outline block text-[10px]">Negociaciones</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {agent.negotiationsCount}
                      </span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm border border-surface-container-low">
                      <span className="font-label-sm text-label-sm text-outline block text-[10px]">Acuerdos</span>
                      <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                        {agent.agreementsRate}%
                      </span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm border border-surface-container-low">
                      <span className="font-label-sm text-label-sm text-outline block text-[10px]">Pareto</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">
                        {agent.paretoEfficiency}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('propuestas')}
                  className="w-full mt-space-sm flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-low text-primary hover:bg-primary-container hover:text-on-primary transition-all font-label-md text-label-md cursor-pointer font-semibold text-xs"
                >
                  <span>Ver detalle y logs</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ))}

          {/* Agent 6: Agente Coordinador (FEATURED HERO CARD) */}
          <div className="flex flex-col justify-between bg-surface-container-lowest rounded-xl shadow-md transition-all p-space-lg space-y-space-md relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-high border border-primary/20">
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-space-md relative z-10">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[26px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Agente Coordinador</h3>
                    <span className="font-mono-data text-mono-data text-secondary font-semibold text-xs">
                      ORCH-NASH-00
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm tracking-wide shadow-sm text-xs font-semibold">
                  Orquestador Central
                </span>
              </div>

              {/* Pulsing badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-on-primary shadow-sm">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed-dim opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-inverse-primary" />
                </span>
                <span className="font-mono-data text-mono-data font-semibold text-xs">Analizando consenso en vivo</span>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm">
                Supervisar el proceso FIPA-ACL, calcular la frontera eficiente de Pareto y sugerir equilibrios de Nash.
              </p>

              {/* System specifications */}
              <div className="space-y-2 bg-surface-container p-3 rounded-lg font-mono-data text-mono-data text-xs">
                <div className="flex flex-col gap-0.5 text-on-surface-variant">
                  <span className="text-outline text-label-sm text-[10px]">Motor central de inferencia:</span>
                  <span className="font-semibold text-primary">LLM Swarm v4.2 / Nash Bargaining Solution</span>
                </div>
                <div className="pt-1 flex flex-col gap-1">
                  <span className="text-outline text-label-sm text-[10px]">Invariantes de Gobernanza:</span>
                  <div className="flex items-center gap-1.5 text-on-surface text-body-sm text-[11px]">
                    <span className="material-symbols-outlined text-secondary text-[15px]">lock</span>
                    <span className="truncate">No permitir déficit &gt; 0 USD</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface text-body-sm text-[11px]">
                    <span className="material-symbols-outlined text-secondary text-[15px]">key</span>
                    <span className="truncate">Validación criptográfica de firmas</span>
                  </div>
                </div>
              </div>

              {/* Central Telemetry mini bar */}
              <div className="p-2.5 rounded-lg bg-surface-container-high/60 flex items-center justify-between font-mono-data text-mono-data text-xs">
                <span className="text-on-surface-variant text-label-sm text-[11px]">Capacidad de mediación:</span>
                <span className="text-primary font-bold">12 canales paralelos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('centro-de-negociacion')}
              className="w-full mt-space-sm flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-primary transition-all font-label-md text-label-md shadow-sm relative z-10 cursor-pointer font-semibold text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Consola de Orquestación</span>
            </button>
          </div>
        </div>

        {/* Telemetry, Inter-agent Communication Log & Analytical Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Live FIPA-ACL Protocol Communication Logs (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-md">
            <div>
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">rss_feed</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Telemetría de Protocolo FIPA-ACL
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Traza de mensajes interactivos e intercambio de utilidades en tiempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  <span className="font-mono-data text-mono-data text-secondary font-medium text-xs">STREAM EN VIVO</span>
                </div>
              </div>

              {/* Inter-Agent Communication Feed */}
              <div className="space-y-space-xs mt-space-sm max-h-[380px] overflow-y-auto pr-1">
                {/* Packet 1 */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="font-mono-data text-mono-data text-outline shrink-0 text-xs">14:32:08.412</span>
                    <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary text-on-primary shrink-0 text-xs font-semibold">
                      PROPOSE
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">
                      <strong className="text-primary font-bold">TECH-SYS-02</strong> →{' '}
                      <strong className="text-secondary font-bold">ORCH-NASH-00</strong>: Presupuesto Cloud Q3 ($14.2M, SLA 99.99%)
                    </span>
                  </div>
                  <span className="font-mono-data text-mono-data text-outline self-end md:self-auto shrink-0 text-xs">
                    RTT: 38ms
                  </span>
                </div>

                {/* Packet 2 */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="font-mono-data text-mono-data text-outline shrink-0 text-xs">14:32:08.790</span>
                    <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-high text-on-surface font-semibold shrink-0 text-xs">
                      CFP
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">
                      <strong className="text-secondary font-bold">ORCH-NASH-00</strong> →{' '}
                      <strong className="text-on-surface font-bold">FIN-CORP-01</strong>: Solicitud de frontera factible para TECH-02
                    </span>
                  </div>
                  <span className="font-mono-data text-mono-data text-outline self-end md:self-auto shrink-0 text-xs">
                    RTT: 41ms
                  </span>
                </div>

                {/* Packet 3 */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="font-mono-data text-mono-data text-outline shrink-0 text-xs">14:32:09.115</span>
                    <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold shrink-0 text-xs">
                      COUNTER
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">
                      <strong className="text-primary font-bold">FIN-CORP-01</strong> →{' '}
                      <strong className="text-secondary font-bold">ORCH-NASH-00</strong>: Techo ajustado a $13.6M con amortización a 24 meses
                    </span>
                  </div>
                  <span className="font-mono-data text-mono-data text-outline self-end md:self-auto shrink-0 text-xs">
                    RTT: 45ms
                  </span>
                </div>

                {/* Packet 4 */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="font-mono-data text-mono-data text-outline shrink-0 text-xs">14:32:09.520</span>
                    <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container text-on-primary shrink-0 text-xs font-semibold">
                      MEDIATE
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">
                      <strong className="text-secondary font-bold">ORCH-NASH-00</strong> →{' '}
                      <strong className="text-primary font-bold">TECH-SYS-02</strong>: Punto de Nash calculado u_nash = 0.941
                    </span>
                  </div>
                  <span className="font-mono-data text-mono-data text-outline self-end md:self-auto shrink-0 text-xs">
                    RTT: 29ms
                  </span>
                </div>

                {/* Packet 5 */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="font-mono-data text-mono-data text-outline shrink-0 text-xs">14:32:09.840</span>
                    <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary text-on-secondary shrink-0 text-xs font-semibold">
                      ACCEPT
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">
                      <strong className="text-primary font-bold">TECH-SYS-02</strong> →{' '}
                      <strong className="text-secondary font-bold">ORCH-NASH-00</strong>: Firma de pre-acuerdo con SHA-256 verificado
                    </span>
                  </div>
                  <span className="font-mono-data text-mono-data text-outline self-end md:self-auto shrink-0 text-xs">
                    RTT: 34ms
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-space-sm flex items-center justify-between font-mono-data text-mono-data text-outline text-xs border-t border-surface-container-low">
              <span>Protocolo FIPA-ACL v2.4 Activo</span>
              <span>Buffer: 10,000 frames</span>
            </div>
          </div>

          {/* Analytic Charts: Latency & Concession Dynamics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Chart 1: Latency distribution sparkline */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Latencia de Red (ms)</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Tiempo de respuesta inter-nodo en las últimas 2 horas
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-surface-container-low font-mono-data text-mono-data text-primary font-bold text-xs">
                  42ms prom.
                </span>
              </div>
              {/* Inline Latency SVG Area Chart */}
              <div className="w-full h-28 my-2">
                <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 400 110">
                  <defs>
                    <linearGradient id="latencyGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 Q30,65 60,75 T120,45 T180,60 T240,30 T300,50 T360,35 L400,42 L400,110 L0,110 Z"
                    fill="url(#latencyGradient)"
                  />
                  <path
                    d="M0,80 Q30,65 60,75 T120,45 T180,60 T240,30 T300,50 T360,35 L400,42"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <line opacity="0.4" stroke="#757682" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="400" y1="70" y2="70" />
                </svg>
              </div>
              <div className="flex justify-between items-center text-outline font-mono-data text-mono-data text-xs">
                <span>-120 min</span>
                <span className="text-secondary font-semibold">Max: 68ms • Min: 21ms</span>
                <span>Ahora</span>
              </div>
            </div>

            {/* Chart 2: Concession Distribution Bars */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Curva de Concesión por Agente</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Porcentaje de flexibilidad negociada v/s umbral límite
                  </p>
                </div>
                <span className="material-symbols-outlined text-outline">tune</span>
              </div>
              <div className="space-y-2.5 mt-1">
                {/* Tech */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-data text-mono-data text-xs">
                    <span className="text-on-surface font-medium">Tecnología</span>
                    <span className="text-primary font-bold">6.6% / 15% Max</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '44%' }} />
                  </div>
                </div>

                {/* Finanzas */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-data text-mono-data text-xs">
                    <span className="text-on-surface font-medium">Finanzas</span>
                    <span className="text-primary font-bold">12.0% / 20% Max</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                {/* Marketing */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-data text-mono-data text-xs">
                    <span className="text-on-surface font-medium">Marketing</span>
                    <span className="text-primary font-bold">20.0% / 25% Max</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Operaciones */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-data text-mono-data text-xs">
                    <span className="text-on-surface font-medium">Operaciones</span>
                    <span className="text-primary font-bold">30.0% / 35% Max</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Ajustar Parámetros de Utilidad */}
      {showUtilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-xl w-full mx-4 p-space-lg space-y-space-md animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">tune</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Ajustar Pesos de Utilidad Multiobjetivo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUtilityModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Modifique las ponderaciones relativas de las funciones de utilidad para reconfigurar el espacio de solución de Nash en la siguiente ronda.
            </p>
            <div className="space-y-4 font-mono-data text-mono-data text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-on-surface">
                  <span>Ponderación Financiera (λ1)</span>
                  <span className="font-bold text-secondary">{finWeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={finWeight}
                  onChange={(e) => setFinWeight(parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-on-surface">
                  <span>Ponderación Tecnológica (λ2)</span>
                  <span className="font-bold text-secondary">{techWeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={techWeight}
                  onChange={(e) => setTechWeight(parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-on-surface">
                  <span>Ponderación Operativa (λ3)</span>
                  <span className="font-bold text-secondary">{opsWeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opsWeight}
                  onChange={(e) => setOpsWeight(parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-on-surface">
                  <span>Tolerancia de Desviación Pareto (ε)</span>
                  <span className="font-bold text-primary">{paretoEpsilon.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.10"
                  step="0.01"
                  value={paretoEpsilon}
                  onChange={(e) => setParetoEpsilon(parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-surface-container-low">
              <button
                type="button"
                onClick={() => setShowUtilityModal(false)}
                className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md cursor-pointer font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveWeights}
                className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary hover:bg-primary font-label-md text-label-md shadow-sm cursor-pointer font-semibold"
              >
                Propagar Nuevos Parámetros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
