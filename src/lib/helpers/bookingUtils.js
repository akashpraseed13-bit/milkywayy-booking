const DEFAULT_SLOT_CAPACITY = 6;
export const DEFAULT_WEIGHT_MODEL = {
  propertyWeights: {
    Apartment: { Studio: 1, "1BR": 1.5, "1 Bed": 1.5, "2BR": 2, "2 Bed": 2, "3BR": 2.5, "3 Bed": 2.5, "4BR": 3, "4 Bed": 3 },
    "Villa/Townhouse": { "2BR": 2.5, "2 Bed": 2.5, "3BR": 3, "3 Bed": 3, "4BR": 3.5, "4 Bed": 3.5, "5BR": 4, "5 Bed": 4, "6BR": 5, "6 Bed": 5 },
    Commercial: { Basic: 2, Essential: 3.5, Premium: 5, Executive: 7, Elite: 7 },
  },
  serviceWeights: {
    Photo: { weight: 1, active: true },
    "Short Form Video": { weight: 1.5, active: true },
    "Long Form - Daylight": { weight: 2, active: true },
    "Long Form - Night": { weight: 2, active: true },
    "Long Form - Day + Night": { weight: 3, active: true },
    "360 Virtual Tour": { weight: 1.5, active: true },
  },
};

const normalizeServiceKey = (serviceName, videographySubService) => {
  if (serviceName === "Photography") return "Photo";
  if (serviceName === "360° Tour" || serviceName === "360 Tour") {
    return "360 Virtual Tour";
  }
  if (serviceName !== "Videography") return null;

  if (!videographySubService || videographySubService === "Short Form") {
    return "Short Form Video";
  }
  if (videographySubService.includes("Night Light")) return "Long Form - Night";
  if (videographySubService.includes("Daylight + Night")) {
    return "Long Form - Day + Night";
  }
  return "Long Form - Daylight";
};

export function isNightServiceSelected(services, videographySubService) {
  const selectedServices = Array.isArray(services) ? services : [];
  return selectedServices.some((serviceName) => {
    const key = normalizeServiceKey(serviceName, videographySubService || "");
    return key === "Long Form - Night" || key === "Long Form - Day + Night";
  });
}

export function getVisibleStartPeriods({ isNightService }) {
  if (isNightService) return ["evening"];
  return ["morning", "afternoon"];
}

export function getBookingLoadBreakdown({
  propertyType,
  propertySize,
  services,
  videographySubService,
  slotCapacity,
  weightModel,
}) {
  const selectedServices = Array.isArray(services) ? services : [];
  const normalizedSlotCapacity = DEFAULT_SLOT_CAPACITY;
  const wm = weightModel || DEFAULT_WEIGHT_MODEL;

  const propertyWeight =
    wm?.propertyWeights?.[propertyType]?.[propertySize] || 1;

  let serviceWeightSum = 0;
  selectedServices.forEach((serviceName) => {
    const key = normalizeServiceKey(serviceName, videographySubService || "");
    if (!key) return;
    const cfg = wm?.serviceWeights?.[key];
    if (!cfg || cfg.active === false) return;
    serviceWeightSum += Number(cfg.weight) || 0;
  });

  const totalLoad = propertyWeight + serviceWeightSum;
  const slotsRequired = totalLoad <= normalizedSlotCapacity ? 1 : 2;

  return {
    propertyWeight,
    serviceWeightSum,
    totalLoad,
    slotCapacity: normalizedSlotCapacity,
    slotsRequired,
    isNightService: isNightServiceSelected(selectedServices, videographySubService),
  };
}

/**
 * Calculates booking duration as number of fixed blocks (M/A/E) required.
 * PDF rule: totalLoad <= slotCapacity => 1 block, otherwise 2 blocks.
 *
 * @param {Object|Array} service - Services object/array.
 * @param {Object} propertyDetails - Details about the property (type, size, videographySubService).
 * @param {Object} location - Optional settings carrier: { slotCapacity, weightModel }.
 * @returns {number} Number of blocks required (1 or 2).
 */
export function calculateBookingDuration(service, propertyDetails, location) {
  const propertyType = propertyDetails?.type || propertyDetails?.propertyType;
  const propertySize = propertyDetails?.size || propertyDetails?.propertySize;

  const services = Array.isArray(service)
    ? service
    : Array.isArray(service?.id)
      ? service.id
      : Array.isArray(service?.services)
        ? service.services
        : [];

  if (!propertyType || !propertySize || services.length === 0) {
    return 1;
  }

  const videographySubService =
    propertyDetails?.videographySubService ||
    service?.videographySubService ||
    "";

  return getBookingLoadBreakdown({
    propertyType,
    propertySize,
    services,
    videographySubService,
    slotCapacity: location?.slotCapacity,
    weightModel: location?.weightModel,
  }).slotsRequired;
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

