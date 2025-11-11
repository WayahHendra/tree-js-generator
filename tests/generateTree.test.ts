import { describe, it, expect } from "vitest";
import path from "path";
import { fileURLToPath } from "url";
import { generateTree } from "../src/core/generateTree";
import { GenerateTreeOptions } from "../src/config/types";
import { DEFAULT_IGNORES } from "../src/config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDir = path.resolve(__dirname, "mock_project");
const rootDir = mockDir;

describe("generateTree (Refactored)", () => {
  const baseOptions: GenerateTreeOptions = {
    ignorePatterns: DEFAULT_IGNORES,
    depth: undefined,
  };

  it("should generate tree and ignore default patterns (node_modules, etc.)", async () => {
    const result = await generateTree(mockDir, baseOptions, rootDir);

    const expectedTree = ["├── src", "│   └── index.ts", "└── README.md"].join(
      "\n",
    );

    expect(result).toBe(expectedTree);
    expect(result).not.toContain("node_modules");
    expect(result).not.toContain("dummy.txt");
  });

  it("should respect the --depth limit (depth: 0)", async () => {
    const options: GenerateTreeOptions = {
      ...baseOptions,
      depth: 0,
    };

    const result = await generateTree(mockDir, options, rootDir);

    const expectedTree = ["├── src", "└── README.md"].join("\n");

    expect(result).toBe(expectedTree);
    expect(result).not.toContain("index.ts");
    expect(result).not.toContain("dummy.txt");
  });

  it("should ignore custom patterns using glob (*.md)", async () => {
    const customIgnores = ["*.md"];
    const options: GenerateTreeOptions = {
      ...baseOptions,
      ignorePatterns: [...baseOptions.ignorePatterns, ...customIgnores],
    };

    const result = await generateTree(mockDir, options, rootDir);
    const expectedTree = "└── src\n    └── index.ts";

    expect(result).toBe(expectedTree);
    expect(result).not.toContain("README.md");
  });

  it("should ignore custom path patterns (src/)", async () => {
    const customIgnores = ["src/"];
    const options: GenerateTreeOptions = {
      ...baseOptions,
      ignorePatterns: [...baseOptions.ignorePatterns, ...customIgnores],
    };

    const result = await generateTree(mockDir, options, rootDir);
    const expectedTree = "└── README.md";

    expect(result).toBe(expectedTree);
    expect(result).not.toContain("src");
    expect(result).not.toContain("index.ts");
  });

  it("should return an empty string if all items are ignored", async () => {
    const customIgnores = ["README.md", "src"];
    const options: GenerateTreeOptions = {
      ...baseOptions,
      ignorePatterns: [...baseOptions.ignorePatterns, ...customIgnores],
    };

    const result = await generateTree(mockDir, options, rootDir);

    expect(result).toBe("");
  });
});
