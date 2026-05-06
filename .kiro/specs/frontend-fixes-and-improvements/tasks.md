# Implementation Plan: Frontend Fixes and Improvements

## Overview

Implement all fixes and missing functionality for the Teligram UI poetry kiosk system. The plan is structured to deliver stable foundations first (hook fix, shared components), then layer in CRUD operations for each entity, and finally wire everything together with error boundaries and poem sorting. All changes are confined to the frontend project.

## Tasks

- [x] 1. Fix useFetch hook — eliminate infinite re-render risk and add AbortController
  - Replace `fetchFn` in `useCallback` deps with a `useRef` to hold the latest `fetchFn`
  - Add `AbortController` per request; abort on cleanup and ignore `AbortError`
  - Only update state when `!abortController.signal.aborted`
  - Modify `src/lib/hooks/useFetch.ts` in place — keep the same public API (`data`, `loading`, `error`, `refetch`)
  - _Requirements: Property 1 (No Infinite Re-renders), Property 2 (Request Cleanup)_

  - [ ]* 1.1 Write property test for useFetch cleanup
    - **Property 2: Request Cleanup** — unmounting always aborts in-flight requests and produces no state updates
    - **Validates: Requirements Property 2**

- [x] 2. Add environment variable support for API base URL
  - Create `.env.local` with `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1`
  - `src/lib/constants/api.ts` already reads `process.env.NEXT_PUBLIC_API_URL` — verify the fallback is correct and add a comment documenting the variable
  - _Requirements: Environment Configuration_

- [x] 3. Build shared UI primitives — Modal, ConfirmDialog, form inputs, Button
  - [x] 3.1 Create `src/components/shared/Modal.tsx`
    - Implement `ModalProps` interface from design: `isOpen`, `onClose`, `title`, `children`, `size?`
    - Render via `ReactDOM.createPortal` into `document.body`
    - Lock body scroll when open; restore on close
    - Close on ESC keydown and overlay click
    - Focus-trap: cycle Tab/Shift+Tab within focusable elements inside the modal
    - Add ARIA attributes: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
    - Only render children when `isOpen` is true (lazy rendering)
    - _Requirements: Property 6 (Modal Focus Trap), Component Interface §1_

  - [ ]* 3.2 Write property test for Modal focus trap
    - **Property 6: Modal Focus Trap** — Tab key never moves focus outside an open modal
    - **Validates: Requirements Property 6**

  - [x] 3.3 Create `src/components/shared/ConfirmDialog.tsx`
    - Implement `ConfirmDialogProps` interface from design
    - Use `Modal` internally
    - Show loading state on confirm button while `onConfirm` is executing
    - Prevent double-submission by disabling confirm button when `loading` is true
    - Color-code by `variant`: red for `"danger"`, amber for `"warning"`
    - _Requirements: Component Interface §2_

  - [x] 3.4 Create `src/components/shared/form/Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Button.tsx`
    - `Input`: wraps `<input>`, shows `label`, renders `error` message below, red border on error
    - `Textarea`: same pattern for `<textarea>`
    - `Select`: wraps `<select>`, accepts `options: Array<{ value: string; label: string }>`
    - `Button`: `variant` prop (`primary` | `secondary` | `danger`), `loading` spinner, `fullWidth` flag
    - All components forward native HTML attributes via spread
    - All inputs have associated `<label>` with `htmlFor` pointing to a generated or passed `id`
    - _Requirements: Component Interface §3_

- [x] 4. Build ErrorBoundary and wire it into the app
  - [x] 4.1 Create `src/components/shared/ErrorBoundary.tsx`
    - Class component extending `React.Component<ErrorBoundaryProps, ErrorBoundaryState>`
    - Implement `getDerivedStateFromError` and `componentDidCatch` (log to console)
    - Render `fallback` prop if provided, otherwise a default card with error message and "Try Again" button
    - "Try Again" resets `hasError` state to `false`
    - _Requirements: Component Interface §4, Property 7 (Error Boundary Isolation)_

  - [x] 4.2 Wrap app in ErrorBoundary inside `src/app/providers.tsx`
    - Import `ErrorBoundary` and wrap `{children}` so the entire app is protected
    - Keep `NotificationProvider` outside the boundary (it must always render)
    - _Requirements: Property 7_

- [x] 5. Checkpoint — verify hook fix and shared components compile cleanly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build entity form components
  - [x] 6.1 Create `src/components/admin/forms/BoothForm.tsx`
    - Fields: `location` (Input, required, 2–100 chars), `theme` (Input, required, 2–200 chars)
    - Client-side validation using existing `src/lib/utils/validation.ts` helpers; extend as needed
    - Support create mode (empty `initialData`) and edit mode (pre-filled)
    - Submit button shows loading state; cancel calls `onCancel`
    - _Requirements: Form Validation §Booth, Property 3 (Form Validation Completeness)_

  - [x] 6.2 Create `src/components/admin/forms/CollectionForm.tsx`
    - Field: `name` (Input, required, 2–100 chars)
    - Same create/edit pattern as BoothForm
    - _Requirements: Form Validation §Collection_

  - [x] 6.3 Create `src/components/admin/forms/PoetForm.tsx`
    - Fields: `name` (Input, required, 2–100 chars), `bio` (Textarea, optional, max 2000), `image` (Input, optional, must be valid http/https URL)
    - Validate URL format using `isValidUrl` from `src/lib/utils/validation.ts`
    - _Requirements: Form Validation §Poet_

  - [x] 6.4 Create `src/components/admin/forms/PoemForm.tsx`
    - Fields: `name` (Input, required), `text` (Textarea, required, 10–10000 chars), `poemNo` (Input type=number, required, min 1), `collection_id` (Select, required), `poet_id` (Select, required), `description` (Textarea, optional), `audio` (Input, optional URL), `image` (Input, optional URL)
    - Accept `collections: Collection[]` and `poets: Poet[]` props to populate Select options
    - _Requirements: Form Validation §Poem_

  - [ ]* 6.5 Write property test for form validation completeness
    - **Property 3: Form Validation Completeness** — submitting with any required field empty always produces a non-empty errors object and prevents the API call
    - **Validates: Requirements Property 3**

