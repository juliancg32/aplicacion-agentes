/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent } from '../entities/Agent';

export interface IAgentRepository {
  getAll(): Promise<Agent[]>;
  getById(id: string): Promise<Agent | null>;
  getByCode(code: string): Promise<Agent | null>;
  updateWeights(weights: { finance: number; tech: number; operations: number }): Promise<void>;
  updateStatus(id: string, status: Agent['status']): Promise<Agent>;
}
