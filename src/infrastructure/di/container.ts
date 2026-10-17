/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MockAgentRepository } from '../repositories/MockAgentRepository';
import { MockNegotiationRepository } from '../repositories/MockNegotiationRepository';
import { MockProposalRepository } from '../repositories/MockProposalRepository';
import { MockConsensusResolutionRepository } from '../repositories/MockConsensusResolutionRepository';
import { MockSystemConfigRepository } from '../repositories/MockSystemConfigRepository';

import { GetDashboardMetricsUseCase } from '../../application/use-cases/GetDashboardMetricsUseCase';
import {
  GetNegotiationsUseCase,
  GetNegotiationByIdUseCase,
  CreateNegotiationUseCase,
  AdvanceNegotiationRoundUseCase,
  AcceptAgreementUseCase,
  DeleteNegotiationUseCase
} from '../../application/use-cases/NegotiationUseCases';
import { GetAgentsUseCase, UpdateAgentWeightsUseCase } from '../../application/use-cases/AgentUseCases';
import { GetProposalsUseCase, CreateProposalUseCase } from '../../application/use-cases/ProposalUseCases';
import { GetConsensusResolutionsUseCase, GetResolutionByIdUseCase } from '../../application/use-cases/ConsensusUseCases';
import { GetSystemConfigUseCase, UpdateSystemConfigUseCase } from '../../application/use-cases/SystemConfigUseCases';

class Container {
  // Repositories
  readonly agentRepository = new MockAgentRepository();
  readonly negotiationRepository = new MockNegotiationRepository();
  readonly proposalRepository = new MockProposalRepository();
  readonly resolutionRepository = new MockConsensusResolutionRepository();
  readonly systemConfigRepository = new MockSystemConfigRepository();

  // Use Cases
  readonly getDashboardMetrics = new GetDashboardMetricsUseCase(this.negotiationRepository);
  readonly getNegotiations = new GetNegotiationsUseCase(this.negotiationRepository);
  readonly getNegotiationById = new GetNegotiationByIdUseCase(this.negotiationRepository);
  readonly createNegotiation = new CreateNegotiationUseCase(this.negotiationRepository);
  readonly advanceNegotiationRound = new AdvanceNegotiationRoundUseCase(this.negotiationRepository);
  readonly acceptAgreement = new AcceptAgreementUseCase(this.negotiationRepository);
  readonly deleteNegotiation = new DeleteNegotiationUseCase(this.negotiationRepository);

  readonly getAgents = new GetAgentsUseCase(this.agentRepository);
  readonly updateAgentWeights = new UpdateAgentWeightsUseCase(this.agentRepository);

  readonly getProposals = new GetProposalsUseCase(this.proposalRepository);
  readonly createProposal = new CreateProposalUseCase(this.proposalRepository);

  readonly getConsensusResolutions = new GetConsensusResolutionsUseCase(this.resolutionRepository);
  readonly getResolutionById = new GetResolutionByIdUseCase(this.resolutionRepository);

  readonly getSystemConfig = new GetSystemConfigUseCase(this.systemConfigRepository);
  readonly updateSystemConfig = new UpdateSystemConfigUseCase(this.systemConfigRepository);
}

export const container = new Container();
