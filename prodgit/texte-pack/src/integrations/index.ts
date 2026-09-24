/**
 * ForgeAI Sovereign Native Modules Manifest
 * 100% Autonome & Déconnecté de toute source externe
 */

export interface NativeModuleEntry {
  name?: string;
  fileName?: string;
  source?: string;
  repo?: string;
  status?: string;
  role?: string;
  license?: string;
  targetPath?: string;
  editable?: boolean;
  synchronized?: boolean;
}

export const NATIVE_MODULE_MANIFEST: NativeModuleEntry[] = [
  {
    "name": "UniversalApp",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "DataWorkspace",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "SettingsManager",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  }
];

// Alias pour rétro-compatibilité
export const MOUNTED_MANIFEST = NATIVE_MODULE_MANIFEST;

export function getMountedComponent(fileName: string): NativeModuleEntry | undefined {
  return NATIVE_MODULE_MANIFEST.find(
    (c) => c.name === fileName
  );
}
