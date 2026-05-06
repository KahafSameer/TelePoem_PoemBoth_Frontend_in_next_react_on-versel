# Implementation Plan

## Tasks

- [x] 1. Enhance global CSS utilities (`src/app/globals.css`)
  - [x] 1.1 Update `.poetry-text` class to `font-light text-lg leading-[1.9] text-slate-800`
  - [x] 1.2 Add `@keyframes float-slow` and `@keyframes float-medium` animation definitions for landing page decorative circles
  - [x] 1.3 Add `.btn-primary` utility class for consistent primary button styling
  - [x] 1.4 Verify all existing `:root` CSS custom properties (`--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--danger`) are preserved
  - **Files**: `src/app/globals.css`
  - **Requirements**: 12.1, 12.2, 12.3, 12.4, 12.5

- [x] 2. Enhance `LoadingSpinner` shared component
  - [x] 2.1 Add `variant` prop (`"inline" | "page"`, default `"inline"`) and `label` prop (`string | undefined`) to the component interface
  - [x] 2.2 Implement `"inline"` variant: preserve existing small spinner (`h-4 w-4 border-2`) with "Loading..." text
  - [x] 2.3 Implement `"page"` variant: `fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm` with larger spinner (`h-10 w-10 border-4`) and optional label text below
  - [x] 2.4 Verify backward compatibility — all existing call sites using `<LoadingSpinner />` with no props continue to render the inline variant unchanged
  - **Files**: `src/components/shared/LoadingSpinner.tsx`
  - **Requirements**: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8

- [x] 3. Create `EmptyState` shared component
  - [x] 3.1 Create `src/components/shared/EmptyState.tsx` with interface: `{ title: string; icon?: React.ReactNode; description?: string; action?: React.ReactNode }`
  - [x] 3.2 Implement default SVG icon (inbox/document) rendered when `icon` prop is not provided
  - [x] 3.3 Implement layout: centered column with icon (48×48px area), title (`text-sm font-medium text-slate-900`), optional description (`text-sm text-slate-500`), optional action element
  - [x] 3.4 Apply container styling: `py-12 flex flex-col items-center gap-3 text-center`
  - **Files**: `src/components/shared/EmptyState.tsx`
  - **Requirements**: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8

- [x] 4. Polish `SearchInput` shared component
  - [x] 4.1 Update input padding to `py-2.5` (from `py-2`)
  - [x] 4.2 Strengthen focus ring to `focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`
  - [x] 4.3 Add `focus:bg-white` for subtle background tint on focus
  - [x] 4.4 Make clear button more prominent on hover (increase opacity or add background on hover)
  - [x] 4.5 Verify the component's prop interface is unchanged
  - **Files**: `src/components/shared/SearchInput.tsx`
  - **Requirements**: 11.1, 11.2, 11.3, 11.4, 11.5

- [x] 5. Enhance Landing Page (`src/app/page.tsx`)
  - [x] 5.1 Replace the plain centered layout with a full-viewport hero using `min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-50`
  - [x] 5.2 Update the H1 to use `text-5xl font-bold tracking-tight text-indigo-900` with a tagline below it
  - [x] 5.3 Restyle the kiosk entry card with an amber accent ring (`ring-2 ring-amber-400/60`) and a decorative icon/emoji
  - [x] 5.4 Restyle the admin entry card with a slate accent ring (`ring-2 ring-slate-300`) and a decorative icon/emoji
  - [x] 5.5 Add hover lift effects to both cards: `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`
  - [x] 5.6 Add two decorative floating circle elements (absolutely positioned, using the keyframe animations from task 1.2) as purely cosmetic background elements
  - **Files**: `src/app/page.tsx`
  - **Requirements**: 1.1, 1.2, 1.3, 1.4, 1.5

- [x] 6. Enhance Client Layout & Header (`src/app/client/layout.tsx`)
  - [x] 6.1 Add `"use client"` directive at the top of the file
  - [x] 6.2 Import `usePathname` from `next/navigation`
  - [x] 6.3 Implement `isActive(pathname, href, exact?)` utility function: exact match when `exact=true`, `startsWith` otherwise
  - [x] 6.4 Apply active styling to matching nav link: `text-indigo-700 font-semibold border-b-2 border-indigo-600`
  - [x] 6.5 Apply inactive styling with hover transition: `text-slate-600 hover:text-slate-900 transition-colors`
  - [x] 6.6 Update page background gradient to `from-slate-50 via-indigo-50/30 to-white`
  - [x] 6.7 Update header to `bg-white/95 backdrop-blur-md` with a stronger bottom border (`border-b border-slate-200`)
  - [x] 6.8 Add a "Home" nav link for `/client` with exact-match active detection
  - **Files**: `src/app/client/layout.tsx`
  - **Requirements**: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8

