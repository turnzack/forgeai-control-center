import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, MoreVertical, Plus, UserPlus } from 'lucide-react';

const members = [
  { id: 1, name: 'Alice Dubois', email: 'alice@forgeai.com', role: 'Admin', avatar: 'AD', status: 'Actif' },
  { id: 2, name: 'Bob Martin', email: 'bob@forgeai.com', role: 'Éditeur', avatar: 'BM', status: 'Actif' },
  { id: 3, name: 'Claire Leroy', email: 'claire@forgeai.com', role: 'Lecteur', avatar: 'CL', status: 'En attente' },
  { id: 4, name: 'David Sanchez', email: 'david@forgeai.com', role: 'Éditeur', avatar: 'DS', status: 'Actif' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function Members() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Membres de l'équipe
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Gérez les accès et les rôles de vos collaborateurs.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 self-start sm:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          Ajouter un membre
        </motion.button>
      </motion.div>

      {/* Grid of members */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {members.map((member) => (
          <motion.div 
            key={member.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 hover:border-gray-600 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            {/* Glow effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-lg font-bold text-gray-200 border border-gray-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{member.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {member.email}
                  </div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${member.role === 'Admin' ? 'text-purple-400' : 'text-gray-500'}`} />
                <span className="text-sm font-medium text-gray-300">{member.role}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                member.status === 'Actif' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Actif' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                {member.status}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty state / Invite card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden bg-gray-900/20 backdrop-blur-xl border border-dashed border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 group min-h-[200px]"
        >
          <div className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-300 group-hover:text-white">Inviter un collègue</h3>
          <p className="text-sm text-gray-500 mt-1">Envoyez une invitation par email.</p>
        </motion.div>

      </motion.div>
    </div>
  );
}
