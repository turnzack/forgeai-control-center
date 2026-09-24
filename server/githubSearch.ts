/**
 * Moteur Avancé de Recherche GitHub, Scoring UI/UX et Validation SPDX
 * Conforme à la spécification technique d'architecture et de conformité légale.
 */

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  disabled: boolean;
  pushed_at: string;
  license?: {
    key?: string;
    name?: string;
    spdx_id?: string | null;
    url?: string | null;
  } | null;
}

export interface ScoreBreakdown {
  relevance: number;
  uiSignals: number;
  activity: number;
  license: number;
  popularity: number;
}

export interface ScoredRepository {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
  archived: boolean;
  license: {
    spdxId: string;
    name: string;
    status: "approved" | "warning" | "rejected" | "unknown";
    source: "github" | "license_file" | "manual";
  };
  score: number;
  scoreBreakdown: ScoreBreakdown;
  badges: string[];
}

export interface SearchResultPayload {
  query: string;
  items: ScoredRepository[];
  pagination: {
    page: number;
    perPage: number;
    totalCount: number;
    visibleTotal: number;
    totalPages: number;
    hasNextPage: number | boolean;
    limitedByGitHub: boolean;
    maxAccessibleResults: number;
    warning?: string;
  };
  rateLimit?: {
    remaining?: number;
    reset?: number;
  };
}

const APPROVED_LICENSES = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "CC0-1.0",
  "Unlicense",
]);

const DENIED_LICENSES = new Set([
  "GPL-2.0",
  "GPL-3.0",
  "AGPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "SSPL",
]);

const SPDX_ALIASES: Record<string, string> = {
  mit: "MIT",
  "mit license": "MIT",
  apache: "Apache-2.0",
  "apache 2": "Apache-2.0",
  "apache-2": "Apache-2.0",
  "apache-2.0": "Apache-2.0",
  bsd: "BSD-3-Clause",
  "bsd-3-clause": "BSD-3-Clause",
  "bsd-2-clause": "BSD-2-Clause",
  isc: "ISC",
  unlicense: "Unlicense",
  gpl: "GPL-3.0",
  "gpl-3.0": "GPL-3.0",
  "gpl-2.0": "GPL-2.0",
  agpl: "AGPL-3.0",
  "agpl-3.0": "AGPL-3.0",
};

export function normalizeSpdx(input: string): string {
  const key = input.trim().toLowerCase();
  return SPDX_ALIASES[key] ?? input.toUpperCase();
}

export function validateRepositoryLicense(licenseSpdxId: string | null | undefined): {
  status: "approved" | "warning" | "rejected" | "unknown";
  spdxId: string;
  message: string;
} {
  const normalized = licenseSpdxId ? normalizeSpdx(licenseSpdxId) : null;
  if (!normalized || normalized === "NOASSERTION" || normalized === "NONE") {
    return {
      status: "unknown",
      spdxId: "Non spécifiée",
      message: "Aucune licence SPDX reconnue.",
    };
  }
  if (DENIED_LICENSES.has(normalized)) {
    return {
      status: "rejected",
      spdxId: normalized,
      message: "Licence restrictive (Copyleft / GPL) non autorisée pour du code commercial.",
    };
  }
  if (APPROVED_LICENSES.has(normalized)) {
    return {
      status: "approved",
      spdxId: normalized,
      message: "Licence permissive certifiée (SPDX autorisée).",
    };
  }
  return {
    status: "warning",
    spdxId: normalized,
    message: "Licence reconnue mais nécessite une vérification manuelle.",
  };
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}

function daysSince(dateStr: string): number {
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return 999;
  return (Date.now() - time) / 86_400_000;
}

export function calculateRelevanceScore(repo: GitHubRepoItem, keywords: string[]): {
  score: number;
  breakdown: ScoreBreakdown;
  badges: string[];
} {
  const text = [
    repo.name || "",
    repo.description || "",
    ...(repo.topics || []),
  ].join(" ").toLowerCase();

  // 1. Correspondance Mots-clés (30%)
  const normalizedKeywords = keywords
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k && !k.includes(":") && !["and", "or", "not", "react", "typescript"].includes(k));

  const matchedKeywords = normalizedKeywords.filter((k) => text.includes(k));
  const keywordScore = normalizedKeywords.length
    ? (matchedKeywords.length / normalizedKeywords.length) * 100
    : 80;

  // 2. Signaux UI / UX (25%)
  const uiTerms = [
    "ui", "ux", "component", "components", "design-system", "design system",
    "dashboard", "tailwind", "storybook", "frontend", "react", "vue", "svelte",
    "radix", "lucide", "shadcn", "modal", "table", "card", "kanban", "chart",
  ];
  const uiMatches = uiTerms.filter((term) => text.includes(term)).length;
  const uiScore = clamp(uiMatches * 14);

  // 3. Activité Récente (15%)
  const age = daysSince(repo.pushed_at);
  const activityScore =
    age <= 30 ? 100 : age <= 90 ? 85 : age <= 180 ? 70 : age <= 365 ? 45 : 15;

  // 4. Licence Autorisée (15%)
  const licValidation = validateRepositoryLicense(repo.license?.spdx_id);
  const licenseScore =
    licValidation.status === "approved" ? 100 : licValidation.status === "warning" ? 50 : 0;

  // 5. Popularité & Maturité (15%)
  const popularityScore = clamp(
    Math.log10((repo.stargazers_count || 0) + 1) * 22 +
    Math.log10((repo.forks_count || 0) + 1) * 8
  );

  // Pénalité d'archivage
  const maintenancePenalty = repo.archived || repo.disabled ? 100 : 0;

  const rawScore =
    keywordScore * 0.30 +
    uiScore * 0.25 +
    activityScore * 0.15 +
    licenseScore * 0.15 +
    popularityScore * 0.15 -
    maintenancePenalty * 0.30;

  const finalScore = Math.round(clamp(rawScore, 10, 99));

  // Badges explicatifs
  const badges: string[] = [];
  if (licValidation.status === "approved") badges.push(`Licence ${licValidation.spdxId}`);
  if (age <= 60) badges.push("Actif récemment");
  if (repo.language) badges.push(repo.language);
  if (uiMatches >= 3) badges.push("Composants UI riches");
  if (repo.stargazers_count >= 500) badges.push("Populaire ⭐");
  if (repo.archived) badges.push("⚠️ Archivé");

  return {
    score: finalScore,
    breakdown: {
      relevance: Math.round(keywordScore),
      uiSignals: Math.round(uiScore),
      activity: Math.round(activityScore),
      license: Math.round(licenseScore),
      popularity: Math.round(popularityScore),
    },
    badges,
  };
}

