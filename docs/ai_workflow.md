# AI Development Workflow

## Overview

AlgoFlow Visualizer uses an AI-assisted development loop where agents collaborate to implement features from the backlog.

## Workflow Steps

1. **Issue Creation** — A GitHub Issue is created with a feature request or bug report using the issue template.

2. **Triage** — The Architect Agent reviews the issue, updates `docs/backlog.md`, and designs the implementation approach.

3. **Implementation** — The Developer Agent creates a feature branch and implements the changes, following `docs/coding_standards.md`.

4. **Testing** — The QA Agent writes/updates tests and runs `npm test` and `npm run lint`.

5. **Review** — The Reviewer Agent checks the pull request diff and either approves or requests changes.

6. **Merge** — On approval, the branch is merged to `main` and CI runs automatically.

7. **Monitoring** — The `issue-monitor.yml` workflow creates GitHub Issues on CI failure.

## Branch Naming

```
feat/<description>
fix/<description>
docs/<description>
test/<description>
```

## Commit Format

```
type(scope): description

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
