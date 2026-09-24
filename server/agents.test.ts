import { describe, expect, it } from "vitest";
import { getCloudflareStatus, runCloudflareAgent } from "./agents";

describe("Cloudflare agent orchestration", () => {
  it("does not require credentials to prepare a local pipeline plan", async () => {
    const result = await runCloudflareAgent("prd", "@cf/meta/llama-3.1-8b-instruct", "Créer un storefront e-commerce original");
    expect(result.stage).toBe("prd");
    expect(result.response).toContain("PRD");
    expect(typeof result.configured).toBe("boolean");
  });

  it("never exposes the API token in the status payload", () => {
    const status = getCloudflareStatus();
    expect(status).toHaveProperty("provider", "Cloudflare Workers AI");
    expect(status).not.toHaveProperty("token");
    expect(status).not.toHaveProperty("apiToken");
    expect(status.agents).toEqual(expect.arrayContaining(["Architect Agent", "Code Agent", "QA Agent"]));
  });
});
