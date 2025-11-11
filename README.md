# 🌳 tree-js-generator (`make-tree`)

[![NPM Version](https://img.shields.io/npm/v/tree-js-generator.svg)](https://www.npmjs.com/package/tree-js-generator)
[![License](https://img.shields.io/npm/l/tree-js-generator.svg)](LICENSE)

A simple yet powerful CLI tool to generate a GitHub-style project directory tree and automatically inject it into your `README.md` file.

---

## 🚀 Key Features

* **Auto-Update README:** Intelligently finds `` and `` tags in your `README.md` and updates the content between them.
* **Smart Configuration:** Set your defaults (like `depth`, `ignore`, etc.) using a `.treerc.json` file.
* **Flexible Ignore System:** Ignore files and folders using a `.treeignore` file that supports glob patterns (just like `.gitignore`).
* **Watch Mode:** Run `make-tree --watch` to automatically update your tree every time you add or remove a file.
* **Custom Output:** Print to the terminal (default), update your `README.md` (`--update`), or save to any file (`--output`).
* **Full ESM/CJS Support:** Built with modern TypeScript and compiled to both ES Module and CommonJS formats.

---

## 📦 Installation

You can install this tool globally to use it in any of your projects:

```bash
npm install -g tree-js-generator
````

*(Note: The name in your `package.json` is `tree-js-generator`, which will be the package name on NPM)*.

-----

## 📖 Usage

Once installed, you can run the `make-tree` command from any project directory.

```bash
make-tree [options]
```

### CLI Options

| Option | Alias | Description |
| :--- | :--- | :--- |
| `--depth <n>` | `-d` | Limits the tree's scan depth (e.g., `2`). |
| `--ignore <patterns>` | `-i` | A comma-separated list of glob patterns to ignore (e.g., `"dist,*.log"`). |
| `--update` | `-u` | Automatically updates the `README.md` file between tags. |
| `--output <file>` | `-o` | Saves the tree output to a specific file (e.g., `tree.txt`). |
| `--root <name>` | `-r` | Adds a custom root name to the top line of the tree (e.g., `"."`). |
| `--watch` | `-w` | Stays running and watches for file changes, updating automatically. |
| `--version` | `-v` | Displays the tool's version. |
| `--help` | `-h` | Displays the help message. |

-----

## ⚙️ Configuration

You can configure `make-tree` using two special files in your project's root directory.

### 1\. `.treeignore` (For Ignoring Files)

This file works exactly like a `.gitignore`. Use it to list all files or folders you **do not** want to show in the tree.

Create a file named `.treeignore` in your project root.

**`.treeignore` Template:**

```
# Comments are ignored
# Ignore common folders
node_modules
dist
.git
.vscode
.next
logs

# Ignore specific files
.env
package-lock.json

# Ignore using glob patterns (minimatch)
*.log
*.tmp
```

The tool also ignores some common folders by default, like `.git` and `node_modules`, but adding them here is good practice.

### 2\. `.treerc.json` (For Saving Options)

This file is very useful for saving your default CLI options. Instead of typing `make-tree --depth 2 --update` every time, you can save it here.

Create a file named `.treerc.json` in your project root.

**`.treerc.json` Template:**

```json
{
  "depth": 2,
  "root": "my-project",
  "ignore": [
    "docs",
    ".github",
    "*.md"
  ],
  "update": true,
  "watch": false
}
```

#### Configuration Priority

The tool merges settings in the following order of priority (number 1 always wins):

1.  **CLI Options** (e.g., `make-tree --depth 3`)
2.  **Options in `.treerc.json`** (e.g., `"depth": 2`)
3.  **Program Defaults**

> **Example:** If your `.treerc.json` has `"depth": 2`, but you run `make-tree --depth 4`, then **`depth 4`** will be used. If you just run `make-tree`, then **`depth 2`** will be used.

-----

## ✨ Usage Examples

### 1\. Printing to the Terminal

Just run the base command. This will print the tree to your console.

```bash
make-tree
```

### 2\. Updating README.md 

Add these tags to your `README.md` file:

```markdown
`<!-- TREE:START -->`
`<!-- TREE:END -->`

```

Then, run the command with the `--update` flag:

```bash
make-tree --update
```

The tool will find the tags and automatically update the content between them.

### 3\. Using `.treerc.json`

You want to always update the README with a depth of 2 and ignore the `docs` folder.

**Your `.treerc.json` file:**

```json
{
  "depth": 2,
  "update": true,
  "ignore": ["docs"]
}
```

Now, you only need to run:

```bash
make-tree
```

...and the tool will automatically run as if you had typed `make-tree --depth 2 --update --ignore "docs"`.

### 4\. Saving to a File

You want to create a `TREE.txt` file with a depth of 1.

```bash
make-tree --output TREE.txt --depth 1
```

### 5\. Watch Mode

You are actively developing and want your `README.md` to always be up-to-date.
(Assuming your `.treerc.json` already contains `"update": true`).

```bash
make-tree --watch
```

> 👀 Watching for file changes... (Press Ctrl+C to stop)

Now, every time you add, delete, or rename a file, your `README.md` will be updated automatically.

-----

## 📜 License

This project is licensed under the MIT License.

```
```
