/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsensusResolution } from '../entities/ConsensusResolution';

export interface IConsensusResolutionRepository {
  getAll(): Promise<ConsensusResolution[]>;
  getById(id: string): Promise<ConsensusResolution | null>;
  create(resolution: ConsensusResolution): Promise<ConsensusResolution>;
}
