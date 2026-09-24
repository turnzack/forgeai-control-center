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
    "name": "Storefront",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "ProductCard",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "ProductDetailPage",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "FilterSidebar",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "CartDrawer",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "CheckoutWizard",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "OrdersTrackingPage",
    "source": "ForgeAI Studio Native Generator",
    "status": "generated",
    "editable": true,
    "synchronized": false
  },
  {
    "name": "CartService",
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
