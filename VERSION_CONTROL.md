# Version Control Policy – tree-md-generator

This document defines the version control practices, branching strategy, commit conventions, and release workflow for the **open-source** project `tree-md-generator`.

## Repository Access

- The repository is **publicly accessible** under the MIT License.
- Write access is restricted to **maintainers and trusted contributors**.
- External contributions must go through the **pull request (PR)** process.
- Sensitive credentials (e.g., API keys) must **never be committed** to the repository.

## Branching Strategy

We follow a structured branching model:

| Branch      | Purpose                               | Rules                                              |
| ----------- | ------------------------------------- | -------------------------------------------------- |
| `main`      | Production-ready code                 | Only tested and approved merges from `dev`         |
| `dev`       | Integration of new features and fixes | Feature branches are merged here after code review |
| `feature/*` | Isolated new features or improvements | Merged into `dev` after successful testing         |
| `hotfix/*`  | Urgent fixes for production issues    | Merged into `main` and back-ported to `dev`        |

## Commit Conventions

Commit messages should follow this format:

```
<type>(<scope>): <short description>
```

### Full List of Commit Types with Detailed Explanation

- `feat` → **New Feature**: Introduces a new functionality or module.
- `fix` → **Bug Fix**: Corrects a defect or issue affecting functionality.
- `docs` → **Documentation**: Changes only affecting documentation (README, comments, etc.).
- `style` → **Code Style**: Formatting, indentation, whitespace, missing semicolons, or code styling without affecting functionality.
- `refactor` → **Refactoring**: Changes to the code structure, improving readability or maintainability without adding new features or fixing bugs.
- `perf` → **Performance**: Optimizations that improve efficiency or speed.
- `test` → **Testing**: Adding or updating automated tests or test-related code.
- `chore` → **Maintenance**: Updates to build processes, auxiliary tools, or dependencies that do not change application functionality.
- `ci` → **Continuous Integration**: Changes related to CI/CD pipelines, GitHub Actions, GitLab CI, etc.
- `revert` → **Revert**: Reverts a previous commit.
- `build` → **Build**: Changes affecting build system or external dependencies (e.g., Dockerfile, Gradle, Maven).
- `security` → **Security**: Fixes or updates to address security vulnerabilities.
- `config` → **Configuration**: Changes to configuration files or environment setup.
- `deps` → **Dependencies**: Updates, upgrades, or removal of dependencies.
- `hotfix` → **Hotfix**: Urgent fixes applied directly to release or production branches.
- `wip` → **Work in Progress**: Temporary commit, not yet complete.
- `rollback` → **Rollback**: Reversing a deployment or major change.
- `locale` → **Localization**: Adding or updating translations and locale files.
- `analytics` → **Analytics**: Changes related to tracking, logging, or metrics.
- `ux` → **User Experience**: Adjustments to improve UI/UX.

**Example usage:**

```
feat(chat): add WebSocket read receipt feature
fix(auth): correct token expiration handling
docs(README): update installation instructions
style(ui): fix button alignment
refactor(api): simplify message handler logic
perf(db): optimize query performance
test(chat): add tests for new message format
chore(deps): update project dependencies
ci(github): add lint workflow
revert: revert feature/login
build(docker): update Dockerfile for production
security(auth): fix token validation bypass
config(env): update .env.example
deps: upgrade flutter to 3.19.6
hotfix(chat): fix critical crash on message send
wip(chat): implement draft feature
rollback: revert v1.2.0 deployment
locale(i18n): add French translations
analytics: integrate Google Analytics GTM
ux(profile): improve profile page layout
```

## Pull Request & Code Review

- All changes must go through **Pull Requests (PRs)**.
- Minimum **1 approval** is required before merging.
- PRs should include:
  - A clear description of the change
  - Screenshots or examples (if UI-related)
  - Steps for testing or reproduction

- No direct commits to `main` are allowed.

## Versioning & Releases

- Semantic Versioning (**SemVer**) is used: `MAJOR.MINOR.PATCH`
  - `MAJOR` → Breaking changes
  - `MINOR` → New features, backward compatible
  - `PATCH` → Bug fixes, backward compatible
- Pre-release versions are labeled as `-alpha`, `-beta`, or `-rc`
  Example: `v1.2.0-beta.1`

## Security & Sensitive Information

- Do **not commit passwords, API keys, or sensitive data**.
- Secrets must be stored in environment variables or secure vaults.
- Audit repository history regularly to prevent accidental leaks.

## 🏷️ Tags & Releases

- Every release must be **tagged** in the repository with the version number.
- Tags should be **annotated** with release notes and changelog entries.
- Example:

```
git tag -a v1.0.0 -m "Initial stable release with tree visualization and CLI improvements"
git push origin v1.0.0
```

## ⚠️ Enforcement

- Maintainers may request changes or reject PRs not following this policy.
- Persistent violations (e.g., pushing to main, unreviewed merges) may result in temporary access restrictions.
- Contributors must acknowledge and follow this version control policy to maintain repository quality.

_This document establishes the open-source version control standards for the `tree-md-generator` project, ensuring consistency, transparency, and security throughout development._
