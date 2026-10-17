/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Negotiation } from '../../domain/entities/Negotiation';
import { INegotiationRepository } from '../../domain/repositories/INegotiationRepository';
import { mockNegotiationsData } from '../mocks/mockNegotiations';

export class MockNegotiationRepository implements INegotiationRepository {
  private negotiations: Negotiation[];

  constructor() {
    this.negotiations = mockNegotiationsData.map((attrs) => new Negotiation(attrs));
  }

  async getAll(): Promise<Negotiation[]> {
    return [...this.negotiations];
  }

  async getById(id: string): Promise<Negotiation | null> {
    const found = this.negotiations.find((n) => n.id === id);
    return found ? found : null;
  }

  async getByFolio(folio: string): Promise<Negotiation | null> {
    const found = this.negotiations.find((n) => n.folio === folio);
    return found ? found : null;
  }

  async create(negotiation: Negotiation): Promise<Negotiation> {
    this.negotiations.unshift(negotiation);
    return negotiation;
  }

  async update(negotiation: Negotiation): Promise<Negotiation> {
    const idx = this.negotiations.findIndex((n) => n.id === negotiation.id);
    if (idx !== -1) {
      this.negotiations[idx] = negotiation;
    }
    return negotiation;
  }

  async advanceRound(negotiationId: string): Promise<Negotiation> {
    const idx = this.negotiations.findIndex((n) => n.id === negotiationId);
    if (idx === -1) throw new Error('Negotiation not found');

    const current = this.negotiations[idx];
    const nextRound = Math.min(current.currentRound + 1, current.maxRounds);
    
    // Simulate smart convergence
    const updated = new Negotiation({
      ...current,
      currentRound: nextRound,
      lastActivity: 'Ahora',
      convergenceRate: Math.min(100, current.convergenceRate + 8),
      totalCurrentRequested: current.totalBudgetLimit // reaches Nash equilibrium
    });

    this.negotiations[idx] = updated;
    return updated;
  }

  async acceptAgreement(negotiationId: string): Promise<Negotiation> {
    const idx = this.negotiations.findIndex((n) => n.id === negotiationId);
    if (idx === -1) throw new Error('Negotiation not found');

    const current = this.negotiations[idx];
    const updated = new Negotiation({
      ...current,
      status: 'finalizada_acuerdo',
      statusLabel: 'Acuerdo Aprobado',
      lastActivity: 'Acuerdo sellado',
      convergenceRate: 100,
      totalCurrentRequested: current.totalBudgetLimit
    });

    this.negotiations[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.negotiations.length;
    this.negotiations = this.negotiations.filter((n) => n.id !== id);
    return this.negotiations.length < initialLen;
  }
}
