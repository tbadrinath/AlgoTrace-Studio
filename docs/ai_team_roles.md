# AI Team Roles

This document describes the AI agent roles used in the AlgoFlow Visualizer development workflow.

## Roles

### 🏗️ Architect Agent
- Designs system architecture and component interfaces
- Reviews technology choices and dependency decisions
- Maintains `docs/architecture.md` and `docs/system_spec.md`

### 💻 Developer Agent
- Implements features from backlog tickets
- Writes TypeScript/React code following coding standards
- Ensures all components pass type-checking and lint

### 🧪 QA Agent
- Writes Jest unit tests for engine logic
- Writes Playwright E2E tests for UI flows
- Runs `npm test` and reports failures

### 🔍 Reviewer Agent
- Reviews code changes for quality, correctness, and security
- Checks for adherence to `docs/coding_standards.md`
- Approves or requests changes on pull requests

### 📝 Documentation Agent
- Keeps docs/ up to date with code changes
- Writes API documentation and usage examples
- Updates backlog with completed items
