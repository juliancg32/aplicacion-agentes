/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';

export async function GET() {
  try {
    const config = await container.getSystemConfig.execute();
    return Response.json(
      {
        success: true,
        data: config
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar la configuración del sistema';
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
          error: 'Cuerpo de solicitud JSON inválido'
        },
        { status: 400 }
      );
    }

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
    } = body;

    // Validation
    if (bargainingAlgorithm && !['nash', 'kalai', 'proportional'].includes(bargainingAlgorithm)) {
      return Response.json(
        {
          success: false,
          error: "Algoritmo de negociación inválido. Debe ser 'nash', 'kalai' o 'proportional'"
        },
        { status: 400 }
      );
    }

    if (maxRounds !== undefined && (typeof maxRounds !== 'number' || maxRounds < 1 || maxRounds > 30)) {
      return Response.json(
        {
          success: false,
          error: 'El número máximo de rondas debe estar entre 1 y 30'
        },
        { status: 400 }
      );
    }

    if (
      divergenceTolerancePercent !== undefined &&
      (typeof divergenceTolerancePercent !== 'number' ||
        divergenceTolerancePercent < 0 ||
        divergenceTolerancePercent > 1)
    ) {
      return Response.json(
        {
          success: false,
          error: 'La tolerancia de divergencia debe estar entre 0.0 y 1.0 (0% a 100%)'
        },
        { status: 400 }
      );
    }

    if (
      minimumMandatoryConcessionUsd !== undefined &&
      (typeof minimumMandatoryConcessionUsd !== 'number' || minimumMandatoryConcessionUsd < 0)
    ) {
      return Response.json(
        {
          success: false,
          error: 'La concesión mínima obligatoria debe ser un valor no negativo'
        },
        { status: 400 }
      );
    }

    if (autonomyLevel && !['human_veto', 'full_auto', 'advisor'].includes(autonomyLevel)) {
      return Response.json(
        {
          success: false,
          error: "Nivel de autonomía no válido. Debe ser 'human_veto', 'full_auto' o 'advisor'"
        },
        { status: 400 }
      );
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

    return Response.json(
      {
        success: true,
        data: updated
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al actualizar la configuración del sistema';
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
