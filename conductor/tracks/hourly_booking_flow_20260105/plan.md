# Plan: Hourly Booking Flow & Dynamic Duration Implementation

This plan outlines the steps to transition the booking flow from general time slots (Morning/Afternoon/Evening) to a dynamic hourly selection system with duration-based availability.

## Phase 1: Logic & Core Utility Setup [checkpoint: 3a6058c]
Establish the foundational logic for duration calculation and availability checking.

- [x] Task: Create `calculateBookingDuration` utility with the required signature and temporary randomized logic. af0f62a
- [x] Task: Create a utility function to determine available time slots based on existing bookings and duration requirements. 342d473
- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & Core Utility Setup' (Protocol in workflow.md) 3a6058c

## Phase 2: UI/UX Transition - Hourly Picker [checkpoint: 5d1c107]
Update the frontend components to display and handle hourly slots instead of general time periods.

- [x] Task: Modify the booking state management to store specific start times and calculated durations. b3f2bf6
- [x] Task: Refactor `DateSlotPicker` (or relevant component) to render 30-minute intervals from 10:00 AM to 6:00 PM. 4fed7d2
- [x] Task: Implement visual validation/disabling logic in the UI for slots that don't fit the required duration or overlap. 4fed7d2
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI/UX Transition - Hourly Picker' (Protocol in workflow.md) 4fed7d2

## Phase 3: Backend Integration & Validation [checkpoint: f6c12a2]
Ensure the backend correctly processes, validates, and stores the new hourly booking data.

- [x] Task: Update the booking API/Schema to support start-time and duration fields (if not already present). d60906f
- [x] Task: Implement server-side validation to ensure requested time blocks are actually available (preventing race conditions). 45a2d7f
- [x] Task: Conductor - User Manual Verification 'Phase 3: Backend Integration & Validation' (Protocol in workflow.md) f6c12a2

## Phase 4: Final Refinement & Mobile Optimization [checkpoint: 8e56270]
Polish the experience and ensure it works perfectly across all devices.

- [x] Task: Verify responsive behavior of the new hourly picker on mobile devices.
- [x] Task: Perform end-to-end testing of the full booking flow from date selection to success page. 8e56270
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Refinement & Mobile Optimization' (Protocol in workflow.md) 8e56270
