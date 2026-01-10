# Specification: Black & White to Color Hover Effect for Photography

## Overview
This feature introduces a visual enhancement to the "Our Work" section on the landing page. Specifically, for items under the "Photography" category, images will appear in black and white by default and transition smoothly to their original colors when hovered by a user on desktop devices.

## Functional Requirements
- **Category Targeting:** The grayscale effect MUST only apply to items categorized as "Photography".
- **Default State:** Photography images MUST be displayed in grayscale (black and white) on initial load for desktop.
- **Hover State:** Photography images MUST transition to full color when the user hovers their mouse over the image container.
- **Transition Style:** The transition between grayscale and color MUST be a smooth fade (suggested duration: 0.3s to 0.5s).
- **Mobile Behavior:** On mobile/touch devices, the grayscale effect SHOULD be disabled, and images SHOULD always be displayed in their original color to ensure visual clarity and avoid interaction confusion.

## Non-Functional Requirements
- **Performance:** The grayscale effect should be implemented using efficient CSS filters (`filter: grayscale(100%)`) to minimize performance impact.
- **Maintainability:** The logic for category detection and style application should be integrated cleanly into existing React components (`OurWorkPreview.js` or equivalent).

## Acceptance Criteria
- [ ] In the "Our Work" section, clicking "Photography" shows images in black and white.
- [ ] Hovering over a photography image smoothly fades it into color.
- [ ] Moving the mouse away from the image smoothly fades it back to black and white.
- [ ] Non-photography items (e.g., Videography) are unaffected and always shown in color.
- [ ] On mobile viewports (or touch-primary devices), photography images appear in color by default.

## Out of Scope
- Changing the layout or grid structure of the "Our Work" section.
- Applying this effect to video thumbnails or other sections of the site.
