import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getCloudflareStatus, runCloudflareAgent } from "./agents";
import { searchGitHubRepositories, buildGitHubQuery, validateRepositoryLicense } from "./githubSearch";
import { CloudflareAIService } from "./services/CloudflareAIService";
import { downloadRepoArchive, mountComponent } from "./githubDownload";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agents: router({
    status: publicProcedure.query(() => getCloudflareStatus()),
    run: publicProcedure
      .input(z.object({
        stage: z.enum(["prd", "architecture", "tasks", "code", "qa", "assistant"]),
        model: z.string().min(1).max(160),
        prompt: z.string().min(1).max(12000),
        context: z.object({
          packName: z.string().optional(),
          packSlug: z.string().optional(),
          gems: z.array(z.object({
            fileName: z.string(),
            repo: z.string(),
            role: z.string(),
            targetPath: z.string(),
            license: z.string().optional(),
          })).optional(),
        }).optional(),
      }))
      .mutation(({ input }) => runCloudflareAgent(input.stage, input.model, input.prompt, input.context)),
  }),

  github: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(100).default(20),
        sort: z.enum(["stars", "forks", "updated", "help-wanted-issues"]).default("stars"),
        order: z.enum(["asc", "desc"]).default("desc"),
      }))
      .query(({ input }) => searchGitHubRepositories(input)),

    validateLicense: publicProcedure
      .input(z.object({
        spdxId: z.string().optional(),
      }))
      .query(({ input }) => validateRepositoryLicense(input.spdxId)),

    hermesSearch: publicProcedure
      .input(z.object({
        packId: z.string(),
        prompt: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const fullPrompt = `Le pack est ${input.packId}. Le prompt utilisateur est: ${input.prompt || "Optimise pour ce pack."}. Génère les filtres GitHub stricts (mots-clés, licence MIT, frameworks).`;
        const aiResponse = await CloudflareAIService.ask({
          prompt: fullPrompt,
          missionId: "github-search",
          lotId: input.packId
        });

        if (!aiResponse.ok) {
          throw new Error("Hermes a échoué: " + aiResponse.error);
        }

        const baseKeywords = aiResponse.response.keywords?.join(" ") || input.packId.replace(/_/g, " ");
        const frameworks = aiResponse.response.frameworks?.join(" ") || "react typescript";
        const query = buildGitHubQuery({
          keywords: `${baseKeywords} ${frameworks}`,
          licenses: aiResponse.response.licenses || ["MIT", "Apache-2.0"]
        });

        const results = await searchGitHubRepositories({ query });
        return {
          ai: aiResponse.response,
          query,
          results
        };
      }),

    download: publicProcedure
      .input(z.object({
        owner: z.string(),
        repo: z.string(),
        ref: z.string().default("HEAD"),
        packId: z.string().default("app_web_pack"),
      }))
      .mutation(async ({ input }) => {
        const zipPath = await downloadRepoArchive(input.owner, input.repo, input.ref, input.packId);
        return { success: true, zipPath };
      }),

    mount: publicProcedure
      .input(z.object({
        owner: z.string(),
        repo: z.string(),
        commit: z.string(),
        spdxId: z.string(),
        packId: z.string().default("app_web_pack"),
      }))
      .mutation(async ({ input }) => {
        const mountPath = await mountComponent(input.owner, input.repo, input.commit, input.spdxId, input.packId);
        return { success: true, mountPath };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
