# BewlyMac Dual-Repository Upstream Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make BewlyMac an independently maintained appearance repository, create a clean BewlyCat contribution fork, and configure a documented three-remote workflow that safely ports bottom-layer fixes without overwriting BewlyMac UI customizations.

**Architecture:** One local Git object database uses `origin` for BewlyMac, `upstream` for `keleus/BewlyCat`, and `contrib` for the formal contribution fork. BewlyMac work starts from `origin/main`; upstream fixes start from `upstream/main` in temporary Worktrees and are ported back only through traceable cherry-picks or reviewed sync branches. Repository-level Git settings and Agent rules prevent accidental implicit merges or pushes to the wrong repository.

**Tech Stack:** Git, GitHub, Markdown, pnpm, temporary Git Worktrees

---

### Task 1: Verify detachment and create the formal contribution fork

**External state:**
- Verify: `STERILITZIA02/BewlyMac`
- Create: `STERILITZIA02/BewlyCat` as a fork of `keleus/BewlyCat`

- [ ] **Step 1: Verify BewlyMac is independent**

Open the BewlyMac repository and confirm it no longer displays `forked from keleus/BewlyCat`. Confirm repository ID and default branch remain available.

Expected: `STERILITZIA02/BewlyMac` is an independent public repository with default branch `main`.

- [ ] **Step 2: Create the formal fork**

Open:

```text
https://github.com/keleus/BewlyCat/fork
```

Create the fork with:

```text
Owner: STERILITZIA02
Repository name: BewlyCat
Copy the main branch only: enabled
```

Expected repository:

```text
https://github.com/STERILITZIA02/BewlyCat
```

- [ ] **Step 3: Verify the fork relationship**

Confirm the repository page displays:

```text
forked from keleus/BewlyCat
```

Do not create branches, commits, or pull requests through the GitHub UI in this task.

### Task 2: Normalize local remotes and branch tracking

**Local Git state:**
- Rename current `origin` to `upstream`
- Rename current `fork` to `origin`
- Add `contrib`
- Preserve every existing local and remote-tracking branch

- [ ] **Step 1: Capture the pre-migration state**

Run:

```sh
git status --short --branch
git remote -v
git branch -vv
git log --graph --oneline --decorate --all -20
```

Expected: clean worktree except the implementation plan; current branch is `codex/chrome-package`; remotes still use the old `origin` and `fork` names.

- [ ] **Step 2: Rename the remotes without changing URLs**

Run:

```sh
git remote rename origin upstream
git remote rename fork origin
```

Expected:

```text
origin   https://github.com/STERILITZIA02/BewlyMac.git
upstream https://github.com/keleus/BewlyCat.git
```

- [ ] **Step 3: Add the contribution fork**

Run:

```sh
git remote add contrib https://github.com/STERILITZIA02/BewlyCat.git
git fetch --all --prune
```

Expected: `origin/main`, `upstream/main`, and `contrib/main` are available.

- [ ] **Step 4: Correct branch tracking**

Run:

```sh
git branch --set-upstream-to=origin/main main
git branch --set-upstream-to=origin/codex/chrome-package codex/chrome-package
```

Expected: `main` tracks the independent BewlyMac repository; the current implementation branch continues to track BewlyMac rather than the contribution fork.

- [ ] **Step 5: Apply repository-level safety settings**

Run:

```sh
git config fetch.prune true
git config pull.ff only
git config rerere.enabled true
git config push.default simple
```

Verify:

```sh
git config --local --get fetch.prune
git config --local --get pull.ff
git config --local --get rerere.enabled
git config --local --get push.default
```

Expected values: `true`, `only`, `true`, `simple`.

### Task 3: Add the maintainer workflow and Agent guardrails

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Create: `docs/maintenance/upstream-workflow.md`
- Add: `docs/superpowers/plans/2026-08-05-dual-repository-upstream-workflow.md`

- [ ] **Step 1: Ignore local Worktrees**

Add this repository-local entry to `.gitignore`:

```gitignore
# Local Git worktrees for upstream fixes
.worktrees/
```

- [ ] **Step 2: Create the maintainer workflow document**

Create `docs/maintenance/upstream-workflow.md` with these sections and exact commands:

````markdown
# 上游协作流程

## Remote 职责

- `origin`：`STERILITZIA02/BewlyMac`，外观定制版。
- `upstream`：`keleus/BewlyCat`，只读原上游。
- `contrib`：`STERILITZIA02/BewlyCat`，正式贡献 Fork。

## 创建上游修复

```sh
git fetch --multiple --prune upstream contrib origin
git worktree add .worktrees/fix-<issue> -b fix/<issue>-<slug> upstream/main
cd .worktrees/fix-<issue>
git merge-base --is-ancestor upstream/main HEAD
```

修复只推送到 `contrib`：

```sh
git push -u contrib HEAD
```

PR 目标固定为 `keleus/BewlyCat:main`。

## 移植底层修复

