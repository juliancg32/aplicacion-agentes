  /**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';

// Datos en memoria para que la demo funcione en Vercel sin depender de
// módulos de repositorio que requieren un proceso persistente.
const negotiations = [
  { id: 'neg-2026-001', folio: 'NEG-2026-001', title: 'Distribución presupuestal 2026', description: 'Acuerdo entre Finanzas, Tecnología y Operaciones', category: 'Presupuesto', status: 'En negociación', totalBudgetLimit: 250000, currency: 'USD', currentRound: 2, maxRounds: 5, departments: ['Finanzas', 'Tecnología', 'Operaciones'] },
  { id: 'neg-2026-002', folio: 'NEG-2026-002', title: 'Renovación de infraestructura', description: 'Renovación de servidores y licencias', category: 'Infraestructura', status: 'Pendiente', totalBudgetLimit: 120000, currency: 'USD', currentRound: 1, maxRounds: 4, departments: ['Finanzas', 'Tecnología'] },
  { id: 'neg-2026-003', folio: 'NEG-2026-003', title: 'Plan de continuidad operativa', description: 'Inversión para continuidad del servicio', category: 'Operaciones', status: 'Acuerdo alcanzado', totalBudgetLimit: 80000, currency: 'USD', currentRound: 3, maxRounds: 5, departments: ['Finanzas', 'Operaciones'] }
];
const agents = [
  { id: 'agent-finance', name: 'Agente de Finanzas', code: 'FIN', department: 'Finanzas', status: 'Activo', weight: 0.4 },
  { id: 'agent-tech', name: 'Agente de Tecnología', code: 'TEC', department: 'Tecnología', status: 'Activo', weight: 0.3 },
  { id: 'agent-operations', name: 'Agente de Operaciones', code: 'OPS', department: 'Operaciones', status: 'Activo', weight: 0.3 }
];
const proposals: any[] = [];
let config: Record<string, any> = { bargainingAlgorithm: 'nash', maxRounds: 5, divergenceTolerancePercent: 0.1, autonomyLevel: 'supervisada', earlyConflictWarning: true, sha256MandatorySignatures: false, hardStopBudgetConstraint: true, llmInferenceModel: 'demo' };
const app = express();
app.use(express.json());
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'OPTIONS') return res.sendStatus(204); next(); });
app.get('/api/dashboard', (_req, res) => res.json({ success: true, data: { totalNegotiations: negotiations.length, activeNegotiations: negotiations.filter(n => n.status === 'En negociación').length, agreementsReached: negotiations.filter(n => n.status === 'Acuerdo alcanzado').length, totalBudget: negotiations.reduce((sum, n) => sum + n.totalBudgetLimit, 0), agentsActive: agents.length, proposalsCount: proposals.length, negotiationCount: negotiations.length } }));
app.get('/api/negotiations', (req, res) => { const status = String(req.query.status || 'all'); const search = String(req.query.search || '').toLowerCase(); const data = negotiations.filter(n => (status === 'all' || n.status === status) && (!search || [n.folio, n.title, n.description, n.category].some(v => v.toLowerCase().includes(search)))); res.json({ success: true, data }); });
app.post('/api/negotiations', (req, res) => { const { title, description = '', totalBudgetLimit, currency = 'USD', maxRounds = 5, demands = [] } = req.body || {}; if (!title || typeof totalBudgetLimit !== 'number' || totalBudgetLimit <= 0) return res.status(400).json({ success: false, error: 'El título y un presupuesto positivo son obligatorios' }); const id = 'neg-' + Date.now(); const item = { id, folio: id.toUpperCase(), title: String(title).trim(), description: String(description), category: 'General', status: 'Pendiente', totalBudgetLimit, currency, currentRound: 1, maxRounds, demands, departments: demands.map((d: any) => d.departmentName).filter(Boolean) }; negotiations.unshift(item); res.status(201).json({ success: true, data: item }); });
app.get('/api/negotiations/:id', (req, res) => { const item = negotiations.find(n => n.id === req.params.id || n.folio === req.params.id); return item ? res.json({ success: true, data: item }) : res.status(404).json({ success: false, error: 'Negociación no encontrada' }); });
app.patch('/api/negotiations/:id', (req, res) => { const item = negotiations.find(n => n.id === req.params.id); if (!item) return res.status(404).json({ success: false, error: 'Negociación no encontrada' }); if (req.body?.action === 'advance_round') item.currentRound = Math.min(item.currentRound + 1, item.maxRounds); if (req.body?.action === 'accept_agreement') item.status = 'Acuerdo alcanzado'; res.json({ success: true, data: item }); });
app.delete('/api/negotiations/:id', (req, res) => { const index = negotiations.findIndex(n => n.id === req.params.id); if (index < 0) return res.status(404).json({ success: false, error: 'Negociación no encontrada' }); negotiations.splice(index, 1); res.json({ success: true, message: 'Negociación eliminada' }); });
app.get('/api/agents', (_req, res) => res.json({ success: true, data: agents }));
app.patch('/api/agents', (req, res) => { for (const agent of agents) { const key = agent.code === 'FIN' ? 'finance' : agent.code === 'TEC' ? 'tech' : 'operations'; if (typeof req.body?.[key] === 'number') agent.weight = req.body[key]; } res.json({ success: true, data: agents }); });
app.put('/api/agents', (req, res) => { for (const agent of agents) { const key = agent.code === 'FIN' ? 'finance' : agent.code === 'TEC' ? 'tech' : 'operations'; if (typeof req.body?.[key] === 'number') agent.weight = req.body[key]; } res.json({ success: true, data: agents }); });
app.get('/api/proposals', (req, res) => { const data = proposals.filter(p => (!req.query.negotiationId || p.negotiationId === req.query.negotiationId) && (!req.query.senderAgentId || p.senderAgentId === req.query.senderAgentId)); res.json({ success: true, data }); });
app.post('/api/proposals', (req, res) => { const item = { id: 'prop-' + Date.now(), timestamp: new Date().toISOString(), status: 'En Revisión', ...req.body }; proposals.unshift(item); res.status(201).json({ success: true, data: item }); });
app.get('/api/resolutions', (_req, res) => res.json({ success: true, data: negotiations.filter(n => n.status === 'Acuerdo alcanzado').map(n => ({ id: 'res-' + n.id, folio: n.folio, negotiationId: n.id, title: n.title, status: 'Aprobada', totalBudgetLimit: n.totalBudgetLimit })) }));
app.get('/api/resolutions/:id', (req, res) => { const n = negotiations.find(x => x.id === req.params.id || x.folio === req.params.id); return n && n.status === 'Acuerdo alcanzado' ? res.json({ success: true, data: { id: 'res-' + n.id, folio: n.folio, negotiationId: n.id, title: n.title, status: 'Aprobada', totalBudgetLimit: n.totalBudgetLimit } }) : res.status(404).json({ success: false, error: 'Resolución no encontrada' }); });
app.get('/api/config', (_req, res) => res.json({ success: true, data: config }));
app.patch('/api/config', (req, res) => { config = { ...config, ...req.body }; res.json({ success: true, data: config }); });
app.put('/api/config', (req, res) => { config = { ...config, ...req.body }; res.json({ success: true, data: config }); });
export function createApiApp() { return app; }
