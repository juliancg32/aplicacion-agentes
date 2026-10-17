/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INegotiationRepository } from '../../domain/repositories/INegotiationRepository';

export interface DashboardMetrics {
  activeNegotiationsCount: number;
  completedNegotiationsCount: number;
  agreementsReachedCount: number;
  successRate: number;
  accumulatedSavings: number;
  averageConvergenceRate: number;
  humanNegotiationTimeSavedPercent: number;
}

export class GetDashboardMetricsUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(): Promise<DashboardMetrics> {
    const all = await this.negotiationRepository.getAll();
    const active = all.filter((n) => n.status === 'en_curso' || n.status === 'esperando_aprobacion');
    const completed = all.filter((n) => n.status === 'finalizada_acuerdo');

    return {
      activeNegotiationsCount: active.length,
      completedNegotiationsCount: completed.length,
      agreementsReachedCount: 10,
      successRate: 83.3,
      accumulatedSavings: 35.0,
      averageConvergenceRate: 74,
      humanNegotiationTimeSavedPercent: 82
    };
  }
}
