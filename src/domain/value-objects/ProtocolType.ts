/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FipaMessageType = 'PROPOSE' | 'CFP' | 'COUNTER' | 'MEDIATE' | 'ACCEPT' | 'REJECT';

export type NegotiationStatus = 'en_curso' | 'esperando_aprobacion' | 'finalizada_acuerdo' | 'cancelada';

export type AgentRole = 'departamental' | 'coordinador';

export type PriorityLevel = 'Alta' | 'Media' | 'Baja' | 'Crítica';
