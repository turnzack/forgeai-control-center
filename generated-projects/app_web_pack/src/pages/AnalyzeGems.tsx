import { useState } from 'react';
import { Search, Loader2, Github, CheckCircle, Package, BrainCircuit, Box } from 'lucide-react';
import { availablePacks } from '../data/packs';
import { trpc } from '../lib/trpc';

export function AnalyzeGems() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  
  const searchMutation = trpc.github.hermesSearch.useMutation();
  const mountMutation = trpc.github.mount.useMutation();

  const handleSearch = () => {
    if (!selectedPack) return;
    searchMutation.mutate({ packId: selectedPack, prompt });
  };

  const handleMount = (gem: any) => {
    mountMutation.mutate({
      owner: gem.fullName.split('/')[0],
      repo: gem.name,
      commit: "HEAD",
      spdxId: gem.license?.spdxId || "unknown",
      packId: selectedPack || "app_web_pack"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn py-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-cyan-400" />
          Hermes : Composez votre base GitHub
        </h1>
        <p className="text-gray-400 mt-2">
          Triez, comparez et verrouillez les références avant d’ouvrir l’IDE de montage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Sélection du Pack */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/10 bg-black/50 space-y-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              1. Sélectionner un Pack PRD
            </h2>
            <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {availablePacks.map(pack => (
                <div 
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={\`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all \${
                    selectedPack === pack.id 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/5 hover:bg-white/5'
                  }\`}
                >
                  <Box className={\`w-4 h-4 \${selectedPack === pack.id ? 'text-cyan-400' : 'text-gray-500'}\`} />
                  <span className="text-sm font-medium text-white">{pack.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-black/50 space-y-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              2. Affiner la requête (Optionnel)
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Je veux des composants Tailwind uniquement..."
              className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors h-24"
            />
            <button
              onClick={handleSearch}
              disabled={!selectedPack || searchMutation.isLoading}
              className="w-full py-2.5 rounded-md bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {searchMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
              {searchMutation.isLoading ? "Analyse Hermes en cours..." : "Lancer la recherche GitHub"}
            </button>
          </div>
        </div>

        {/* Colonne Droite : Résultats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl border border-white/10 bg-black/50 min-h-[500px]">
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Github className="w-5 h-5 text-white" />
              3. Pépites (Gems) trouvées
            </h2>

            {searchMutation.isError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                Erreur: {searchMutation.error.message}
              </div>
            )}

            {!searchMutation.data && !searchMutation.isLoading && !searchMutation.isError && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-sm">
                <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                Sélectionnez un pack et lancez la recherche pour voir les résultats.
              </div>
            )}

            <div className="space-y-4">
              {searchMutation.data?.results?.items?.map((repo: any) => (
                <div key={repo.id} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-start justify-between">
                  <div className="space-y-2">
                    <a href={repo.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-medium text-lg">
                      {repo.fullName}
                    </a>
                    <p className="text-sm text-gray-300 line-clamp-2">{repo.description}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md flex items-center gap-1">
                        ⭐ {repo.stars}
                      </span>
                      <span className={\`text-xs px-2 py-1 rounded-md border \${repo.license?.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}\`}>
                        {repo.license?.spdxId}
                      </span>
                      {repo.badges?.map((badge: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-2xl font-black text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                      {repo.score}
                    </div>
                    <button
                      onClick={() => handleMount(repo)}
                      disabled={mountMutation.isLoading}
                      className="px-3 py-1.5 rounded-md bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {mountMutation.isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      Monter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
