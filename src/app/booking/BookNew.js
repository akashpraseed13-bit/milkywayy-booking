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
import { calculateBookingDuration, getAvailableSlots } from "@/lib/helpers/bookingUtils";

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
              draft.slot === 1 ? "10:00" :
              draft.slot === 2 ? "13:00" :
              draft.slot === 3 ? "16:00" : ""),
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
    
    // If the changed field affects duration, recalculate it
    if (['propertyType', 'propertySize', 'services'].includes(field)) {
      const property = getValues(`properties.${index}`);
      // Only calculate if we have the minimum required info
      if (property.propertyType && property.propertySize && property.services?.length > 0) {
        const duration = calculateBookingDuration(
          { id: property.services }, // Simulating service object
          { type: property.propertyType, size: property.propertySize },
          { community: property.community }
        );
        setValue(`properties.${index}.duration`, duration);
      } else {
        setValue(`properties.${index}.duration`, 0);
      }
    }
  };

  const toggleService = async (index, serviceName, currentServices) => {
    const newServices = currentServices.includes(serviceName)
      ? currentServices.filter((s) => s !== serviceName)
      : [...currentServices, serviceName];
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
      const ids = res.data;
      setBookingIds(ids);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error.message || "Failed to save bookings");
    }
  };

  const handleFinalSubmit = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await createTransactionAndPaymentIntent(
        bookingIds,
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
      const priceConfig = sizeConfig.prices[service];
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
      const config = sizeConfig.prices[service];
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
    const HOURLY_SLOTS = [
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    properties.forEach((p, idx) => {
      if (idx === currentIndex) return;
      if (!p.preferredDate) return;

      const slotValue = p.startTime || p.timeSlot;
      if (!slotValue) return;

      const duration = p.duration || 1;
      // Handle legacy slots for local blocking
      if (slotValue === 'morning') {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push('morning');
        return;
      }
      if (slotValue === 'afternoon') {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push('afternoon');
        return;
      }
      if (slotValue === 'evening') {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push('evening');
        return;
      }

      const startIndex = HOURLY_SLOTS.indexOf(slotValue);
      if (startIndex === -1) return;

      if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];

      // Duration is in hours, so * 2 for 30-min slots
      const numSlots = duration * 2;
      for (let i = 0; i < numSlots; i++) {
        const slotIndex = startIndex + i;
        if (slotIndex < HOURLY_SLOTS.length) {
          occupied[p.preferredDate].push(HOURLY_SLOTS[slotIndex]);
        }
      }
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

  return (
    <div className="min-h-screen pt-24 py-8 relative">
      <StarBackground />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 !font-heading">
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
