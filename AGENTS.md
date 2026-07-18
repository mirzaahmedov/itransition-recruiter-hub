# Developer Agent Guide & Project Rules

This document outlines the architecture, workspace commands, and coding standards for our monorepo. Refer to this file whenever generating code, refactoring, or running migrations.

---

## 1. Directory Structure

```text
.
├── apps/
│   ├── web/               # React + Vite frontend
│   └── api/               # NestJS backend api
├── packages/
│   ├── database/                # Shared database workspace (Prisma schema & client)
│   ├── shared/                  # Shared validation schemas, types and utils etc.
├── package.json           # Monorepo root configuration
└── AGENTS.md              # This file
```

# Project Rules

When generating or refactoring UI components, strictly follow the patterns, APIs, and guidelines defined in the library documentation:
@llms.txt
