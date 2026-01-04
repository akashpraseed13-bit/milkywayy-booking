# Specification: Hourly Booking Flow & Dynamic Duration

## Overview
Update the current booking system from a broad "Time of Day" (Morning/Afternoon/Evening) selection to a precise hourly selection. The system will dynamically calculate the required duration for a service based on property details and ensure that the selected start time can accommodate the full duration without overlapping with other bookings or exceeding working hours.

## Functional Requirements

### 1. Enhanced Booking Flow
- **Step 1: Date Selection:** User selects a date on the calendar.
- **Step 2: Input Details:** User provides Property Type, Property Size, and selects the Service/Package.
- **Step 3: Hourly Selection:** 
    - Display time slots from **10:00 AM to 6:00 PM** in 30-minute increments.
    - All slots remain visible.
    - If a selected slot + calculated duration exceeds 6:00 PM or overlaps with an existing booking, the UI must visually disable the selection or show a validation error.

### 2. Dynamic Duration Calculation
- Implement a function `calculateBookingDuration(service, propertyDetails, location)`:
    - **Current Implementation:** Returns a random integer between 3 and 8 hours.
    - **Future-Proofing:** Must accept all arguments (Service, Type, Size, Location) so logic can be refined later without changing the function signature.

### 3. Availability Logic
- The system must check for "Consecutive Availability".
- If a user selects a 4-hour service at 2:00 PM, the system verifies that the 2:00 PM - 6:00 PM block is free of existing bookings.

## Non-Functional Requirements
- **Validation Feedback:** Provide clear, immediate feedback if a selected time slot is unavailable due to duration constraints.
- **Maintainability:** Ensure the duration logic is centralized and easy to update.

## Acceptance Criteria
- [ ] Users can see individual hour slots instead of Morning/Afternoon/Evening.
- [ ] The system correctly calculates a duration (currently randomized 3-8h).
- [ ] Users cannot confirm a booking if the duration exceeds the end of the working day (6:00 PM).
- [ ] Users cannot confirm a booking if the duration overlaps with another existing booking.
- [ ] The `calculateBookingDuration` function is implemented with the specified parameters.

## Out of Scope
- Geospatial travel time calculations (to be handled in a future track).
- Real-time notification of "almost full" days.
