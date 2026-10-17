/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';

export async function GET() {
  try {
    const metrics = await container.getDashboardMetrics.execute();
    return Response.json(
      {
        success: true,
        data: metrics
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener métricas del dashboard';
    return Response.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
