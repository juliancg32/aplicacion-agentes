/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsensusResolution } from '../../domain/entities/ConsensusResolution';
import { IConsensusResolutionRepository } from '../../domain/repositories/IConsensusResolutionRepository';

export class GetConsensusResolutionsUseCase {
  constructor(private readonly resolutionRepository: IConsensusResolutionRepository) {}

  async execute(): Promise<ConsensusResolution[]> {
    return this.resolutionRepository.getAll();
  }
}

export class GetResolutionByIdUseCase {
  constructor(private readonly resolutionRepository: IConsensusResolutionRepository) {}

  async execute(id: string): Promise<ConsensusResolution | null> {
    return this.resolutionRepository.getById(id);
  }
}
