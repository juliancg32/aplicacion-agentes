/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Proposal } from '../../domain/entities/Proposal';
import { IProposalRepository, ProposalFilterOptions } from '../../domain/repositories/IProposalRepository';

export class GetProposalsUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(filter?: ProposalFilterOptions): Promise<Proposal[]> {
    return this.proposalRepository.getAll(filter);
  }
}

export class CreateProposalUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(proposal: Proposal): Promise<Proposal> {
    return this.proposalRepository.create(proposal);
  }
}
