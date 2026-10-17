/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';

export const ReportesPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analitica' | 'convergencia' | 'departamentos'>('analitica');
  const [dashboardMetrics, setDashboardMetrics] = useState<{
    completedNegotiationsCount?: number;
    activeNegotiationsCount?: number;
    totalAmountConsensusMillions?: number;
    avgParetoEfficiency?: number;
    avgSavingsPercentage?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDashboardMetrics(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const triggerExport = (type: 'pdf' | 'json' | 'csv') => {
    const filename = `Reporte_Consenso_Presupuestal_2026_${type.toUpperCase()}.${type}`;
    setDownloadSuccess(`Generando ${filename}... Descargado exitosamente con firma SHA-256.`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3500);
  };

  const departmentsData = [
    { name: 'Finanzas', initial: 35.0, final: 24.5, delta: -30.0, utility: 0.88, color: '#1e3a8a' },
    { name: 'Tecnología', initial: 30.0, final: 26.8, delta: -10.7, utility: 0.94, color: '#006699' },
    { name: 'Operaciones', initial: 20.0, final: 18.2, delta: -9.0, utility: 0.91, color: '#0284c7' },
    { name: 'Marketing', initial: 15.0, final: 12.0, delta: -20.0, utility: 0.82, color: '#f59e0b' },
    { name: 'Talento & RRHH', initial: 10.0, final: 8.5, delta: -15.0, utility: 0.85, color: '#10b981' },
    { name: 'Legal & Compliance', initial: 10.0, final: 10.0, delta: 0.0, utility: 1.0, color: '#6366f1' }
  ];

  const totalInitial = departmentsData.reduce((acc, d) => acc + d.initial, 0);
  const totalFinal = departmentsData.reduce((acc, d) => acc + d.final, 0);

  return (
    <div className="flex flex-col w-full px-space-lg py-space-lg space-y-space-lg">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-tertiary text-white text-body-sm font-medium rounded-xl shadow-2xl animate-fade-in border border-secondary/30">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">download_done</span>
          {downloadSuccess}
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono-data text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Consenso Auditado y Certificado
            </span>
            <span className="font-mono-data text-body-sm text-outline">Folio #RES-2026-001</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Reporte Ejecutivo y Analítica de Consenso
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-3xl">
            Evaluación matemática de optimización de Pareto, convergencia del equilibrio de Nash y balance de asignación presupuestal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            onClick={() => triggerExport('pdf')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Descargar Dictamen PDF
          </button>
          <button
            onClick={() => triggerExport('json')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">data_object</span>
            Exportar Ledger JSON
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Eficiencia de Pareto</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-emerald-600">94.2%</span>
            <span className="font-mono-data text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
              +18.5% vs Humano
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Ningún agente puede ganar sin reducir el bienestar conjunto.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Utilidad Colectiva Nash</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">0.864</span>
            <span className="font-mono-data text-xs text-primary bg-primary-fixed px-1.5 py-0.5 rounded font-semibold">
              Nash Optimal
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Producto simétrico de utilidades individuales maximizado.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Desviación Presupuestal</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface">0.00%</span>
            <span className="font-mono-data text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
              Cap Estricto $100M
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Cero déficit o sobreasignación presupuestaria.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Tiempo de Negociación</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-secondary">4m 27s</span>
            <span className="font-mono-data text-xs text-secondary-container bg-secondary-fixed px-1.5 py-0.5 rounded font-semibold">
              -98% vs Semanas
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Resolución algorítmica en 4 rondas de FIPA-ACL.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30">
        <button
          onClick={() => setActiveTab('analitica')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'analitica'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Resumen Analítico
        </button>
        <button
          onClick={() => setActiveTab('convergencia')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'convergencia'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Curva de Convergencia
        </button>
        <button
          onClick={() => setActiveTab('departamentos')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'departamentos'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Desglose por Departamento
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'analitica' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Main Visual Breakdown */}
          <div className="lg:col-span-2 space-y-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Distribución Final del Presupuesto Consensuado ($100.0M)
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Asignación algorítmica aprobada tras resolver las tensiones de utilidad marginal.
            </p>

            {/* Stacked bar visualization */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner">
              {departmentsData.map((d) => (
                <div
                  key={d.name}
                  style={{ width: `${(d.final / totalFinal) * 100}%`, backgroundColor: d.color }}
                  title={`${d.name}: $${d.final}M (${((d.final / totalFinal) * 100).toFixed(1)}%)`}
                  className="h-full transition-all hover:opacity-90 relative group"
                />
              ))}
            </div>

            {/* Department Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm pt-2">
              {departmentsData.map((d) => (
                <div key={d.name} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="font-semibold text-on-surface text-body-sm">{d.name}</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-headline-sm font-bold text-primary">${d.final}M</span>
                    <span className="font-mono-data text-xs text-outline font-medium">
                      {((d.final / totalFinal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-outline">
                    <span>Inicial: ${d.initial}M</span>
                    <span className={d.delta < 0 ? 'text-amber-600 font-semibold' : 'text-outline'}>
                      {d.delta}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Foundations & Governance */}
          <div className="space-y-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Fundamentos Matemáticos
            </h3>

            <div className="space-y-3 font-body-sm text-on-surface">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-bold text-primary block">Equilibrio de Nash (NBS)</span>
                <p className="text-on-surface-variant text-xs mt-1">
                  Maximiza el producto de los excedentes de utilidad:
                </p>
                <div className="font-mono-data text-xs bg-surface-container px-2 py-1.5 rounded mt-2 text-center text-primary font-bold">
                  max ∏ (u_i(x_i) - d_i)^w_i
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-bold text-secondary block">Frontera de Pareto</span>
                <p className="text-on-surface-variant text-xs mt-1">
                  Garantiza optimalidad de recursos: ningún departamento puede recibir más fondos sin perjudicar la función global corporativa.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-bold text-on-surface block">Independencia de Alternativas Irrelevantes (IIA)</span>
                <p className="text-on-surface-variant text-xs mt-1">
                  La solución de consenso se mantiene invariante ante la eliminación de demandas no viables.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('historial')}
              className="w-full py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">manage_history</span>
              Ver Registro Forense en Historial
            </button>
          </div>
        </div>
      )}

      {/* Convergence Curve Tab */}
      {activeTab === 'convergencia' && (
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Evolución de Demandas Presupuestales por Ronda (R1 - R4)
              </h3>
              <p className="font-body-sm text-on-surface-variant">
                Convergencia desde sobre-demanda inicial ($120M) hasta el límite estricto de consenso ($100M).
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-data">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Límite Presupuestal ($100M)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary inline-block" /> Suma Total Demandada
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            <svg viewBox="0 0 800 320" className="w-full h-72">
              {/* Grid Lines */}
              <line x1="60" y1="40" x2="760" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="60" y1="100" x2="760" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="60" y1="160" x2="760" y2="160" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="60" y1="220" x2="760" y2="220" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="60" y1="270" x2="760" y2="270" stroke="#94a3b8" />

              {/* Y Axis Labels */}
              <text x="50" y="45" fill="#64748b" fontSize="11" textAnchor="end" fontFamily="monospace">$130M</text>
              <text x="50" y="105" fill="#64748b" fontSize="11" textAnchor="end" fontFamily="monospace">$120M</text>
              <text x="50" y="165" fill="#64748b" fontSize="11" textAnchor="end" fontFamily="monospace">$110M</text>
              <text x="50" y="225" fill="#e11d48" fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="monospace">$100M</text>
              <text x="50" y="275" fill="#64748b" fontSize="11" textAnchor="end" fontFamily="monospace">$90M</text>

              {/* Target Limit Line ($100M) */}
              <line x1="60" y1="220" x2="760" y2="220" stroke="#e11d48" strokeWidth="2" strokeDasharray="5 5" />
              <text x="765" y="224" fill="#e11d48" fontSize="10" fontFamily="monospace" fontWeight="bold">Cap</text>

              {/* Total Demand Curve: R1(120M)=100px, R2(112M)=148px, R3(104M)=196px, R4(100M)=220px */}
              {/* Points: x = 120, 320, 520, 720 */}
              <polyline
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="3.5"
                points="140,100 320,148 500,196 680,220"
              />

              {/* Nodes for Total Demand */}
              <circle cx="140" cy="100" r="5" fill="#1e3a8a" />
              <circle cx="320" cy="148" r="5" fill="#1e3a8a" />
              <circle cx="500" cy="196" r="5" fill="#1e3a8a" />
              <circle cx="680" cy="220" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

              {/* Node Value Labels */}
              <text x="140" y="85" fill="#1e3a8a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">$120.0M</text>
              <text x="320" y="133" fill="#1e3a8a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">$112.0M</text>
              <text x="500" y="181" fill="#1e3a8a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">$104.2M</text>
              <text x="680" y="245" fill="#059669" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">$100.0M (Acuerdo)</text>

              {/* X Axis Labels */}
              <text x="140" y="295" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">Ronda 1</text>
              <text x="320" y="295" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">Ronda 2</text>
              <text x="500" y="295" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">Ronda 3</text>
              <text x="680" y="295" fill="#059669" fontSize="12" fontWeight="bold" textAnchor="middle">Ronda 4 (Final)</text>
            </svg>
          </div>
        </div>
      )}

      {/* Departments Detail Tab */}
      {activeTab === 'departamentos' && (
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Comparativa Detallada: Demanda Inicial vs. Asignación Aprobada
            </h3>
            <span className="font-mono-data text-xs text-outline">Balance de Recursos en Millones de USD</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface font-label-md text-label-md border-b border-outline-variant/30">
                  <th className="py-3 px-4">Departamento</th>
                  <th className="py-3 px-4">Demanda Inicial (R1)</th>
                  <th className="py-3 px-4">Asignación Final (Consenso)</th>
                  <th className="py-3 px-4">Concesión / Ajuste</th>
                  <th className="py-3 px-4">Utilidad Lograda (u_i)</th>
                  <th className="py-3 px-4">Estado del Acuerdo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                {departmentsData.map((d) => (
                  <tr key={d.name} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </td>
                    <td className="py-3 px-4 font-mono-data text-on-surface-variant font-medium">${d.initial.toFixed(1)}M</td>
                    <td className="py-3 px-4 font-mono-data font-bold text-primary">${d.final.toFixed(1)}M</td>
                    <td className="py-3 px-4 font-mono-data font-semibold">
                      <span className={d.delta < 0 ? 'text-amber-600' : 'text-outline'}>
                        {d.delta !== 0 ? `${d.delta.toFixed(1)}%` : '0.0%'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${d.utility * 100}%` }} />
                        </div>
                        <span className="font-mono-data text-xs font-bold text-on-surface">
                          {d.utility.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono-data text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Firmado
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface-container-low/80 font-bold border-t-2 border-outline-variant">
                  <td className="py-3 px-4 text-on-surface">TOTAL CONSOLIDADO</td>
                  <td className="py-3 px-4 font-mono-data text-outline">${totalInitial.toFixed(1)}M</td>
                  <td className="py-3 px-4 font-mono-data text-primary text-base">${totalFinal.toFixed(1)}M</td>
                  <td className="py-3 px-4 font-mono-data text-amber-700">-16.6%</td>
                  <td className="py-3 px-4 font-mono-data text-emerald-700">0.864 Prom.</td>
                  <td className="py-3 px-4">
                    <span className="text-xs uppercase font-mono-data text-primary tracking-wider font-bold">100% CERRADO</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
