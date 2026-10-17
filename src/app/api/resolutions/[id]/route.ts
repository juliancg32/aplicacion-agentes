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
    const resolution = await container.getResolutionById.execute(id);

    if (!resolution) {
      return Response.json(
        {
          success: false,
          error: `Resolución con folio o identificador '${id}' no encontrada`
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: resolution
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar la resolución';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}
