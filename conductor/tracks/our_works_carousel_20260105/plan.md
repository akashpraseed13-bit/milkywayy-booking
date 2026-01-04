# Implementation Plan: Our Works Multi-Image Carousel

## Phase 1: Backend & Model Adjustments
- [x] Task: Update `OurWork` model logic 3957083
    - [x] Sub-task: Add logic to handle JSON stringification/parsing for `mediaContent` when type is `IMAGE`.
- [x] Task: Update Admin API Handlers 3957083
    - [x] Sub-task: Update `src/app/api/admin/our-works/route.js` (POST) to handle array data for `mediaContent`.
    - [x] Sub-task: Update `src/app/api/admin/our-works/[id]/route.js` (PUT) to handle array data for `mediaContent`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend & Model Adjustments' (Protocol in workflow.md)

## Phase 2: Admin UI Enhancements
- [ ] Task: Update `PortfolioForm.jsx` for Multi-Image Support
    - [ ] Sub-task: Modify file upload logic to allow multiple files for `IMAGE` type.
    - [ ] Sub-task: Implement thumbnail grid for uploaded images.
- [ ] Task: Implement Image Reordering
    - [ ] Sub-task: Integrate `@hello-pangea/dnd` for dragging thumbnails.
    - [ ] Sub-task: Update state on drag end to reflect new order.
- [ ] Task: Implement Individual Image Deletion
    - [ ] Sub-task: Add "Remove" button to each thumbnail.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Admin UI Enhancements' (Protocol in workflow.md)

## Phase 3: Landing Page Carousel Implementation
- [ ] Task: Create `ImageCarousel` component
    - [ ] Sub-task: Implement a simple React-based carousel with Next/Prev buttons and slide transitions.
    - [ ] Sub-task: Add swipe gesture support for mobile.
- [ ] Task: Update `OurWorkPreview.js`
    - [ ] Sub-task: Detect if `mediaContent` is a JSON array.
    - [ ] Sub-task: Render `ImageCarousel` instead of a single image when multiple items are present.
- [ ] Task: Update `MediaRenderer.js`
    - [ ] Sub-task: Ensure it handles both string and array inputs gracefully.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Landing Page Carousel Implementation' (Protocol in workflow.md)

## Phase 4: Final Polishing & Verification
- [ ] Task: Test Backward Compatibility
    - [ ] Sub-task: Verify that existing single-image entries (stored as strings) still work correctly.
- [ ] Task: Final UI/UX Polish
    - [ ] Sub-task: Ensure smooth transitions and hover effects on landing page.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Verification' (Protocol in workflow.md)
