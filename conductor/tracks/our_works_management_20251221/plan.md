# Plan: Our Works Management & Portfolio Page

## Phase 1: Database & API Foundation
- [x] Task: Create Sequelize migration and model for `OurWork` (fields: id, title, subtitle, type, media_content, order, is_visible). 424f8f4
- [x] Task: Implement `GET /api/our-works` public endpoint (fetch top 3 for landing page or full filtered list for portfolio). c44415e
- [ ] Task: Implement `POST /api/admin/our-works` endpoint (Create entry with validation).
- [ ] Task: Implement `PUT /api/admin/our-works/[id]` and `DELETE /api/admin/our-works/[id]` (Update/Delete entries).
- [ ] Task: Implement `PATCH /api/admin/our-works/reorder` (Update order of multiple items).
- [ ] Task: Conductor - User Manual Verification 'Database & API Foundation' (Protocol in workflow.md)

## Phase 2: Admin Interface Implementation
- [ ] Task: Create `src/app/admin/portfolio/page.jsx` with a list view of all entries.
- [ ] Task: Implement "Create New Entry" modal/form with dynamic inputs based on media type.
- [ ] Task: Integrate S3 upload for the `Image` type within the Admin form.
- [ ] Task: Implement Visibility toggle and Delete action in the Admin list.
- [ ] Task: Implement Drag-and-Drop reordering in the Admin table/list.
- [ ] Task: Conductor - User Manual Verification 'Admin Interface Implementation' (Protocol in workflow.md)

## Phase 3: Public Portfolio & Landing Page Integration
- [ ] Task: Update the existing Landing Page "Our Work" section to fetch dynamic data (top 3 visible items).
- [ ] Task: Create `src/app/portfolio/page.js` with category tabs (All, Image, 360 View, Video, Short Video).
- [ ] Task: Implement specialized media rendering components (YouTube Embed, Panoee Iframe, Instagram Reel Embed).
- [ ] Task: Ensure responsive design and lazy loading for heavy media assets.
- [ ] Task: Conductor - User Manual Verification 'Public Portfolio & Landing Page Integration' (Protocol in workflow.md)