```sh
git switch -c port/<issue>-<slug> origin/main
git cherry-pick -x <fix-sha>
git diff --stat origin/main...HEAD
git push -u origin HEAD
```

## 同步上游

```sh
git fetch --multiple --prune upstream origin
git switch -c sync/upstream-YYYYMMDD origin/main
git merge --no-ff upstream/main
```

冲突必须逐项审查。禁止在 `main` 直接 merge 上游，禁止全局 ours/theirs 策略。

## 验证

提交前运行：

```sh
pnpm lint
pnpm typecheck
```
````

Keep the angle-bracket values because this document is a reusable command template, not an unfinished implementation step.

- [ ] **Step 3: Link the workflow from README**

After the upstream maintenance paragraph in `README.md`, add:

```markdown
维护者的分支、Fork、cherry-pick 与上游同步流程见[上游协作流程](docs/maintenance/upstream-workflow.md)。
```

- [ ] **Step 4: Add mandatory Agent rules**

Append an `## 双仓库开发守则` section to `AGENTS.md` that requires Agents to:

1. Inspect status, remotes, and tracking branches before writes.
2. Base BewlyMac work on `origin/main` and upstream fixes on `upstream/main`.
3. Push `fix/*` only to `contrib`; push `port/*` and `sync/*` only to `origin`; never push `upstream`.
4. Run ancestry and diff checks before upstream PR work.
5. Use `git cherry-pick -x` for fix ports.
6. Stop on ambiguous UI conflicts instead of selecting whole-file ours/theirs.
7. Preserve user changes and avoid destructive Git commands.
8. Exclude BewlyMac-only `AGENTS.md`, branding, README, maintenance docs, artifacts, and unrelated formatting from upstream PRs.
9. Run fresh verification before claiming success.

Link the full procedure to `docs/maintenance/upstream-workflow.md` and the approved design spec.

### Task 4: Validate the topology and Worktree isolation

**Validation:**
- Compare remote heads
- Test a detached Worktree from `upstream/main`
- Confirm no source or UI changes

- [ ] **Step 1: Compare upstream and contribution main**

Run:

```sh
git rev-parse upstream/main
git rev-parse contrib/main
git merge-base --is-ancestor upstream/main contrib/main
git merge-base --is-ancestor contrib/main upstream/main
```

Expected: both refs point to the same commit immediately after Fork creation. If they differ, report the exact SHAs and do not force-push.

- [ ] **Step 2: Create a detached smoke Worktree**

Run:

```sh
git worktree add --detach .worktrees/fix-workflow-smoke upstream/main
git -C .worktrees/fix-workflow-smoke rev-parse HEAD
git rev-parse upstream/main
git worktree remove .worktrees/fix-workflow-smoke
```

Expected: both SHAs match; the Worktree is removed without creating or deleting a branch.

- [ ] **Step 3: Inspect final Git configuration**

Run:

```sh
git remote -v
git branch -vv
git config --local --get-regexp '^(fetch\.prune|pull\.ff|rerere\.enabled|push\.default)$'
git status --short --branch
```

Expected: three correctly named remotes, correct tracking relationships, four local settings, and only the planned documentation/configuration files modified.

### Task 5: Verify, commit, and publish the maintenance configuration

**Files to stage:**
- `.gitignore`
- `README.md`
- `AGENTS.md`
- `docs/maintenance/upstream-workflow.md`
- `docs/superpowers/plans/2026-08-05-dual-repository-upstream-workflow.md`
- `docs/superpowers/specs/2026-08-05-dual-repository-upstream-workflow-design.md`

- [ ] **Step 1: Verify file scope**

Run:

```sh
git diff --check
git diff --stat
git status --short
```

Expected: no source, locale, package, license, build artifact, or UI component is modified.

- [ ] **Step 2: Run required checks**

Run:

```sh
pnpm lint
pnpm typecheck
```

Expected: both commands exit with status 0.

- [ ] **Step 3: Stage only approved files**

Run:

```sh
git add -- .gitignore README.md AGENTS.md docs/maintenance/upstream-workflow.md docs/superpowers/plans/2026-08-05-dual-repository-upstream-workflow.md docs/superpowers/specs/2026-08-05-dual-repository-upstream-workflow-design.md
git diff --cached --stat
```

Expected: exactly six paths are staged. Do not use broad `git add` forms.

- [ ] **Step 4: Commit the maintenance configuration**

Run:

```sh
git commit -m "docs(maintenance): 建立双仓库上游协作流程"
```

Expected: one commit containing only the six approved paths.

- [ ] **Step 5: Push the current branch to BewlyMac**

Run:

```sh
git push -u origin codex/chrome-package
```

Expected: `codex/chrome-package` is updated in `STERILITZIA02/BewlyMac`. Do not create or merge a pull request in this task.

- [ ] **Step 6: Verify the remote commit**

Run:

```sh
git ls-remote origin refs/heads/codex/chrome-package
git rev-parse HEAD
git status --short --branch
```

Expected: local and remote SHAs match and the worktree is clean.
