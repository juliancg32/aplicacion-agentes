/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PriorityLevel } from '../value-objects/ProtocolType';

export interface AgentAttributes {
  id: string;
  code: string;
  name: string;
  department: string;
  priority: PriorityLevel;
  status: 'activa' | 'en_espera' | 'aceptada' | 'offline';
  description: string;
  baseBudget: number; // in Millions
  currentOffer: number; // in Millions
  typicalConcession: number; // percentage
  maxConcessionLimit: number; // percentage
  utilityFunction: string;
  strategy: string;
  negotiationsCount: number;
  agreementsRate: number; // percentage
  paretoEfficiency: number; // 0 to 1
  iconName: string;
  isCoordinator?: boolean;
  coordinatorSpecs?: {
    engine: string;
    invariants: string[];
    capacity: string;
  };
}

export class Agent {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly department: string;
  readonly priority: PriorityLevel;
  readonly status: 'activa' | 'en_espera' | 'aceptada' | 'offline';
  readonly description: string;
  readonly baseBudget: number;
  readonly currentOffer: number;
  readonly typicalConcession: number;
  readonly maxConcessionLimit: number;
  readonly utilityFunction: string;
  readonly strategy: string;
  readonly negotiationsCount: number;
  readonly agreementsRate: number;
  readonly paretoEfficiency: number;
  readonly iconName: string;
  readonly isCoordinator: boolean;
  readonly coordinatorSpecs?: {
    engine: string;
    invariants: string[];
    capacity: string;
  };

  constructor(attrs: AgentAttributes) {
    this.id = attrs.id;
    this.code = attrs.code;
    this.name = attrs.name;
    this.department = attrs.department;
    this.priority = attrs.priority;
    this.status = attrs.status;
    this.description = attrs.description;
    this.baseBudget = attrs.baseBudget;
    this.currentOffer = attrs.currentOffer;
    this.typicalConcession = attrs.typicalConcession;
    this.maxConcessionLimit = attrs.maxConcessionLimit;
    this.utilityFunction = attrs.utilityFunction;
    this.strategy = attrs.strategy;
    this.negotiationsCount = attrs.negotiationsCount;
    this.agreementsRate = attrs.agreementsRate;
    this.paretoEfficiency = attrs.paretoEfficiency;
    this.iconName = attrs.iconName;
    this.isCoordinator = !!attrs.isCoordinator;
    this.coordinatorSpecs = attrs.coordinatorSpecs;
  }

  get concessionAmount(): number {
    return +(this.baseBudget - this.currentOffer).toFixed(2);
  }

  get concessionPercentage(): number {
    if (this.baseBudget === 0) return 0;
    return +(((this.baseBudget - this.currentOffer) / this.baseBudget) * 100).toFixed(1);
  }
}
