/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsensusResolutionAttributes } from '../../domain/entities/ConsensusResolution';

export const mockResolutionsData: ConsensusResolutionAttributes[] = [
  {
    id: 'res-2026-001',
    folio: '#NEG-2026-001',
    title: 'Distribución presupuestal 2026',
    category: 'Gobernanza Corporativa',
    closedDate: '30/09/2026',
    budgetLimit: 100.0,
    initialRequested: 120.0,
    finalAssigned: 100.0,
    algorithmicSavings: 20.0,
    savingsPercentage: 16.7,
    totalRounds: 3,
    elapsedTime: '8m 42s',
    participatingAgents: ['Finanzas', 'Marketing', 'Tecnología', 'RRHH', 'Operaciones'],
    consensusStatus: 'Acuerdo Aprobado / Nash',
    protocolVersion: 'Protocolo Pareto-Optimal v3',
    executiveSummary: 'El proceso de asignación presupuestal anual concluyó con éxito bajo el equilibrio Nash. El límite corporativo de $100.0M fue respetado íntegramente tras absorber las demandas iniciales de $120.0M. La mayor concesión fue provista por Marketing y Operaciones tras optimizaciones de sinergias multi-agente en infraestructura compartida de IA.',
    smartContractHash: '0x7F9a21B341cE29a4b882190c1283e74b9981290e',
    blockTimestamp: '2026-09-30T14:32:11.890Z',
    details: [
      { department: 'Tecnología (Core Cloud & IA)', initialDemand: '$42.0M', finalAssigned: '$37.0M', adjustment: '-$5.0M', finalUtility: '94.2%' },
      { department: 'Marketing & Crecimiento', initialDemand: '$30.0M', finalAssigned: '$24.0M', adjustment: '-$6.0M', finalUtility: '89.8%' },
      { department: 'Operaciones & Logística', initialDemand: '$26.0M', finalAssigned: '$21.0M', adjustment: '-$5.0M', finalUtility: '91.0%' },
      { department: 'Capital Humano & Cultura', initialDemand: '$14.0M', finalAssigned: '$12.0M', adjustment: '-$2.0M', finalUtility: '96.5%' },
      { department: 'Finanzas & Cumplimiento', initialDemand: '$8.0M', finalAssigned: '$6.0M', adjustment: '-$2.0M', finalUtility: '98.0%' }
    ]
  },
  {
    id: 'res-2025-084',
    folio: '#NEG-2025-084',
    title: 'Presupuesto Extraordinario Ciberseguridad Q4',
    category: 'Infraestructura Crítica',
    closedDate: '15/12/2025',
    budgetLimit: 15.0,
    initialRequested: 18.5,
    finalAssigned: 15.0,
    algorithmicSavings: 3.5,
    savingsPercentage: 18.9,
    totalRounds: 2,
    elapsedTime: '4m 10s',
    participatingAgents: ['Finanzas', 'Tecnología', 'Legal'],
    consensusStatus: 'Acuerdo Exitoso',
    protocolVersion: 'Auditoría Criptográfica SOC2 • Protocolo Fast-Track',
    executiveSummary: 'Asignación de emergencia completada con 2 rondas de iteración. El comité de ciberseguridad redujo requerimientos de hardware on-premise migrando licencias a modelo SaaS elástico, logrando un ahorro inmediato de $3.5M sin comprometer resiliencia.',
    smartContractHash: '0x3E8B190284719283749182739487192837491827',
    blockTimestamp: '2025-12-15T18:44:02.102Z',
    details: [
      { department: 'SecOps & Red Team', initialDemand: '$9.0M', finalAssigned: '$7.5M', adjustment: '-$1.5M', finalUtility: '95.0%' },
      { department: 'Compliance & Audits', initialDemand: '$5.5M', finalAssigned: '$4.5M', adjustment: '-$1.0M', finalUtility: '92.4%' },
      { department: 'Infraestructura Resiliente', initialDemand: '$4.0M', finalAssigned: '$3.0M', adjustment: '-$1.0M', finalUtility: '90.1%' }
    ]
  },
  {
    id: 'res-2025-071',
    folio: '#NEG-2025-071',
    title: 'Renovación Infraestructura Servidores Cloud',
    category: 'Contrataciones Core',
    closedDate: '10/11/2025',
    budgetLimit: 40.0,
    initialRequested: 46.0,
    finalAssigned: 40.0,
    algorithmicSavings: 6.0,
    savingsPercentage: 13.0,
    totalRounds: 4,
    elapsedTime: '12m 04s',
    participatingAgents: ['Finanzas', 'Tecnología', 'Operaciones'],
    consensusStatus: 'Acuerdo Exitoso',
    protocolVersion: 'Subasta Inversa Multiagente',
    executiveSummary: 'Negociación compleja de 4 rondas con proveedores de hiper-escala. El agente de Compras negoció instancias reservadas a 3 años reduciendo el gasto de $46.0M al tope institucional estricto de $40.0M, maximizando créditos por cómputo de GPU.',
    smartContractHash: '0x992B104829104829104829104829104829104829',
    blockTimestamp: '2025-11-10T11:20:19.450Z',
    details: [
      { department: 'Clusters IA y GPU Compute', initialDemand: '$22.0M', finalAssigned: '$19.0M', adjustment: '-$3.0M', finalUtility: '93.5%' },
      { department: 'Storage y Archivo Frío', initialDemand: '$12.0M', finalAssigned: '$10.5M', adjustment: '-$1.5M', finalUtility: '88.0%' },
      { department: 'Networking y Enlaces Tier-1', initialDemand: '$12.0M', finalAssigned: '$10.5M', adjustment: '-$1.5M', finalUtility: '91.2%' }
    ]
  },
  {
    id: 'res-2025-060',
    folio: '#NEG-2025-060',
    title: 'Presupuesto Campaña Black Friday & Expansión',
    category: 'Crecimiento Comercial',
    closedDate: '02/10/2025',
    budgetLimit: 25.0,
    initialRequested: 32.0,
    finalAssigned: 25.0,
    algorithmicSavings: 7.0,
    savingsPercentage: 21.8,
    totalRounds: 3,
    elapsedTime: '6m 50s',
    participatingAgents: ['Finanzas', 'Marketing', 'Ventas'],
    consensusStatus: 'Acuerdo Exitoso',
    protocolVersion: 'Protocolo Bayesian Search',
    executiveSummary: 'Optimización de ROI en pauta digital logrando un 21.8% de ahorro contra el requerimiento inicial gracias a la reasignación dinámica por performance modelado por agentes de Growth y Analytics.',
    smartContractHash: '0x7182938471928374918273948719283749182739',
    blockTimestamp: '2025-10-02T16:05:44.210Z',
    details: [
      { department: 'Publicidad Programática', initialDemand: '$16.0M', finalAssigned: '$12.5M', adjustment: '-$3.5M', finalUtility: '91.0%' },
      { department: 'Promociones y Descuentos', initialDemand: '$10.0M', finalAssigned: '$8.0M', adjustment: '-$2.0M', finalUtility: '94.0%' },
      { department: 'Logística de Despacho Rápido', initialDemand: '$6.0M', finalAssigned: '$4.5M', adjustment: '-$1.5M', finalUtility: '87.5%' }
    ]
  },
  {
    id: 'res-2025-045',
    folio: '#NEG-2025-045',
    title: 'Reestructuración y Retención de Talento Tech',
    category: 'Capital Humano',
    closedDate: '14/08/2025',
    budgetLimit: 18.0,
    initialRequested: 22.0,
    finalAssigned: 18.0,
    algorithmicSavings: 4.0,
    savingsPercentage: 18.1,
    totalRounds: 3,
    elapsedTime: '5m 32s',
    participatingAgents: ['Finanzas', 'RRHH', 'Tecnología'],
    consensusStatus: 'Acuerdo Exitoso',
    protocolVersion: 'Planes de Equity y Retención de Investigadores',
    executiveSummary: 'Consolidación de incentivos basados en hitos. Las demandas iniciales de $22M fueron ajustadas a $18M mediante esquemas de compensación diferida y bonos atados al despliegue de modelos fundacionales.',
    smartContractHash: '0x4482910482910482910482910482910482910482',
    blockTimestamp: '2025-08-14T09:12:30.880Z',
    details: [
      { department: 'Investigación & Algoritmia', initialDemand: '$11.0M', finalAssigned: '$9.0M', adjustment: '-$2.0M', finalUtility: '97.0%' },
      { department: 'Ingeniería de Sistemas Distribuidos', initialDemand: '$7.0M', finalAssigned: '$6.0M', adjustment: '-$1.0M', finalUtility: '93.5%' },
      { department: 'Operaciones de Talento', initialDemand: '$4.0M', finalAssigned: '$3.0M', adjustment: '-$1.0M', finalUtility: '89.0%' }
    ]
  }
];
