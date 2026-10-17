/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfigAttributes } from '../../domain/entities/SystemConfig';

export const mockSystemConfigData: SystemConfigAttributes = {
  hardStopBudgetConstraint: true,
  bargainingAlgorithm: 'nash',
  maxRounds: 5,
  divergenceTolerancePercent: 0.0,
  minimumMandatoryConcessionUsd: 1_000_000,
  llmInferenceModel: 'LLM Swarm Enterprise v4.2',
  autonomyLevel: 'human_veto',
  earlyConflictWarning: true,
  sha256MandatorySignatures: true,
  corporateWebhookEnabled: true,
  immediateEmailAlerts: true,
  operatorProfile: {
    fullName: 'Carlos Mendoza',
    email: 'carlos.mendoza@empresa.com',
    role: 'Administrador Corporativo',
    tokenFidoRegistered: true
  },
  paretoWeights: {
    finance: 0.35,
    tech: 0.30,
    operations: 0.20,
    paretoDeviationEpsilon: 0.05
  }
};
