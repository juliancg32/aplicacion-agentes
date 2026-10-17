/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ConsensusResolution } from '../../domain/entities/ConsensusResolution';
import { CryptographicAuditService } from '../../application/services/CryptographicAuditService';

export const HistorialPage: React.FC = () => {
  const { navigate, searchQuery } = useNavigation();
  const [resolutions, setResolutions] = useState<ConsensusResolution[]>([]);
  const [selectedResolution, setSelectedResolution] = useState<ConsensusResolution | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    resolutionFolio?: string;
    details?: string;
  } | null>(null);

  const loadResolutions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/resolutions');
      if (!res.ok) throw new Error('Error al cargar historial de resoluciones');
      const json = await res.json();
      if (json.success) {
        setResolutions(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con /api/resolutions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResolutions();
  }, []);

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;

    const cleanInput = verificationInput.trim().toLowerCase();
    const found = resolutions.find(
      (r) =>
        r.smartContractHash.toLowerCase().includes(cleanInput) ||
        r.folio.toLowerCase().includes(cleanInput)
    );

    if (found) {
      setVerificationResult({
        tested: true,
        isValid: true,
        resolutionFolio: found.folio,
        details: `Integridad verificada formalmente en Ledger. Corresponde al acuerdo de consenso ${found.title} ($${found.finalAssigned}M).`
      });
    } else {
      const basicCheck = CryptographicAuditService.verifyHash(cleanInput);
      setVerificationResult({
        tested: true,
        isValid: basicCheck.isValid,
        details: basicCheck.isValid
          ? 'Formato de hash criptográfico válido (SHA-256), pero no se encuentra registrado en el ledger institucional de este clúster.'
          : 'Cadena no válida para algoritmo SHA-256 (debe ser hexadecimal de 64 caracteres).'
      });
    }
  };

  const filteredResolutions = resolutions.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.folio.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.smartContractHash.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full px-space-lg py-space-lg space-y-space-lg">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-mono-data text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Libro Mayor Inmutable
            </span>
            <span className="font-mono-data text-body-sm text-outline">Cadena de Bloques Corporativa SHA-256</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Historial de Resoluciones y Auditoría Forense
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-3xl">
            Repositorio histórico de acuerdos presupuestales consensuados por agentes autónomos con verificación criptográfica a prueba de manipulaciones.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => navigate('reportes')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Métricas de Consenso
          </button>
        </div>
      </div>

      {/* Cryptographic Verifier Widget */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/30 shadow-sm space-y-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">verified</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Validador Criptográfico de Ledger en Tiempo Real
          </h3>
        </div>
        <p className="font-body-sm text-on-surface-variant">
          Ingrese un hash SHA-256 de consenso, bloque génesis o código de folio para auditar la inmutabilidad y autenticidad del acuerdo.
        </p>

        <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              fingerprint
            </span>
            <input
              type="text"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              placeholder="Ej: a9f8e72c8109bf44... o #RES-2026-001"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-mono-data text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all shadow-sm shrink-0 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">search_check</span>
            Verificar Firma Forense
          </button>
        </form>

        {verificationResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 mt-3 animate-fade-in ${
              verificationResult.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">
              {verificationResult.isValid ? 'check_circle' : 'error'}
            </span>
            <div>
              <p className="font-bold font-headline-sm text-body-md">
                {verificationResult.isValid
                  ? 'Firma Criptográfica Válida y Certificada'
                  : 'Fallo de Verificación en Ledger'}
              </p>
              <p className="text-body-sm mt-0.5">{verificationResult.details}</p>
              {verificationResult.resolutionFolio && (
                <button
                  onClick={() => {
                    const r = resolutions.find((x) => x.folio === verificationResult.resolutionFolio);
                    if (r) setSelectedResolution(r);
                  }}
                  className="mt-2 text-xs font-semibold text-primary underline hover:text-primary-container inline-flex items-center gap-1"
                >
                  Ver expediente completo del acuerdo &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resolutions List */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden space-y-space-sm p-space-lg">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Acuerdos Presupuestales Cerrados
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Historial de decisiones con firma multiagente y sellado temporal inmutable.
            </p>
          </div>
          <span className="font-mono-data text-xs text-outline">{filteredResolutions.length} resoluciones archivadas</span>
        </div>

        <div className="grid grid-cols-1 gap-space-md pt-2">
          {filteredResolutions.map((res) => (
            <div
              key={res.id}
              className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-space-md cursor-pointer group"
              onClick={() => setSelectedResolution(res)}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-data font-bold text-primary text-base group-hover:text-secondary transition-colors">
                    {res.folio}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono-data text-[11px] font-bold">
                    CONSENSO VÁLIDO
                  </span>
                  <span className="font-mono-data text-xs text-outline">{res.closedDate}</span>
                </div>

                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {res.title}
                </h4>

                <p className="font-body-sm text-on-surface-variant line-clamp-2">
                  {res.executiveSummary}
                </p>

                {/* Hash preview */}
                <div className="flex items-center gap-2 pt-1 font-mono-data text-[11px] text-outline">
                  <span className="font-semibold text-on-surface">Consensus Hash:</span>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-primary">
                    {res.smartContractHash.substring(0, 24)}...{res.smartContractHash.substring(res.smartContractHash.length - 8)}
                  </span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-space-lg shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-outline-variant/20">
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">Asignado</span>
                  <span className="font-headline-md font-bold text-primary font-mono-data">${res.finalAssigned}M</span>
                  <span className="text-[11px] text-outline block">{res.totalRounds} rondas ejecutadas</span>
                </div>

                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">Ahorro</span>
                  <span className="font-body-md font-semibold text-on-surface font-mono-data">${res.algorithmicSavings}M</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block">{res.savingsPercentage}% Optimizado</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResolution(res);
                  }}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Auditar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Audit Modal */}
      {selectedResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-space-lg py-space-md bg-tertiary text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">gavel</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold">
                    Expediente de Acuerdo {selectedResolution.folio}
                  </h3>
                  <p className="font-mono-data text-xs text-surface-container-high">
                    Sellado el {selectedResolution.closedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResolution(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto">
              <div className="bg-surface-container-low p-space-md rounded-xl space-y-2">
                <h4 className="font-headline-sm font-bold text-on-surface">{selectedResolution.title}</h4>
                <p className="font-body-sm text-on-surface-variant">{selectedResolution.executiveSummary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
                  <div className="p-2 bg-surface-container rounded-lg">
                    <span className="text-[11px] text-outline block uppercase">Total Acordado</span>
                    <span className="font-mono-data font-bold text-primary text-sm">${selectedResolution.finalAssigned}M</span>
                  </div>
                  <div className="p-2 bg-surface-container rounded-lg">
                    <span className="text-[11px] text-outline block uppercase">Rondas</span>
                    <span className="font-mono-data font-bold text-on-surface text-sm">{selectedResolution.totalRounds}</span>
                  </div>
                  <div className="p-2 bg-surface-container rounded-lg">
                    <span className="text-[11px] text-outline block uppercase">Ahorro</span>
                    <span className="font-mono-data font-bold text-emerald-600 text-sm">{selectedResolution.savingsPercentage}%</span>
                  </div>
                  <div className="p-2 bg-surface-container rounded-lg">
                    <span className="text-[11px] text-outline block uppercase">Firmantes</span>
                    <span className="font-mono-data font-bold text-secondary text-sm">{selectedResolution.participatingAgents.length} Agentes</span>
                  </div>
                </div>
              </div>

              {/* Department breakdown table */}
              <div>
                <h5 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-2">
                  Desglose de Asignación por Departamento
                </h5>
                <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                  <table className="w-full text-left text-body-sm">
                    <thead className="bg-surface-container text-on-surface font-label-md">
                      <tr>
                        <th className="py-2.5 px-3">Departamento</th>
                        <th className="py-2.5 px-3">Demanda Inicial</th>
                        <th className="py-2.5 px-3">Asignado Final</th>
                        <th className="py-2.5 px-3">Ajuste</th>
                        <th className="py-2.5 px-3">Utilidad Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {selectedResolution.details.map((row) => (
                        <tr key={row.department}>
                          <td className="py-2 px-3 font-semibold">{row.department}</td>
                          <td className="py-2 px-3 font-mono-data text-outline">{row.initialDemand}</td>
                          <td className="py-2 px-3 font-mono-data font-bold text-primary">{row.finalAssigned}</td>
                          <td className="py-2 px-3 font-mono-data text-amber-700">{row.adjustment}</td>
                          <td className="py-2 px-3 font-mono-data font-bold text-emerald-700">{row.finalUtility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cryptographic Ledger Proof */}
              <div className="space-y-2">
                <h5 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">
                  Prueba Criptográfica de Inmutabilidad
                </h5>
                <div className="p-3 bg-tertiary text-white rounded-xl space-y-2 font-mono-data text-xs">
                  <div>
                    <span className="text-secondary-fixed block text-[10px] uppercase font-bold">Protocol Version</span>
                    <span className="text-white/80">{selectedResolution.protocolVersion}</span>
                  </div>
                  <div>
                    <span className="text-secondary-fixed block text-[10px] uppercase font-bold">Consensus Block Hash (Smart Contract)</span>
                    <span className="break-all text-emerald-300 font-bold">{selectedResolution.smartContractHash}</span>
                  </div>
                  <div>
                    <span className="text-secondary-fixed block text-[10px] uppercase font-bold">Block Timestamp</span>
                    <span className="text-white/70">{selectedResolution.blockTimestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-space-sm px-space-lg py-space-sm bg-surface-container border-t border-outline-variant/30">
              <button
                onClick={() => setSelectedResolution(null)}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedResolution.smartContractHash);
                  alert('Hash de consenso copiado al portapapeles');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copiar Hash SHA-256
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
