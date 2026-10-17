/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../../infrastructure/di/container';

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

async function extractId(context: RouteContext): Promise<string> {
  const p = await context.params;
  return p.id;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const id = await extractId(context);
    const negotiation = await container.getNegotiationById.execute(id);

    if (!negotiation) {
      return Response.json(
        {
          success: false,
          error: `Negociación con ID '${id}' no encontrada`
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: negotiation
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error interno al consultar la negociación';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const id = await extractId(context);
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        {
          success: false,
          error: 'Cuerpo de solicitud JSON inválido'
        },
        { status: 400 }
      );
    }

    const { action } = body;

    if (!action || !['advance_round', 'accept_agreement'].includes(action)) {
      return Response.json(
        {
          success: false,
          error: "Acción no válida. Se espera 'advance_round' o 'accept_agreement'"
        },
        { status: 400 }
      );
    }

    let updated;
    if (action === 'advance_round') {
      updated = await container.advanceNegotiationRound.execute(id);
    } else {
      updated = await container.acceptAgreement.execute(id);
    }

    return Response.json(
      {
        success: true,
        data: updated
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al actualizar estado de la negociación';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const id = await extractId(context);
    const deleted = await container.deleteNegotiation.execute(id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          error: `No se pudo eliminar la negociación con ID '${id}' porque no existe`
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `Negociación '${id}' eliminada exitosamente`
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al eliminar la negociación';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}
