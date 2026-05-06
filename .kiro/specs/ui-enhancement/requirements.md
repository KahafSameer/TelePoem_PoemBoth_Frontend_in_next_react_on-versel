# Requirements Document

## Introduction

This document captures the functional and presentational requirements for the TelePoem UI Enhancement feature. The enhancement transforms both the public client/kiosk experience and the admin dashboard into polished, visually cohesive interfaces while preserving all existing functionality, component contracts, API integrations, and routing. All changes are purely presentational — no API contracts, data models, or routing are altered. No new npm dependencies are introduced.

## Glossary

- **Landing_Page**: The root `src/app/page.tsx` component that routes users to either the kiosk or admin experience.
- **Client_Layout**: The `src/app/client/layout.tsx` shell component wrapping all public-facing kiosk pages.
- **Admin_Layout**: The `src/app/admin/layout.tsx` shell component wrapping all admin pages.
- **Client_Home**: The `src/app/client/page.tsx` component displaying booth selection and poet discovery.
- **Poem_Reader**: The `src/app/client/poem/[poemId]/page.tsx` component for reading a single poem.
- **Poet_Profile**: The `src/app/client/poet/[poetId]/page.tsx` component showcasing a poet and their works.
- **Admin_Dashboard**: The `src/app/admin/page.tsx` component showing content counts and quick actions.
- **Admin_Table_Page**: Any of the four admin CRUD pages: booths, poets, collections, or poems.
- **LoadingSpinner**: The `src/components/shared/LoadingSpinner.tsx` shared component.
- **EmptyState**: The new `src/components/shared/EmptyState.tsx` shared component.
- **SearchInput**: The `src/components/shared/SearchInput.tsx` shared component.
- **isActive**: The utility function that determines whether a nav link should receive active styling.
- **Tailwind_CSS**: The utility-first CSS framework already installed in the project.
- **usePathname**: The Next.js hook from `next/navigation` that returns the current URL path.
- **poetry-text**: The CSS class applied to poem body text in `globals.css`.
- **System**: The TelePoem Next.js frontend application.

---

## Requirements

### Requirement 1: Landing Page Visual Enhancement

**User Story:** As a visitor, I want to see a visually distinct and welcoming landing page, so that I can immediately understand the two entry points and feel invited to explore.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a full-viewport hero section with a light layered gradient background using the color sequence `from-indigo-50 via-violet-50 to-slate-50`.
2. THE Landing_Page SHALL display a centered application title and tagline using the hero heading typography scale (`text-5xl font-bold tracking-tight`).
3. THE Landing_Page SHALL present two entry-point cards — one for the kiosk experience and one for the admin dashboard — with visually distinct styling: the kiosk card uses an amber accent ring and the admin card uses a slate/neutral accent ring.
4. WHEN a user hovers over an entry-point card, THE Landing_Page SHALL apply a lift effect (`hover:shadow-md` or `hover:-translate-y-1`) to indicate interactivity.
5. THE Landing_Page SHALL include decorative animated elements (subtle floating circles via CSS keyframes) that are purely cosmetic and do not affect navigation or functionality.

---

### Requirement 2: Client Layout and Header Enhancement

**User Story:** As a kiosk user, I want a polished, context-aware navigation header, so that I always know which section I am in and can navigate easily.

#### Acceptance Criteria

1. THE Client_Layout SHALL be a Client Component (include `"use client"` directive) to enable `usePathname()` usage.
2. THE Client_Layout SHALL use `usePathname()` to determine the current route and apply active styling to the matching nav link.
3. WHEN a nav link's `href` equals `/client` exactly, THE Client_Layout SHALL mark it active only when `pathname === "/client"`.
4. WHEN a nav link's `href` is any path other than `/client`, THE Client_Layout SHALL mark it active when `pathname.startsWith(href)`.
5. THE Client_Layout SHALL render the active nav link with `text-indigo-700 font-semibold border-b-2 border-indigo-600` styling.
6. THE Client_Layout SHALL render inactive nav links with a smooth underline transition on hover.
7. THE Client_Layout SHALL use a richer gradient background: `from-slate-50 via-indigo-50/30 to-white`.
8. THE Client_Layout SHALL render the header with `bg-white/95 backdrop-blur-md` and a stronger bottom border.

