/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';

export async function GET() {
  try {
    const agents = await container.getAgents.execute();
    return Response.json(
      {
        success: true,
        data: agents
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar agentes';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const { finance, tech, operations } = body;

    // Validate weights if provided
    if (finance !== undefined && (typeof finance !== 'number' || finance < 0 || finance > 1)) {
      return Response.json(
        {
          success: false,
          error: 'El peso de finanzas debe ser un valor numérico entre 0.0 y 1.0'
        },
        { status: 400 }
      );
    }

    if (tech !== undefined && (typeof tech !== 'number' || tech < 0 || tech > 1)) {
      return Response.json(
        {
          success: false,
          error: 'El peso de tecnología debe ser un valor numérico entre 0.0 y 1.0'
        },
        { status: 400 }
      );
    }

    if (operations !== undefined && (typeof operations !== 'number' || operations < 0 || operations > 1)) {
      return Response.json(
        {
          success: false,
          error: 'El peso de operaciones debe ser un valor numérico entre 0.0 y 1.0'
        },
        { status: 400 }
      );
    }

    const updated = await container.updateAgentWeights.execute({
      finance,
      tech,
      operations
    });

    return Response.json(
      {
        success: true,
        data: updated
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al actualizar ponderaciones de agentes';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return PATCH(request);
}