- [x] 7. Enhance Client Home Page (`src/app/client/page.tsx`)
  - [x] 7.1 Add a 4px gradient accent bar (`bg-gradient-to-r from-indigo-500 to-violet-500 h-1 rounded-t-2xl`) at the top of each booth card
  - [x] 7.2 Add an SVG map-pin icon beside each booth's location name
  - [x] 7.3 Render each booth's theme as a styled badge: `inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700`
  - [x] 7.4 Update booth card hover to `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`
  - [x] 7.5 Replace the plain poet avatar with a gradient circle (`bg-gradient-to-br from-indigo-400 to-violet-500`) showing the poet's initial letter when no image is available
  - [x] 7.6 Style the poem count badge with amber accent: `bg-amber-50 text-amber-700`
  - [x] 7.7 Ensure poet bio text has `line-clamp-2` applied
  - [x] 7.8 Replace the plain empty-state `<p>` elements with the new `EmptyState` component for both booths and poets sections
  - **Files**: `src/app/client/page.tsx`
  - **Requirements**: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8

- [x] 8. Enhance Poem Reading Page (`src/app/client/poem/[poemId]/page.tsx`)
  - [x] 8.1 Update the article card background to `bg-amber-50/30` and increase border radius to `rounded-2xl`
  - [x] 8.2 Update poem title to `text-4xl font-bold tracking-tight`
  - [x] 8.3 Render the poet byline as `— {poet.name}` with `text-slate-600 mt-2` styling
  - [x] 8.4 Ensure poem body text uses the `.poetry-text` class (already present; verify it picks up the updated CSS)
  - [x] 8.5 Add a decorative large opening quote mark element (`text-8xl font-serif text-indigo-200 leading-none select-none`) before the poem text
  - [x] 8.6 Style the progress indicator as a pill badge: `rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600`
  - [x] 8.7 Replace plain Previous/Next `<Link>` elements with fully styled buttons including left/right chevron SVG icons and `opacity-40 cursor-not-allowed` disabled state
  - [x] 8.8 Wrap the audio player in a styled container with a waveform SVG icon and "Listen to this poem" label
  - **Files**: `src/app/client/poem/[poemId]/page.tsx`
  - **Requirements**: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10

- [x] 9. Enhance Poet Profile Page (`src/app/client/poet/[poetId]/page.tsx`)
  - [x] 9.1 Add a gradient banner header (`bg-gradient-to-r from-indigo-600 to-violet-700 h-32 rounded-t-2xl`) at the top of the profile article
  - [x] 9.2 Position the avatar (112×112px) to overlap the bottom edge of the banner using negative margin (`-mt-14`) and add `ring-4 ring-white shadow-lg`
  - [x] 9.3 Render the poet's name in white text (`text-white`) on the gradient banner
  - [x] 9.4 For poets without an image, render a gradient fallback circle (`bg-gradient-to-br from-indigo-400 to-violet-500`) with the initial letter
  - [x] 9.5 Render the poet's bio in a clean card section below the banner
  - [x] 9.6 Update the poem list cards to show: amber poem number badge, title as a link, collection tag, and listen button — in a two-column grid
  - [x] 9.7 Style the "Back to poets" link as a breadcrumb: `← Back to poets` with `text-sm text-indigo-700 hover:underline flex items-center gap-1`
  - [x] 9.8 Replace the plain empty-state `<p>` for no poems with the `EmptyState` component
  - **Files**: `src/app/client/poet/[poetId]/page.tsx`
  - **Requirements**: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7

- [x] 10. Enhance Admin Layout Sidebar (`src/app/admin/layout.tsx`)
  - [x] 10.1 Add `"use client"` directive at the top of the file
  - [x] 10.2 Import `usePathname` from `next/navigation`
  - [x] 10.3 Implement `isActive(pathname, href, exact?)` utility (same logic as task 6.3; consider extracting to a shared util)
  - [x] 10.4 Apply active sidebar item styling: `bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600 pl-[10px]`
  - [x] 10.5 Apply inactive sidebar item styling: `text-slate-600 hover:bg-slate-50 hover:text-slate-900`
  - [x] 10.6 Add inline SVG icons for each nav item: grid icon (Overview), map-pin (Booths), book-open (Collections), user (Poets), document-text (Poems)
  - [x] 10.7 Update sidebar container to `bg-white ring-1 ring-slate-200 shadow-sm rounded-2xl`
  - [x] 10.8 Update the main content area wrapper to use `bg-slate-50` as the page background
  - [x] 10.9 Mark the `/admin` Overview link with `exact: true` for active detection
  - **Files**: `src/app/admin/layout.tsx`
  - **Requirements**: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9

