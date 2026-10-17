/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfig } from '../../domain/entities/SystemConfig';
import { ISystemConfigRepository } from '../../domain/repositories/ISystemConfigRepository';

export class GetSystemConfigUseCase {
  constructor(private readonly configRepository: ISystemConfigRepository) {}

  async execute(): Promise<SystemConfig> {
    return this.configRepository.getConfig();
  }
}

export class UpdateSystemConfigUseCase {
  constructor(private readonly configRepository: ISystemConfigRepository) {}

  async execute(partialConfig: Partial<SystemConfig>): Promise<SystemConfig> {
    return this.configRepository.updateConfig(partialConfig);
  }
}