---

### Requirement 3: Client Home Page Card Enhancement

**User Story:** As a kiosk user, I want booth and poet cards that are visually rich and easy to scan, so that I can quickly identify and select the experience I want.

#### Acceptance Criteria

1. THE Client_Home SHALL render each booth card with a gradient accent bar (`from-indigo-500 to-violet-500`, 4px height) at the top of the card.
2. THE Client_Home SHALL display a location icon (SVG pin) beside each booth's location name.
3. THE Client_Home SHALL display each booth's theme as a styled badge/tag element.
4. WHEN a user hovers over a booth card, THE Client_Home SHALL apply `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`.
5. THE Client_Home SHALL render each poet card with a gradient avatar circle (`from-indigo-400 to-violet-500`) displaying the poet's initial letter when no image is available.
6. THE Client_Home SHALL display each poet's poem count as a badge with an amber accent.
7. THE Client_Home SHALL render poet bio text with `line-clamp-2` to prevent overflow.
8. THE Client_Home SHALL render section headers ("Select Booth", "Poets") with a decorative divider treatment.

---

### Requirement 4: Poem Reading Page Enhancement

**User Story:** As a kiosk user, I want an immersive and literary poem reading experience, so that I can focus on the poem content in a visually appropriate setting.

#### Acceptance Criteria

1. THE Poem_Reader SHALL render the poem article card with a warm off-white background (`bg-amber-50/30`) to evoke a paper-like aesthetic.
2. THE Poem_Reader SHALL display the poem title using a larger, more dramatic size (`text-4xl font-bold`).
3. THE Poem_Reader SHALL display the poet's name as a styled byline with a decorative em-dash prefix (e.g., `— Robert Frost`).
4. THE Poem_Reader SHALL apply the `.poetry-text` CSS class to the poem body text, rendering it with `font-light text-lg leading-[1.9] text-slate-800`.
5. THE Poem_Reader SHALL display a decorative large opening quote mark (faded indigo `"`) as a visual element preceding the poem text.
6. THE Poem_Reader SHALL display the poem progress indicator (e.g., `3 / 12`) styled as a pill badge.
7. WHEN `prevId` is null, THE Poem_Reader SHALL render the Previous navigation button with `opacity-40 cursor-not-allowed` disabled styling.
8. WHEN `nextId` is null, THE Poem_Reader SHALL render the Next navigation button with `opacity-40 cursor-not-allowed` disabled styling.
9. THE Poem_Reader SHALL render Previous and Next navigation as fully styled buttons with chevron icons.
10. WHERE an audio URL is available, THE Poem_Reader SHALL render the audio player with a waveform icon and "Listen" label wrapper.

---

### Requirement 5: Poet Profile Page Enhancement

**User Story:** As a kiosk user, I want a visually striking poet profile page, so that I can appreciate the poet's identity and easily browse their works.

#### Acceptance Criteria

1. THE Poet_Profile SHALL render a gradient banner header (`from-indigo-600 to-violet-700`) at the top of the profile.
2. THE Poet_Profile SHALL render the poet's avatar (112×112px) overlapping the bottom edge of the gradient banner with a `ring-4 ring-white` border.
3. WHEN no poet image is available, THE Poet_Profile SHALL render a gradient fallback circle displaying the poet's initial letter.
4. THE Poet_Profile SHALL display the poet's name in white text on the gradient banner.
5. THE Poet_Profile SHALL render the poet's bio in a clean card below the banner.
6. THE Poet_Profile SHALL render the poem list as a two-column grid of styled cards, each showing a poem number badge (amber accent), title, collection tag, and listen button.
7. THE Poet_Profile SHALL render the "Back to poets" link styled as a breadcrumb navigation element.

---

### Requirement 6: Admin Layout Sidebar Enhancement

**User Story:** As an admin user, I want a polished sidebar with clear active-state indicators and icons, so that I always know where I am in the admin section.

#### Acceptance Criteria

