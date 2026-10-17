/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Express, Request, Response } from 'express';
import { container } from './infrastructure/di/container.js';
import { Proposal } from './domain/entities/Proposal.js';
import { FipaMessageType } from './domain/value-objects/ProtocolType.js';

export function createApiApp(): Express {
  const app = express();
  app.use(express.json());

  // GET /api/dashboard
  app.get('/api/dashboard', async (_req: Request, res: Response) => {
    try {
      const metrics = await container.getDashboardMetrics.execute();
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al obtener métricas del dashboard';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/negotiations
  app.get('/api/negotiations', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const search = (req.query.search as string | undefined)?.toLowerCase();

      let list = await container.getNegotiations.execute();

      if (status && status !== 'all') {
        list = list.filter((n) => n.status === status);
      }

      if (search) {
        list = list.filter(
          (n) =>
            n.folio.toLowerCase().includes(search) ||
            n.title.toLowerCase().includes(search) ||
            n.description.toLowerCase().includes(search) ||
            n.category.toLowerCase().includes(search)
        );
      }

      res.status(200).json({ success: true, data: list });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar negociaciones';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // POST /api/negotiations
  app.post('/api/negotiations', async (req: Request, res: Response) => {
    try {
      const { title, description, totalBudgetLimit, currency, maxRounds, startDate, demands } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ success: false, error: 'El título de la negociación es obligatorio' });
        return;
      }

      if (typeof totalBudgetLimit !== 'number' || totalBudgetLimit <= 0) {
        res.status(400).json({ success: false, error: 'El límite presupuestal debe ser un número positivo mayor a 0' });
        return;
      }

      if (!currency || !['USD', 'EUR'].includes(currency)) {
        res.status(400).json({ success: false, error: 'La moneda debe ser USD o EUR' });
        return;
      }

      if (typeof maxRounds !== 'number' || maxRounds < 1 || maxRounds > 20) {
        res.status(400).json({ success: false, error: 'El número máximo de rondas debe estar entre 1 y 20' });
        return;
      }

      if (!Array.isArray(demands) || demands.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Debe incluir al menos un departamento/agente participante con su demanda'
        });
        return;
      }

      for (const d of demands) {
        if (!d.departmentId || !d.departmentName || typeof d.initialDemand !== 'number' || d.initialDemand <= 0) {
          res.status(400).json({
            success: false,
            error: `Datos de demanda inválidos para el departamento ${d.departmentName || d.departmentId}`
          });
          return;
        }
      }

      const created = await container.createNegotiation.execute({
        title: title.trim(),
        description: (description || '').trim(),
        totalBudgetLimit,
        currency,
        maxRounds,
        startDate: startDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        demands
      });

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al crear negociación';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/negotiations/:id
  app.get('/api/negotiations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const negotiation = await container.getNegotiationById.execute(id);

      if (!negotiation) {
        res.status(404).json({ success: false, error: `Negociación con ID '${id}' no encontrada` });
        return;
      }

      res.status(200).json({ success: true, data: negotiation });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar negociación';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // PATCH /api/negotiations/:id
  app.patch('/api/negotiations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { action } = req.body;

      if (!action || !['advance_round', 'accept_agreement'].includes(action)) {
        res.status(400).json({
          success: false,
          error: "Acción no válida. Se espera 'advance_round' o 'accept_agreement'"
        });
        return;
      }

      let updated;
      if (action === 'advance_round') {
        updated = await container.advanceNegotiationRound.execute(id);
      } else {
        updated = await container.acceptAgreement.execute(id);
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar negociación';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // DELETE /api/negotiations/:id
  app.delete('/api/negotiations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await container.deleteNegotiation.execute(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: `No se pudo eliminar la negociación con ID '${id}' porque no existe`
        });
        return;
      }

      res.status(200).json({ success: true, message: `Negociación '${id}' eliminada exitosamente` });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al eliminar negociación';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/agents
  app.get('/api/agents', async (_req: Request, res: Response) => {
    try {
      const agents = await container.getAgents.execute();
      res.status(200).json({ success: true, data: agents });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar agentes';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // PATCH & PUT /api/agents
  const handleUpdateAgents = async (req: Request, res: Response) => {
    try {
      const { finance, tech, operations } = req.body;

      if (finance !== undefined && (typeof finance !== 'number' || finance < 0 || finance > 1)) {
        res.status(400).json({ success: false, error: 'El peso de finanzas debe ser un número entre 0.0 y 1.0' });
        return;
      }

      if (tech !== undefined && (typeof tech !== 'number' || tech < 0 || tech > 1)) {
        res.status(400).json({ success: false, error: 'El peso de tecnología debe ser un número entre 0.0 y 1.0' });
        return;
      }

      if (operations !== undefined && (typeof operations !== 'number' || operations < 0 || operations > 1)) {
        res.status(400).json({ success: false, error: 'El peso de operaciones debe ser un número entre 0.0 y 1.0' });
        return;
      }

      const updated = await container.updateAgentWeights.execute({ finance, tech, operations });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar ponderaciones de agentes';
      res.status(500).json({ success: false, error: msg });
    }
  };

  app.patch('/api/agents', handleUpdateAgents);
  app.put('/api/agents', handleUpdateAgents);

  // GET /api/proposals
  app.get('/api/proposals', async (req: Request, res: Response) => {
    try {
      const roundNumberParam = req.query.roundNumber as string | undefined;
      const senderAgentId = req.query.senderAgentId as string | undefined;
      const messageType = req.query.messageType as string | undefined;
      const negotiationId = req.query.negotiationId as string | undefined;

      const filter: {
        roundNumber?: number;
        senderAgentId?: string;
        messageType?: string;
        negotiationId?: string;
      } = {};

      if (roundNumberParam && roundNumberParam !== 'all') {
        const parsed = parseInt(roundNumberParam, 10);
        if (!isNaN(parsed)) filter.roundNumber = parsed;
      }

      if (senderAgentId && senderAgentId !== 'all') filter.senderAgentId = senderAgentId;
      if (messageType && messageType !== 'all') filter.messageType = messageType;
      if (negotiationId && negotiationId !== 'all') filter.negotiationId = negotiationId;

      const proposals = await container.getProposals.execute(filter);
      res.status(200).json({ success: true, data: proposals });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar propuestas';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // POST /api/proposals
  app.post('/api/proposals', async (req: Request, res: Response) => {
    try {
      const {
        senderAgentName,
        senderAgentCode,
        statement,
        currentClaimAmount,
        offeredConcessionPercent,
        utilityValue,
        messageType,
        roundNumber,
        negotiationId
      } = req.body;

      if (!senderAgentName || !senderAgentCode) {
        res.status(400).json({ success: false, error: 'El nombre y código del agente emisor son obligatorios' });
        return;
      }

      if (!statement || typeof statement !== 'string' || statement.trim().length === 0) {
        res.status(400).json({ success: false, error: 'La declaración de la propuesta es obligatoria' });
        return;
      }

      if (typeof currentClaimAmount !== 'number' || currentClaimAmount <= 0) {
        res.status(400).json({ success: false, error: 'El monto solicitado debe ser un número positivo' });
        return;
      }

      const validPerformatives: FipaMessageType[] = ['PROPOSE', 'CFP', 'COUNTER', 'MEDIATE', 'ACCEPT', 'REJECT'];
      const pMessageType: FipaMessageType = validPerformatives.includes(messageType) ? messageType : 'PROPOSE';

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newCode = req.body.code || `#P-${randomSuffix}`;
      const hash =
        req.body.sha256Hash ||
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newProposal = new Proposal({
        id: `prop-${Date.now()}`,
        code: newCode,
        negotiationId: negotiationId || 'neg-2026-001',
        negotiationTitle: req.body.negotiationTitle || 'Distribución presupuestal 2026',
        roundNumber: typeof roundNumber === 'number' ? roundNumber : 2,
        senderAgentId: req.body.senderAgentId || `agent-${senderAgentCode.toLowerCase()}`,
        senderAgentName,
        senderAgentCode,
        messageType: pMessageType,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        turnNumber: req.body.turnNumber || 1,
        statement: statement.trim(),
        offeredConcessionAmount: typeof req.body.offeredConcessionAmount === 'number' ? req.body.offeredConcessionAmount : -1.0,
        offeredConcessionPercent: typeof offeredConcessionPercent === 'number' ? offeredConcessionPercent : -3.5,
        currentClaimAmount,
        utilityValue: typeof utilityValue === 'number' ? utilityValue : 0.9,
        operationalRisk: req.body.operationalRisk || 'Bajo',
        status: req.body.status || 'En Revisión',
        sha256Hash: hash,
        impactMetrics: req.body.impactMetrics || { 'Alineación Estratégica': '95%' }
      });

      const created = await container.createProposal.execute(newProposal);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al registrar propuesta';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/resolutions
  app.get('/api/resolutions', async (_req: Request, res: Response) => {
    try {
      const resolutions = await container.getConsensusResolutions.execute();
      res.status(200).json({ success: true, data: resolutions });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar resoluciones';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/resolutions/:id
  app.get('/api/resolutions/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resolution = await container.getResolutionById.execute(id);

      if (!resolution) {
        res.status(404).json({
          success: false,
          error: `Resolución con folio o identificador '${id}' no encontrada`
        });
        return;
      }

      res.status(200).json({ success: true, data: resolution });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar resolución';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/config
  app.get('/api/config', async (_req: Request, res: Response) => {
    try {
      const config = await container.getSystemConfig.execute();
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al consultar configuración';
      res.status(500).json({ success: false, error: msg });
    }
  });

  // PATCH & PUT /api/config
  const handleUpdateConfig = async (req: Request, res: Response) => {
    try {
      const {
        bargainingAlgorithm,
        maxRounds,
        divergenceTolerancePercent,
        minimumMandatoryConcessionUsd,
        autonomyLevel,
        earlyConflictWarning,
        sha256MandatorySignatures,
        corporateWebhookEnabled,
        immediateEmailAlerts,
        hardStopBudgetConstraint,
        llmInferenceModel
      } = req.body;

      if (bargainingAlgorithm && !['nash', 'kalai', 'proportional'].includes(bargainingAlgorithm)) {
        res.status(400).json({
          success: false,
          error: "Algoritmo inválido. Debe ser 'nash', 'kalai' o 'proportional'"
        });
        return;
      }

      if (maxRounds !== undefined && (typeof maxRounds !== 'number' || maxRounds < 1 || maxRounds > 30)) {
        res.status(400).json({ success: false, error: 'El número máximo de rondas debe estar entre 1 y 30' });
        return;
      }

      if (
        divergenceTolerancePercent !== undefined &&
        (typeof divergenceTolerancePercent !== 'number' ||
          divergenceTolerancePercent < 0 ||
          divergenceTolerancePercent > 1)
      ) {
        res.status(400).json({ success: false, error: 'La tolerancia de divergencia debe estar entre 0.0 y 1.0' });
        return;
      }

      const updated = await container.updateSystemConfig.execute({
        hardStopBudgetConstraint,
        bargainingAlgorithm,
        maxRounds,
        divergenceTolerancePercent,
        minimumMandatoryConcessionUsd,
        autonomyLevel,
        earlyConflictWarning,
        sha256MandatorySignatures,
        corporateWebhookEnabled,
        immediateEmailAlerts,
        llmInferenceModel
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar configuración';
      res.status(500).json({ success: false, error: msg });
    }
  };

  app.patch('/api/config', handleUpdateConfig);
  app.put('/api/config', handleUpdateConfig);

  return app;
}