export function buildGitHubQuery(filters: {
  keywords: string;
  licenses?: string[];
  language?: string;
  minStars?: number;
  includeArchived?: boolean;
}): string {
  const parts: string[] = [];
  const cleanKeywords = filters.keywords.trim() || "react components";
  parts.push(cleanKeywords);

  if (filters.licenses && filters.licenses.length > 0) {
    const licParts = filters.licenses.map(normalizeSpdx).map((l) => `license:${l}`);
    if (licParts.length === 1) {
      parts.push(licParts[0]);
    } else {
      parts.push(`(${licParts.join(" OR ")})`);
    }
  }

  if (filters.language && filters.language !== "Tous") {
    parts.push(`language:${filters.language}`);
  }

  if (filters.minStars && filters.minStars > 0) {
    parts.push(`stars:>=${filters.minStars}`);
  }

  if (!filters.includeArchived) {
    parts.push("NOT is:archived");
  }

  return parts.join(" ");
}

export async function searchGitHubRepositories(params: {
  query: string;
  page?: number;
  perPage?: number;
  sort?: "stars" | "forks" | "updated" | "help-wanted-issues";
  order?: "asc" | "desc";
  token?: string;
}): Promise<SearchResultPayload> {
  const page = Math.max(params.page || 1, 1);
  const perPage = Math.min(Math.max(params.perPage || 20, 1), 100);
  const sort = params.sort || "stars";
  const order = params.order || "desc";
  const token = params.token || process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || "";

  const searchUrl = new URL("https://api.github.com/search/repositories");
  searchUrl.searchParams.set("q", params.query);
  searchUrl.searchParams.set("sort", sort);
  searchUrl.searchParams.set("order", order);
  searchUrl.searchParams.set("page", String(page));
  searchUrl.searchParams.set("per_page", String(perPage));

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ForgeAI-Control-Center/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(searchUrl.toString(), {
    headers,
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 403) {
      throw new Error("Quota GitHub Search atteint (Rate Limit). Réessayez dans un instant ou configurez un GITHUB_TOKEN.");
    }
    if (response.status === 422) {
      throw new Error(`Requête GitHub invalide : ${errorBody}`);
    }
    throw new Error(`Erreur GitHub ${response.status} : ${errorBody}`);
  }

  const data = (await response.json()) as {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepoItem[];
  };

  const keywords = params.query.split(/\s+/).filter(Boolean);

  const scoredItems: ScoredRepository[] = (data.items || []).map((repo) => {
    const lic = validateRepositoryLicense(repo.license?.spdx_id);
    const { score, breakdown, badges } = calculateRelevanceScore(repo, keywords);

    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description || "Aucune description fournie.",
      language: repo.language || "TypeScript",
      topics: repo.topics || [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      openIssues: repo.open_issues_count || 0,
      pushedAt: repo.pushed_at,
      archived: Boolean(repo.archived),
      license: {
        spdxId: lic.spdxId,
        name: repo.license?.name || lic.spdxId,
        status: lic.status,
        source: "github",
      },
      score,
      scoreBreakdown: breakdown,
      badges,
    };
  });

  // Tri par score combiné décroissant
  scoredItems.sort((a, b) => b.score - a.score);

  const totalCount = data.total_count || 0;
  const maxAccessibleResults = 1000;
  const visibleTotal = Math.min(totalCount, maxAccessibleResults);
  const totalPages = Math.ceil(visibleTotal / perPage);

  return {
    query: params.query,
    items: scoredItems,
    pagination: {
      page,
      perPage,
      totalCount,
      visibleTotal,
      totalPages,
      hasNextPage: page < totalPages,
      limitedByGitHub: totalCount > maxAccessibleResults,
      maxAccessibleResults,
      warning: totalCount > maxAccessibleResults ? "GitHub limite l'accès aux 1 000 premiers résultats." : undefined,
    },
  };
}
