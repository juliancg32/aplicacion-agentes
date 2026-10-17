/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';
import { Proposal } from '../../../domain/entities/Proposal';
import { FipaMessageType } from '../../../domain/value-objects/ProtocolType';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roundNumberParam = searchParams.get('roundNumber');
    const senderAgentId = searchParams.get('senderAgentId') || undefined;
    const messageType = searchParams.get('messageType') || undefined;
    const negotiationId = searchParams.get('negotiationId') || undefined;

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

    if (senderAgentId && senderAgentId !== 'all') {
      filter.senderAgentId = senderAgentId;
    }

    if (messageType && messageType !== 'all') {
      filter.messageType = messageType;
    }

    if (negotiationId && negotiationId !== 'all') {
      filter.negotiationId = negotiationId;
    }

    const proposals = await container.getProposals.execute(filter);

    return Response.json(
      {
        success: true,
        data: proposals
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar propuestas';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        {
          success: false,
          error: 'Cuerpo de solicitud inválido o no es formato JSON'
        },
        { status: 400 }
      );
    }

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
    } = body;

    // Validation
    if (!senderAgentName || !senderAgentCode) {
      return Response.json(
        {
          success: false,
          error: 'El nombre y código del agente emisor son obligatorios'
        },
        { status: 400 }
      );
    }

    if (!statement || typeof statement !== 'string' || statement.trim().length === 0) {
      return Response.json(
        {
          success: false,
          error: 'La declaración/argumentación de la propuesta es obligatoria'
        },
        { status: 400 }
      );
    }

    if (typeof currentClaimAmount !== 'number' || currentClaimAmount <= 0) {
      return Response.json(
        {
          success: false,
          error: 'El monto solicitado debe ser un número positivo'
        },
        { status: 400 }
      );
    }

    const validPerformatives: FipaMessageType[] = ['PROPOSE', 'CFP', 'COUNTER', 'MEDIATE', 'ACCEPT', 'REJECT'];
    const pMessageType: FipaMessageType = validPerformatives.includes(messageType) ? messageType : 'PROPOSE';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = body.code || `#P-${randomSuffix}`;
    const hash =
      body.sha256Hash ||
      Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newProposal = new Proposal({
      id: `prop-${Date.now()}`,
      code: newCode,
      negotiationId: negotiationId || 'neg-2026-001',
      negotiationTitle: body.negotiationTitle || 'Distribución presupuestal 2026',
      roundNumber: typeof roundNumber === 'number' ? roundNumber : 2,
      senderAgentId: body.senderAgentId || `agent-${senderAgentCode.toLowerCase()}`,
      senderAgentName,
      senderAgentCode,
      messageType: pMessageType,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      turnNumber: body.turnNumber || 1,
      statement: statement.trim(),
      offeredConcessionAmount: typeof body.offeredConcessionAmount === 'number' ? body.offeredConcessionAmount : -1.0,
      offeredConcessionPercent: typeof offeredConcessionPercent === 'number' ? offeredConcessionPercent : -3.5,
      currentClaimAmount,
      utilityValue: typeof utilityValue === 'number' ? utilityValue : 0.9,
      operationalRisk: body.operationalRisk || 'Bajo',
      status: body.status || 'En Revisión',
      sha256Hash: hash,
      impactMetrics: body.impactMetrics || { 'Alineación Estratégica': '95%' }
    });

    const created = await container.createProposal.execute(newProposal);

    return Response.json(
      {
        success: true,
        data: created
      },
      { status: 201 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al registrar la propuesta';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}
