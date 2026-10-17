/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfig } from '../../domain/entities/SystemConfig';
import { ISystemConfigRepository } from '../../domain/repositories/ISystemConfigRepository';
import { mockSystemConfigData } from '../mocks/mockSystemConfig';

export class MockSystemConfigRepository implements ISystemConfigRepository {
  private config: SystemConfig;

  constructor() {
    this.config = new SystemConfig(mockSystemConfigData);
  }

  async getConfig(): Promise<SystemConfig> {
    return new SystemConfig({ ...this.config });
  }

  async updateConfig(newConfig: Partial<SystemConfig>): Promise<SystemConfig> {
    this.config = new SystemConfig({
      ...this.config,
      ...newConfig
    });
    return new SystemConfig({ ...this.config });
  }
}
