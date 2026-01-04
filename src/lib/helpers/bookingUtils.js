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

/**
 * Generates available time slots for a given date, duration, and existing bookings.
 * 
 * @param {Date} date - The date to check availability for.
 * @param {number} durationHours - The duration of the requested service in hours.
 * @param {Array<{startTime: Date, duration: number}>} existingBookings - List of existing bookings.
 * @returns {Array<{time: string, available: boolean, reason?: string}>} Array of time slots.
 */
export function getAvailableSlots(date, durationHours, existingBookings) {
  const slots = [];
  const startHour = 10;
  const endHour = 18;
  const intervalMinutes = 30;

  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  const workDayEndMinutes = endHour * 60; // 18:00 = 1080

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const slotStartMinutes = h * 60 + m;
      
      // Format time as HH:mm
      const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      const slotEndMinutes = slotStartMinutes + (durationHours * 60);

      let available = true;
      let reason = null;

      // Check if exceeds working hours
      if (slotEndMinutes > workDayEndMinutes) {
        available = false;
        reason = "Exceeds working hours";
      } else {
        // Check for overlaps
        // We need to compare this specific slot on this specific day against existing bookings.
        // Assuming existingBookings are for the SAME day or we need to filter them.
        // The test passes specific Date objects for existing bookings.
        
        // Construct Date objects for the current slot to compare strictly with booking Date objects
        const slotStartDate = new Date(baseDate);
        slotStartDate.setHours(h, m, 0, 0);
        
        const slotEndDate = new Date(slotStartDate);
        slotEndDate.setMinutes(slotEndDate.getMinutes() + (durationHours * 60));

        for (const booking of existingBookings) {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(bookingStart);
          bookingEnd.setMinutes(bookingEnd.getMinutes() + (booking.duration * 60));

          // Check overlap: (StartA < EndB) && (EndA > StartB)
          if (slotStartDate < bookingEnd && slotEndDate > bookingStart) {
            available = false;
            reason = "Overlap with existing booking";
            break;
          }
        }
      }

      slots.push({
        time: timeString,
        available,
        reason
      });
    }
  }

  return slots;
}

