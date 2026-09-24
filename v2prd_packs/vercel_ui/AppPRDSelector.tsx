import React, { useState, useEffect } from 'react';
import { 
  Diamond, 
  Bot, 
  FolderGit2, 
  X, 
  CheckCircle2, 
  ShoppingCart, 
  ShieldCheck, 
  Layout, 
  Smartphone,
  Newspaper,
  Trophy,
  CreditCard
} from 'lucide-react';

// --- MOCK DATA DES PACKS PRD ---
// Dans votre vraie App.tsx, vous pourrez charger cette liste depuis vos manifest.json ou via l'API locale Electron.
const AVAILABLE_PACKS = [
  { id: 'prd_auth_gateway', name: 'Auth Gateway Security', icon: ShieldCheck, color: 'bg-red-500/10 text-red-500' },
  { id: 'prd_ecom_catalog', name: 'E-commerce Catalog', icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'prd_ecom_checkout', name: 'E-commerce Checkout', icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'prd_saas_billing_pro', name: 'SaaS Billing Pro', icon: CreditCard, color: 'bg-purple-500/10 text-purple-500' },
  { id: 'prd_layout_bento', name: 'Layout Bento', icon: Layout, color: 'bg-orange-500/10 text-orange-500' },
  { id: 'prd_mobile_social', name: 'Mobile Social', icon: Smartphone, color: 'bg-pink-500/10 text-pink-500' },
  { id: 'prd_blog_magazine', name: 'Blog Magazine', icon: Newspaper, color: 'bg-yellow-500/10 text-yellow-500' },
  { id: 'prd_game_leaderboard', name: 'Game Leaderboard', icon: Trophy, color: 'bg-amber-500/10 text-amber-500' },
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState("");

  const togglePack = (packId: string) => {
    setSelectedPacks(prev => 
      prev.includes(packId) 
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    );
  };

  const handleGenerate = () => {
    console.log("🚀 Envoi au moteur Electron (Trombone) !");
    console.log("Packs sélectionnés :", selectedPacks);
    console.log("Prompt Utilisateur :", userPrompt);
    
    // Ici, vous appellerez votre Bridge Electron (ex: window.electron.invoke('generate-mega-prompt', { ... }))
    alert(`Génération lancée avec ${selectedPacks.length} packs ! Vérifiez la console.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8 flex flex-col items-center">
      
      {/* 1. TOP BAR (Simulée) */}
      <div className="w-full max-w-4xl flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl mb-12">
        <div className="font-bold text-xl tracking-tight text-white">Sovereign IDE</div>
        
        {/* BOUTONS D'ACTION (Assistant, Projets, et le nouveau Packs PRD) */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium">
            <Bot size={16} /> Assistant IA
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium">
            <FolderGit2 size={16} /> Projets
          </button>
          
          {/* LE NOUVEAU BOUTON PACKS PRD */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            <Diamond size={16} className="text-cyan-300" />
            Packs PRD
            {selectedPacks.length > 0 && (
              <span className="ml-1 bg-white text-indigo-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedPacks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. ZONE DE PROMPT PRINCIPALE */}
      <div className="w-full max-w-2xl bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-semibold text-white mb-2">Que voulez-vous construire ?</h2>
        <p className="text-slate-400 mb-6 text-sm">Sélectionnez vos packs d'architecture et décrivez votre projet.</p>
        
        <textarea 
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Ex: Crée moi une application SaaS pour gérer des factures..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {selectedPacks.map(id => {
              const pack = AVAILABLE_PACKS.find(p => p.id === id);
              return pack ? (
                <div key={id} className="flex items-center gap-1 bg-indigo-950 text-indigo-300 text-xs px-3 py-1.5 rounded-lg border border-indigo-900">
                  <pack.icon size={12} /> {pack.name}
                </div>
              ) : null;
            })}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!userPrompt || selectedPacks.length === 0}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-colors"
          >
            Générer l'Application ✨
          </button>
        </div>
      </div>

      {/* 3. MODALE DE SÉLECTION DES PACKS (HUD CARROUSEL/GRILLE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header Modale */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Diamond className="text-cyan-400" /> Bibliothèque d'Architecture
                </h2>
                <p className="text-slate-400 text-sm mt-1">Cochez les contrats d'interface (PRD) à injecter dans le moteur "Trombone".</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Grille des Packs */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_PACKS.map((pack) => {
                  const isSelected = selectedPacks.includes(pack.id);
                  return (
                    <div 
                      key={pack.id}
                      onClick={() => togglePack(pack.id)}
                      className={\`cursor-pointer relative p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3 group \${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-900/20' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/80'
                      }\`}
                    >
                      {/* Checkbox Icon */}
                      <div className={\`absolute top-4 right-4 transition-transform \${isSelected ? 'scale-100 text-indigo-500' : 'scale-0 text-transparent'}\`}>
                        <CheckCircle2 size={24} className="fill-indigo-500/20" />
                      </div>

                      <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${pack.color}\`}>
                        <pack.icon size={24} />
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold">{pack.name}</h3>
                        <p className="text-slate-500 text-xs mt-1 font-mono">{pack.id}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Modale */}
            <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900">
              <div className="text-sm text-slate-400">
                <span className="font-bold text-white">{selectedPacks.length}</span> pack(s) prêt(s) pour l'injection.
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
              >
                Valider la Sélection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
