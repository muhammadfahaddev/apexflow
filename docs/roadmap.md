# ApexFlow Public Roadmap

> *Last updated: October 2026*

**ApexFlow** is an open-source AI executive agent. This roadmap shows what's coming and when.

Want to influence the roadmap? [Open a discussion](../../discussions) or [vote on issues](../../issues).

---

## 🚧 In Progress

### v0.1 — Foundation
*Target: Q4 2026*

**Core Features:**
- [x] Turborepo monorepo setup
- [x] Shared TypeScript types
- [x] BYOAI abstraction layer
- [x] Plugin SDK
- [x] Database schema
- [ ] Task management (10 status types)
- [ ] Smart priority engine (8 factors)
- [ ] Daily planner algorithm
- [ ] Reminder lifecycle (Before/Start/Overdue/Follow-up)
- [ ] Emergency mode + automatic rescheduling
- [ ] Activity log / timeline
- [ ] Basic agent memory
- [ ] Web chat interface
- [ ] Daily summary + weekly review
- [ ] Gemini AI provider

---

## 📋 Planned

### v0.2 — Google Calendar
*Target: Q1 2027*
- Google OAuth + Calendar connection
- Event reading + availability check
- Conflict detection
- Calendar-aware daily planning
- Personal focus blocks
- Controlled event changes

### v0.3 — Gmail
*Target: Q1 2027*
- Inbox reading + thread understanding
- Email summaries + important detection
- Action item + deadline extraction
- Email-to-task workflow
- Draft replies
- Approval-based sending (Level 2 default)
- Email audit trail

### v0.4 — Google Drive + Docs
*Target: Q2 2027*
- File/folder search + project folders
- Docs reading + content extraction
- Docs creation (work log, meeting notes)
- Suggest/Edit modes
- Project status documents

### v0.5 — Cross-Google Intelligence
*Target: Q2 2027*
- Email → Task → Calendar → Drive connected workflows
- Meeting preparation brief
- Post-meeting notes → Tasks
- OpenAI provider support

### v0.6 — Mobile App (Android First)
*Target: Q3 2027*
- Expo Android app
- Push notifications with 8 action types
- Voice commands (Expo Speech)
- Emergency button
- Approval inbox (mobile)
- iOS support

### v0.7 — Plugin System
*Target: Q3 2027*
- `@apexflow/plugin-sdk` stable
- Plugin registration system
- Plugin settings UI
- `integrations/community/` open for PRs

### v0.8 — Local AI (Privacy-First)
*Target: Q4 2027*
- Ollama provider (llama3.1, mistral, phi3)
- Claude provider
- Local model setup guide
- Zero cloud AI option

### v0.9 — Community Integrations
*Target: Q4 2027*
- Telegram plugin (official)
- Community integrations from contributors
- Self-host Docker Compose (stable)
- i18n foundation

### v1.0 — Stable Release
*Target: Q1 2028*
- All features stable + tested
- Full documentation website
- Demo instance live
- Security audit complete
- Production-ready

---

## 💡 Future Ideas (Beyond v1.0)

These are ideas we're considering for the future. No timeline yet.

- Microsoft 365 / Outlook integration
- Notion integration
- GitHub integration (PR/issue → task)
- WhatsApp Business integration
- Voice-first mobile mode
- Team mode (multi-user)
- API for external automations
- Browser extension

Want to build any of these? [Open an issue!](../../issues/new?template=integration_request.yml)
