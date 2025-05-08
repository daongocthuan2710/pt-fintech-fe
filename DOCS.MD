## STRUCTURE

```bash

src/
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── (routes folders)
│
├── components/               # UI layer (Atomic Design)
│   ├── atoms/               # button, input, icon, badge,...
│   ├── molecules/           # input with label, card, list item,...
│   ├── organisms/           # navbar, footer, table, modal,...
│   ├── templates/           # page layout, section layout,...
│   └── pages/               # UI specific for each page
│
├── features/                # Feature-based structure
│   └── user/
│       ├── components/
│       ├── hooks.ts
│       ├── services.ts
│       ├── types.ts
│       └── index.ts
│
├── libs/                    # Libs / Helpers / Utils
│   ├── axios.ts
│   ├── fetcher.ts
│   └── format.ts
│
├── hooks/                   # Global reusable hooks
│   └── useDebounce.ts
│
├── constants/               # Static constants / enums
│   ├── routes.ts
│   └── config.ts
│
├── styles/                  # Tailwind config & global style
│   └── globals.css
│
├── assets/                  # Static images / icons
│
├── types/                   # Global types & interfaces
│
├── lib/                     # Server-side lib (Next.js RSC)
│
├── middleware.ts            # Next.js Middleware
│
├── env.d.ts                 # Env types declaration
│
├── utils/                   # Utility functions
│
└── config/                  # SEO config, theme config, i18n config

```

## SET UP:

### UI & UX Ready

- Responsive Layout ready

- Responsive sample layout

- UI base components clean (Button, Input, Modal, Toast)

- Page Loader

- Toastify notification

- Modal ready

- Dark mode ready

- Error Boundary setup

### Auth & RBAC Ready

- API auth ready

- Sample login/register page ready

- Demo Login/Register ready

- Protect route ready (RBAC)

- Role-based access (RBAC)

- Hook useAuth, useUser

### API & Data Layer

- API layer (REST API chuẩn)

- Fetch API chuẩn REST + SWR

- State management bằng Context cực nhẹ

### Theme & Style

- Tailwind Theme config riêng

- Multi-theme (color system)

- Support dark / light / custom theme

- useTheme hook

### SEO & i18n

- SEO dynamic example (Next SEO config sẵn)

- Support đa ngôn ngữ (i18n)

### Form & Validation

- Form validation bằng zod / react-hook-form

### Code Quality & Best Practice

- Clean structure

- Auto format (ESLint + Prettier + Husky)

- Alias ready (@/paths)

- Env type-safe (.env + env.d.ts)

### Extra tiện cho Dev

- Folder mẫu feature User

- File README hướng dẫn rõ ràng

### Data Layer Patterns:

- API Layer riêng: Call API qua hooks hoặc libs
- Repository Pattern: Call API qua repo giống BE style
- Adapter Pattern: Convert API response qua FE model
