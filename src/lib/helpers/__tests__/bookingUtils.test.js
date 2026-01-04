import { calculateBookingDuration } from '../bookingUtils';

describe('calculateBookingDuration', () => {
  it('should return a duration between 3 and 8 hours', () => {
    // Mock arguments (values don't matter for the current randomized logic, but must be accepted)
    const service = { id: 'cleaning' };
    const propertyDetails = { size: 1000, type: 'apartment' };
    const location = { city: 'New York' };

    // Run multiple times to ensure randomness falls within range
    for (let i = 0; i < 20; i++) {
      const duration = calculateBookingDuration(service, propertyDetails, location);
      expect(duration).toBeGreaterThanOrEqual(3);
      expect(duration).toBeLessThanOrEqual(8);
      expect(Number.isInteger(duration)).toBe(true);
    }
  });

  it('should accept three arguments', () => {
    expect(calculateBookingDuration.length).toBe(3);
  });
});
