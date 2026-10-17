/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export const LoginPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('carlos.mendoza@latamcorp.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('dashboard');
    }, 600);
  };

  const handleQuickLogin = (role: 'cfo' | 'auditor') => {
    if (role === 'cfo') {
      setEmail('carlos.mendoza@latamcorp.com');
    } else {
      setEmail('elena.torres@ia-audit.org');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Left Obsidian Brand Panel */}
      <div className="lg:w-1/2 bg-tertiary p-space-lg lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
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

        {/* Center Pitch Content */}
        <div className="relative z-10 my-12 space-y-6 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-fixed border border-secondary/30 font-mono-data text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Consenso Presupuestal Autónomo
          </span>

          <h2 className="font-headline-xl text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Teoría de juegos y consenso algorítmico al servicio de decisiones corporativas.
          </h2>

          <p className="font-body-lg text-white/80 leading-relaxed">
            Elimine semanas de fricción departamental. Coordine agentes de IA bajo axiomas de Nash y trazabilidad inmutable SHA-256.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl mb-1">balance</span>
              <p className="font-bold text-white text-body-md">Equilibrio de Nash</p>
              <p className="text-xs text-white/70 mt-0.5">Optimización colectiva con garantía matemática de Pareto.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl mb-1">lock</span>
              <p className="font-bold text-white text-body-md">Ledger Criptográfico</p>
              <p className="text-xs text-white/70 mt-0.5">Firmas asimétricas Ed25519 e historial a prueba de manipulaciones.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/60 font-mono-data flex items-center justify-between">
          <span>LATAM-CORP-GOVERNANCE v4.2</span>
          <span>Clúster Seguro TLS 1.3</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-space-lg lg:p-16 bg-surface-container-lowest">
        <div className="w-full max-w-md space-y-space-lg">
          <div>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">
              Acceso Institucional
            </h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              Ingrese con sus credenciales de directivo o auditor corporativo.
            </p>
          </div>

          {/* 1-Click Fast Demo Credentials */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold block">
              Acceso Rápido Demostrativo (1 Clic)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('cfo')}
                className="py-2 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary transition-all text-xs font-semibold text-on-surface text-left border border-outline-variant/20 flex flex-col"
              >
                <span className="font-bold">Carlos Mendoza</span>
                <span className="text-[10px] text-outline group-hover:text-white/80">Chief Financial Officer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('auditor')}
                className="py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary transition-all text-xs font-semibold text-on-surface text-left border border-outline-variant/20 flex flex-col"
              >
                <span className="font-bold">Dra. Elena Torres</span>
                <span className="text-[10px] text-outline group-hover:text-white/80">Auditora de Algoritmos</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <label className="font-label-md text-label-md font-semibold text-on-surface block mb-1">
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Contraseña Institucional
                </label>
                <a href="#recuperar" className="text-xs text-primary font-medium hover:underline">
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                Recordar en esta terminal
              </label>
              <span className="font-mono-data text-[11px] text-outline">SSO SAML 2.0</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando en Directorio Corporativo...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Bottom link to Register */}
          <div className="text-center pt-2">
            <p className="font-body-sm text-on-surface-variant">
              ¿No tiene credenciales de analista?{' '}
              <button
                type="button"
                onClick={() => navigate('registro')}
                className="font-semibold text-primary hover:underline"
              >
                Solicitar Registro
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