- [x] 7. Implement full CRUD for Booths admin page
  - [x] 7.1 Rewrite `src/app/admin/booths/page.tsx` with create, edit, delete
    - Add "Create Booth" button that opens a `Modal` containing `BoothForm`
    - Add "Edit" button per row that opens a `Modal` pre-filled with `BoothForm(initialData)`
    - Add "Delete" button per row that opens `ConfirmDialog`; on confirm call `boothAPI.remove` then `refetch()`
    - On create/edit success: call `addNotification("...", "success")`, close modal, call `refetch()`
    - On any error: call `addNotification(getErrorMessage(err), "error")`
    - _Requirements: Property 5 (Notification Consistency), Property 8 (Data Consistency After CRUD)_

  - [x] 7.2 Rewrite `src/app/admin/booths/[boothId]/edit/page.tsx`
    - Replace scaffold with a fully functional edit page using `BoothForm(initialData=data)`
    - On submit call `boothAPI.update(id, payload)`, show notification, redirect to `/admin/booths`
    - _Requirements: Property 8_

- [x] 8. Implement full CRUD for Collections admin page
  - [x] 8.1 Rewrite `src/app/admin/collections/page.tsx` with create, edit, delete
    - Same pattern as booths: Create button → Modal + CollectionForm, Edit per row, Delete per row with ConfirmDialog
    - _Requirements: Property 5, Property 8_

  - [x] 8.2 Implement booth-collection linking UI in `src/app/admin/collections/[collectionId]/poems/page.tsx`
    - Add "Link Booth" button that opens a Modal with a Select of available booths
    - On confirm call `boothCollectionAPI.link`; on unlink call `boothCollectionAPI.unlink`
    - Show current linked booths in the page
    - _Requirements: Property 8_

- [x] 9. Implement full CRUD for Poets admin page
  - Rewrite `src/app/admin/poets/page.tsx` with create, edit, delete
  - Add "Create Poet" button → Modal + PoetForm
  - Add "Edit" and "Delete" buttons per row following the same pattern as booths
  - _Requirements: Property 5, Property 8_

- [x] 10. Implement full CRUD for Poems admin page
  - [x] 10.1 Rewrite `src/app/admin/poems/page.tsx` with create, edit, delete
    - Fetch `collectionAPI.getAll` and `poetAPI.getAll` alongside poems to populate PoemForm selects
    - Add "Create Poem" button → Modal + PoemForm
    - Add "Edit" and "Delete" buttons per row
    - _Requirements: Property 5, Property 8_

  - [x] 10.2 Rewrite `src/app/admin/poems/[poemId]/edit/page.tsx`
    - Replace scaffold with functional edit page using `PoemForm(initialData=data)`
    - Fetch collections and poets for the select dropdowns
    - On submit call `poemAPI.update`, show notification, redirect to `/admin/poems`
    - _Requirements: Property 8_

- [x] 11. Checkpoint — verify all admin CRUD pages compile and notifications fire correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Fix poem sorting in kiosk pages
  - [x] 12.1 Add `sortPoemsByNumber` utility to `src/lib/utils/formatting.ts`
    - `function sortPoemsByNumber(poems: Poem[]): Poem[]` — returns `[...poems].sort((a, b) => a.poemNo - b.poemNo)`
    - Must not mutate the input array
    - _Requirements: Property 4 (Poem Ordering)_

  - [ ]* 12.2 Write property test for poem sorting
    - **Property 4: Poem Ordering** — for any array of poems, `sortPoemsByNumber` returns an array where `poems[i].poemNo <= poems[i+1].poemNo` for all valid `i`, and the output length equals the input length
    - **Validates: Requirements Property 4**

  - [x] 12.3 Apply `sortPoemsByNumber` in kiosk collection and booth pages
    - In `src/app/kiosk/collection/[collectionId]/page.tsx`: wrap `data` with `useMemo(() => sortPoemsByNumber(data ?? []), [data])`
    - In `src/app/kiosk/booth/[boothId]/page.tsx`: sort `selectedCollection?.poems` before rendering the poem grid
    - In `src/app/kiosk/poem/[poemId]/page.tsx`: sort `collectionPoems` before computing `prevId`/`nextId` so navigation follows `poemNo` order
    - _Requirements: Property 4_

- [x] 13. Wire NotificationProvider dismiss button and verify notification auto-dismiss
  - Add a close (×) button to each toast in `src/components/shared/Toast/NotificationProvider.tsx` that calls `removeNotification(item.id)`
  - Verify `toastErrorMs` (5 s) is used for error notifications and `toastSuccessMs` (3 s) for success
  - _Requirements: Property 5_

- [x] 14. Final checkpoint — full integration pass
  - Run `npm run build` inside `telegram_Frontend/teligram-ui` and fix any TypeScript or ESLint errors
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests require installing `fast-check` as a dev dependency (`npm install -D fast-check`)
- All changes are confined to `telegram_Frontend/teligram-ui/` — no backend files are modified
- The API layer (`src/lib/api/`) already has all CRUD methods; tasks only wire them to UI
- Checkpoints at tasks 5, 11, and 14 ensure incremental validation before moving to the next phase
