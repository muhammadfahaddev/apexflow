# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Full support |
| 0.x     | 🔒 Security fixes only |

---

## Reporting a Vulnerability

**⚠️ Please do NOT create a public GitHub issue for security vulnerabilities.**

ApexFlow handles Gmail and Google Drive access on behalf of users. Security issues must be handled carefully.

### How to Report

**Option 1 (Preferred):** Use [GitHub's private vulnerability reporting](../../security/advisories/new)

**Option 2:** Email `security@apexflow.dev`  
Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### Response Timeline

| Step | Time |
|------|------|
| Acknowledgement | Within 48 hours |
| Severity assessment | Within 5 days |
| Fix timeline communication | Within 7 days |
| Public disclosure | After fix is released |

---

## Security Architecture

ApexFlow is designed with security-first principles:

- **Principle of least privilege** — minimum Google OAuth scopes requested
- **Permission-based automation** — all destructive actions require confirmation
- **Encrypted tokens** — OAuth tokens encrypted at rest via Supabase Vault
- **Audit log** — append-only activity log for full transparency
- **No credential storage** — API keys in environment variables, never in DB
- **User control** — users can revoke all Google access from Settings at any time

---

## Google OAuth Scopes Used

ApexFlow requests only the minimum required scopes:

| Scope | Why |
|-------|-----|
| `gmail.readonly` | Read emails for task extraction and summaries |
| `gmail.compose` | Create email drafts |
| `gmail.send` | Send emails (only with user confirmation) |
| `calendar.readonly` | Read events for daily planning |
| `calendar.events` | Create personal task blocks |
| `drive.readonly` | Search for project files |
| `drive.file` | Create/update files agent created |
| `documents.readonly` | Read documents for context |
| `documents` | Create/update documents with user permission |

---

## Automated Security

- **GitHub Dependabot** — automatic dependency vulnerability updates
- **Secret scanning** — prevents accidental credential commits
- **Push protection** — blocks pushes containing secrets
- **CodeQL** — static analysis for common vulnerabilities
