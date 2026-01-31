import { PROPERTY_TYPES } from "@/lib/config/pricing";

// NOTE ##########################################################
// this is for new timeslot calculation logic (should be implemented from checkAvailability and getUnavailableSlotsHandler functions in src/lib/actions/bookings.js
// this has not been implemented

export const TIME_WINDOW = {
  [PROPERTY_TYPES.APARTMENT]: {
    Studio: [1, 2, 3, 4],
    "1 Bed": [1, 2, 3, 4],
    "2 Bed": [1, 2, 3, 4],
    "3 Bed": [1, 2, 3, 4],
    "4 Bed": [1, 2, 3, 4],
  },
  [PROPERTY_TYPES.VILLA]: {
    "3 Bed": [1, 2, 3, 4],
    "4 Bed": [1, 2, 3, 4],
    "5 Bed": [1, 2, 3, 4],
    "6 Bed": [1, 2, 3, 4],
    "7 Bed": [1, 2, 3, 4],
  },
  [PROPERTY_TYPES.COMMERCIAL]: {
    "Under 500 sq. ft.": [1, 2, 3, 4],
    "500 - 1,000 sq. ft.": [1, 2, 3, 4],
    "1,000 - 2,000 sq. ft.": [1, 2, 3, 4],
    "2,000 - 3,000 sq. ft.": [1, 2, 3, 4],
    "3,000 - 5,000 sq. ft.": [1, 2, 3, 4],
    "5,000 - 7,500 sq. ft.": [1, 2, 3, 4],
    "7,500 - 10,000 sq. ft.": [1, 2, 3, 4],
    "10,000+ sq. ft.": [1, 2, 3, 4],
  },
};

export const TIMESLOT_REST_BUFFER = 2;
