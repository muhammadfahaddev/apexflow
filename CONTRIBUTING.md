# Contributing to ApexFlow

Thank you for your interest in contributing to ApexFlow! 🎉

ApexFlow is an open-source project and we welcome contributions of all kinds — bug fixes, new features, documentation improvements, new AI providers, and new integrations.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Good First Issues](#good-first-issues)
- [Adding an Integration](#adding-an-integration)
- [Adding an AI Provider](#adding-an-ai-provider)
- [Pull Request Process](#pull-request-process)
- [Commit Convention](#commit-convention)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/apexflow.git`
3. **Create a branch**: `git checkout -b feat/your-feature-name`
4. **Make your changes**
5. **Submit a Pull Request**

---

## Development Setup

**Prerequisites:**
- Node.js 20+
- pnpm 9+
- Docker (for local database)

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Fill in at minimum: SUPABASE and AI provider keys

# Start local Supabase
pnpm supabase start

# Run database migrations
pnpm supabase db push

# Start all apps in development mode
pnpm dev
```

**Web app:** http://localhost:3000  
**Mobile app:** Scan QR code with Expo Go

---

## Project Structure

ApexFlow is a **modular monorepo**. You don't need to understand the whole codebase to contribute.

| Area | Path | Description |
|------|------|-------------|
| Web UI | `apps/web/` | Next.js web app |
| Mobile | `apps/mobile/` | Expo Android/iOS app |
| Types | `packages/types/` | Shared TypeScript types |
| AI Layer | `packages/ai-provider/` | BYOAI abstraction |
| Plugin SDK | `packages/plugin-sdk/` | Integration interface |
| Business Logic | `packages/utils/` | Scheduler, priority, etc. |
| Constants | `packages/constants/` | Status enums, permissions |
| Integrations | `integrations/community/` | Community-built plugins |
| Database | `supabase/migrations/` | SQL schema files |
| Docs | `docs/` | Architecture, guides |

---

## How to Contribute

### 🐛 Bug Reports
Use the [Bug Report template](../../issues/new?template=bug_report.yml).

### 💡 Feature Requests
Use the [Feature Request template](../../issues/new?template=feature_request.yml).

### 🔌 New Integration
Use the [Integration Request template](../../issues/new?template=integration_request.yml)  
then read [docs/contributing/adding-integration.md](docs/contributing/adding-integration.md).

### 🤖 New AI Provider
Read [docs/contributing/adding-ai-provider.md](docs/contributing/adding-ai-provider.md).

### 📖 Documentation
Any improvements to docs, README, or code comments are welcome!

---

## Good First Issues

New to the codebase? Start here:

- [`good first issue`](../../issues?q=label%3A%22good+first+issue%22) — small, well-defined tasks
- [`help wanted`](../../issues?q=label%3A%22help+wanted%22) — larger features needing community input

---

## Adding an Integration

1. Create a folder: `integrations/community/your-integration/`
2. Create `plugin.ts` implementing the `ApexPlugin` interface from `@apexflow/plugin-sdk`
3. Create `README.md` explaining setup and usage
4. Add tests in `your-integration/tests/`
5. Submit a PR!

[**→ Full guide**](docs/contributing/adding-integration.md)

---

## Adding an AI Provider

1. Create `packages/ai-provider/src/providers/your-provider.ts`
2. Implement the `AIProvider` interface
3. Export from `packages/ai-provider/src/index.ts`
4. Add env variable documentation to `.env.example`
5. Submit a PR!

[**→ Full guide**](docs/contributing/adding-ai-provider.md)

---

## Pull Request Process

1. Make sure tests pass: `pnpm test`
2. Make sure lint passes: `pnpm lint`
3. Update documentation if needed
4. Fill out the PR template completely
5. Link the related issue: `Closes #123`
6. Request review from a maintainer

PRs are merged using **squash merge** to keep history clean.

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Telegram integration
fix: resolve task rescheduling bug on emergency mode
docs: update contributing guide
chore: upgrade Expo SDK to 52
test: add unit tests for priority calculator
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

---

Thank you for making ApexFlow better! 🌊
