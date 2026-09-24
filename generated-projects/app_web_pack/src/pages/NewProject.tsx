import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Settings, ChevronDown, Plus, Shield, ChevronRight, LayoutTemplate, Box, MessageSquare, Briefcase, Rocket, Sparkles, Search } from 'lucide-react';
import { availablePacks } from '../data/packs';

export function NewProject() {
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }]);
  const [selectedPack, setSelectedPack] = useState('saas_pack');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPacks = availablePacks.filter(pack => 
    pack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-6">
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
        <span className="hover:text-white cursor-pointer transition-colors">Vercel</span>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-white cursor-pointer transition-colors">turnzack</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">New Project</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Repository Info */}
        <div className="lg:col-span-1 space-y-6">
          <h1 className="text-2xl font-semibold text-white tracking-tight">You're almost done.</h1>
          <p className="text-gray-400 text-sm">Please follow the steps to configure your Project and deploy it.</p>
          
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Repository</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">turnzack / forgeai-control-center</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3" /> Private • main
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-medium text-white">Configure Project</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Name</label>
                <input 
                  type="text" 
                  defaultValue="forgeai-control-center"
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors"
                />
              </div>

              {/* Pack Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">ForgeAI Pack (Template)</label>
                
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search from 100+ packs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredPacks.map(pack => (
                    <div 
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPack === pack.id 
                        ? 'border-cyan bg-cyan/10' 
                        : 'border-white/5 bg-black/30 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="p-2 rounded-md bg-white/5 border border-white/5">
                        <Box className="w-4 h-4 text-cyan" />
                      </div>
                      <span className="text-sm font-medium text-white truncate" title={pack.name}>{pack.name}</span>
                    </div>
                  ))}
                  {filteredPacks.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
                      No packs found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>

              {/* Framework Preset */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Framework Preset</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors appearance-none cursor-pointer">
                    <option className="bg-black">Vite</option>
                    <option className="bg-black">Next.js</option>
                    <option className="bg-black">React</option>
                    <option className="bg-black">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Root Directory */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Root Directory</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    defaultValue="generated-projects/app_web_pack"
                    className="flex-1 bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors font-mono"
                  />
                  <button className="px-4 py-2 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-white">
                    Edit
                  </button>
                </div>
              </div>

              {/* Build & Development Settings */}
              <div className="pt-4 border-t border-white/10">
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  Build and Output Settings
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Environment Variables */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Environment Variables</label>
                </div>
                
                <div className="space-y-3">
                  {envVars.map((_env, i) => (
                    <div key={i} className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="EXAMPLE_NAME"
                        className="flex-1 bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors font-mono"
                      />
                      <input 
                        type="text" 
                        placeholder="Value"
                        className="flex-1 bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors font-mono"
                      />
                    </div>
                  ))}
                  <button onClick={addEnvVar} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2">
                    <Plus className="w-4 h-4" /> Add Another
                  </button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-white/10 bg-[#000000]">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-md bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Deploy
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
