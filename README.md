<div align="center">

# Labqii Tech

**Portfolio of Muhammad Iqbal Firmansyah**

Fullstack JavaScript Developer — React · Next.js · Node.js

[![Live](https://img.shields.io/badge/live-iqbalfir.vercel.app-0F2442?style=flat-square&logo=vercel&logoColor=white)](https://iqbalfir.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## About

Personal portfolio website with a built-in admin panel for full content control — no external CMS needed. Projects, activities, experiences, CV, and tech stack are all manageable directly from the dashboard.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Storage | Cloudinary |
| Hosting | Vercel |

---

## Features

### Portfolio

- 🌗 &nbsp;**Dark / Light mode** — default light, persistent across sessions
- ✨ &nbsp;**Smooth animations** — page transitions, magic line navbar, anti-gravity background orbs
- 💀 &nbsp;**Skeleton loading** — elegant placeholder while API data loads
- 🎵 &nbsp;**Background music** — hint alert on first visit per session
- 📱 &nbsp;**Fully responsive** — optimized across all screen sizes
- 🔗 &nbsp;**Hash navigation** — smooth scroll to section from any page, waits for data to load

### Admin Panel `/admin`

- 📊 &nbsp;**Dashboard** — stats overview: total projects, posts, experiences, CV last updated
- 🗂 &nbsp;**Manage Projects** — create, edit, delete projects with status (draft / live)
- 📝 &nbsp;**Manage Posts & Activities** — full CRUD for blog posts and activity entries
- 🧑‍💼 &nbsp;**Manage Admins** — control admin access and roles
- 📄 &nbsp;**CV Manager** — upload and update CV file, track last updated date
- 🖼 &nbsp;**Tech Logos** — manage technology icons displayed on profile

---

## Getting Started

**1. Clone & install**

```bash
git clone https://github.com/iqbalfirmansyah/labqii.git
cd labqii
npm install
```

**2. Setup environment**

```bash
cp .env.example .env.local
```

```env
# Supabase
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

**3. Setup database**

```bash
npx prisma migrate dev
npx prisma generate
```

**4. Run dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) · Admin at [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Project Structure

```
labqii/
├── app/
│   ├── (portfolio)/          # Public portfolio pages
│   └── admin/                # Admin panel pages
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── sections/             # Homepage sections
│   └── admin/                # Admin-specific components
├── lib/                      # Utilities & API helpers
├── prisma/
│   └── schema.prisma
└── public/                   # Static assets
```

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint check
npx prisma studio    # Database GUI
```

---

## Deployment

Deployed on **Vercel** — connected to Supabase and Cloudinary.

> Make sure all environment variables are configured in the Vercel dashboard before deploying.

```bash
npm run build
```

---

## Admin Access

Navigate to `/admin` and sign in with your registered admin credentials.
New admin accounts can be created from the **Manage Admins** page after first login.

---

<div align="center">

Made with ☕ by **Iqbal** &nbsp;·&nbsp; [iqbalfir.vercel.app](https://iqbalfir.vercel.app)

</div>
