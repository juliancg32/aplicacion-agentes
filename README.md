# MultiAgent Negotiation - Consenso Presupuestal Autónomo
## API RESTful & Clean Architecture Documentation

Plataforma corporativa de consenso presupuestal y orquestación multiagente mediante teoría de juegos cooperativa (Equilibrio de Nash, Solución Kalai-Smorodinsky, Óptimo de Pareto) y trazabilidad inmutable mediante firmas criptográficas SHA-256.

---

## 1. Arquitectura del Sistema

La aplicación está construida siguiendo **Clean Architecture**, principios **SOLID** y separación estricta de responsabilidades:

```text
┌────────────────────────────────────────────────────────┐
│             PRESENTATION / UI LAYER                    │
│  React Components · Tailwind CSS · Stitch Design       │
│  Hooks (useState, useEffect, Promise.all)              │
└──────────────────────────┬─────────────────────────────┘
                           │ fetch()
                           ▼
┌────────────────────────────────────────────────────────┐
│           REST API / ROUTE HANDLERS LAYER              │
│  Next.js App Router (src/app/api/*)                    │
│  Full-stack Express Adapter (server.ts)                │
│  JSON Validation · Status 200/201/400/404/500          │
└──────────────────────────┬─────────────────────────────┘
                           │ Call Use Case
                           ▼
┌────────────────────────────────────────────────────────┐
│             APPLICATION LAYER (Use Cases)              │
│  GetDashboardMetrics · CreateNegotiation ·             │
│  AdvanceRound · AcceptAgreement · UpdateAgentWeights · │
│  CreateProposal · NashBargainingService · AuditService │
└──────────────────────────┬─────────────────────────────┘
                           │ Depends on Interfaces
                           ▼
┌────────────────────────────────────────────────────────┐
│               DOMAIN LAYER (Entities & VOs)            │
│  Agent · Negotiation · Proposal · ConsensusResolution  │
│  SystemConfig · Money · ProtocolType · Interfaces      │
└──────────────────────────┬─────────────────────────────┘
                           │ Implemented by
                           ▼
┌────────────────────────────────────────────────────────┐
│            INFRASTRUCTURE LAYER (Data Sources)         │
│  MockAgentRepository · MockNegotiationRepository ·     │
│  MockProposalRepository · MockResolutionRepository     │
└────────────────────────────────────────────────────────┘
```

El frontend **nunca consume directamente los repositorios ni la infraestructura**. Todas las operaciones fluyen a través de peticiones HTTP `fetch()` a la API RESTful.

---

## 2. Formato Estándar de Respuesta HTTP

Todas las respuestas de la API siguen una estructura JSON predecible:

### Respuesta Exitosa (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta de Error (`400 Bad Request` / `404 Not Found` / `500 Internal Server Error`):
```json
{
  "success": false,
  "error": "Descripción clara del motivo del error"
}
```

---

## 3. Catálogo Detallado de Endpoints RESTful

### 3.1. Dashboard

#### `GET /api/dashboard`
Obtiene las métricas ejecutivas consolidadas del sistema.
- **Método**: `GET`
- **Autenticación**: Sesión de analista / SSO
- **Parámetros**: Ninguno
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "activeNegotiationsCount": 3,
    "completedNegotiationsCount": 14,
    "totalAmountConsensusMillions": 164.2,
    "avgParetoEfficiency": 94.2,
    "avgSavingsPercentage": 18.5
  }
}
```
- **Posibles Errores**:
  - `500`: Error interno al calcular métricas.

---

### 3.2. Negociaciones

#### `GET /api/negotiations`
Lista todas las negociaciones presupuestales del portafolio, con capacidad de filtrado y búsqueda.
- **Método**: `GET`
- **Query Params**:
  - `status` *(opcional)*: `'en_curso' | 'esperando_aprobacion' | 'finalizada_acuerdo' | 'all'`
  - `search` *(opcional)*: Término de búsqueda (folio, título, descripción, categoría).
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "neg-2026-001",
      "folio": "#NEG-2026-F4",
      "title": "Distribución presupuestal 2026",
      "status": "en_curso",
      "statusLabel": "En Negociación",
      "currentRound": 2,
      "maxRounds": 5,
      "totalBudgetLimit": 100.0,
      "totalCurrentRequested": 100.0,
      "convergenceRate": 92
    }
  ]
}
```

