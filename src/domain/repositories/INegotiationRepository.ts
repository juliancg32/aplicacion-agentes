/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Negotiation } from '../entities/Negotiation';

export interface INegotiationRepository {
  getAll(): Promise<Negotiation[]>;
  getById(id: string): Promise<Negotiation | null>;
  getByFolio(folio: string): Promise<Negotiation | null>;
  create(negotiation: Negotiation): Promise<Negotiation>;
  update(negotiation: Negotiation): Promise<Negotiation>;
  advanceRound(negotiationId: string): Promise<Negotiation>;
  acceptAgreement(negotiationId: string): Promise<Negotiation>;
  delete(id: string): Promise<boolean>;
}
