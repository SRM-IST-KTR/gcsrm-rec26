# GCSRM Recruitment '26 Portal

The official recruitment registration and candidate status portal for GitHub Community SRM (GCSRM) Recruitment Drive 2026.

## Overview

A client application built with Next.js (App Router), React 19, Tailwind CSS, and Radix UI. Interfaces with the **`gcsrm_server`** backend API for OTP verification, applicant registration, task retrieval, and submission tracking.

## Getting Started

### Prerequisites

- Node.js (v20+)
- Running `gcsrm_server` backend instance (`http://localhost:8000`)

### Environment Configuration

Create `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server on port 3001
npm run dev -- -p 3001
```

Visit [http://localhost:3001](http://localhost:3001) to view the portal.
