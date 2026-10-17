/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';

interface ActivityTurn {
  id: string;
  agentName: string;
  agentRole: string;
  type: 'propuesta' | 'contraoferta' | 'aceptacion';
  typeLabel: string;
  time: string;
  turnNumber: number;
  statement: string;
  detail1: string;
  detail2: string;
  detail3: string;
  icon: string;
}

export const CentroNegociacionPage: React.FC = () => {
  const { navigate, activeNegotiationId } = useNavigation();

  // Live state
  const [roundNumber, setRoundNumber] = useState(2);
  const [totalSeconds, setTotalSeconds] = useState(267);
  const [filterType, setFilterType] = useState<'all' | 'propuesta' | 'contraoferta' | 'aceptacion'>('all');
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [coordinatorNote, setCoordinatorNote] = useState(
    'Las solicitudes actuales se han ajustado a $100M convergiendo exactamente con el presupuesto disponible. Finanzas y Tecnología presentan prioridad alta y han cedido un 11% en conjunto. Marketing y Recursos Humanos han reducido un 20% sus solicitudes.'
  );

  // Initial timeline
  const [activities, setActivities] = useState<ActivityTurn[]>([
    {
      id: 't-1',
      agentName: 'Agente Finanzas',
      agentRole: 'FIN-CORP-01',
      type: 'propuesta',
      typeLabel: 'Propuesta Inicial',
      time: '10:14 AM',
      turnNumber: 1,
      statement: '“Solicitamos $25M debido a las necesidades financieras y cumplimiento tributario actual. Se requiere blindar el balance auditado del primer semestre.”',
      detail1: 'Utilidad esperada: 0.94',
      detail2: 'Prioridad: Alta',
      detail3: 'Cálculo: Riesgo Fiscal Cero',
      icon: 'account_balance_wallet'
    },
    {
      id: 't-2',
      agentName: 'Agente Tecnología',
      agentRole: 'TECH-SYS-02',
      type: 'contraoferta',
      typeLabel: 'Contraoferta',
      time: '10:17 AM',
      turnNumber: 2,
      statement: '“Podemos reducir nuestra solicitud inicial a $28M postergando infraestructura secundaria de data centers y optimizando licencias cloud no esenciales.”',
      detail1: 'Concesión: -$2.0M',
      detail2: 'Prioridad: Alta',
      detail3: 'Impacto: Proyectos Core protegidos',
      icon: 'developer_board'
    },
    {
      id: 't-3',
      agentName: 'Agente Marketing',
      agentRole: 'MKT-GROWTH-03',
      type: 'aceptacion',
      typeLabel: 'Aceptación',
      time: '10:21 AM',
      turnNumber: 3,
      statement: '“Aceptamos reducir nuestra solicitud a $20M reorientando el gasto a canales digitales orgánicos y pausando contratos de patrocinio presencial exterior.”',
      detail1: 'Concesión: -$5.0M',
      detail2: 'Prioridad: Media',
      detail3: 'Ajuste CAC: +4.2%',
      icon: 'campaign'
    },
    {
      id: 't-4',
      agentName: 'Agente Operaciones',
      agentRole: 'OPS-SUPPLY-05',
      type: 'contraoferta',
      typeLabel: 'Contraoferta',
      time: '10:25 AM',
      turnNumber: 4,
      statement: '“Necesitamos mantener al menos $14M para garantizar las operaciones críticas de la cadena logística, almacenamiento en frío y rutas troncales.”',
      detail1: 'Concesión: -$6.0M (Límite operacional)',
      detail2: 'Prioridad: Alta',
      detail3: 'SLAs de Entrega: 98.4%',
      icon: 'precision_manufacturing'
    },
    {
      id: 't-5',
      agentName: 'Agente RRHH',
      agentRole: 'HR-TALENT-04',
      type: 'aceptacion',
      typeLabel: 'Aceptación',
      time: '10:28 AM',
      turnNumber: 5,
      statement: '“Optimizamos plan de capacitación a $16M alineándonos al cupo disponible mediante convenios virtuales y subsidios educativos bilaterales.”',
      detail1: 'Concesión: -$4.0M',
      detail2: 'Prioridad: Media',
      detail3: 'Headcount clave: Preservado',
      icon: 'badge'
    }
  ]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSimulateNextRound = async () => {
    setRoundNumber((r) => r + 1);
    setCoordinatorNote(
      'Simulación Ronda 3: Convocando reevaluación paramétrica. Se aconseja no modificar Finanzas ni Operaciones para preservar la estabilidad del equilibrio Nash alcanzado.'
    );

    const newTurn: ActivityTurn = {
      id: `t-${Date.now()}`,
      agentName: 'Orquestador IA',
      agentRole: 'ORCH-NASH-00',
      type: 'propuesta',
      typeLabel: 'Ronda 3 Solicitada',
      time: 'Ahora',
      turnNumber: activities.length + 1,
      statement: '“Apertura de Ronda 3 iniciada a solicitud del operador. Se ratifica la preservación de reservas legales y contratos críticos.”',
      detail1: 'Vector Nash: [0.94, 0.91, 0.88]',
      detail2: 'Tolerancia: Zero-Loss',
      detail3: 'Estado: Óptimo Pareto',
      icon: 'autorenew'
    };

    setActivities([newTurn, ...activities]);

    try {
      await fetch(`/api/negotiations/${activeNegotiationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'advance_round' })
      });
    } catch (err) {
      console.error('Error al invocar endpoint REST para avanzar ronda:', err);
    }
  };

  const handleAcceptAgreement = async () => {
    try {
      const res = await fetch(`/api/negotiations/${activeNegotiationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept_agreement' })
      });
      if (res.ok) {
        setShowSuccessToast(true);
      }
    } catch (err) {
      console.error('Error al invocar endpoint REST para aceptar acuerdo:', err);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Notification / Broadcast Pill */}
      <div className="px-space-lg pt-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-sm">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold text-xs">
              Sesión Sincronizada #NEG-2026-F4
            </span>
            <span className="font-body-sm text-body-sm text-outline">|</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Topología de Negociación: Pareto-Optimal Search (v4.2)
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1.5 font-mono-data text-mono-data text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
              <span>Tiempo de ronda:</span>
              <span className="font-bold text-primary">{formatTimer(totalSeconds)}</span>
            </div>
            <button
              onClick={handleSimulateNextRound}
              className="px-space-sm py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer font-semibold"
            >
              Simular Ronda {roundNumber + 1}
            </button>
          </div>
        </div>
      </div>

      {/* Header & Live KPIs Bar */}
      <section className="px-space-lg pt-space-md pb-space-sm">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold text-xs">
                Ejercicio Fiscal 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-primary shadow-sm font-label-sm text-label-sm font-semibold text-xs">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                Negociación activa • Ronda {roundNumber} de 5
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-background tracking-tight font-bold">
              Centro de negociación: Distribución presupuestal 2026
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Orquestación concurrente entre 5 agentes departamentales autónomos y el Coordinador Institucional IA.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={() => setShowCoordinatorModal(true)}
              className="flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm font-label-md text-label-md transition-all cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
              <span>Auditoría de Inferencia</span>
            </button>
            <button
              type="button"
              onClick={handleAcceptAgreement}
              className="flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-primary shadow-sm font-label-md text-label-md transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Aceptar acuerdo y Finalizar</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mt-space-md">
          {/* KPI 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Techo Presupuestal
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="font-headline-lg text-headline-lg text-on-background font-bold">$100.0M</span>
              <span className="font-mono-data text-mono-data text-outline ml-1">USD</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Capacidad asignada fija</span>
              <span className="text-primary font-bold">100% fondo</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Solicitado Actual (Ronda {roundNumber})
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">request_quote</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-background font-bold">$100.0M</span>
              <span className="font-mono-data text-mono-data text-error line-through text-xs">$120.0M inicial</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Concesión global:</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">-$20.0M (-16.7%)</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Diferencia Presupuestal
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined text-[20px]">balance</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-secondary font-bold">$0.0M</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold text-xs">
                Equilibrado
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>Déficit superado:</span>
              <span className="text-on-surface font-semibold">100% absorbido</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Progreso de Convergencia
              </span>
              <span className="font-mono-data text-mono-data text-primary font-bold">82%</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-surface-container-low rounded-full h-2.5 overflow-hidden">
                <div className="bg-secondary h-2.5 rounded-full transition-all duration-700" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>Ronda {roundNumber} de 5 en curso</span>
              <span className="text-secondary font-semibold">Convergencia alta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Agent Cards Grid (5 Autonomous Agents) */}
      <section className="px-space-lg py-space-sm">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">groups_3</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Agentes Participantes en Tiempo Real
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary text-xs font-semibold">
              5 activos
            </span>
          </div>
          <span className="font-mono-data text-mono-data text-outline text-xs">
            Sincronización de pesos de utilidad: Pareto Search Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-sm">
          {/* Agent 1: Finanzas */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Finanzas</p>
                  <span className="font-label-sm text-label-sm text-outline text-[11px]">Prioridad Alta</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Negociando
              </span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Solicitado:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-semibold">$25.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Oferta actual:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">$22.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Reducción:</span>
                <span className="font-mono-data text-mono-data text-secondary font-semibold">-$3.0M (-12%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          {/* Agent 2: Marketing */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Marketing</p>
                  <span className="font-label-sm text-label-sm text-outline text-[11px]">Prioridad Media</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm text-[11px] font-semibold">
                Esperando
              </span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Solicitado:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-semibold">$25.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Oferta actual:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">$20.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Reducción:</span>
                <span className="font-mono-data text-mono-data text-secondary font-semibold">-$5.0M (-20%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Agent 3: Tecnología */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">developer_board</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Tecnología</p>
                  <span className="font-label-sm text-label-sm text-outline text-[11px]">Prioridad Alta</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Negociando
              </span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Solicitado:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-semibold">$30.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Oferta actual:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">$28.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Reducción:</span>
                <span className="font-mono-data text-mono-data text-secondary font-semibold">-$2.0M (-6.6%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '93%' }} />
            </div>
          </div>

          {/* Agent 4: Recursos Humanos */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">RRHH</p>
                  <span className="font-label-sm text-label-sm text-outline text-[11px]">Prioridad Media</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm text-[11px] font-semibold">
                Propuesta OK
              </span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Solicitado:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-semibold">$20.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Oferta actual:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">$16.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Reducción:</span>
                <span className="font-mono-data text-mono-data text-secondary font-semibold">-$4.0M (-20%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Agent 5: Operaciones */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Operaciones</p>
                  <span className="font-label-sm text-label-sm text-outline text-[11px]">Prioridad Alta</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Negociando
              </span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Solicitado:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-semibold">$20.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Oferta actual:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">$14.0M</span>
              </div>
              <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Reducción:</span>
                <span className="font-mono-data text-mono-data text-secondary font-semibold">-$6.0M (-30%)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Work Surface: Split Grid (Live Feed 8 Cols + AI Coordinator Panel 4 Cols) */}
      <section className="px-space-lg py-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Activity & Conversation Stream (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Stream Header with Filters */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">forum</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Actividad de Negociación en Vivo
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Protocolo inter-agente FIPA-ACL con firmas de auditoría
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-low p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer font-medium ${
                  filterType === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterType('propuesta')}
                className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer font-medium ${
                  filterType === 'propuesta'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Propuestas
              </button>
              <button
                type="button"
                onClick={() => setFilterType('contraoferta')}
                className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer font-medium ${
                  filterType === 'contraoferta'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Contraofertas
              </button>
              <button
                type="button"
                onClick={() => setFilterType('aceptacion')}
                className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer font-medium ${
                  filterType === 'aceptacion'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Aceptaciones
              </button>
            </div>
          </div>

          {/* Feed Container */}
          <div className="flex flex-col gap-space-md">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-space-md items-start"
              >
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[22px]">{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">{act.agentName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm text-xs font-semibold ${
                          act.type === 'propuesta'
                            ? 'bg-surface-container-high text-primary'
                            : act.type === 'contraoferta'
                            ? 'bg-secondary-fixed text-primary'
                            : 'bg-surface-container text-secondary'
                        }`}
                      >
                        {act.typeLabel}
                      </span>
                    </div>
                    <span className="font-mono-data text-mono-data text-outline text-xs">
                      {act.time} • Turno #{act.turnNumber}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">{act.statement}</p>
                  <div className="mt-space-sm pt-space-xs flex flex-wrap items-center gap-space-md text-on-surface-variant font-mono-data text-mono-data text-xs border-t border-surface-container-low">
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <span className="material-symbols-outlined text-[16px]">data_check</span>
                      {act.detail1}
                    </span>
                    <span>{act.detail2}</span>
                    <span>{act.detail3}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Vector Convergence Chart Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">ssid_chart</span>
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Curva de Concesión y Espacio de Negociación
                </span>
              </div>
              <span className="font-mono-data text-mono-data text-secondary font-semibold text-xs">
                Delta vs Techo: $0.0M
              </span>
            </div>
            {/* Inline Vector Graphic Visualizing Multi-Agent Concession */}
            <div className="w-full h-36 bg-surface-container-low rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 120">
                <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="20" y2="20" />
                <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="60" y2="60" />
                <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="100" y2="100" />
                <line stroke="#00236f" strokeDasharray="6 4" strokeWidth="2" x1="0" x2="600" y1="70" y2="70" />
                <text className="font-mono text-[10px] font-bold" fill="#00236f" x="10" y="65">
                  Techo Presupuestal ($100M Target)
                </text>
                <path d="M 0,10 Q 150,35 300,55 T 600,70 L 600,120 L 0,120 Z" fill="#0051d5" opacity="0.1" />
                <path d="M 0,10 Q 150,35 300,55 T 600,70" stroke="#0051d5" strokeLinecap="round" strokeWidth="3" />
                <circle cx="0" cy="10" fill="#00236f" r="4" />
                <circle cx="150" cy="35" fill="#00236f" r="4" />
                <circle cx="300" cy="55" fill="#0051d5" r="4" />
                <circle cx="450" cy="64" fill="#0051d5" r="4" />
                <circle cx="600" cy="70" fill="#00236f" r="5" />
              </svg>
              <div className="flex justify-between items-center font-mono-data text-[11px] text-on-surface-variant pt-1">
                <span>Ronda 1: $120M inicial</span>
                <span>Turno 3: $108M</span>
                <span>Turno 5: $100M (Equilibrio Nash)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Coordinator Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* AI Coordinator Main Hub Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Coordinador IA</h3>
                    <span className="font-label-sm text-label-sm text-secondary font-medium text-xs">
                      Orquestador de Consenso
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary">
                  <span className="h-2 w-2 rounded-full bg-secondary animate-ping" />
                  <span className="font-label-sm text-label-sm font-semibold text-xs">Analizando...</span>
                </div>
              </div>

              {/* Current Analysis Box */}
              <div className="bg-surface-container-low p-space-md rounded-xl mt-space-sm">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-xs">
                    Análisis Actual de la Sesión
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed text-sm">
                  {coordinatorNote}
                </p>
              </div>

              {/* Dynamic Indicators Matrix */}
              <div className="grid grid-cols-2 gap-space-sm mt-space-md">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <span className="font-body-sm text-body-sm text-outline text-xs">Presupuesto Límite</span>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">$100M</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <span className="font-body-sm text-body-sm text-outline text-xs">Solicitado Ajustado</span>
                  <p className="font-headline-sm text-headline-sm text-secondary font-bold mt-0.5">$100M</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl col-span-2">
                  <div className="flex items-center justify-between text-body-sm mb-1">
                    <span className="text-on-surface-variant font-medium text-xs">Nivel de Conflicto:</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold text-xs">Bajo (18%)</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '18%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-outline mt-1 font-mono-data">
                    <span>0% Fricción</span>
                    <span>Umbral de Ruptura: 65%</span>
                  </div>
                </div>
              </div>

              {/* Coordinator Recommendation Box */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-bold">Recomendación del Coordinador</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed text-xs">
                    El acuerdo se encuentra en el límite exacto presupuestal ($100M). Se recomienda ejecutar validación de consenso o aprobar acuerdo definitivo sin iniciar rondas adicionales de riesgo.
                  </p>
                </div>
              </div>
            </div>

            {/* System Controls Button Group */}
            <div className="flex flex-col gap-2 mt-space-lg pt-space-sm border-t border-surface-container-low">
              <button
                type="button"
                onClick={handleAcceptAgreement}
                className="w-full py-3 px-space-md rounded-xl bg-secondary text-on-secondary hover:bg-primary font-label-md text-label-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Aceptar acuerdo y Finalizar</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCoordinatorModal(true)}
                className="w-full py-2.5 px-space-md rounded-xl bg-surface-container-low text-primary hover:bg-surface-container font-label-md text-label-md transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">query_stats</span>
                <span>Ver Análisis del Coordinador</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateNextRound}
                className="w-full py-2.5 px-space-md rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Generar nueva ronda (Ronda {roundNumber + 1})</span>
              </button>
            </div>
          </div>

          {/* Quick Telemetry & Safety Invariants Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
            <h4 className="font-label-md text-label-md text-on-surface font-bold mb-space-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">security</span>
              <span>Invariantes de Gobernanza</span>
            </h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-xs">Tope Máximo Estricto:</span>
                <span className="font-mono-data text-mono-data text-primary font-bold text-xs">$100,000,000</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-xs">Concesión Mínima / Turno:</span>
                <span className="font-mono-data text-mono-data text-on-surface font-medium text-xs">$1.0M</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-xs">Agentes con Veto Activo:</span>
                <span className="font-label-sm text-label-sm text-outline text-xs">Finanzas, Operaciones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal: AI Coordinator Deep Inference */}
      {showCoordinatorModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-space-lg shadow-xl flex flex-col gap-space-md animate-in fade-in">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Auditoría Profunda de Inferencia IA
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Modelo de Coordinación: Multi-Agent Convergence Vector v4.2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCoordinatorModal(false)}
                className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="space-y-space-md">
              <div className="p-space-md bg-surface-container-low rounded-xl">
                <p className="font-label-sm text-label-sm text-primary uppercase font-bold mb-1 text-xs">
                  Diagnóstico de Concesiones
                </p>
                <p className="font-body-md text-body-md text-on-surface">
                  Todos los agentes han operado dentro del rango factible de Pareto. Operaciones ha alcanzado su frontera de reserva en $14M; forzar una reducción mayor activará un riesgo del 84% de paro logístico.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="p-space-sm bg-surface-container rounded-xl">
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Eficiencia Pareto Estimada:
                  </span>
                  <p className="font-headline-sm text-headline-sm text-secondary font-bold">96.4%</p>
                </div>
                <div className="p-space-sm bg-surface-container rounded-xl">
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Riesgo de Ruptura en Ronda 3:
                  </span>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">12.2% (Controlado)</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={() => setShowCoordinatorModal(false)}
                  className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                >
                  Cerrar Auditoría
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAcceptAgreement();
                    setShowCoordinatorModal(false);
                  }}
                  className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-primary transition-colors cursor-pointer font-semibold"
                >
                  Aprobar Distribución Definitiva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Agreement Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 max-w-md w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-2xl border border-secondary/30 z-50 flex items-start gap-space-sm animate-in slide-in-from-bottom">
          <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex-1">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">¡Acuerdo Presupuestal Alcanzado!</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
              Distribución de $100.0M ratificada por 5 agentes. Contrato de consenso guardado en el libro de auditoría institucional.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('historial')}
                className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm hover:bg-primary transition-colors cursor-pointer font-semibold text-xs"
              >
                Ver Acta de Cierre
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessToast(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm cursor-pointer text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
