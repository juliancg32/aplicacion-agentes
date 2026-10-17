/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NegotiationStatus } from '../value-objects/ProtocolType';

export interface DepartmentDemand {
  departmentId: string;
  departmentName: string;
  agentCode: string;
  initialDemand: number; // Millions
  currentOffer: number; // Millions
  finalAgreed?: number; // Millions
  utilityScore: number; // 0.0 - 1.0
  reductionPercentage: number;
  priority: string;
}

export interface NegotiationAttributes {
  id: string;
  folio: string;
  title: string;
  description: string;
  status: NegotiationStatus;
  statusLabel: string;
  fiscalYear: string;
  currentRound: number;
  maxRounds: number;
  totalBudgetLimit: number; // Millions
  totalRequestedInitial: number; // Millions
  totalCurrentRequested: number; // Millions
  currency: string;
  startDate: string;
  lastActivity: string;
  convergenceRate: number; // percentage
  consensusProtocol: string;
  agentsParticipatingCount: number;
  demands: DepartmentDemand[];
  slaMinimum?: string;
  deficitCurrent: number;
  category: string;
}

export class Negotiation {
  readonly id: string;
  readonly folio: string;
  readonly title: string;
  readonly description: string;
  readonly status: NegotiationStatus;
  readonly statusLabel: string;
  readonly fiscalYear: string;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly totalBudgetLimit: number;
  readonly totalRequestedInitial: number;
  readonly totalCurrentRequested: number;
  readonly currency: string;
  readonly startDate: string;
  readonly lastActivity: string;
  readonly convergenceRate: number;
  readonly consensusProtocol: string;
  readonly agentsParticipatingCount: number;
  readonly demands: DepartmentDemand[];
  readonly slaMinimum?: string;
  readonly deficitCurrent: number;
  readonly category: string;

  constructor(attrs: NegotiationAttributes) {
    this.id = attrs.id;
    this.folio = attrs.folio;
    this.title = attrs.title;
    this.description = attrs.description;
    this.status = attrs.status;
    this.statusLabel = attrs.statusLabel;
    this.fiscalYear = attrs.fiscalYear;
    this.currentRound = attrs.currentRound;
    this.maxRounds = attrs.maxRounds;
    this.totalBudgetLimit = attrs.totalBudgetLimit;
    this.totalRequestedInitial = attrs.totalRequestedInitial;
    this.totalCurrentRequested = attrs.totalCurrentRequested;
    this.currency = attrs.currency;
    this.startDate = attrs.startDate;
    this.lastActivity = attrs.lastActivity;
    this.convergenceRate = attrs.convergenceRate;
    this.consensusProtocol = attrs.consensusProtocol;
    this.agentsParticipatingCount = attrs.agentsParticipatingCount;
    this.demands = attrs.demands;
    this.slaMinimum = attrs.slaMinimum;
    this.deficitCurrent = attrs.deficitCurrent;
    this.category = attrs.category;
  }

  get isBudgetMet(): boolean {
    return this.totalCurrentRequested <= this.totalBudgetLimit;
  }

  get totalConcession(): number {
    return +(this.totalRequestedInitial - this.totalCurrentRequested).toFixed(1);
  }
}
