# AI Development Loop

This document describes the automated AI development loop for AlgoFlow Visualizer.

## Overview

The AI dev loop runs continuously to process backlog items, implement features, and maintain code quality.

## Loop Steps

```
1. Read docs/backlog.md → pick next "Todo" item
2. Create feature branch: feat/<item-name>
3. Implement changes following docs/coding_standards.md
4. Run: npm run lint && npm test
5. Fix any errors
6. Commit with Co-authored-by trailer
7. Open pull request
8. Wait for CI to pass
9. Merge to main
10. Update docs/backlog.md (move item to Done)
11. Repeat
```

## Failure Handling

If CI fails on `main`:
- `issue-monitor.yml` creates a GitHub Issue with the failure details
- The QA Agent investigates and opens a fix PR

## Trigger Conditions

- Manually triggered via `workflow_dispatch`
- Scheduled nightly (future)
- On new GitHub Issues labeled `ai-task`
