<div align="center">

# 🌊 ApexFlow

### Not another chatbot. An agent that actually runs your day.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da)](https://discord.gg/apexflow)

**Plan your day. Manage your inbox. Prepare for meetings. Reschedule automatically when life changes.**

[🚀 Quick Start](#-quick-start) · [📸 Demo](#-demo) · [🗺️ Roadmap](#%EF%B8%8F-roadmap) · [🤝 Contributing](#-contributing) · [💬 Discord](https://discord.gg/apexflow)

</div>

---

## ✨ What is ApexFlow?

ApexFlow is an **open-source AI executive agent** that connects your Gmail, Google Calendar, Drive, and Docs — and actually manages your day.

It doesn't just answer questions. It:

- 🌅 **Builds your daily plan** every morning based on tasks, deadlines, and calendar
- 📧 **Reads your Gmail** and extracts action items automatically
- 📅 **Detects calendar conflicts** and plans around them
- 🚨 **Rebuilds your schedule** automatically when emergencies happen
- 📋 **Prepares meeting briefs** before every important call
- 🔔 **Sends smart reminders** with context, not just alarms
- 📝 **Tracks everything** with a full activity timeline

All with your permission. You stay in control.

---

## 📸 Demo

> *Screenshots and demo GIF coming in v0.1 launch*

---

## 🚀 Quick Start

### Option 1: Vercel + Supabase (Recommended — fastest)

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/apexflow.git
cd apexflow

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env
# Fill in your Supabase and Gemini API keys

# 4. Run database migrations
pnpm supabase db push

# 5. Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — done!

### Option 2: Self-Host with Docker

```bash
git clone https://github.com/yourusername/apexflow.git
cd apexflow
cp .env.example .env   # fill in your values
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 Bring Your Own AI (BYOAI)

ApexFlow works with any major AI provider. Just set `AI_PROVIDER` in your `.env`:

| Provider | Config | Cost |
|----------|--------|------|
| **Google Gemini** (default) | `AI_PROVIDER=gemini` | Free tier available |
| **OpenAI GPT-4o** | `AI_PROVIDER=openai` | Pay per use |
| **Anthropic Claude** | `AI_PROVIDER=claude` | Pay per use |
| **Ollama** (local, private) | `AI_PROVIDER=ollama` | Free |

```env
# Example: Switch to local Ollama (completely free and private)
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.1
```

---

## 🏗️ Architecture

ApexFlow is a **Turborepo monorepo** with two apps and shared packages:

```
apexflow/
├── apps/web/          → Next.js 14 web app
├── apps/mobile/       → Expo (Android first, iOS ready)
└── packages/
    ├── types/         → Shared TypeScript interfaces
    ├── ai-provider/   → BYOAI abstraction layer
    ├── plugin-sdk/    → Build your own integration
    ├── utils/         → Priority calc, scheduler algo
    └── constants/     → Status enums, permission levels
```

**Tech Stack:** Next.js · Expo · TypeScript · Supabase · Inngest · tRPC · Tailwind

---

## 🔌 Integrations

### Official (Core Team)
- ✅ Gmail
- ✅ Google Calendar
- ✅ Google Drive
- ✅ Google Docs

### Community (You can build these!)
- [ ] Telegram — [Help wanted #12](../../issues/12)
- [ ] Slack — [Help wanted #13](../../issues/13)
- [ ] Notion — [Help wanted #14](../../issues/14)
- [ ] Outlook / Microsoft 365 — [Help wanted #15](../../issues/15)
- [ ] GitHub — [Help wanted #16](../../issues/16)

[**→ How to build an integration**](docs/contributing/adding-integration.md)

---

## 🗺️ Roadmap

| Version | Focus | Status |
|---------|-------|--------|
| **v0.1** | Tasks + Daily Planner + Reminders + Emergency Mode | 🚧 In Progress |
| **v0.2** | Google Calendar Integration | 📋 Planned |
| **v0.3** | Gmail Integration | 📋 Planned |
| **v0.4** | Google Drive + Docs | 📋 Planned |
| **v0.5** | Cross-Google Intelligence | 📋 Planned |
| **v0.6** | Mobile App (Android) | 📋 Planned |
| **v0.7** | Plugin System | 📋 Planned |
| **v0.8** | Local AI (Ollama) | 📋 Planned |
| **v0.9** | Community Integrations | 📋 Planned |
| **v1.0** | Stable Release | 📋 Planned |

[**→ Full Roadmap**](docs/roadmap.md)

---

## 🤝 Contributing

ApexFlow is built by the community, for the community.

**New to open source?** Start with [good first issues](../../issues?q=label%3A%22good+first+issue%22)

**Want to add an integration?** Read [adding-integration.md](docs/contributing/adding-integration.md)

**Want to add an AI provider?** Read [adding-ai-provider.md](docs/contributing/adding-ai-provider.md)

[**→ Full Contributing Guide**](CONTRIBUTING.md)

---

## 🔒 Security

ApexFlow handles Gmail and Google Drive access. We take security seriously.

- OAuth tokens encrypted at rest
- Minimum Google API scopes only
- All destructive actions require explicit confirmation
- Activity log is append-only (tamper-evident)

Found a vulnerability? Please read [SECURITY.md](SECURITY.md) before reporting.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ by [ApexFlow Contributors](../../graphs/contributors)

[⭐ Star this repo](../../stargazers) · [🐛 Report a bug](../../issues/new?template=bug_report.yml) · [💡 Request a feature](../../issues/new?template=feature_request.yml)

</div>