1. THE Admin_Layout SHALL be a Client Component (include `"use client"` directive) to enable `usePathname()` usage.
2. THE Admin_Layout SHALL use `usePathname()` to determine the current route and apply active styling to the matching sidebar nav item.
3. WHEN a sidebar nav item's `href` is `/admin` (the overview), THE Admin_Layout SHALL mark it active only when `pathname === "/admin"` (exact match).
4. WHEN a sidebar nav item's `href` is any other admin path, THE Admin_Layout SHALL mark it active when `pathname.startsWith(href)`.
5. THE Admin_Layout SHALL render the active sidebar item with `bg-indigo-50 text-indigo-700 font-semibold` and a left border accent (`border-l-2 border-indigo-600`).
6. THE Admin_Layout SHALL render inactive sidebar items with `text-slate-600 hover:bg-slate-50 hover:text-slate-900` styling.
7. THE Admin_Layout SHALL render each sidebar nav item with a corresponding SVG icon beside the label (Overview: grid icon, Booths: map-pin icon, Collections: book-open icon, Poets: user icon, Poems: document-text icon).
8. THE Admin_Layout SHALL render the sidebar with `bg-white ring-1 ring-slate-200 shadow-sm rounded-2xl` styling.
9. THE Admin_Layout SHALL render the main content area with a `bg-slate-50` page background.

---

### Requirement 7: Admin Dashboard Stat Cards Enhancement

**User Story:** As an admin user, I want color-coded stat cards on the dashboard, so that I can quickly distinguish between different content types at a glance.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL render four stat cards, each with a unique color identity: Booths uses indigo (`bg-indigo-50`, `text-indigo-700`), Collections uses violet (`bg-violet-50`, `text-violet-700`), Poems uses amber (`bg-amber-50`, `text-amber-700`), and Poets uses emerald (`bg-emerald-50`, `text-emerald-700`).
2. THE Admin_Dashboard SHALL render each stat card with a colored icon circle (48×48px) containing the appropriate SVG icon.
3. THE Admin_Dashboard SHALL render each stat card's count number using `text-4xl font-bold` typography.
4. THE Admin_Dashboard SHALL render each stat card with a "View all →" link styled subtly within the card.
5. WHEN a user hovers over a stat card, THE Admin_Dashboard SHALL apply a hover lift effect.
6. THE Admin_Dashboard SHALL render quick-action buttons as a row of outlined buttons, each color-matched to its corresponding stat card.

---

### Requirement 8: Admin Table Pages Enhancement

**User Story:** As an admin user, I want consistently styled and readable data tables across all admin CRUD pages, so that I can efficiently manage content.

#### Acceptance Criteria

1. THE Admin_Table_Page SHALL render the table wrapper with `rounded-2xl border bg-white shadow-sm overflow-hidden` styling.
2. THE Admin_Table_Page SHALL render the table header row with `bg-slate-50 border-b border-slate-200` background and `text-xs font-semibold uppercase tracking-wide text-slate-500` text styling.
3. THE Admin_Table_Page SHALL render alternating table body rows with `even:bg-slate-50/50` background.
4. WHEN a user hovers over a table row, THE Admin_Table_Page SHALL apply `hover:bg-indigo-50/30 transition-colors`.
5. THE Admin_Table_Page SHALL render Edit action buttons with `rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors` styling.
6. THE Admin_Table_Page SHALL render Delete action buttons with `rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors` styling.
7. THE Admin_Table_Page SHALL render neutral/secondary action buttons (Manage, Toggle Status) with `rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors` styling.
8. THE Admin_Table_Page SHALL render a consistent page header pattern: a title on the left and a primary "Create" action button on the right, separated from the search input by a visual divider.

---

### Requirement 9: LoadingSpinner Component Enhancement

**User Story:** As a user, I want appropriate loading indicators for both inline and full-page loading states, so that I always have clear feedback when content is being fetched.

#### Acceptance Criteria

