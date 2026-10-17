/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsensusResolution } from '../../domain/entities/ConsensusResolution';
import { IConsensusResolutionRepository } from '../../domain/repositories/IConsensusResolutionRepository';
import { mockResolutionsData } from '../mocks/mockResolutions';

export class MockConsensusResolutionRepository implements IConsensusResolutionRepository {
  private resolutions: ConsensusResolution[];

  constructor() {
    this.resolutions = mockResolutionsData.map((attrs) => new ConsensusResolution(attrs));
  }

  async getAll(): Promise<ConsensusResolution[]> {
    return [...this.resolutions];
  }

  async getById(id: string): Promise<ConsensusResolution | null> {
    const found = this.resolutions.find((r) => r.id === id || r.folio === id);
    return found ? found : null;
  }

  async create(resolution: ConsensusResolution): Promise<ConsensusResolution> {
    this.resolutions.unshift(resolution);
    return resolution;
  }
}
