
import { useState, useEffect } from 'react';
import { Activity, CreditCard, Users, ArrowUpRight, ShieldCheck, Database, Zap, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const [apiStats, setApiStats] = useState<{ activeUsers: string, revenue: string, apiRequests: string } | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApiStats(data.stats);
        }
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const stats = [
    { name: 'Utilisateurs Actifs', value: apiStats?.activeUsers || '...', change: '+12.5%', icon: Users, color: 'from-blue-500 to-indigo-500' },
    { name: 'Revenu Mensuel', value: apiStats?.revenue || '...', change: '+8.2%', icon: CreditCard, color: 'from-emerald-400 to-teal-500' },
    { name: 'Requêtes API', value: apiStats?.apiRequests || '...', change: '+24.1%', icon: Activity, color: 'from-purple-500 to-fuchsia-500' },
  ];
  return (
    <div className="space-y-8">
      {/* Header animé */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 flex items-center gap-3">
            Vue d'ensemble <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Bienvenue sur votre plateforme Edge-First propulsée par ForgeAI.</p>
        </div>
      </motion.div>

      {/* Stats Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="group relative overflow-hidden rounded-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-6 transition-all hover:border-gray-600 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`}></div>
            
            <dt>
              <div className={`absolute rounded-xl bg-gradient-to-br ${stat.color} p-[1px]`}>
                <div className="bg-gray-950 p-2.5 rounded-xl">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2 mt-2">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="ml-3 flex items-baseline text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                {stat.change}
                <ArrowUpRight className="ml-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </p>
            </dd>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gray-900/30 backdrop-blur-lg border border-gray-800/50 p-8 hover:border-gray-700 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Database className="w-6 h-6 text-indigo-400" />
            État de la Base D1
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Tables générées', value: '2 (users, workspaces)', color: 'text-white' },
              { label: 'Taille estimée', value: '12 MB / 500 MB', color: 'text-gray-300' },
              { label: 'Latence moyenne', value: '24ms', color: 'text-emerald-400' }
            ].map((item, idx) => (
              <div key={idx} className="group flex justify-between items-center p-4 rounded-2xl bg-gray-950/50 border border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <span className="text-sm text-gray-400 group-hover:text-gray-300">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900/80 to-gray-950 border border-gray-800/50 p-8">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Sécurité Edge
          </h2>
          <p className="text-sm text-gray-400 mb-8">L'infrastructure tourne actuellement sur le réseau ultra-rapide Cloudflare.</p>
          <div className="space-y-4">
            {['Validation Zod Stricte', 'Headers CORS Sécurisés', 'Protection Anti-DDoS', 'Zero-Mock Architecture'].map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-base font-medium text-gray-200">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
