import React from 'react';
import { Activity, CreditCard, Users, ArrowUpRight, ShieldCheck, Database } from 'lucide-react';

const stats = [
  { name: 'Utilisateurs Actifs', value: '8,234', change: '+12.5%', icon: Users },
  { name: 'Revenu Mensuel', value: '45,231 €', change: '+8.2%', icon: CreditCard },
  { name: 'Requêtes API', value: '1.2M', change: '+24.1%', icon: Activity },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Vue d'ensemble</h1>
        <p className="text-gray-400 mt-2">Bienvenue sur votre plateforme Edge-First propulsée par ForgeAI.</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 transition-all hover:border-gray-700">
            <dt>
              <div className="absolute rounded-xl bg-indigo-500/10 p-3">
                <stat.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-emerald-400">
                {stat.change}
                <ArrowUpRight className="ml-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* System Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            État de la Base D1
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-950 border border-gray-800/50">
              <span className="text-sm text-gray-400">Tables générées</span>
              <span className="text-sm font-bold text-white">2 (users, workspaces)</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-950 border border-gray-800/50">
              <span className="text-sm text-gray-400">Taille estimée</span>
              <span className="text-sm font-bold text-white">12 MB / 500 MB</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-950 border border-gray-800/50">
              <span className="text-sm text-gray-400">Latence moyenne</span>
              <span className="text-sm font-bold text-emerald-400">24ms</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Sécurité Edge
          </h2>
          <p className="text-sm text-gray-400 mb-6">L'infrastructure tourne actuellement sur le réseau Edge Cloudflare.</p>
          <div className="space-y-3">
            {['Validation Zod Stricte', 'Headers CORS Sécurisés', 'Protection Anti-DDoS', 'Zero-Mock Architecture'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
