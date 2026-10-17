/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemConfigAttributes {
  hardStopBudgetConstraint: boolean;
  bargainingAlgorithm: 'nash' | 'kalai' | 'proportional';
  maxRounds: number;
  divergenceTolerancePercent: number;
  minimumMandatoryConcessionUsd: number;
  llmInferenceModel: string;
  autonomyLevel: 'human_veto' | 'full_auto' | 'advisor';
  earlyConflictWarning: boolean;
  sha256MandatorySignatures: boolean;
  corporateWebhookEnabled: boolean;
  immediateEmailAlerts: boolean;
  operatorProfile: {
    fullName: string;
    email: string;
    role: string;
    tokenFidoRegistered: boolean;
  };
  paretoWeights: {
    finance: number;
    tech: number;
    operations: number;
    paretoDeviationEpsilon: number;
  };
}

export class SystemConfig {
  hardStopBudgetConstraint: boolean;
  bargainingAlgorithm: 'nash' | 'kalai' | 'proportional';
  maxRounds: number;
  divergenceTolerancePercent: number;
  minimumMandatoryConcessionUsd: number;
  llmInferenceModel: string;
  autonomyLevel: 'human_veto' | 'full_auto' | 'advisor';
  earlyConflictWarning: boolean;
  sha256MandatorySignatures: boolean;
  corporateWebhookEnabled: boolean;
  immediateEmailAlerts: boolean;
  operatorProfile: {
    fullName: string;
    email: string;
    role: string;
    tokenFidoRegistered: boolean;
  };
  paretoWeights: {
    finance: number;
    tech: number;
    operations: number;
    paretoDeviationEpsilon: number;
  };

  constructor(attrs: SystemConfigAttributes) {
    this.hardStopBudgetConstraint = attrs.hardStopBudgetConstraint;
    this.bargainingAlgorithm = attrs.bargainingAlgorithm;
    this.maxRounds = attrs.maxRounds;
    this.divergenceTolerancePercent = attrs.divergenceTolerancePercent;
    this.minimumMandatoryConcessionUsd = attrs.minimumMandatoryConcessionUsd;
    this.llmInferenceModel = attrs.llmInferenceModel;
    this.autonomyLevel = attrs.autonomyLevel;
    this.earlyConflictWarning = attrs.earlyConflictWarning;
    this.sha256MandatorySignatures = attrs.sha256MandatorySignatures;
    this.corporateWebhookEnabled = attrs.corporateWebhookEnabled;
    this.immediateEmailAlerts = attrs.immediateEmailAlerts;
    this.operatorProfile = attrs.operatorProfile;
    this.paretoWeights = attrs.paretoWeights;
  }
}