#### `POST /api/negotiations`
Registra una nueva negociación presupuestal multiparte con sus demandas departamentales iniciales.
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body Requerido**:
```json
{
  "title": "Distribución Tecnológica Q3",
  "description": "Asignación para clusters de cómputo GPU y modelos IA",
  "totalBudgetLimit": 120.0,
  "currency": "USD",
  "maxRounds": 5,
  "startDate": "14 de Octubre, 2026",
  "demands": [
    {
      "departmentId": "finanzas",
      "departmentName": "Finanzas",
      "agentCode": "FIN-CORP-01",
      "initialDemand": 40.0,
      "priority": "Alta"
    },
    {
      "departmentId": "tecnologia",
      "departmentName": "Tecnología",
      "agentCode": "TECH-AI-02",
      "initialDemand": 50.0,
      "priority": "Alta"
    }
  ]
}
```
- **Validaciones**:
  - `title`: obligatorio, tipo string no vacío.
  - `totalBudgetLimit`: número > 0.
  - `currency`: `'USD'` o `'EUR'`.
  - `maxRounds`: entero entre 1 y 20.
  - `demands`: arreglo no vacío de demandas con montos positivos.
- **Respuesta Exitosa (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "neg-1728892019",
    "folio": "#NEG-2026-782",
    "title": "Distribución Tecnológica Q3",
    "status": "en_curso",
    "totalBudgetLimit": 120.0
  }
}
```
- **Posibles Errores**:
  - `400`: Datos de entrada inválidos o faltantes.
  - `500`: Error en el procesamiento del caso de uso.

#### `GET /api/negotiations/[id]`
Obtiene el detalle completo de una negociación específica por su ID.
- **Método**: `GET`
- **Parámetro URL**: `id` (identificador de la negociación)
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "neg-2026-001",
    "folio": "#NEG-2026-F4",
    "title": "Distribución presupuestal 2026",
    "demands": [ ... ]
  }
}
```
- **Posibles Errores**:
  - `404`: Negociación no encontrada.

#### `PATCH /api/negotiations/[id]`
Ejecuta una acción transaccional sobre el estado de la negociación: avanzar ronda o aceptar acuerdo.
- **Método**: `PATCH`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "action": "advance_round"
}
```
*O para formalizar acuerdo:*
```json
{
  "action": "accept_agreement"
}
```
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "neg-2026-001",
    "currentRound": 3,
    "status": "en_curso"
  }
}
```
- **Posibles Errores**:
  - `400`: Acción no válida (distinta de `advance_round` o `accept_agreement`).
  - `404`: Negociación no encontrada.

#### `DELETE /api/negotiations/[id]`
Elimina o cancela una negociación del repositorio.
- **Método**: `DELETE`
- **Parámetro URL**: `id`
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Negociación 'neg-2026-001' eliminada exitosamente"
}
```
- **Posibles Errores**:
  - `404`: No existe la negociación indicada.

---

### 3.3. Agentes Autónomos

#### `GET /api/agents`
Lista todos los agentes autónomos con sus pesos en la función de utilidad y cuotas asignadas.
- **Método**: `GET`
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "agent-fin-01",
      "code": "FIN-CORP-01",
      "name": "Agente Finanzas",
      "department": "Finanzas",
      "weight": 0.35,
      "priority": "Alta",
      "status": "active"
    }
  ]
}
```

#### `PATCH` / `PUT /api/agents`
Calibra las ponderaciones marginales ($\lambda_i$) de los agentes en el espacio de solución de Nash y Pareto.
- **Método**: `PATCH` o `PUT`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "finance": 0.35,
  "tech": 0.30,
  "operations": 0.20
}
```
- **Validaciones**:
  - Cada peso debe ser un número flotante entre `0.0` y `1.0`.
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [ ... agentes con pesos actualizados ... ]
}
```
- **Posibles Errores**:
  - `400`: Pesos fuera del rango admitido [0, 1].

---

### 3.4. Propuestas y Trazabilidad FIPA-ACL

