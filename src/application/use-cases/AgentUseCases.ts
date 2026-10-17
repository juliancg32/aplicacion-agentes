/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent } from '../../domain/entities/Agent';
import { IAgentRepository } from '../../domain/repositories/IAgentRepository';

export class GetAgentsUseCase {
  constructor(private readonly agentRepository: IAgentRepository) {}

  async execute(): Promise<Agent[]> {
    return this.agentRepository.getAll();
  }
}

export class UpdateAgentWeightsUseCase {
  constructor(private readonly agentRepository: IAgentRepository) {}

  async execute(weights: { finance: number; tech: number; operations: number }): Promise<void> {
    return this.agentRepository.updateWeights(weights);
  }
}
