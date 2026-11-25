/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { MockAgentRepository } from '../repositories/MockAgentRepository.js';
import { MockNegotiationRepository } from '../repositories/MockNegotiationRepository.js';
import { MockProposalRepository } from '../repositories/MockProposalRepository.js';
import { MockConsensusResolutionRepository } from '../repositories/MockConsensusResolutionRepository.js';
import { MockSystemConfigRepository } from '../repositories/MockSystemConfigRepository.js';
import { GetDashboardMetricsUseCase } from '../../application/use-cases/GetDashboardMetricsUseCase.js';
import { GetNegotiationsUseCase, GetNegotiationByIdUseCase, CreateNegotiationUseCase, AdvanceNegotiationRoundUseCase, AcceptAgreementUseCase, DeleteNegotiationUseCase } from '../../application/use-cases/NegotiationUseCases.js';
import { GetAgentsUseCase, UpdateAgentWeightsUseCase } from '../../application/use-cases/AgentUseCases.js';
import { GetProposalsUseCase, CreateProposalUseCase } from '../../application/use-cases/ProposalUseCases.js';
import { GetConsensusResolutionsUseCase, GetResolutionByIdUseCase } from '../../application/use-cases/ConsensusUseCases.js';
import { GetSystemConfigUseCase, UpdateSystemConfigUseCase } from '../../application/use-cases/SystemConfigUseCases.js';

class Container {
  readonly agentRepository = new MockAgentRepository();
  readonly negotiationRepository = new MockNegotiationRepository();
  readonly proposalRepository = new MockProposalRepository();
  readonly resolutionRepository = new MockConsensusResolutionRepository();
  readonly systemConfigRepository = new MockSystemConfigRepository();

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
