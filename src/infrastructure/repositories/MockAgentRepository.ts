/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent } from '../../domain/entities/Agent';
import { IAgentRepository } from '../../domain/repositories/IAgentRepository';
import { mockAgentsData } from '../mocks/mockAgents';

export class MockAgentRepository implements IAgentRepository {
  private agents: Agent[];

  constructor() {
    this.agents = mockAgentsData.map((attrs) => new Agent(attrs));
  }

  async getAll(): Promise<Agent[]> {
    return [...this.agents];
  }

  async getById(id: string): Promise<Agent | null> {
    const found = this.agents.find((a) => a.id === id);
    return found ? found : null;
  }

  async getByCode(code: string): Promise<Agent | null> {
    const found = this.agents.find((a) => a.code === code);
    return found ? found : null;
  }

  async updateWeights(weights: { finance: number; tech: number; operations: number }): Promise<void> {
    console.log('Pesos de utilidad actualizados:', weights);
  }

  async updateStatus(id: string, status: Agent['status']): Promise<Agent> {
    const idx = this.agents.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error(`Agent with id ${id} not found`);
    }
    const current = this.agents[idx];
    const updated = new Agent({
      ...current,
      status
    });
    this.agents[idx] = updated;
    return updated;
  }
}
