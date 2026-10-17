/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DepartmentResolutionDetail {
  department: string;
  initialDemand: string;
  finalAssigned: string;
  adjustment: string;
  finalUtility: string;
}

export interface ConsensusResolutionAttributes {
  id: string;
  folio: string;
  title: string;
  category: string;
  closedDate: string;
  budgetLimit: number; // in Millions
  initialRequested: number; // in Millions
  finalAssigned: number; // in Millions
  algorithmicSavings: number; // in Millions
  savingsPercentage: number;
  totalRounds: number;
  elapsedTime: string;
  participatingAgents: string[];
  consensusStatus: string;
  protocolVersion: string;
  executiveSummary: string;
  smartContractHash: string;
  blockTimestamp: string;
  details: DepartmentResolutionDetail[];
}

export class ConsensusResolution {
  readonly id: string;
  readonly folio: string;
  readonly title: string;
  readonly category: string;
  readonly closedDate: string;
  readonly budgetLimit: number;
  readonly initialRequested: number;
  readonly finalAssigned: number;
  readonly algorithmicSavings: number;
  readonly savingsPercentage: number;
  readonly totalRounds: number;
  readonly elapsedTime: string;
  readonly participatingAgents: string[];
  readonly consensusStatus: string;
  readonly protocolVersion: string;
  readonly executiveSummary: string;
  readonly smartContractHash: string;
  readonly blockTimestamp: string;
  readonly details: DepartmentResolutionDetail[];

  constructor(attrs: ConsensusResolutionAttributes) {
    this.id = attrs.id;
    this.folio = attrs.folio;
    this.title = attrs.title;
    this.category = attrs.category;
    this.closedDate = attrs.closedDate;
    this.budgetLimit = attrs.budgetLimit;
    this.initialRequested = attrs.initialRequested;
    this.finalAssigned = attrs.finalAssigned;
    this.algorithmicSavings = attrs.algorithmicSavings;
    this.savingsPercentage = attrs.savingsPercentage;
    this.totalRounds = attrs.totalRounds;
    this.elapsedTime = attrs.elapsedTime;
    this.participatingAgents = attrs.participatingAgents;
    this.consensusStatus = attrs.consensusStatus;
    this.protocolVersion = attrs.protocolVersion;
    this.executiveSummary = attrs.executiveSummary;
    this.smartContractHash = attrs.smartContractHash;
    this.blockTimestamp = attrs.blockTimestamp;
    this.details = attrs.details;
  }
}
