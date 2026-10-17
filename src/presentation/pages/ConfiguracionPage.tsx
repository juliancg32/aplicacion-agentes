/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { SystemConfig } from '../../domain/entities/SystemConfig';

export const ConfiguracionPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'algoritmo' | 'restricciones' | 'seguridad' | 'notificaciones'>('algoritmo');
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local editable state
  const [hardStop, setHardStop] = useState(true);
  const [algorithm, setAlgorithm] = useState<'nash' | 'kalai' | 'proportional'>('nash');
  const [maxRounds, setMaxRounds] = useState(5);
  const [divergenceTolerance, setDivergenceTolerance] = useState(0.05);
  const [minConcessionUsd, setMinConcessionUsd] = useState(0.5);
  const [autonomyLevel, setAutonomyLevel] = useState<'human_veto' | 'full_auto' | 'advisor'>('human_veto');
  const [earlyConflictWarning, setEarlyConflictWarning] = useState(true);
  const [sha256MandatorySignatures, setSha256MandatorySignatures] = useState(true);
  const [corporateWebhookEnabled, setCorporateWebhookEnabled] = useState(true);
  const [immediateEmailAlerts, setImmediateEmailAlerts] = useState(true);
  const [llmInferenceModel, setLlmInferenceModel] = useState('gemini-2.5-flash');

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('Error al consultar configuración del kernel');
      const json = await res.json();
      if (json.success && json.data) {
        const cfg = json.data;
        setConfig(cfg);
        setHardStop(cfg.hardStopBudgetConstraint);
        setAlgorithm(cfg.bargainingAlgorithm);
        setMaxRounds(cfg.maxRounds);
        setDivergenceTolerance(cfg.divergenceTolerancePercent);
        setMinConcessionUsd(cfg.minimumMandatoryConcessionUsd);
        setAutonomyLevel(cfg.autonomyLevel);
        setEarlyConflictWarning(cfg.earlyConflictWarning);
        setSha256MandatorySignatures(cfg.sha256MandatorySignatures);
        setCorporateWebhookEnabled(cfg.corporateWebhookEnabled);
        setImmediateEmailAlerts(cfg.immediateEmailAlerts);
        setLlmInferenceModel(cfg.llmInferenceModel);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con /api/config');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hardStopBudgetConstraint: hardStop,
          bargainingAlgorithm: algorithm,
          maxRounds,
          divergenceTolerancePercent: divergenceTolerance,
          minimumMandatoryConcessionUsd: minConcessionUsd,
          autonomyLevel,
          earlyConflictWarning,
          sha256MandatorySignatures,
          corporateWebhookEnabled,
          immediateEmailAlerts,
          llmInferenceModel
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Error al guardar configuración');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToRecommended = () => {
    setHardStop(true);
    setAlgorithm('nash');
    setMaxRounds(5);
    setDivergenceTolerance(0.05);
    setMinConcessionUsd(0.5);
    setAutonomyLevel('human_veto');
    setEarlyConflictWarning(true);
    setSha256MandatorySignatures(true);
    setCorporateWebhookEnabled(true);
    setImmediateEmailAlerts(true);
  };

  return (
    <div className="flex flex-col w-full px-space-lg py-space-lg space-y-space-lg">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-tertiary text-white text-body-sm font-medium rounded-xl shadow-2xl border border-secondary/30 animate-fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
          Configuración del Kernel actualizada y sincronizada en el clúster.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Gobernanza Algorítmica v4.2
            </span>
            <span className="font-mono-data text-body-sm text-outline">Cluster Latam-West-1</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Control de Kernel y Gobernanza del Sistema
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-3xl">
            Ajuste fino de axiomas de teoría de juegos, restricciones inviolables de presupuesto y políticas criptográficas de auditoría.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={resetToRecommended}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline text-on-surface font-label-md font-semibold hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Valores Óptimos
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </div>

      {/* System Engine Health Card */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h4 className="font-headline-sm font-bold text-on-surface text-base">Motor de Consenso En Línea</h4>
            <p className="text-body-sm text-on-surface-variant">
              Nodo broker primario activo con latencia de 12ms. Algoritmo activo: {algorithm.toUpperCase()}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono-data text-xs">
          <span className="px-3 py-1 rounded-lg bg-surface-container text-on-surface font-semibold">
            Memory: 412 MB / 2 GB
          </span>
          <span className="px-3 py-1 rounded-lg bg-surface-container text-emerald-700 font-semibold">
            Health: 100%
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30">
        <button
          onClick={() => setActiveTab('algoritmo')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'algoritmo'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Algoritmo de Negociación
        </button>
        <button
          onClick={() => setActiveTab('restricciones')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'restricciones'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Restricciones Presupuestales
        </button>
        <button
          onClick={() => setActiveTab('seguridad')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'seguridad'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Criptografía y Firmas
        </button>
        <button
          onClick={() => setActiveTab('notificaciones')}
          className={`pb-3 px-4 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'notificaciones'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Webhooks e Integraciones
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm">
        {activeTab === 'algoritmo' && (
          <div className="space-y-space-lg max-w-3xl">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Solución de Negociación Axiomática
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Seleccione el formalismo de teoría de juegos cooperativa para el cálculo del punto de acuerdo óptimo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <label
                className={`p-space-md rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  algorithm === 'nash'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-headline-sm text-on-surface">Nash (NBS)</span>
                    <input
                      type="radio"
                      name="algorithm"
                      checked={algorithm === 'nash'}
                      onChange={() => setAlgorithm('nash')}
                      className="text-primary"
                    />
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-mono-data font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Recomendado
                  </span>
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    Maximiza el producto geométrico de utilidades. Invariante a transformaciones afines de utilidad y óptimo de Pareto.
                  </p>
                </div>
              </label>

              <label
                className={`p-space-md rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  algorithm === 'kalai'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-headline-sm text-on-surface">Kalai-Smorodinsky</span>
                    <input
                      type="radio"
                      name="algorithm"
                      checked={algorithm === 'kalai'}
                      onChange={() => setAlgorithm('kalai')}
                      className="text-primary"
                    />
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-mono-data font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Monotonía
                  </span>
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    Preserva la propiedad de monotonicidad individual. Proporcional a la máxima ganancia teórica de cada área.
                  </p>
                </div>
              </label>

              <label
                className={`p-space-md rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  algorithm === 'proportional'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-headline-sm text-on-surface">Egalitario Ponderado</span>
                    <input
                      type="radio"
                      name="algorithm"
                      checked={algorithm === 'proportional'}
                      onChange={() => setAlgorithm('proportional')}
                      className="text-primary"
                    />
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-mono-data font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Equidad Lineal
                  </span>
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    Minimiza la varianza de utilidades entre áreas ponderadas. Adecuado para periodos de recorte de costos lineal.
                  </p>
                </div>
              </label>
            </div>

            {/* Inference model */}
            <div className="space-y-2 pt-2">
              <label className="font-bold font-headline-sm text-on-surface text-body-md block">
                Motor de Inferencia LLM para Diálogo de Agentes
              </label>
              <select
                value={llmInferenceModel}
                onChange={(e) => setLlmInferenceModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-mono-data text-body-sm text-on-surface"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Baja latencia - Recomendado)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Razonamiento profundo multi-paso)</option>
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Próxima generación)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'restricciones' && (
          <div className="space-y-space-lg max-w-3xl">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Restricciones e Invariantes Presupuestales
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Límites inviolables que el orquestador multiagente impone sobre el espacio de ofertas admisibles.
              </p>
            </div>

            <div className="space-y-4">
              {/* Hard stop toggle */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-on-surface text-body-md block">
                    Restricción Presupuestal Estricta (Hard-Stop Constraint)
                  </span>
                  <p className="text-xs text-on-surface-variant">
                    Prohíbe terminantemente cualquier asignación final que exceda el límite total establecido (Cero sobregiro).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={hardStop}
                    onChange={(e) => setHardStop(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Max Rounds selector */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-on-surface text-body-md block">
                    Número Máximo de Rondas de Negociación
                  </span>
                  <p className="text-xs text-on-surface-variant">
                    Límite de turnos de contraoferta permitidos antes de forzar resolución por mediación coordinada.
                  </p>
                </div>
                <select
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant font-mono-data font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={3}>3 Rondas (Rápido)</option>
                  <option value={5}>5 Rondas (Recomendado)</option>
                  <option value={7}>7 Rondas (Extendido)</option>
                  <option value={10}>10 Rondas (Máximo)</option>
                </select>
              </div>

              {/* Minimum mandatory concession */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-on-surface text-body-md block">
                    Concesión Mínima Obligatoria por Ronda
                  </span>
                  <p className="text-xs text-on-surface-variant">
                    Monto piso de reducción que un agente en conflicto debe conceder al presentar una contraoferta.
                  </p>
                </div>
                <span className="font-mono-data font-bold text-primary px-3 py-1 bg-surface-container rounded-lg">
                  ${minConcessionUsd}M USD
                </span>
              </div>

              {/* Autonomy level */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-on-surface text-body-md block">Nivel de Supervisión Humana</span>
                  <p className="text-xs text-on-surface-variant">
                    Control de autorización para cerrar acuerdos en ledger.
                  </p>
                </div>
                <select
                  value={autonomyLevel}
                  onChange={(e) => setAutonomyLevel(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant font-body-sm font-semibold text-primary"
                >
                  <option value="human_veto">Veto Humano Obligatorio (CFO aprueba)</option>
                  <option value="full_auto">Autonomía Completa (Cierre automático)</option>
                  <option value="advisor">Modo Asesor (Solo recomendaciones)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguridad' && (
          <div className="space-y-space-lg max-w-3xl">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Parámetros Criptográficos y Firmas Digitales
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Garantía matemática de inmutabilidad y no repudio para auditorías internas y regulatorias.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface text-body-md block">Firma Criptográfica SHA-256 Obligatoria</span>
                  <p className="text-xs text-on-surface-variant">
                    Exigir que toda propuesta esté sellada en el ledger de la negociación.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={sha256MandatorySignatures}
                    onChange={(e) => setSha256MandatorySignatures(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface text-body-md block">Alerta Temprana de Conflicto en Red</span>
                  <p className="text-xs text-on-surface-variant">
                    Disparar mediador automático si la divergencia no reduce al menos 15% tras la ronda 2.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={earlyConflictWarning}
                    onChange={(e) => setEarlyConflictWarning(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notificaciones' && (
          <div className="space-y-space-lg max-w-3xl">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Webhooks e Integraciones Corporativas
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Envío de eventos de consenso al sistema ERP / SAP y canales de supervisión ejecutiva.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface text-body-md block">Integración con ERP (Webhooks)</span>
                  <p className="text-xs text-on-surface-variant">
                    Emitir webhook firmado con el acuerdo final para actualización contable.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={corporateWebhookEnabled}
                    onChange={(e) => setCorporateWebhookEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface text-body-md block">Alertas Inmediatas por Email</span>
                  <p className="text-xs text-on-surface-variant">
                    Notificar al comité de dirección cuando se alcance un equilibrio de Nash.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={immediateEmailAlerts}
                    onChange={(e) => setImmediateEmailAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
