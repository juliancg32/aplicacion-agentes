/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Proposal } from '../../domain/entities/Proposal';

export const PropuestasPage: React.FC = () => {
  const { navigate, searchQuery } = useNavigation();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedMessageType, setSelectedMessageType] = useState<string>('all');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProposals();
  }, [selectedRound, selectedAgent, selectedMessageType]);

  const loadProposals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedRound !== 'all') params.set('roundNumber', selectedRound);
      if (selectedAgent !== 'all') params.set('senderAgentId', selectedAgent);
      if (selectedMessageType !== 'all') params.set('messageType', selectedMessageType);

      const res = await fetch(`/api/proposals?${params.toString()}`);
      if (!res.ok) throw new Error('Error al consultar propuestas en el ledger');
      const json = await res.json();
      if (json.success) {
        setProposals(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con /api/proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setToastMessage('Hash criptográfico copiado al portapapeles');
    setTimeout(() => {
      setCopiedHash(null);
      setToastMessage(null);
    }, 2500);
  };

  const filteredProposals = proposals.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      p.senderAgentName.toLowerCase().includes(q) ||
      p.senderAgentCode.toLowerCase().includes(q) ||
      p.statement.toLowerCase().includes(q) ||
      p.sha256Hash.toLowerCase().includes(q)
    );
  });

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'PROPOSE':
        return 'bg-primary-fixed text-primary border-primary/20';
      case 'COUNTER':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CFP':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'MEDIATE':
        return 'bg-secondary-fixed text-on-secondary-fixed border-secondary/20';
      case 'ACCEPT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECT':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-surface-container-high text-on-surface';
    }
  };

  return (
    <div className="flex flex-col w-full px-space-lg py-space-lg space-y-space-lg">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-tertiary text-white text-body-sm font-medium rounded-xl shadow-xl animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Protocolo FIPA-ACL Activo
            </span>
            <span className="font-mono-data text-body-sm text-outline">Ledger SHA-256 Sincronizado</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Trazabilidad de Propuestas y Contraofertas
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-3xl">
            Inspección formal de interacciones multiagente, deltas de concesión algorítmica y hashes criptográficos inmutables.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => navigate('centro-de-negociacion')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            Ver Sala en Vivo
          </button>
          <button
            onClick={() => navigate('reportes')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Reporte de Consenso
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Propuestas</p>
            <p className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">{proposals.length}</p>
            <p className="font-body-sm text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              100% verificadas en ledger
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">rule</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Delta Promedio</p>
            <p className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">-8.4%</p>
            <p className="font-body-sm text-on-surface-variant mt-0.5">Tasa de concesión por ronda</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined text-2xl">trending_down</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Utilidad Global Nash</p>
            <p className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">0.864</p>
            <p className="font-body-sm text-emerald-600 mt-0.5">Convergencia Óptima</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <span className="material-symbols-outlined text-2xl">balance</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Ronda Actual</p>
            <p className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Ronda 2 / 5</p>
            <p className="font-body-sm text-secondary font-medium mt-0.5">Intercambio de Contraofertas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-2xl">sync</span>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Round selector */}
          <div className="flex items-center gap-2">
            <span className="font-label-md text-on-surface-variant font-medium">Ronda:</span>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-body-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="all">Todas las rondas</option>
              <option value="1">Ronda 1 (Demandas Iniciales)</option>
              <option value="2">Ronda 2 (Contraofertas)</option>
              <option value="3">Ronda 3 (Convergencia)</option>
              <option value="4">Ronda 4 (Equilibrio Final)</option>
            </select>
          </div>

          {/* Agent filter */}
          <div className="flex items-center gap-2">
            <span className="font-label-md text-on-surface-variant font-medium">Agente:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-body-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="all">Todos los agentes</option>
              <option value="agent-fin-01">Finanzas (FIN-CORP-01)</option>
              <option value="agent-tech-02">Tecnología (TECH-AI-02)</option>
              <option value="agent-ops-03">Operaciones (OPS-LOG-03)</option>
              <option value="agent-mkt-04">Marketing (MKT-GROWTH-04)</option>
              <option value="agent-hr-05">Talento y RRHH (HR-PEOPLE-05)</option>
              <option value="agent-legal-06">Legal & Riesgos (LEGAL-COMP-06)</option>
            </select>
          </div>

          {/* Message Type filter */}
          <div className="flex items-center gap-2">
            <span className="font-label-md text-on-surface-variant font-medium">Tipo FIPA:</span>
            <select
              value={selectedMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-body-sm font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="all">Todos los mensajes</option>
              <option value="PROPOSE">PROPOSE</option>
              <option value="COUNTER">COUNTER</option>
              <option value="CFP">CFP (Call For Proposal)</option>
              <option value="MEDIATE">MEDIATE</option>
              <option value="ACCEPT">ACCEPT</option>
            </select>
          </div>
        </div>

        <div className="font-body-sm text-outline">
          Mostrando <span className="font-semibold text-on-surface">{filteredProposals.length}</span> mensajes de protocolo
        </div>
      </div>

      {/* Main Table / Ledger List */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface font-label-md text-label-md border-b border-outline-variant/30">
                <th className="py-3.5 px-space-md">Folio / Ronda</th>
                <th className="py-3.5 px-space-md">Tipo FIPA</th>
                <th className="py-3.5 px-space-md">Agente Emisor</th>
                <th className="py-3.5 px-space-md">Monto Solicitado</th>
                <th className="py-3.5 px-space-md">Delta Concesión</th>
                <th className="py-3.5 px-space-md">Utilidad (u_i)</th>
                <th className="py-3.5 px-space-md">Hash SHA-256 Ledger</th>
                <th className="py-3.5 px-space-md text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">find_in_page</span>
                    <p className="font-headline-sm text-headline-sm text-on-surface">No se encontraron propuestas</p>
                    <p className="text-body-sm mt-1">Ajusta los filtros o términos de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredProposals.map((prop) => (
                  <tr
                    key={prop.id}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer group"
                    onClick={() => setSelectedProposal(prop)}
                  >
                    <td className="py-3.5 px-space-md font-medium text-on-surface">
                      <div className="flex flex-col">
                        <span className="font-mono-data font-bold text-primary group-hover:text-secondary transition-colors">
                          {prop.code}
                        </span>
                        <span className="text-[11px] text-outline font-mono-data">Ronda {prop.roundNumber}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono-data text-[11px] font-bold border ${getMessageTypeBadge(
                          prop.messageType
                        )}`}
                      >
                        {prop.messageType}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{prop.senderAgentName}</span>
                        <span className="font-mono-data text-[11px] text-outline">{prop.senderAgentCode}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md font-mono-data font-bold text-on-surface">
                      ${prop.currentClaimAmount.toFixed(1)}M USD
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span
                        className={`font-mono-data font-medium ${
                          prop.offeredConcessionPercent < 0 ? 'text-amber-600' : 'text-outline'
                        }`}
                      >
                        {prop.offeredConcessionPercent !== 0 ? `${prop.offeredConcessionPercent.toFixed(1)}%` : '0.0%'}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${prop.utilityValue * 100}%` }}
                          />
                        </div>
                        <span className="font-mono-data text-[12px] font-semibold text-on-surface">
                          {prop.utilityValue.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="font-mono-data text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded">
                          {prop.sha256Hash.substring(0, 10)}...{prop.sha256Hash.substring(prop.sha256Hash.length - 6)}
                        </span>
                        <button
                          onClick={() => handleCopyHash(prop.sha256Hash)}
                          title="Copiar hash SHA-256"
                          className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedHash === prop.sha256Hash ? 'done' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-right">
                      <button
                        onClick={() => setSelectedProposal(prop)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all"
                      >
                        Auditar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Audit Modal Drawer */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-space-lg py-space-md bg-tertiary text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold">
                    Inspección Criptográfica {selectedProposal.code}
                  </h3>
                  <p className="font-mono-data text-[12px] text-surface-container-high">
                    Ronda {selectedProposal.roundNumber} - Protocolo FIPA {selectedProposal.messageType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto">
              {/* Agent & Proposition Summary */}
              <div className="grid grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-xl">
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Agente Emisor</span>
                  <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                    {selectedProposal.senderAgentName}
                  </p>
                  <p className="font-mono-data text-xs text-outline">{selectedProposal.senderAgentCode}</p>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Monto Solicitado</span>
                  <p className="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">
                    ${selectedProposal.currentClaimAmount.toFixed(1)}M USD
                  </p>
                  <p className="font-body-sm text-outline">
                    Concesión:{' '}
                    <span className="font-mono-data font-semibold text-amber-600">
                      {selectedProposal.offeredConcessionPercent}%
                    </span>
                  </p>
                </div>
              </div>

              {/* Rationale & Argumentation */}
              <div>
                <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-1">
                  Argumentación Justificada del Agente
                </h4>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 text-body-sm text-on-surface leading-relaxed">
                  "{selectedProposal.statement}"
                </div>
              </div>

              {/* Cryptographic Verification Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">
                    Certificado Criptográfico SHA-256
                  </h4>
                  <span className="inline-flex items-center gap-1 font-mono-data text-[11px] text-emerald-600 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Hash Verificado en Ledger
                  </span>
                </div>
                <div className="p-3 bg-tertiary-container rounded-xl font-mono-data text-xs text-on-tertiary-container break-all select-all flex items-center justify-between gap-2">
                  <span>{selectedProposal.sha256Hash}</span>
                  <button
                    onClick={() => handleCopyHash(selectedProposal.sha256Hash)}
                    className="shrink-0 p-1 rounded hover:bg-white/10 text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Payload JSON Schema */}
              <div>
                <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-1">
                  Carga Útil FIPA Payload (JSON-LD)
                </h4>
                <pre className="p-3 bg-tertiary text-emerald-300 rounded-xl font-mono-data text-[11px] overflow-x-auto">
{JSON.stringify(
  {
    protocol: 'FIPA-ACL-2026',
    performative: selectedProposal.messageType,
    sender: selectedProposal.senderAgentCode,
    receiver: 'NEGOTIATION_BROKER_ALL',
    round: selectedProposal.roundNumber,
    timestamp: selectedProposal.timestamp,
    content: {
      demandedAmount: selectedProposal.currentClaimAmount,
      currency: 'USD',
      utility: selectedProposal.utilityValue,
      delta: selectedProposal.offeredConcessionPercent
    },
    signature: {
      type: 'Ed25519Signature2020',
      hash: selectedProposal.sha256Hash,
      status: 'VERIFIED'
    }
  },
  null,
  2
)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-space-sm px-space-lg py-space-sm bg-surface-container border-t border-outline-variant/30">
              <button
                onClick={() => setSelectedProposal(null)}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleCopyHash(selectedProposal.sha256Hash);
                  setSelectedProposal(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Copiar Hash y Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
