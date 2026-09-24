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
    "name": "SaasDashboard",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "BillingPanel",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "TeamMembersPanel",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "InvoiceTable",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "UsageMetrics",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "SubscriptionService",
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
