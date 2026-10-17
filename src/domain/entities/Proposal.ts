/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FipaMessageType } from '../value-objects/ProtocolType';

export interface ProposalAttributes {
  id: string;
  code: string; // e.g. #P-8921
  negotiationId: string;
  negotiationTitle: string;
  roundNumber: number;
  senderAgentId: string;
  senderAgentName: string;
  senderAgentCode: string;
  targetAgentId?: string;
  targetAgentName?: string;
  targetAgentCode?: string;
  messageType: FipaMessageType;
  timestamp: string;
  timeFormatted: string;
  turnNumber: number;
  statement: string;
  offeredConcessionAmount: number; // in Millions (e.g. -2.0)
  offeredConcessionPercent: number; // percentage (e.g. -6.6)
  currentClaimAmount: number; // in Millions (e.g. 28.0)
  utilityValue: number; // e.g. 0.91
  operationalRisk: 'Bajo' | 'Medio' | 'Alto';
  status: 'Aceptada preliminarmente' | 'En Revisión' | 'Consolidada en Matriz' | 'Superada por Ronda 2' | 'Propuesta Inicial';
  sha256Hash: string;
  impactMetrics: { [key: string]: string };
  roundRTT?: string;
}

export class Proposal {
  readonly id: string;
  readonly code: string;
  readonly negotiationId: string;
  readonly negotiationTitle: string;
  readonly roundNumber: number;
  readonly senderAgentId: string;
  readonly senderAgentName: string;
  readonly senderAgentCode: string;
  readonly targetAgentId?: string;
  readonly targetAgentName?: string;
  readonly targetAgentCode?: string;
  readonly messageType: FipaMessageType;
  readonly timestamp: string;
  readonly timeFormatted: string;
  readonly turnNumber: number;
  readonly statement: string;
  readonly offeredConcessionAmount: number;
  readonly offeredConcessionPercent: number;
  readonly currentClaimAmount: number;
  readonly utilityValue: number;
  readonly operationalRisk: 'Bajo' | 'Medio' | 'Alto';
  readonly status: 'Aceptada preliminarmente' | 'En Revisión' | 'Consolidada en Matriz' | 'Superada por Ronda 2' | 'Propuesta Inicial';
  readonly sha256Hash: string;
  readonly impactMetrics: { [key: string]: string };
  readonly roundRTT?: string;

  constructor(attrs: ProposalAttributes) {
    this.id = attrs.id;
    this.code = attrs.code;
    this.negotiationId = attrs.negotiationId;
    this.negotiationTitle = attrs.negotiationTitle;
    this.roundNumber = attrs.roundNumber;
    this.senderAgentId = attrs.senderAgentId;
    this.senderAgentName = attrs.senderAgentName;
    this.senderAgentCode = attrs.senderAgentCode;
    this.targetAgentId = attrs.targetAgentId;
    this.targetAgentName = attrs.targetAgentName;
    this.targetAgentCode = attrs.targetAgentCode;
    this.messageType = attrs.messageType;
    this.timestamp = attrs.timestamp;
    this.timeFormatted = attrs.timeFormatted;
    this.turnNumber = attrs.turnNumber;
    this.statement = attrs.statement;
    this.offeredConcessionAmount = attrs.offeredConcessionAmount;
    this.offeredConcessionPercent = attrs.offeredConcessionPercent;
    this.currentClaimAmount = attrs.currentClaimAmount;
    this.utilityValue = attrs.utilityValue;
    this.operationalRisk = attrs.operationalRisk;
    this.status = attrs.status;
    this.sha256Hash = attrs.sha256Hash;
    this.impactMetrics = attrs.impactMetrics;
    this.roundRTT = attrs.roundRTT;
  }
}
