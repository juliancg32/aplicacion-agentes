/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export const RegisterPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Finanzas Corporativas');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Orquestador de Consenso');
  const [masterToken, setMasterToken] = useState('CORP-AUTH-2026-X9');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      navigate('dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Left Obsidian Brand Panel */}
      <div className="lg:w-1/2 bg-tertiary p-space-lg lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 40 40">
              <rect fill="#1e3a8a" height="40" rx="10" width="40" />
              <circle cx="20" cy="12" fill="#60a5fa" r="4.5" />
              <circle cx="12" cy="27" fill="#38bdf8" r="4" />
              <circle cx="28" cy="27" fill="#38bdf8" r="4" />
              <circle cx="20" cy="21" fill="#ffffff" r="3" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="20" x2="20" y1="12" y2="21" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="12" x2="20" y1="27" y2="21" />
              <line stroke="#93c5fd" strokeLinecap="round" strokeWidth="2" x1="28" x2="20" y1="27" y2="21" />
              <circle cx="20" cy="21" fill="#1e3a8a" r="1.5" />
            </svg>
          </div>
          <div>
            <span className="font-headline-sm text-headline-sm font-bold block leading-tight">MultiAgent</span>
            <span className="font-label-sm text-secondary-fixed text-[11px] font-semibold uppercase tracking-wider block">
              Negotiation Platform
            </span>
          </div>
        </div>

        <div className="relative z-10 my-12 space-y-6 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-fixed border border-secondary/30 font-mono-data text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Registro Institucional
          </span>

          <h2 className="font-headline-xl text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Únase al clúster de orquestación y gobernanza presupuestaria.
          </h2>

          <p className="font-body-lg text-white/80 leading-relaxed">
            Configure su perfil corporativo para supervisar rondas de consenso autónomo, auditar contratos inteligentes y calibrar funciones de utilidad de agentes.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
            <p className="font-mono-data text-xs text-secondary-fixed uppercase font-bold">Protocolos Admitidos</p>
            <p className="text-body-sm text-white/80">
              FIPA-ACL Performatives, Nash Bargaining Solution (NBS), Kalai-Smorodinsky y verificación inmutable SHA-256.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60 font-mono-data flex items-center justify-between">
          <span>LATAM-CORP-GOVERNANCE v4.2</span>
          <span>Clúster Seguro TLS 1.3</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-space-lg lg:p-16 bg-surface-container-lowest">
        <div className="w-full max-w-md space-y-space-lg">
          <div>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">
              Solicitud de Credenciales
            </h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              Complete los datos del analista u orquestador para aprovisionar su clave institucional.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lic. Rodrigo Saldívar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              />
            </div>

            <div>
              <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                Correo Electrónico Institucional
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rodrigo.saldivar@latamcorp.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                  Departamento
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Finanzas Corporativas">Finanzas</option>
                  <option value="Tecnología & IA">Tecnología & IA</option>
                  <option value="Operaciones Globales">Operaciones</option>
                  <option value="Legal & Compliance">Legal</option>
                  <option value="Dirección General">Dirección General</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                  Rol de Acceso
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Orquestador de Consenso">Orquestador</option>
                  <option value="Auditor de Algoritmos">Auditor IA</option>
                  <option value="Observador de Junta">Observador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                Token Maestro de Aprovisionamiento
              </label>
              <input
                type="text"
                required
                value={masterToken}
                onChange={(e) => setMasterToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-mono-data text-body-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando Certificado Criptográfico...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  Crear Cuenta y Entrar al Sistema
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="font-body-sm text-on-surface-variant">
              ¿Ya cuenta con credenciales activas?{' '}
              <button
                type="button"
                onClick={() => navigate('login')}
                className="font-semibold text-primary hover:underline"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
