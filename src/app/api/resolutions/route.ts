/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { container } from '../../../infrastructure/di/container';

export async function GET() {
  try {
    const resolutions = await container.getConsensusResolutions.execute();
    return Response.json(
      {
        success: true,
        data: resolutions
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar resoluciones de consenso';
    return Response.json(
      {
        success: false,
        error: msg
      },
      { status: 500 }
    );
  }
}
