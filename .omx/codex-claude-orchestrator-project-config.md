# Codex Claude Orchestrator Project Config

## Repository

- Repo root: `D:\wzb\BTEY\BTEY`
- Canonical branch: `main`

## Lane Policy

- Prefer scout for:
  - existing page and cloudfunction mapping
  - data model verification against the approved questionnaire spec
  - narrow read-only inspections before a builder patch
  - code review follow-up on a candidate branch
- Prefer builder for:
  - bounded questionnaire feature work in isolated files or directories
  - single-phase implementations that fit one reviewable patch set
  - focused refactors required to keep questionnaire code organized
- Never delegate:
  - final merge decision
  - remote push and branch coordination
  - repository-wide config rewrites
  - private config edits in `project.private.config.json`
  - destructive cleanup of unrelated legacy files without Codex review

## Document Policy

- `.md` mode: `patch/report only`
- `.docx` mode: `candidate copy + change report`
- `.docx` verification rule: `manual visual check required`

## Path Boundaries

- Allowed roots:
  - `D:\wzb\BTEY\BTEY\miniprogram`
  - `D:\wzb\BTEY\BTEY\cloudfunctions`
  - `D:\wzb\BTEY\BTEY\docs`
  - `D:\wzb\BTEY\BTEY\.omx`
  - `D:\wzb\BTEY\BTEY\.overstory`
- Forbidden roots:
  - `D:\wzb\BTEY\BTEY\.git`
  - `D:\wzb\BTEY\BTEY\.overstory\worktrees`
  - `D:\wzb\BTEY\BTEY\cloudfunctions\**\node_modules`
  - `D:\wzb\BTEY\BTEY\project.private.config.json`
  - `D:\wzb\BTEY\BTEY\miniprogram\project.private.config.json`

## High-Risk Classes

- lockfiles under `cloudfunctions/**/package-lock.json`
- global project config such as `project.config.json`
- role and permission checks in cloudfunctions
- export logic that includes child or guardian research data
- any file that changes routing in `miniprogram/app.json`

## Validation

- Default verification commands:
  - `git -C D:\wzb\BTEY\BTEY diff --check`
  - `pwsh -Command "$root='D:\\wzb\\BTEY\\BTEY'; $files=git -C $root diff --name-only HEAD~1 HEAD | Where-Object { $_ -match '\\.js$' }; foreach ($f in $files) { node --check (Join-Path $root $f) }"`
  - `git -C D:\wzb\BTEY\BTEY status --short`
- Manual verification expectations:
  - questionnaire pages touched in a phase must be smoke-tested in WeChat DevTools before completion is claimed
  - doctor/admin pages must be reviewed for role-gated entry visibility

## Merge Policy

- Require dry-run merge before integration: `yes`
- Require Codex diff review before integration: `yes`
- Allow automatic merge after worker completion: `no`
