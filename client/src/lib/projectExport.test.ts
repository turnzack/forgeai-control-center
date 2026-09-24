import { describe, expect, it } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { createProjectZip, normalizeProjectPath } from "./projectExport";

describe("generic project export", () => {
  it("rejects traversal paths", () => {
    expect(() => normalizeProjectPath("../secret.txt")).toThrow("invalide");
    expect(() => normalizeProjectPath("src/../secret.txt")).toThrow("invalide");
  });

  it("creates a readable ZIP containing project files", () => {
    const zip = createProjectZip("demo", [
      { path: "README.md", content: "# Demo" },
      { path: "src/main.ts", content: "export {};" },
    ]);
    const files = unzipSync(zip);
    expect(strFromU8(files["README.md"])).toBe("# Demo");
    expect(strFromU8(files["src/main.ts"])).toBe("export {};");
  });
});
