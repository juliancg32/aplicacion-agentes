/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentAttributes } from '../../domain/entities/Agent';

export const mockAgentsData: AgentAttributes[] = [
  {
    id: 'agent-fin-01',
    code: 'FIN-CORP-01',
    name: 'Agente Finanzas',
    department: 'Finanzas y Control Tributario',
    priority: 'Alta',
    status: 'activa',
    description: 'Controlar la distribución y viabilidad presupuestal garantizando solvencia y cumplimiento tributario.',
    baseBudget: 25.0,
    currentOffer: 22.0,
    typicalConcession: 12.0,
    maxConcessionLimit: 20.0,
    utilityFunction: 'Convex Loss Function',
    strategy: 'Conservador / Solvencia Estricta',
    negotiationsCount: 24,
    agreementsRate: 88,
    paretoEfficiency: 0.94,
    iconName: 'account_balance'
  },
  {
    id: 'agent-tech-02',
    code: 'TECH-SYS-02',
    name: 'Agente Tecnología',
    department: 'Infraestructura Cloud & Data Centers',
    priority: 'Alta',
    status: 'activa',
    description: 'Infraestructura cloud, licencias SaaS críticas, seguridad informática y centros de datos.',
    baseBudget: 30.0,
    currentOffer: 28.0,
    typicalConcession: 6.6,
    maxConcessionLimit: 15.0,
    utilityFunction: 'Throughput / SLA Preservation',
    strategy: 'Tit-for-Tat Adaptativo',
    negotiationsCount: 28,
    agreementsRate: 92,
    paretoEfficiency: 0.91,
    iconName: 'memory'
  },
  {
    id: 'agent-mkt-03',
    code: 'MKT-GROWTH-03',
    name: 'Agente Marketing',
    department: 'Marketing Global y Crecimiento',
    priority: 'Media',
    status: 'en_espera',
    description: 'Financiar campañas globales, posicionamiento de marca y adquisición de clientes multicanal.',
    baseBudget: 25.0,
    currentOffer: 20.0,
    typicalConcession: 20.0,
    maxConcessionLimit: 25.0,
    utilityFunction: 'Maximización CAC/LTV',
    strategy: 'Flexible / Elasticidad de Demanda',
    negotiationsCount: 19,
    agreementsRate: 85,
    paretoEfficiency: 0.88,
    iconName: 'campaign'
  },
  {
    id: 'agent-hr-04',
    code: 'HR-TALENT-04',
    name: 'Recursos Humanos',
    department: 'Talento, Cultura y Capacitación',
    priority: 'Media',
    status: 'aceptada',
    description: 'Gestión de talento, programas de capacitación, bienestar corporativo y retención.',
    baseBudget: 20.0,
    currentOffer: 16.0,
    typicalConcession: 20.0,
    maxConcessionLimit: 25.0,
    utilityFunction: 'Bienestar / Headcount',
    strategy: 'Cooperativo',
    negotiationsCount: 21,
    agreementsRate: 90,
    paretoEfficiency: 0.93,
    iconName: 'groups'
  },
  {
    id: 'agent-ops-05',
    code: 'OPS-SUPPLY-05',
    name: 'Agente Operaciones',
    department: 'Operaciones & Logística de Suministro',
    priority: 'Alta',
    status: 'activa',
    description: 'Mantener y optimizar la cadena logística, almacenamiento, soporte y SLAs de entrega.',
    baseBudget: 20.0,
    currentOffer: 14.0,
    typicalConcession: 30.0,
    maxConcessionLimit: 35.0,
    utilityFunction: 'SLA Bound Optimization',
    strategy: 'Escalonado / Resiliencia Operativa',
    negotiationsCount: 26,
    agreementsRate: 89,
    paretoEfficiency: 0.89,
    iconName: 'precision_manufacturing'
  },
  {
    id: 'agent-coord-00',
    code: 'ORCH-NASH-00',
    name: 'Agente Coordinador',
    department: 'Orquestador Central y Mediador Nash',
    priority: 'Alta',
    status: 'activa',
    description: 'Supervisar el proceso FIPA-ACL, calcular la frontera eficiente de Pareto y sugerir equilibrios de Nash.',
    baseBudget: 0,
    currentOffer: 0,
    typicalConcession: 0,
    maxConcessionLimit: 0,
    utilityFunction: 'Social Welfare Function W = prod(u_i - d_i)',
    strategy: 'Nash Bargaining Solution v4.2',
    negotiationsCount: 142,
    agreementsRate: 99.8,
    paretoEfficiency: 0.99,
    iconName: 'psychology',
    isCoordinator: true,
    coordinatorSpecs: {
      engine: 'LLM Swarm v4.2 / Nash Bargaining Solution',
      invariants: [
        'No permitir déficit > 0 USD',
        'Validación criptográfica de firmas'
      ],
      capacity: '12 canales paralelos'
    }
  }
];
