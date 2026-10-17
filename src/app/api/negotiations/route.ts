/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

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

    return Response.json(
      {
        success: true,
        data: list
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar negociaciones';
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

    const { title, description, totalBudgetLimit, currency, maxRounds, startDate, demands } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return Response.json(
        { success: false, error: 'El título de la negociación es obligatorio' },
        { status: 400 }
      );
    }

    if (typeof totalBudgetLimit !== 'number' || totalBudgetLimit <= 0) {
      return Response.json(
        { success: false, error: 'El límite presupuestal debe ser un número positivo mayor a 0' },
        { status: 400 }
      );
    }

    if (!currency || !['USD', 'EUR'].includes(currency)) {
      return Response.json(
        { success: false, error: 'La moneda debe ser USD o EUR' },
        { status: 400 }
      );
    }

    if (typeof maxRounds !== 'number' || maxRounds < 1 || maxRounds > 20) {
      return Response.json(
        { success: false, error: 'El número máximo de rondas debe estar entre 1 y 20' },
        { status: 400 }
      );
    }

    if (!Array.isArray(demands) || demands.length === 0) {
      return Response.json(
        { success: false, error: 'Debe incluir al menos un departamento/agente participante con su demanda' },
        { status: 400 }
      );
    }

    for (const d of demands) {
      if (!d.departmentId || !d.departmentName || typeof d.initialDemand !== 'number' || d.initialDemand <= 0) {
        return Response.json(
          {
            success: false,
            error: `Datos de demanda inválidos para el departamento ${d.departmentName || d.departmentId}`
          },
          { status: 400 }
        );
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

    return Response.json(
      {
        success: true,
        data: created
      },
      { status: 201 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al procesar la creación de la negociación';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}