- [x] 11. Enhance Admin Dashboard (`src/app/admin/page.tsx`)
  - [x] 11.1 Assign each stat card a unique color config: Booths → indigo, Collections → violet, Poems → amber, Poets → emerald
  - [x] 11.2 Render each stat card with a 48×48px colored icon circle containing the appropriate SVG icon
  - [x] 11.3 Update the count number to `text-4xl font-bold` within each card
  - [x] 11.4 Add a subtle "View all →" link inside each stat card pointing to the corresponding admin table page
  - [x] 11.5 Add hover lift effect to each stat card: `hover:-translate-y-0.5 hover:shadow-md transition-all duration-150`
  - [x] 11.6 Update quick-action buttons to be outlined and color-matched to their stat card (indigo for Booths, violet for Collections, etc.)
  - **Files**: `src/app/admin/page.tsx`
  - **Requirements**: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6

- [x] 12. Enhance Admin Booths Table Page (`src/app/admin/booths/page.tsx`)
  - [x] 12.1 Update the section wrapper to `rounded-2xl border bg-white shadow-sm overflow-hidden`
  - [x] 12.2 Update the `<thead>` row to `bg-slate-50 border-b border-slate-200` with `text-xs font-semibold uppercase tracking-wide text-slate-500` on `<th>` elements
  - [x] 12.3 Add `even:bg-slate-50/50 hover:bg-indigo-50/30 transition-colors` to `<tr>` elements in `<tbody>`
  - [x] 12.4 Update Edit button to: `rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors`
  - [x] 12.5 Update Delete button to: `rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors`
  - [x] 12.6 Update Toggle Status button to: `rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors`
  - [x] 12.7 Replace the inline empty-state `<td>` text with the `EmptyState` component rendered in a full-width `<tr>` when `filteredBooths.length === 0`
  - [x] 12.8 Ensure the page header follows the consistent pattern: title left, "+ Create Booth" button right, SearchInput below with a visual separator

- [x] 13. Enhance Admin Poets Table Page (`src/app/admin/poets/page.tsx`)
  - [x] 13.1 Apply the same table wrapper styling as task 12.1
  - [x] 13.2 Apply the same `<thead>` styling as task 12.2
  - [x] 13.3 Apply the same `<tbody>` row hover/alternating styling as task 12.3
  - [x] 13.4 Apply standardized Edit, Delete, and neutral action button styles (tasks 12.4–12.6)
  - [x] 13.5 Replace inline empty-state text with `EmptyState` component
  - [x] 13.6 Ensure consistent page header pattern (title + create button + search)

- [x] 14. Enhance Admin Collections Table Page (`src/app/admin/collections/page.tsx`)
  - [x] 14.1 Apply the same table wrapper styling as task 12.1
  - [x] 14.2 Apply the same `<thead>` styling as task 12.2
  - [x] 14.3 Apply the same `<tbody>` row hover/alternating styling as task 12.3
  - [x] 14.4 Apply standardized Edit, Delete, and neutral action button styles (tasks 12.4–12.6)
  - [x] 14.5 Replace inline empty-state text with `EmptyState` component
  - [x] 14.6 Ensure consistent page header pattern (title + create button + search)

- [x] 15. Enhance Admin Poems Table Page (`src/app/admin/poems/page.tsx`)
  - [x] 15.1 Apply the same table wrapper styling as task 12.1
  - [x] 15.2 Apply the same `<thead>` styling as task 12.2
  - [x] 15.3 Apply the same `<tbody>` row hover/alternating styling as task 12.3
  - [x] 15.4 Apply standardized Edit, Delete, and neutral action button styles (tasks 12.4–12.6)
  - [x] 15.5 Replace inline empty-state text with `EmptyState` component
  - [x] 15.6 Ensure consistent page header pattern (title + create button + search)

- [ ] 16. Extract shared `isActive` utility and write unit tests
  - [ ] 16.1 Create `src/lib/utils/isActive.ts` exporting `isActive(pathname: string, href: string, exact?: boolean): boolean`
  - [ ] 16.2 Update `src/app/client/layout.tsx` and `src/app/admin/layout.tsx` to import from the shared utility
  - [ ] 16.3 Write unit tests for `isActive`: exact-match true/false cases, prefix-match true/false cases, edge cases (trailing slashes, sub-paths)
  - [ ] 16.4 Write unit tests for `LoadingSpinner`: inline variant renders without `fixed` class, page variant renders with `fixed` class, page variant with label renders label text, page variant without label renders no label
  - [ ] 16.5 Write unit tests for `EmptyState`: title always rendered, description rendered when provided, action rendered when provided, default icon rendered when icon not provided
  - **Files**: `src/lib/utils/isActive.ts`, `src/app/client/layout.tsx`, `src/app/admin/layout.tsx`, test files
  - **Requirements**: 2.3, 2.4, 6.3, 6.4, 9.3, 9.4, 9.5, 9.8, 10.2, 10.4, 13.1
