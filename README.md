# SaasCore — SaaS Dashboard

A modern, full-featured SaaS Dashboard portfolio project built with Next.js 16, Tailwind CSS v4, and shadcn/ui.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — dark theme, sidebar wrapper
│   ├── page.tsx            # Dashboard page
│   ├── projects/
│   │   └── page.tsx        # Projects / Tasks page
│   └── settings/
│       └── page.tsx        # Settings page
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Collapsible sidebar navigation
│   │   └── Topbar.tsx      # Top navigation bar
│   ├── dashboard/
│   │   ├── StatsCard.tsx   # Stat overview cards with trend indicators
│   │   ├── AnalyticsChart.tsx  # Area / Bar chart with metric tabs
│   │   └── RecentActivity.tsx  # Activity feed list
│   ├── projects/
│   │   ├── TaskTable.tsx   # Data table with sort, filter, pagination
│   │   ├── TaskModal.tsx   # Create / Edit task modal with validation
│   │   └── StatusBadge.tsx # Status and priority badge components
│   └── ui/                 # shadcn/ui primitives
├── data/
│   └── mockData.ts         # All mock data (tasks, activity, chart data)
├── hooks/
│   └── useTasks.ts         # Task state management hook
├── lib/
│   └── utils.ts            # Tailwind merge utility
└── types/
    └── index.ts            # TypeScript types
```

---

## Features

### Dashboard
- 4 stat cards: Revenue, Active Users, Open Tasks, Conversion Rate
- Analytics chart (Area / Bar) switchable between Revenue / Users / Tasks metrics
- Recent activity feed with avatar initials and time-ago formatting

### Projects Page
- Full data table with 12 mock tasks
- Search across title, assignee, project
- Filter by status, priority, project
- Sort by any column (click header)
- Pagination (8 tasks per page)
- Create / Edit modal with form validation
- Delete task with confirmation

### Settings Page
- User profile card with avatar
- Language and timezone selectors
- Toggle switches for email, push, and weekly digest notifications
- Save feedback state

### UI / UX
- Dark theme forced via `html.dark`
- Collapsible sidebar (chevron toggle)
- Fully responsive layout
- shadcn/ui component system

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start
```

---

## Mock Data

All data lives in `src/data/mockData.ts`:

- **12 tasks** across 4 projects (Website Redesign, API Platform, DevOps, Marketing)
- **7 activity items** with realistic user actions
- **7 months** of chart data (Sep 2025 – Mar 2026)
- **4 stat cards** with trend percentages
- **User profile** for the settings page
