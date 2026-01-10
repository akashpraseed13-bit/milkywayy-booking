# Specification: Our Works Multi-Image Carousel

## Overview
Currently, the "Our Works" section on the landing page and the admin panel only support a single image per entry. This track will enable administrators to upload and manage multiple images for a single "Photography" work entry, and display them as an interactive, mobile-optimized carousel on the landing page.

## Functional Requirements

### 1. Database & Model
- **Storage:** Use the existing `mediaContent` column in the `OurWork` model to store a JSON array of URLs for entries of type `IMAGE`.
- **Backward Compatibility:** Ensure existing single-string URLs are handled gracefully (treated as a single-item array).

### 2. Admin Panel Enhancements
- **Bulk Upload:** Enable selecting multiple files in the image upload field for "Photography" items.
- **Management UI:**
  - Display thumbnails of all uploaded images for an entry.
  - Implement Drag & Drop reordering of thumbnails to set display priority.
  - Provide a "Delete" option for individual images within the set.
- **Validation:** Ensure only the `IMAGE` type allows multiple uploads; other types (Video, 360) remain single-link.

### 3. Landing Page (Carousel)
- **Component:** Upgrade `OurWorkPreview` to detect multiple images and render a carousel for `IMAGE` types.
- **Navigation:**
  - **Manual:** Display "Next" and "Previous" arrows (visible on hover/active).
  - **Touch:** Implement swipe gestures for mobile users.
- **Transition:** Smooth horizontal sliding animation between images.
- **Visible Items:** Only one image should be visible at a time within the card.

## Non-Functional Requirements
- **Performance:** Images should be lazy-loaded within the carousel.
- **Responsiveness:** Carousel controls must be accessible and appropriately sized for all screen resolutions.

## Acceptance Criteria
- [ ] Admin can upload 3+ images for a single Photography work entry.
- [ ] Admin can reorder images via drag-and-drop and save the new order.
- [ ] Landing page "Photography" cards with multiple images show navigation arrows.
- [ ] Swiping on mobile successfully changes the visible image.
- [ ] Existing single-image entries still display correctly without errors.

## Out of Scope
- Carousel support for Video, Short Video, or 360 categories.
- Auto-play functionality for the carousel.
- Lightbox/Full-screen view for carousel images.
