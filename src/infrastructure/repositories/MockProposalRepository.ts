/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Proposal } from '../../domain/entities/Proposal';
import { IProposalRepository, ProposalFilterOptions } from '../../domain/repositories/IProposalRepository';
import { mockProposalsData } from '../mocks/mockProposals';

export class MockProposalRepository implements IProposalRepository {
  private proposals: Proposal[];

  constructor() {
    this.proposals = mockProposalsData.map((attrs) => new Proposal(attrs));
  }

  async getAll(filter?: ProposalFilterOptions): Promise<Proposal[]> {
    let result = [...this.proposals];

    if (filter) {
      if (filter.negotiationId) {
        result = result.filter((p) => p.negotiationId === filter.negotiationId);
      }
      const senderId = filter.senderAgentId;
      if (senderId && senderId !== 'all') {
        result = result.filter((p) => p.senderAgentId === senderId || p.senderAgentCode.toLowerCase().includes(senderId.toLowerCase()));
      }
      const roundNum = filter.roundNumber;
      if (roundNum !== undefined) {
        result = result.filter((p) => p.roundNumber === roundNum);
      }
      const msgType = filter.messageType;
      if (msgType && msgType !== 'all') {
        result = result.filter((p) => p.messageType.toLowerCase() === msgType.toLowerCase());
      }
    }

    return result;
  }

  async getById(id: string): Promise<Proposal | null> {
    const found = this.proposals.find((p) => p.id === id);
    return found ? found : null;
  }

  async create(proposal: Proposal): Promise<Proposal> {
    this.proposals.unshift(proposal);
    return proposal;
  }
}
