# Specification: Refine and Stabilize Booking Flow

## 1. Overview
The goal of this track is to finalize the implementation of the new booking system components (`BookNew.js`, `PaymentStep.js`, `PropertyCard.js`) and ensure they are fully integrated with the backend and database. This involves fixing any existing issues, validating data flow, and ensuring a seamless user experience from selecting a property/service to completing a payment.

## 2. Goals
- **Component Finalization:** Ensure `BookNew.js`, `PaymentStep.js`, `PropertyCard.js`, and related components are functionally complete and match the design guidelines.
- **Backend Integration:** Verify that frontend inputs correctly map to backend API endpoints and database models (`Booking`, `Payment`, etc.).
- **User Experience:** Smooth out transitions, loading states (using `Preloader.jsx`), and error handling during the booking process.
- **Data Integrity:** Ensure that bookings created through the new flow are correctly recorded in the database with all necessary relationships (User, Property, Invoice).

## 3. Key Features & Requirements
### 3.1 Property Selection (`PropertyCard.js`)
- **Requirement:** Display available properties/services with clear pricing and details.
- **Requirement:** Allow users to select a property, triggering the next step in the flow.

### 3.2 Date & Slot Selection
- **Requirement:** Integrate `DateSlotPicker.js` to allow users to choose available time slots.
- **Requirement:** Validate availability against the backend to prevent double bookings.

### 3.3 Booking Details (`BookNew.js`)
- **Requirement:** Collect necessary user information (if not logged in) or confirm details (if logged in).
- **Requirement:** Display a summary of the selected service, date, and price before payment.

### 3.4 Payment Processing (`PaymentStep.js`)
- **Requirement:** Integrate with Stripe via the existing backend setup.
- **Requirement:** Handle success and failure states gracefully.
- **Requirement:** Generate an invoice record upon successful payment.

## 4. Technical Considerations
- **State Management:** Use `React Hook Form` or local state to manage the multi-step form data.
- **Validation:** Use `Zod` schemas shared with the backend where possible to ensure data validity.
- **Styling:** Adhere to the "Futuristic Professionalism" theme using Tailwind CSS and existing UI components.
