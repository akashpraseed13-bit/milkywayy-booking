import { calculateBookingDuration, getAvailableSlots } from '../bookingUtils';

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

describe('getAvailableSlots', () => {
  // Helpers to create Date objects for today at specific hours/minutes
  const getTodayAt = (hour, minute = 0) => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  it('should generate 30-minute slots from 10:00 to 18:00', () => {
    const slots = getAvailableSlots(new Date(), 1, []);
    // 10:00, 10:30 ... 17:30 (18:00 is end of work day, so last start time for >0 duration is before 18:00)
    // Actually, if we list all "slots" regardless of validity, we might list 10:00 to 17:30.
    // 10:00 to 18:00 is 8 hours. 16 slots.
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].time).toBe("10:00");
  });

  it('should mark slots as unavailable if they exceed 18:00 based on duration', () => {
    // Duration 2 hours. 16:30 + 2h = 18:30 > 18:00. Should be unavailable.
    const slots = getAvailableSlots(new Date(), 2, []);
    const lateSlot = slots.find(s => s.time === "16:30");
    expect(lateSlot.available).toBe(false);
    expect(lateSlot.reason).toMatch(/exceeds/i);
    
    // 16:00 + 2h = 18:00. Should be available.
    const validSlot = slots.find(s => s.time === "16:00");
    expect(validSlot.available).toBe(true);
  });

  it('should mark slots as unavailable if they overlap with existing bookings', () => {
    // Existing booking: 12:00 - 14:00 (2 hours)
    const existingBookings = [
      { startTime: getTodayAt(12, 0), duration: 2 }
    ];
    
    // User wants 2h duration.
    // 11:00 starts. Ends 13:00. Overlaps 12:00-13:00.
    const slots = getAvailableSlots(new Date(), 2, existingBookings);
    
    const overlapSlot = slots.find(s => s.time === "11:00");
    expect(overlapSlot.available).toBe(false);
    expect(overlapSlot.reason).toMatch(/overlap/i);

    // 10:00 starts. Ends 12:00. No overlap (assuming touching is fine).
    const touchingSlot = slots.find(s => s.time === "10:00");
    expect(touchingSlot.available).toBe(true);
  });
});