#### `GET /api/proposals`
Obtiene las propuestas y contraofertas registradas en el ledger inmutable.
- **Método**: `GET`
- **Query Params**:
  - `roundNumber` *(opcional)*: Número de ronda (`1`, `2`, `3`...).
  - `senderAgentId` *(opcional)*: ID del agente emisor.
  - `messageType` *(opcional)*: Performativo (`PROPOSE`, `COUNTER`, `CFP`, `ACCEPT`, `REJECT`).
  - `negotiationId` *(opcional)*: ID de la negociación asociada.
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prop-8921",
      "code": "#P-8921",
      "roundNumber": 2,
      "messageType": "COUNTER",
      "senderAgentName": "Agente Finanzas",
      "senderAgentCode": "FIN-CORP-01",
      "currentClaimAmount": 28.0,
      "offeredConcessionPercent": -6.6,
      "utilityValue": 0.91,
      "sha256Hash": "a9f8e72c8109bf44d82f71629471ab63..."
    }
  ]
}
```

#### `POST /api/proposals`
Registra una nueva propuesta o contraoferta sellada criptográficamente en el ledger.
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "senderAgentName": "Agente Operaciones",
  "senderAgentCode": "OPS-LOG-03",
  "statement": "Ajuste de presupuesto operativo a $18.5M mediante renegociación de centros de distribución.",
  "currentClaimAmount": 18.5,
  "offeredConcessionPercent": -7.5,
  "utilityValue": 0.92,
  "messageType": "COUNTER",
  "roundNumber": 2,
  "negotiationId": "neg-2026-001"
}
```
- **Respuesta Exitosa (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "prop-1728893120",
    "code": "#P-4912",
    "sha256Hash": "f3b21...",
    "status": "En Revisión"
  }
}
```
- **Posibles Errores**:
  - `400`: Faltan campos obligatorios (`statement`, `currentClaimAmount`).

---

### 3.5. Resoluciones y Auditoría Forense

#### `GET /api/resolutions`
Obtiene las resoluciones y contratos inteligentes de consenso finalizados y auditados.
- **Método**: `GET`
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "res-2026-001",
      "folio": "#RES-2026-001",
      "title": "Distribución Presupuestal Q1 - Operaciones & TI",
      "finalAssigned": 100.0,
      "algorithmicSavings": 20.0,
      "savingsPercentage": 16.6,
      "smartContractHash": "4f8a91b2c3d4e5f6...",
      "closedDate": "28 de Septiembre, 2026"
    }
  ]
}
```

#### `GET /api/resolutions/[id]`
Obtiene el expediente de auditoría completo de una resolución mediante su ID o Folio.
- **Método**: `GET`
- **Parámetro URL**: `id` (e.g. `res-2026-001` o `#RES-2026-001`)
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "res-2026-001",
    "folio": "#RES-2026-001",
    "title": "Distribución Presupuestal Q1 - Operaciones & TI",
    "smartContractHash": "4f8a91b2c3d4e5f6...",
    "details": [
      {
        "department": "Finanzas",
        "initialDemand": "$35.0M",
        "finalAssigned": "$24.5M",
        "adjustment": "-30.0%",
        "finalUtility": "0.88"
      }
    ]
  }
}
```
- **Posibles Errores**:
  - `404`: Resolución no encontrada.

---

### 3.6. Configuración y Control de Kernel

#### `GET /api/config`
Obtiene los parámetros actuales de gobernanza, axiomas de teoría de juegos y restricciones.
- **Método**: `GET`
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": {
    "hardStopBudgetConstraint": true,
    "bargainingAlgorithm": "nash",
    "maxRounds": 5,
    "divergenceTolerancePercent": 0.05,
    "minimumMandatoryConcessionUsd": 0.5,
    "autonomyLevel": "human_veto",
    "llmInferenceModel": "gemini-2.5-flash"
  }
}
```

#### `PATCH` / `PUT /api/config`
Actualiza los parámetros de configuración y gobernanza algorítmica.
- **Método**: `PATCH` o `PUT`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "hardStopBudgetConstraint": true,
  "bargainingAlgorithm": "nash",
  "maxRounds": 5,
  "divergenceTolerancePercent": 0.05,
  "minimumMandatoryConcessionUsd": 0.5,
  "autonomyLevel": "human_veto"
}
```
- **Validaciones**:
  - `bargainingAlgorithm`: `'nash' | 'kalai' | 'proportional'`.
  - `maxRounds`: entre 1 y 30.
  - `divergenceTolerancePercent`: entre 0.0 y 1.0.
- **Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "data": { ... configuración actualizada ... }
}
```
- **Posibles Errores**:
  - `400`: Parámetros fuera de los rangos válidos.

---

## 4. Ejecución y Despliegue en Vercel

### Ejecución Local:
```bash
npm run dev
```
Inicia el servidor full-stack en `http://localhost:3000` con Express sirviendo los endpoints `/api/*` y Vite montado en modo middleware.

### Verificación de Compilación y TypeScript:
```bash
npm run lint
npm run build
```

### Despliegue en Vercel:
Los Route Handlers ubicados en `src/app/api/**/route.ts` son compatibles al 100% con Vercel Serverless Functions y Next.js App Router, garantizando cero configuración adicional para el despliegue en la nube.
