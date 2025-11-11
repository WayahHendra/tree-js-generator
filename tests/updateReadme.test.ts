import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { updateReadme } from "../src/core/updateReadme";
import { TAG_START, TAG_END } from "../src/config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.resolve(__dirname, "temp_readme_test");
const readmePath = path.join(tempDir, "README.md");
const mockTree = "└── mock_tree.js";

beforeEach(() => {
  fs.mkdirSync(tempDir, { recursive: true });
});

afterEach(() => {
  fs.removeSync(tempDir);
});

describe("updateReadme", () => {
  it("should create a new README.md if one does not exist", async () => {
    expect(fs.existsSync(readmePath)).toBe(false);
    await updateReadme(tempDir, mockTree);
    expect(fs.existsSync(readmePath)).toBe(true);

    const content = fs.readFileSync(readmePath, "utf8");
    expect(content).toContain(TAG_START);
    expect(content).toContain(mockTree);
    expect(content).toContain(TAG_END);
  });

  it("should replace content between existing tags", async () => {
    const oldContent = `${TAG_START}\nold_tree\n${TAG_END}`;
    fs.writeFileSync(readmePath, oldContent);

    await updateReadme(tempDir, mockTree);

    const content = fs.readFileSync(readmePath, "utf8");
    expect(content).toContain(mockTree);
    expect(content).not.toContain("old_tree");
  });

  it("should append tags if README exists but tags do not", async () => {
    const initialContent = "# My Project";
    fs.writeFileSync(readmePath, initialContent);

    await updateReadme(tempDir, mockTree);

    const content = fs.readFileSync(readmePath, "utf8");
    expect(content).toContain(initialContent);
    expect(content).toContain(TAG_START);
    expect(content).toContain(mockTree);
  });
});
