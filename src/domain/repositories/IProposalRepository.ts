/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Proposal } from '../entities/Proposal';

export interface ProposalFilterOptions {
  negotiationId?: string;
  senderAgentId?: string;
  roundNumber?: number;
  messageType?: string;
  status?: string;
}

export interface IProposalRepository {
  getAll(filter?: ProposalFilterOptions): Promise<Proposal[]>;
  getById(id: string): Promise<Proposal | null>;
  create(proposal: Proposal): Promise<Proposal>;
}
