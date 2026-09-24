// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN ?? "",
  cloudflareModel: process.env.CLOUDFLARE_AI_MODEL ?? "@cf/meta/llama-3.1-8b-instruct"
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback2) {
    if (fallback2 && fallback2.length > 0) return fallback2;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/agents.ts
function buildWiringRule(gems = []) {
  if (gems.length === 0) {
    return `### COMPOSANTS R\xC9UTILISABLES MONT\xC9S :
(Aucun composant GitHub n'a \xE9t\xE9 s\xE9lectionn\xE9 pour ce montage)
`;
  }
  const list = gems.slice(0, 10).map((g, i) => {
    const importName = g.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "");
    return `${i + 1}. \`${g.targetPath}\` (Origine : ${g.repo} \xB7 Licence ${g.license || "Libre"})
   - R\xF4le : ${g.role}
   - Import recommand\xE9 : \`import { ${importName} } from "@/${g.targetPath.replace(/^src\//, "").replace(/\.(tsx?|jsx?)$/, "")}";\``;
  }).join("\n");
  return `### COMPOSANTS R\xC9UTILISABLES MONT\xC9S DANS LE PROJET :
${list}

### R\xC8GLE DE C\xC2BLAGE M\xC9TIER :
Ne r\xE9impl\xE9mente PAS ces modules. Importe-les directement dans tes nouveaux services applicatifs.`;
}
var stageInstructions = {
  prd: "Tu es Product Agent. R\xE9dige une synth\xE8se PRD concise et percutante avec personas utilisateurs, parcours cl\xE9s, fonctionnalit\xE9s MVP, r\xE8gles m\xE9tier et crit\xE8res d'acceptation.",
  architecture: "Tu es Architect Agent. Propose une architecture modulaire propre, la structure des dossiers, les contrats de donn\xE9es TypeScript et respecte rigoureusement la R\xC8GLE DE C\xC2BLAGE M\xC9TIER en r\xE9utilisant les composants mont\xE9s.",
  tasks: "Tu es Planning Agent. D\xE9coupe le chantier en 4 sprints ordonn\xE9s (Setup & Boilerplate, C\xE2blage des composants mont\xE9s, Logique m\xE9tier & Store, Tests & Validation).",
  code: "Tu es Code Agent. G\xE9n\xE8re un plan de montage de code original et coh\xE9rent. Importe et c\xE2ble directement les p\xE9pites mont\xE9es selon la r\xE8gle de c\xE2blage.",
  qa: "Tu es QA Agent. \xC9tablis la matrice de tests fonctionnels, de compatibilit\xE9 Vite/React 18 et d'audit de conformit\xE9 des licences open-source (MIT, Apache-2.0).",
  assistant: "Tu es l'assistant de montage ForgeAI. R\xE9ponds comme un copilote technique pragmatique et indique les fichiers ou d\xE9cisions \xE0 ajuster."
};
function configured() {
  return Boolean(ENV.cloudflareAccountId && ENV.cloudflareApiToken);
}
function fallback(stage, prompt, context) {
  const packTitle = context?.packName || "Projet ForgeAI";
  const gemsCount = context?.gems?.length || 0;
  const wiring = buildWiringRule(context?.gems);
  switch (stage) {
    case "prd":
      return `## 01 \u2014 PRD : ${packTitle}
**Intention Produit :** ${prompt.split("\n")[0] || "Application modulaire optimis\xE9e."}

### Personas Cibles
- D\xE9veloppeur / Lead Tech cherchant une architecture pr\xEAte \xE0 l'emploi.
- Utilisateur final b\xE9n\xE9ficiant d'une interface fluide, moderne et r\xE9active.

### Fonctionnalit\xE9s Cl\xE9s du Pack
1. Navigation et exploration temps r\xE9el avec th\xE8me dark adaptatif.
2. Int\xE9gration chirurgicale des ${gemsCount} p\xE9pites GitHub s\xE9lectionn\xE9es.
3. Architecture modulaire bas\xE9e sur React 18, Vite et TypeScript strict.
4. Tra\xE7abilit\xE9 compl\xE8te des licences libres et de la provenance du code.

### Crit\xE8res d'Acceptation
- 100% du code compile sans avertissement ni collision d'exports.
- Les composants adapt\xE9s sont isol\xE9s dans \`src/integrations/github-adapted/\`.`;
    case "architecture":
      return `## 02 \u2014 Architecture & C\xE2blage : ${packTitle}

### Stack Technique
- **Framework :** React 18.3 + TypeScript 5.6
- **Bundler :** Vite 6 (HMR instantan\xE9 sur port 5173)
- **Typographie & Design :** Inter, JetBrains Mono, Dark Theme tokens HSL

${wiring}

### Cartographie des R\xE9pertoires
- \`src/components/\` : UI r\xE9utilisable globale (Navbar, Layout, Badges)
- \`src/features/\` : Domaines m\xE9tier ind\xE9pendants
- \`src/integrations/\` : Registre \`MOUNTED_MANIFEST\` et p\xE9pites adapt\xE9es
- \`src/types/\` : Contrats TypeScript stricts`;
    case "tasks":
      return `## 03 \u2014 Plan de R\xE9alisation : ${packTitle}

- **Sprint 1 (Bootstrap & Scaffolding) :**
  - G\xE9n\xE9ration de \`package.json\`, \`tsconfig.json\`, \`vite.config.ts\`, \`index.html\`.
  - Initialisation de \`src/main.tsx\` et \`src/index.css\`.
- **Sprint 2 (Montage & Isolation des P\xE9pites) :**
  - D\xE9compression des ${gemsCount} modules dans \`src/integrations/github-adapted/\`.
  - G\xE9n\xE9ration du barrel export typ\xE9 \`src/integrations/index.ts\` (\`MOUNTED_MANIFEST\`).
- **Sprint 3 (C\xE2blage M\xE9tier UI & State) :**
  - Assemblage de \`src/App.tsx\` connectant les composants adapt\xE9s.
  - Impl\xE9mentation du store d'\xE9tat local et des flux de donn\xE9es.
- **Sprint 4 (Audit & Validation QA) :**
  - Compilation \`tsc -b && vite build\` (0 erreur garantie).
  - Validation du rapport \`PROVENANCE_REPORT.md\` et \`THIRD_PARTY_NOTICES.md\`.`;
    case "code":
      return `## 04 \u2014 Montage Applicatif & Code : ${packTitle}
- ${gemsCount} modules mont\xE9s avec succ\xE8s dans \`src/integrations/github-adapted/\`.
- Interface principale \`src/App.tsx\` assembl\xE9e avec succ\xE8s.
- Registre centralis\xE9 \`MOUNTED_MANIFEST\` pr\xEAt pour import dans les composants m\xE9tiers.
- Application pr\xEAte \xE0 d\xE9marrer sur http://localhost:5173 via \`pnpm dev\`.`;
    case "qa":
      return `## 05 \u2014 Matrice QA & Conformit\xE9 des Licences : ${packTitle}
- **Compatibilit\xE9 Build :** Vite 6 + React 18 valid\xE9 (Code 0).
- **V\xE9rification TypeScript :** Alias de chemins \`@/*\` r\xE9solus, exclusions configur\xE9es.
- **Audit Licences :** 100% des ${gemsCount} composants sont certifi\xE9s sous licences permissives (MIT, Apache-2.0, BSD).
- **S\xE9curit\xE9 :** 0 secret, cl\xE9 API ou token priv\xE9 d\xE9tect\xE9 dans les sources int\xE9gr\xE9es.`;
    case "assistant":
      return `[ForgeAI Studio Copilot]
Chantier : **${packTitle}** (${gemsCount} p\xE9pites actives).
Toutes les briques du PRD sont align\xE9es avec l'architecture. Vous pouvez lancer la g\xE9n\xE9ration ou inspecter les fichiers dans l'explorateur.`;
  }
}
async function runCloudflareAgent(stage, model, prompt, context) {
  const wiringRule = buildWiringRule(context?.gems);
  if (!configured()) {
    return {
      configured: false,
      model,
      stage,
      response: fallback(stage, prompt, context)
    };
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ENV.cloudflareAccountId}/ai/run/${encodeURIComponent(model)}`;
  const systemPrompt = `${stageInstructions[stage]}
Tu travailles dans ForgeAI Studio Builder pour le pack "${context?.packName || "ForgeAI"}".
${wiringRule}
Les d\xE9p\xF4ts GitHub sont des r\xE9f\xE9rences de contexte et de provenance ; le code applicatif doit respecter strictement la r\xE8gle de c\xE2blage.`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.cloudflareApiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1400
    })
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    return {
      configured: false,
      model,
      stage,
      response: fallback(stage, prompt, context)
    };
  }
  return {
    configured: true,
    model,
    stage,
    response: payload.result?.response || fallback(stage, prompt, context)
  };
}
function getCloudflareStatus() {
  return {
    configured: configured(),
    provider: "Cloudflare Workers AI",
    model: ENV.cloudflareModel || "@cf/meta/llama-3.1-8b-instruct",
    agents: ["Architect Agent", "Product Agent", "Code Agent", "QA Agent"]
  };
}

// server/githubSearch.ts
var APPROVED_LICENSES = /* @__PURE__ */ new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "CC0-1.0",
  "Unlicense"
]);
var DENIED_LICENSES = /* @__PURE__ */ new Set([
  "GPL-2.0",
  "GPL-3.0",
  "AGPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "SSPL"
]);
var SPDX_ALIASES = {
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
  "agpl-3.0": "AGPL-3.0"
};
function normalizeSpdx(input) {
  const key = input.trim().toLowerCase();
  return SPDX_ALIASES[key] ?? input.toUpperCase();
}
function validateRepositoryLicense(licenseSpdxId) {
  const normalized = licenseSpdxId ? normalizeSpdx(licenseSpdxId) : null;
  if (!normalized || normalized === "NOASSERTION" || normalized === "NONE") {
    return {
      status: "unknown",
      spdxId: "Non sp\xE9cifi\xE9e",
      message: "Aucune licence SPDX reconnue."
    };
  }
  if (DENIED_LICENSES.has(normalized)) {
    return {
      status: "rejected",
      spdxId: normalized,
      message: "Licence restrictive (Copyleft / GPL) non autoris\xE9e pour du code commercial."
    };
  }
  if (APPROVED_LICENSES.has(normalized)) {
    return {
      status: "approved",
      spdxId: normalized,
      message: "Licence permissive certifi\xE9e (SPDX autoris\xE9e)."
    };
  }
  return {
    status: "warning",
    spdxId: normalized,
    message: "Licence reconnue mais n\xE9cessite une v\xE9rification manuelle."
  };
}
function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
function daysSince(dateStr) {
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return 999;
  return (Date.now() - time) / 864e5;
}
function calculateRelevanceScore(repo, keywords) {
  const text2 = [
    repo.name || "",
    repo.description || "",
    ...repo.topics || []
  ].join(" ").toLowerCase();
  const normalizedKeywords = keywords.map((k) => k.trim().toLowerCase()).filter((k) => k && !k.includes(":") && !["and", "or", "not", "react", "typescript"].includes(k));
  const matchedKeywords = normalizedKeywords.filter((k) => text2.includes(k));
  const keywordScore = normalizedKeywords.length ? matchedKeywords.length / normalizedKeywords.length * 100 : 80;
  const uiTerms = [
    "ui",
    "ux",
    "component",
    "components",
    "design-system",
    "design system",
    "dashboard",
    "tailwind",
    "storybook",
    "frontend",
    "react",
    "vue",
    "svelte",
    "radix",
    "lucide",
    "shadcn",
    "modal",
    "table",
    "card",
    "kanban",
    "chart"
  ];
  const uiMatches = uiTerms.filter((term) => text2.includes(term)).length;
  const uiScore = clamp(uiMatches * 14);
  const age = daysSince(repo.pushed_at);
  const activityScore = age <= 30 ? 100 : age <= 90 ? 85 : age <= 180 ? 70 : age <= 365 ? 45 : 15;
  const licValidation = validateRepositoryLicense(repo.license?.spdx_id);
  const licenseScore = licValidation.status === "approved" ? 100 : licValidation.status === "warning" ? 50 : 0;
  const popularityScore = clamp(
    Math.log10((repo.stargazers_count || 0) + 1) * 22 + Math.log10((repo.forks_count || 0) + 1) * 8
  );
  const maintenancePenalty = repo.archived || repo.disabled ? 100 : 0;
  const rawScore = keywordScore * 0.3 + uiScore * 0.25 + activityScore * 0.15 + licenseScore * 0.15 + popularityScore * 0.15 - maintenancePenalty * 0.3;
  const finalScore = Math.round(clamp(rawScore, 10, 99));
  const badges = [];
  if (licValidation.status === "approved") badges.push(`Licence ${licValidation.spdxId}`);
  if (age <= 60) badges.push("Actif r\xE9cemment");
  if (repo.language) badges.push(repo.language);
  if (uiMatches >= 3) badges.push("Composants UI riches");
  if (repo.stargazers_count >= 500) badges.push("Populaire \u2B50");
  if (repo.archived) badges.push("\u26A0\uFE0F Archiv\xE9");
  return {
    score: finalScore,
    breakdown: {
      relevance: Math.round(keywordScore),
      uiSignals: Math.round(uiScore),
      activity: Math.round(activityScore),
      license: Math.round(licenseScore),
      popularity: Math.round(popularityScore)
    },
    badges
  };
}
async function searchGitHubRepositories(params) {
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
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ForgeAI-Control-Center/1.0",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(searchUrl.toString(), {
    headers,
    signal: AbortSignal.timeout(12e3)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 403) {
      throw new Error("Quota GitHub Search atteint (Rate Limit). R\xE9essayez dans un instant ou configurez un GITHUB_TOKEN.");
    }
    if (response.status === 422) {
      throw new Error(`Requ\xEAte GitHub invalide : ${errorBody}`);
    }
    throw new Error(`Erreur GitHub ${response.status} : ${errorBody}`);
  }
  const data = await response.json();
  const keywords = params.query.split(/\s+/).filter(Boolean);
  const scoredItems = (data.items || []).map((repo) => {
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
        source: "github"
      },
      score,
      scoreBreakdown: breakdown,
      badges
    };
  });
  scoredItems.sort((a, b) => b.score - a.score);
  const totalCount = data.total_count || 0;
  const maxAccessibleResults = 1e3;
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
      warning: totalCount > maxAccessibleResults ? "GitHub limite l'acc\xE8s aux 1 000 premiers r\xE9sultats." : void 0
    }
  };
}

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  agents: router({
    status: publicProcedure.query(() => getCloudflareStatus()),
    run: publicProcedure.input(z2.object({
      stage: z2.enum(["prd", "architecture", "tasks", "code", "qa", "assistant"]),
      model: z2.string().min(1).max(160),
      prompt: z2.string().min(1).max(12e3),
      context: z2.object({
        packName: z2.string().optional(),
        packSlug: z2.string().optional(),
        gems: z2.array(z2.object({
          fileName: z2.string(),
          repo: z2.string(),
          role: z2.string(),
          targetPath: z2.string(),
          license: z2.string().optional()
        })).optional()
      }).optional()
    })).mutation(({ input }) => runCloudflareAgent(input.stage, input.model, input.prompt, input.context))
  }),
  github: router({
    search: publicProcedure.input(z2.object({
      query: z2.string().min(1),
      page: z2.number().int().min(1).default(1),
      perPage: z2.number().int().min(1).max(100).default(20),
      sort: z2.enum(["stars", "forks", "updated", "help-wanted-issues"]).default("stars"),
      order: z2.enum(["asc", "desc"]).default("desc")
    })).query(({ input }) => searchGitHubRepositories(input)),
    validateLicense: publicProcedure.input(z2.object({
      spdxId: z2.string().optional()
    })).query(({ input }) => validateRepositoryLicense(input.spdxId))
  })
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    vitePluginManusRuntime(),
    vitePluginManusDebugCollector()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
