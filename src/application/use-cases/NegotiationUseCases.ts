/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Negotiation } from '../../domain/entities/Negotiation';
import { INegotiationRepository } from '../../domain/repositories/INegotiationRepository';

export class GetNegotiationsUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(): Promise<Negotiation[]> {
    return this.negotiationRepository.getAll();
  }
}

export class GetNegotiationByIdUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(id: string): Promise<Negotiation | null> {
    return this.negotiationRepository.getById(id);
  }
}

export class CreateNegotiationUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(data: {
    title: string;
    description: string;
    totalBudgetLimit: number;
    currency: string;
    maxRounds: number;
    startDate: string;
    demands: {
      departmentId: string;
      departmentName: string;
      agentCode: string;
      initialDemand: number;
      priority: string;
    }[];
  }): Promise<Negotiation> {
    const totalRequested = data.demands.reduce((acc, d) => acc + d.initialDemand, 0);
    const deficit = Math.max(0, +(totalRequested - data.totalBudgetLimit).toFixed(1));
    const randomFolio = `#NEG-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newNegotiation = new Negotiation({
      id: `neg-${Date.now()}`,
      folio: randomFolio,
      title: data.title,
      description: data.description,
      status: 'en_curso',
      statusLabel: 'En Negociación',
      fiscalYear: '2026',
      currentRound: 1,
      maxRounds: data.maxRounds,
      totalBudgetLimit: data.totalBudgetLimit,
      totalRequestedInitial: totalRequested,
      totalCurrentRequested: totalRequested,
      currency: data.currency,
      startDate: data.startDate,
      lastActivity: 'Ahora',
      convergenceRate: 50,
      consensusProtocol: 'Pareto-Optimal Search (v4.2)',
      agentsParticipatingCount: data.demands.length + 1,
      deficitCurrent: deficit,
      category: 'Distribución Presupuestal',
      demands: data.demands.map((d) => ({
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        agentCode: d.agentCode,
        initialDemand: d.initialDemand,
        currentOffer: d.initialDemand,
        utilityScore: 1.0,
        reductionPercentage: 0.0,
        priority: d.priority
      }))
    });

    return this.negotiationRepository.create(newNegotiation);
  }
}

export class AdvanceNegotiationRoundUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(negotiationId: string): Promise<Negotiation> {
    return this.negotiationRepository.advanceRound(negotiationId);
  }
}

export class AcceptAgreementUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(negotiationId: string): Promise<Negotiation> {
    return this.negotiationRepository.acceptAgreement(negotiationId);
  }
}

export class DeleteNegotiationUseCase {
  constructor(private readonly negotiationRepository: INegotiationRepository) {}

  async execute(negotiationId: string): Promise<boolean> {
    return this.negotiationRepository.delete(negotiationId);
  }
}
