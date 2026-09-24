import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, BellRing, Key, Palette, ChevronRight } from 'lucide-react';

const settingsGroups = [
  {
    title: 'Mon Profil',
    items: [
      { name: 'Informations personnelles', description: 'Mettez à jour votre nom et email.', icon: Shield },
      { name: 'Sécurité & Mots de passe', description: 'Double authentification et clés d\'accès.', icon: Key },
    ]
  },
  {
    title: 'Préférences de l\'App',
    items: [
      { name: 'Apparence', description: 'Thèmes, mode sombre et animations.', icon: Palette },
      { name: 'Notifications', description: 'Gérez vos alertes email et push.', icon: BellRing },
      { name: 'Appareils connectés', description: 'Gérez vos sessions actives.', icon: Smartphone },
    ]
  }
];

export function Settings() {
  return (
    <div className="max-w-4xl space-y-10 pb-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Paramètres du compte
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Personnalisez votre expérience et sécurisez vos données.</p>
      </motion.div>

      <div className="space-y-12">
        {settingsGroups.map((group, groupIdx) => (
          <motion.div 
            key={group.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + (groupIdx * 0.1) }}
          >
            <h2 className="text-xl font-bold text-gray-200 mb-6">{group.title}</h2>
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              {group.items.map((item, idx) => (
                <motion.div 
                  key={item.name}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                  className={`group flex items-center justify-between p-6 cursor-pointer transition-colors ${
                    idx !== group.items.length - 1 ? 'border-b border-gray-800/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300 group-hover:scale-110">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-gray-800 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
