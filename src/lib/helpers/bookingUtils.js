/**
 * Calculates the booking duration based on service and property details.
 * Currently returns a random duration between 3 and 8 hours.
 *
 * @param {Object} service - The selected service object.
 * @param {Object} propertyDetails - Details about the property (type, size, etc.).
 * @param {Object} location - The location object.
 * @returns {number} Duration in hours (integer).
 */
export function calculateBookingDuration(service, propertyDetails, location) {
  // Logic to be refined later. Currently random integer between 3 and 8.
  const min = 3;
  const max = 8;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
