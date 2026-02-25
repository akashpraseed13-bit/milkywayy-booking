"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import StarBackground from "@/components/StarBackground";
import { Button } from "@/components/ui/button";
import {
  createBookings,
  createTransactionAndPaymentIntent,
  getDrafts,
  saveDrafts,
} from "@/lib/actions/bookings";
import { validateCoupon } from "@/lib/actions/coupons";
import { PRICING_CONFIG as STATIC_PRICING_CONFIG } from "@/lib/config/pricing";
import { useAuth } from "@/lib/contexts/auth";
import { bookingSchema } from "@/lib/schema/booking.schema";
import {
  calculateBookingDuration,
  getBookingLoadBreakdown,
  isNightServiceSelected,
} from "@/lib/helpers/bookingUtils";

// Modular Components
import { PropertyCard } from "./components/PropertyCard";
import { PaymentStep } from "./components/PaymentStep";
import { PricingSummary } from "./components/PricingSummary";

export default function BookNew({ pricingsPromise, discountsPromise }) {
  const pricingsRes = use(pricingsPromise);
  const discountsRes = use(discountsPromise);

  const pricings = pricingsRes?.success ? pricingsRes.data : null;
  const discountsConfig =
    (discountsRes?.success ? discountsRes.data : []) || [];

  const PRICING_CONFIG = pricings || STATIC_PRICING_CONFIG;
  const [openPropertyIndex, setOpenPropertyIndex] = useState(0);
  const [step, setStep] = useState("details");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [bookingIds, setBookingIds] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [rollingWindowDays, setRollingWindowDays] = useState(90);
  const [timeSlotSettings, setTimeSlotSettings] = useState(null);
  const { authState, login } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "all",
    defaultValues: {
      properties: [
        {
          propertyType: "",
          propertySize: "",
          services: [],
          videographySubService: "",
          preferredDate: "",
          timeSlot: "",
          startTime: "",
          duration: 0,
          building: "",
          community: "",
          unitNumber: "",
          contactName: "",
          contactPhone: "+971",
          contactEmail: "",
        },
      ],
    },
  });

  const properties = useWatch({
    control,
    name: "properties",
  });

  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);

  // Load drafts on mount
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const res = await getDrafts();
        const drafts = res.success ? res.data : [];
        if (drafts && drafts.length > 0) {
          const mappedProperties = drafts.map((draft) => ({
            propertyType: draft.propertyDetails?.type || "",
            propertySize: draft.propertyDetails?.size || "",
            services: draft.shootDetails?.services || [],
            videographySubService: draft.shootDetails?.videographySubService || "",
            preferredDate: draft.date || "",
            timeSlot:
              draft.slot === 1
                ? "morning"
                : draft.slot === 2
                  ? "afternoon"
                  : draft.slot === 3
                    ? "evening"
                    : "",
            startTime: 
              draft.startTime || (
              draft.slot === 1 ? "09:00" :
              draft.slot === 2 ? "13:00" :
              draft.slot === 3 ? "17:00" : ""),
            duration: draft.duration || 0,
            building: draft.propertyDetails?.building || "",
            community: draft.propertyDetails?.community || "",
            unitNumber: draft.propertyDetails?.unit || "",
            contactName: draft.contactDetails?.name || "",
            contactPhone: draft.contactDetails?.phone || "",
            contactEmail: draft.contactDetails?.email || "",
          }));
          setValue("properties", mappedProperties);
        }
      } catch (error) {
        console.error("Failed to load drafts", error);
      } finally {
        setIsLoadingDrafts(false);
      }
    };
    loadDrafts();
  }, [setValue]);

  useEffect(() => {
    const loadTimeSlotSettings = async () => {
      try {
        const res = await fetch("/api/admin/timeslots", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        const days = parseInt(
          data?.config?.systemSettings?.rollingWindowDays,
          10,
        );
        if (Number.isFinite(days) && days > 0) {
          setRollingWindowDays(days);
        }
        setTimeSlotSettings(data?.config?.systemSettings || null);
      } catch (error) {
        // Use default fallback when settings are unavailable.
      }
    };

    loadTimeSlotSettings();
  }, []);

  // Auto-save drafts
  useEffect(() => {
    if (isLoadingDrafts || step !== "details") return;

    const timer = setTimeout(async () => {
      try {
        if (properties?.length > 0) {
          await saveDrafts(properties);
        }
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [properties, isLoadingDrafts, step]);

  const addProperty = () => {
    const currentProperties = getValues("properties");
    setValue(
      "properties",
      [
        ...currentProperties,
        {
          propertyType: "",
          propertySize: "",
          services: [],
          preferredDate: "",
          timeSlot: "",
          startTime: "",
          duration: 0,
          building: "",
          community: "",
          unitNumber: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
        },
      ],
      { shouldValidate: true },
    );
    setOpenPropertyIndex(currentProperties.length);
  };

  const duplicateProperty = (index) => {
    const currentProperties = getValues("properties");
    const propertyToDuplicate = {
      ...currentProperties[index],
      preferredDate: "",
      timeSlot: "",
      startTime: "",
      duration: 0,
    };
    setValue("properties", [...currentProperties, propertyToDuplicate], {
      shouldValidate: true,
    });
    setOpenPropertyIndex(currentProperties.length);
  };

  const removeProperty = (index) => {
    const currentProperties = getValues("properties");
    if (currentProperties.length > 1) {
      setValue(
        "properties",
        currentProperties.filter((_, i) => i !== index),
      );
      if (index === openPropertyIndex) {
        setOpenPropertyIndex(index > 0 ? index - 1 : 0);
      } else if (index < openPropertyIndex) {
        setOpenPropertyIndex(openPropertyIndex - 1);
      }
    }
  };

  const updatePropertyField = (index, field, value) => {
    setValue(`properties.${index}.${field}`, value, { shouldValidate: true });

    const nextProperty = {
      ...getValues(`properties.${index}`),
      [field]: value,
    };

    // Keep sub-service in sync with actual Videography selection.
    if (
      !nextProperty?.services?.includes("Videography") &&
      nextProperty?.videographySubService
    ) {
      setValue(`properties.${index}.videographySubService`, "", {
        shouldValidate: true,
      });
      nextProperty.videographySubService = "";
    }

    // If service mix changes slot visibility, clear stale slot/time.
    const selectedSlot = nextProperty.startTime || nextProperty.timeSlot;
    if (selectedSlot) {
      const startPeriodMap = {
        "09:00": "morning",
        "10:00": "morning",
        morning: "morning",
        "13:00": "afternoon",
        afternoon: "afternoon",
        "16:00": "evening",
        "17:00": "evening",
        evening: "evening",
      };
      const startPeriod = startPeriodMap[selectedSlot] || selectedSlot;
      const nightService = isNightServiceSelected(
        nextProperty?.services || [],
        nextProperty?.videographySubService || "",
      );
      const isValidStart = nightService
        ? startPeriod === "evening"
        : startPeriod === "morning" || startPeriod === "afternoon";

      if (!isValidStart) {
        setValue(`properties.${index}.timeSlot`, "", { shouldValidate: true });
        setValue(`properties.${index}.startTime`, "", { shouldValidate: true });
      }
    }
    
    // If changed field affects duration, recalculate it
    if (["propertyType", "propertySize", "services", "videographySubService"].includes(field)) {
      const property = {
        ...nextProperty,
        videographySubService:
          nextProperty?.services?.includes("Videography")
            ? nextProperty?.videographySubService
            : "",
      };
      // Only calculate if we have the minimum required info
      if (property.propertyType && property.propertySize && property.services?.length > 0) {
        const duration = calculateBookingDuration(
          { id: property.services, videographySubService: property.videographySubService },
          {
            type: property.propertyType,
            size: property.propertySize,
            videographySubService: property.videographySubService,
          },
          {
            slotCapacity: timeSlotSettings?.slotCapacity,
            weightModel: timeSlotSettings?.weightModel,
          }
        );
        setValue(`properties.${index}.duration`, duration);
      } else {
        setValue(`properties.${index}.duration`, 0);
      }
    }
  };

  useEffect(() => {
    if (!properties?.length) return;
    properties.forEach((property, index) => {
      if (
        property.propertyType &&
        property.propertySize &&
        property.services?.length > 0
      ) {
        const duration = calculateBookingDuration(
          {
            id: property.services,
            videographySubService: property.videographySubService,
          },
          {
            type: property.propertyType,
            size: property.propertySize,
            videographySubService: property.videographySubService,
          },
          {
            slotCapacity: timeSlotSettings?.slotCapacity,
            weightModel: timeSlotSettings?.weightModel,
          },
        );
        setValue(`properties.${index}.duration`, duration);
      }
    });
  }, [timeSlotSettings]);

  const toggleService = async (index, serviceName, currentServices) => {
    const newServices = currentServices.includes(serviceName)
      ? currentServices.filter((s) => s !== serviceName)
      : [...currentServices, serviceName];
    
    // Clear videography sub-service if videography is being deselected
    if (serviceName === "Videography" && !newServices.includes("Videography")) {
      setValue(`properties.${index}.videographySubService`, "");
    }
    
    updatePropertyField(index, "services", newServices);
  };

  const onContinue = async (data) => {
    if (!authState.isAuthenticated) {
      login();
      return;
    }
    try {
      const res = await createBookings(data.properties);
      if (!res.success) throw new Error(res.message);
      const bookingData = res.data;
      const bookingIds = bookingData.map(b => b.id);
      console.log('Booking codes generated:', bookingData.map(b => b.bookingCode));
      
      // Go directly to payment without confirmation step
      setIsProcessingPayment(true);
      const paymentRes = await createTransactionAndPaymentIntent(
        bookingIds,
        couponCode,
      );
      if (!paymentRes.success) throw new Error(paymentRes.message);
      const result = paymentRes.data;
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (error) {
      toast.error(error.message || "Failed to process booking");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsProcessingPayment(true);
    try {
      // Extract just IDs for payment processing
      const idsForPayment = bookingIds.map(b => typeof b === 'object' ? b.id : b);
      const res = await createTransactionAndPaymentIntent(
        idsForPayment,
        couponCode,
      );
      if (!res.success) throw new Error(res.message);
      const result = res.data;
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (error) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateTotal = () => {
    return properties.reduce((total, property) => {
      return total + getPropertyPrice(property);
    }, 0);
  };

  const getPropertyPrice = (property) => {
    if (!property.propertyType || !property.propertySize || !property.services)
      return 0;
    const typeConfig = PRICING_CONFIG[property.propertyType];
    if (!typeConfig) return 0;

    const sizeConfig = typeConfig.sizes.find(
      (s) => s.label === property.propertySize,
    );
    if (!sizeConfig) return 0;

    return property.services.reduce((total, service) => {
      let priceConfig = sizeConfig.prices[service];
      
      // Handle videography sub-services
      if (service === "Videography" && property.videographySubService && typeof priceConfig === "object") {
        if (property.videographySubService.includes('.')) {
          // Long Form with subcategories
          const [mainService, category] = property.videographySubService.split('.');
          const categoryConfig = priceConfig[mainService]?.[category];
          priceConfig = categoryConfig;
        } else {
          // Short Form - direct pricing
          const categoryConfig = priceConfig[property.videographySubService];
          priceConfig = categoryConfig;
        }
      }
      
      const price =
        typeof priceConfig === "object"
          ? priceConfig.price || 0
          : priceConfig || 0;
      return total + price;
    }, 0);
  };

  const getPropertyDurationAndEvening = (property) => {
    if (!property.propertyType || !property.propertySize || !property.services)
      return { duration: 1, allowEvening: false };

    const typeConfig = PRICING_CONFIG[property.propertyType];
    if (!typeConfig) return { duration: 1, allowEvening: false };

    const sizeConfig = typeConfig.sizes.find(
      (s) => s.label === property.propertySize,
    );
    if (!sizeConfig) return { duration: 1, allowEvening: false };

    let duration = 1;
    let allowEvening = false;

    property.services.forEach((service) => {
      let config = sizeConfig.prices[service];
      
      // Handle videography sub-services
      if (service === "Videography" && property.videographySubService && typeof config === "object") {
        if (property.videographySubService.includes('.')) {
          // Long Form with subcategories
          const [mainService, category] = property.videographySubService.split('.');
          const categoryConfig = config[mainService]?.[category];
          config = categoryConfig;
        } else {
          // Short Form - direct pricing
          const categoryConfig = config[property.videographySubService];
          config = categoryConfig;
        }
      }
      
      if (config && typeof config === "object") {
        const sDuration = config.slots || 1;
        if (sDuration > duration) duration = sDuration;
        if (config.allowEvening) allowEvening = true;
      }
    });

    return { duration, allowEvening };
  };

  const calculateAutomaticDiscounts = (amount) => {
    let currentAmount = amount;
    let calculationBasis = amount;
    let directDiscount = 0;
    let walletCredits = 0;
    const applied = [];

    discountsConfig.forEach((d) => {
      if (!d.isActive) return;
      if (amount < d.minAmount) return;

      const val = Math.min(
        (calculationBasis * d.percentage) / 100,
        d.maxDiscount,
      );

      if (d.type === "direct") {
        directDiscount += val;
        currentAmount -= val;
        calculationBasis -= val;
      } else if (d.type === "wallet") {
        walletCredits += val;
        calculationBasis -= val;
      }
      applied.push({ ...d, value: val });
    });

    return {
      finalAmount: currentAmount,
      directDiscount,
      walletCredits,
      applied,
    };
  };

  const getOccupiedSlots = (currentIndex) => {
    const occupied = {};
    const PERIOD_TO_HOURLY = {
      morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      afternoon: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      evening: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
    };
    const START_TIME_TO_PERIOD = {
      "09:00": "morning",
      "10:00": "morning",
      "13:00": "afternoon",
      "16:00": "evening",
      "17:00": "evening",
    };

    properties.forEach((p, idx) => {
      if (idx === currentIndex) return;
      if (!p.preferredDate) return;

      const slotValue = p.startTime || p.timeSlot;
      if (!slotValue) return;
      const startPeriod = START_TIME_TO_PERIOD[slotValue] || slotValue;
      const slotsRequired = Math.min(Math.max(parseInt(p.duration, 10) || 1, 1), 2);
      const isNight = isNightCompatibleProperty(p);

      if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
      let requiredPeriods = [startPeriod];
      if (slotsRequired === 2) {
        if (isNight && startPeriod === "evening") {
          requiredPeriods = ["afternoon", "evening"];
        } else if (!isNight && startPeriod === "morning") {
          requiredPeriods = ["morning", "afternoon"];
        } else if (!isNight && startPeriod === "afternoon") {
          requiredPeriods = ["afternoon", "evening"];
        }
      }

      requiredPeriods.forEach((period) => {
        (PERIOD_TO_HOURLY[period] || []).forEach((hour) => {
          if (!occupied[p.preferredDate].includes(hour)) {
            occupied[p.preferredDate].push(hour);
          }
        });
      });
    });
    return occupied;
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    setDiscountAmount(0);

    if (!couponCode) return;

    const total = calculateTotal();
    const { finalAmount } = calculateAutomaticDiscounts(total);

    const res = await validateCoupon(couponCode, finalAmount);
    const result = res.success
      ? res.data
      : { valid: false, message: res.message };

    if (result.valid) {
      setDiscountAmount(result.discount);
      setCouponSuccess(`Coupon applied! You saved AED ${result.discount}`);
    } else {
      setCouponError(result.message);
    }
  };

  const totalAmount = calculateTotal();
  const {
    finalAmount: amountAfterAuto,
    directDiscount: autoDirectDiscount,
    walletCredits: autoWalletCredits,
    applied: appliedAutoDiscounts,
  } = calculateAutomaticDiscounts(totalAmount);

  useEffect(() => {
    if (couponCode && discountAmount > 0) {
      validateCoupon(couponCode, amountAfterAuto).then((res) => {
        const result = res.success
          ? res.data
          : { valid: false, message: res.message };
        if (result.valid) {
          setDiscountAmount(result.discount);
        } else {
          setDiscountAmount(0);
          setCouponError(result.message);
          setCouponSuccess("");
        }
      });
    }
  }, [amountAfterAuto]);

  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const maxSelectableDate = new Date(startDate);
  maxSelectableDate.setDate(
    maxSelectableDate.getDate() + (Math.max(rollingWindowDays, 1) - 1),
  );

  const getPropertyLoadBreakdown = (property) => {
    return getBookingLoadBreakdown({
      propertyType: property?.propertyType,
      propertySize: property?.propertySize,
      services: property?.services || [],
      videographySubService: property?.videographySubService || "",
      slotCapacity: timeSlotSettings?.slotCapacity,
      weightModel: timeSlotSettings?.weightModel,
    });
  };

  const isNightCompatibleProperty = (property) => {
    return isNightServiceSelected(
      property?.services || [],
      property?.videographySubService || "",
    );
  };

  return (
    <div className="min-h-screen pt-24 py-8 relative">
      <StarBackground />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 text-center">
            <h1 className="font-heading text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-2">
            Book Your Property Shoot
          </h1>
          <p className="text-muted-foreground">
            Add your property details and preferred schedule
          </p>
        </div>

        {step === "details"
          ? <form onSubmit={handleSubmit(onContinue)} className="space-y-6">
              <div className="space-y-6">
                {properties?.map((property, index) => (
                  <PropertyCard
                    key={index}
                    index={index}
                    property={property}
                    isOpen={index === openPropertyIndex}
                    onToggle={() =>
                      setOpenPropertyIndex(
                        index === openPropertyIndex ? -1 : index,
                      )
                    }
                    onDuplicate={duplicateProperty}
                    onRemove={removeProperty}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    pricingConfig={PRICING_CONFIG}
                    getPropertyPrice={getPropertyPrice}
                    getPropertyDurationAndEvening={
                      getPropertyDurationAndEvening
                    }
                    getOccupiedSlots={getOccupiedSlots}
                    toggleService={toggleService}
                    updatePropertyField={updatePropertyField}
                    isOnlyProperty={properties.length === 1}
                    maxDate={maxSelectableDate}
                    getPropertyLoadBreakdown={getPropertyLoadBreakdown}
                    isNightCompatibleProperty={isNightCompatibleProperty}
                  />
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={addProperty}
                  className="w-full text-muted-foreground border border-border border-dashed hover:border-solid"
                >
                  <Plus size={20} className="mr-2" />
                  Add Another Property
                </Button>
              </div>

              <PricingSummary
                propertyCount={properties.length}
                totalAmount={totalAmount}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-8 w-full"
                >
                  {isSubmitting ? "Submitting..." : "Continue to Payment"}
                </Button>
              </div>
            </form>
          : <PaymentStep
              properties={properties}
              onBack={() => setStep("details")}
              getPropertyPrice={getPropertyPrice}
              calculateTotal={calculateTotal}
              appliedAutoDiscounts={appliedAutoDiscounts}
              discountAmount={discountAmount}
              amountAfterAuto={amountAfterAuto}
              autoWalletCredits={autoWalletCredits}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              couponError={couponError}
              couponSuccess={couponSuccess}
              handleFinalSubmit={handleFinalSubmit}
              isProcessingPayment={isProcessingPayment}
            />}
      </div>
    </div>
  );
}