1. THE LoadingSpinner SHALL accept an optional `variant` prop with values `"inline"` (default) or `"page"`.
2. THE LoadingSpinner SHALL accept an optional `label` prop (string) that is displayed below the spinner in the `"page"` variant.
3. WHEN `variant` is `"inline"` or not provided, THE LoadingSpinner SHALL render a small inline spinner (`h-4 w-4`, `border-2`) with "Loading..." text, preserving the existing behavior.
4. WHEN `variant` is `"page"`, THE LoadingSpinner SHALL render a fixed overlay (`fixed inset-0 z-40`) with `bg-white/80 backdrop-blur-sm`, a centered larger spinner (`h-10 w-10`, `border-4`), and the optional label text below.
5. WHEN `variant` is `"page"` and `label` is provided, THE LoadingSpinner SHALL display the label text below the spinner.
6. WHEN `variant` is `"page"` and `label` is not provided, THE LoadingSpinner SHALL render the spinner without any label text.
7. THE LoadingSpinner SHALL use `animate-spin` for the spinner animation in both variants.
8. IF the `variant` prop is omitted, THEN THE LoadingSpinner SHALL default to `"inline"` behavior, maintaining backward compatibility with all existing usages.

---

### Requirement 10: EmptyState Component Creation

**User Story:** As a user, I want consistent and informative empty-state messages across all list views, so that I understand why a list is empty and what action I can take.

#### Acceptance Criteria

1. THE System SHALL provide a new `EmptyState` component at `src/components/shared/EmptyState.tsx`.
2. THE EmptyState SHALL accept a required `title` prop (string) displayed as the primary empty-state message.
3. THE EmptyState SHALL accept an optional `icon` prop (`React.ReactNode`) displayed above the title at 48×48px.
4. THE EmptyState SHALL accept an optional `description` prop (string) displayed below the title as secondary text.
5. THE EmptyState SHALL accept an optional `action` prop (`React.ReactNode`) rendered below the description as a call-to-action element.
6. WHEN `icon` is not provided, THE EmptyState SHALL render a default inbox/document SVG icon.
7. WHEN `description` is not provided, THE EmptyState SHALL render the title without a description line.
8. WHEN `action` is not provided, THE EmptyState SHALL render without a call-to-action element.
9. THE EmptyState SHALL be rendered by Admin_Table_Page components when the filtered list has zero items.
10. WHEN the filtered list has zero items, THE Admin_Table_Page SHALL render the EmptyState component instead of an empty table body row.

---

### Requirement 11: SearchInput Component Visual Polish

**User Story:** As a user, I want a polished and responsive search input, so that I have clear visual feedback when interacting with search fields.

#### Acceptance Criteria

1. THE SearchInput SHALL render with a slightly taller input height (`py-2.5` instead of `py-2`).
2. WHEN the SearchInput receives focus, THE SearchInput SHALL display a stronger focus ring: `focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`.
3. WHEN the SearchInput receives focus, THE SearchInput SHALL apply a subtle background tint: `focus:bg-white`.
4. THE SearchInput SHALL render the clear button more prominently on hover.
5. THE SearchInput interface (props) SHALL remain unchanged from the existing implementation.

---

### Requirement 12: Global CSS Utilities Enhancement

**User Story:** As a developer, I want enhanced global CSS utilities for poetry text and animations, so that all pages consistently render polished typography and decorative effects.

#### Acceptance Criteria

1. THE System SHALL update the `.poetry-text` CSS class in `globals.css` to use `font-light text-lg leading-[1.9] text-slate-800`.
2. THE System SHALL add CSS `@keyframes` animation definitions to `globals.css` for the decorative floating-circle animations used on the landing page.
3. THE System SHALL add a `.btn-primary` utility class to `globals.css` for consistent primary button styling.
4. THE System SHALL preserve all existing CSS custom property definitions (`:root` variables) in `globals.css`.
5. THE System SHALL preserve the existing `body`, `a`, and `@theme` declarations in `globals.css`.

---

### Requirement 13: Functional Contract Preservation

**User Story:** As a developer, I want all visual enhancements to preserve existing component interfaces and functional behavior, so that no regressions are introduced.

#### Acceptance Criteria

1. THE System SHALL preserve all existing prop interfaces for every enhanced component — no required props shall be added or removed.
2. THE System SHALL preserve all existing API call patterns, data fetching hooks, and state management logic in every enhanced page.
3. THE System SHALL preserve all existing routing and navigation `href` values.
4. THE System SHALL not introduce any new npm package dependencies.
5. WHEN `"use client"` is added to a layout file, THE System SHALL ensure that child page components remain server-renderable where they currently are.
6. THE System SHALL preserve all existing TypeScript types in `src/lib/types.ts` without modification.
