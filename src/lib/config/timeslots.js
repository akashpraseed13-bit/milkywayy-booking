import { PROPERTY_TYPES } from "@/lib/config/pricing";
export const TIME_WINDOW = {
  [PROPERTY_TYPES.APARTMENT]: {
    Studio: [1, 2, 3],
    "1 Bed": [1, 2, 3],
    "2 Bed": [1, 2, 3],
    "3 Bed": [1, 2, 3],
    "4 Bed": [1, 2, 3],
  },
  [PROPERTY_TYPES.VILLA]: {
    "3 Bed": [1, 2, 3],
    "4 Bed": [1, 2, 3],
    "5 Bed": [1, 2, 3],
    "6 Bed": [1, 2, 3],
    "7 Bed": [1, 2, 3],
  },
  [PROPERTY_TYPES.COMMERCIAL]: {
    "Under 500 sq. ft.": [1, 2, 3],
    "500 - 1,000 sq. ft.": [1, 2, 3],
    "1,000 - 2,000 sq. ft.": [1, 2, 3],
    "2,000 - 3,000 sq. ft.": [1, 2, 3],
    "3,000 - 5,000 sq. ft.": [1, 2, 3],
    "5,000 - 7,500 sq. ft.": [1, 2, 3],
    "7,500 - 10,000 sq. ft.": [1, 2, 3],
    "10,000+ sq. ft.": [1, 2, 3],
  },
};
