/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfig } from '../entities/SystemConfig';

export interface ISystemConfigRepository {
  getConfig(): Promise<SystemConfig>;
  updateConfig(config: Partial<SystemConfig>): Promise<SystemConfig>;
}
