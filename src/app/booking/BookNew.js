"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
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
import { calculateBookingDuration } from "@/lib/helpers/bookingUtils";
import { bookingSchema } from "@/lib/schema/booking.schema";
import { PaymentStep } from "./components/PaymentStep";
// Modular Components
import { PropertyCard } from "./components/PropertyCard";

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
            videographySubService:
              draft.shootDetails?.videographySubService || "",
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
              draft.startTime ||
              (draft.slot === 1
                ? "10:00"
                : draft.slot === 2
                  ? "13:00"
                  : draft.slot === 3
                    ? "16:00"
                    : ""),
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

    // If changed field affects duration, recalculate it
    if (
      [
        "propertyType",
        "propertySize",
        "services",
        "videographySubService",
      ].includes(field)
    ) {
      const current = getValues(`properties.${index}`);
      const property = { ...current, [field]: value };
      // Only calculate if we have the minimum required info
      if (
        property.propertyType &&
        property.propertySize &&
        property.services?.length > 0
      ) {
        const duration = calculateBookingDuration(
          { id: property.services }, // Simulating service object
          {
            type: property.propertyType,
            size: property.propertySize,
            videographySubService: property.videographySubService,
          },
          { community: property.community },
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

    setValue(`properties.${index}.services`, newServices, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const property = getValues(`properties.${index}`);
    const hasVideography = newServices.includes("Videography");
    const nextVideographySubService = hasVideography
      ? property?.videographySubService || ""
      : "";

    if (!hasVideography) {
      setValue(`properties.${index}.videographySubService`, "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (
      property?.propertyType &&
      property?.propertySize &&
      newServices.length > 0
    ) {
      const duration = calculateBookingDuration(
        { id: newServices },
        {
          type: property.propertyType,
          size: property.propertySize,
          videographySubService: nextVideographySubService,
        },
        { community: property.community },
      );
      setValue(`properties.${index}.duration`, duration);
    } else {
      setValue(`properties.${index}.duration`, 0);
    }

    await trigger(`properties.${index}.services`);
  };

  const handleFinalSubmit = async () => {
    console.log("handleFinalSubmit called with bookingIds:", bookingIds);
    setIsProcessingPayment(true);
    try {
      // Extract just IDs for payment processing
      const idsForPayment = bookingIds.map((b) =>
        typeof b === "object" ? b.id : b,
      );
      console.log("IDs for payment:", idsForPayment);

      if (idsForPayment.length === 0) {
        throw new Error("No booking IDs available for payment");
      }

      const res = await createTransactionAndPaymentIntent(
        idsForPayment,
        couponCode,
      );
      console.log("Payment response:", res);
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

    const videographySelections = String(property.videographySubService || "")
      .split("|")
      .map((v) => v.trim())
      .filter(Boolean);

    return property.services.reduce((total, service) => {
      const priceConfig = sizeConfig.prices[service];

      // Handle videography sub-services
      if (
        service === "Videography" &&
        property.videographySubService &&
        typeof priceConfig === "object"
      ) {
        const videographyTotal = videographySelections.reduce(
          (sum, selection) => {
            let selectionConfig = priceConfig;
            if (selection.includes(".")) {
              const [mainService, category] = selection.split(".");
              selectionConfig =
                selectionConfig?.[mainService]?.[category] ||
                selectionConfig?.[mainService];
            } else {
              selectionConfig = selectionConfig?.[selection];
            }
            const val =
              typeof selectionConfig === "object"
                ? Number(selectionConfig?.price || 0)
                : Number(selectionConfig || 0);
            return sum + (Number.isFinite(val) ? val : 0);
          },
          0,
        );
        return total + videographyTotal;
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

    const videographySelections = String(property.videographySubService || "")
      .split("|")
      .map((v) => v.trim())
      .filter(Boolean);

    property.services.forEach((service) => {
      const config = sizeConfig.prices[service];

      // Handle videography sub-services
      if (
        service === "Videography" &&
        property.videographySubService &&
        typeof config === "object"
      ) {
        videographySelections.forEach((selection) => {
          let selectionConfig = config;
          if (selection.includes(".")) {
            const [mainService, category] = selection.split(".");
            selectionConfig =
              selectionConfig?.[mainService]?.[category] ||
              selectionConfig?.[mainService];
          } else {
            selectionConfig = selectionConfig?.[selection];
          }
          if (selectionConfig && typeof selectionConfig === "object") {
            const sDuration = selectionConfig.slots || 1;
            if (sDuration > duration) duration = sDuration;
            if (selectionConfig.allowEvening) allowEvening = true;
          }
        });
        return;
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
    const HOURLY_SLOTS = [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];

    properties.forEach((p, idx) => {
      if (idx === currentIndex) return;
      if (!p.preferredDate) return;

      const slotValue = p.startTime || p.timeSlot;
      if (!slotValue) return;

      const duration = p.duration || 1;
      // Handle legacy slots for local blocking
      if (slotValue === "morning") {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push("morning");
        return;
      }
      if (slotValue === "afternoon") {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push("afternoon");
        return;
      }
      if (slotValue === "evening") {
        if (!occupied[p.preferredDate]) occupied[p.preferredDate] = [];
        occupied[p.preferredDate].push("evening");
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

  const onContinue = async (data) => {
    console.log("onContinue called with data:", data);
    try {
      // Create bookings first
      const res = await createBookings(data.properties);
      console.log("Create bookings response:", res);

      if (!res.success) throw new Error(res.message);
      const bookingData = res.data;
      console.log("Booking data received:", bookingData);

      const newBookingIds = bookingData.map((b) => b.id);
      console.log("Extracted booking IDs:", newBookingIds);
      console.log(
        "Booking codes generated:",
        bookingData.map((b) => b.bookingCode),
      );

      // Update state with new booking IDs
      setBookingIds(newBookingIds);

      // Move to payment step
      setStep("payment");
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error(error.message || "Failed to process booking");
    }
  };

  const totalAmount = calculateTotal();
  const {
    finalAmount: amountAfterAuto,
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
  }, [amountAfterAuto, couponCode, discountAmount]);

  const primaryProperty = properties?.[0] || {};
  const primaryTitle = [
    primaryProperty.propertySize,
    primaryProperty.propertyType,
  ]
    .filter(Boolean)
    .join(" ");
  const primaryServices =
    primaryProperty.services?.length > 0
      ? primaryProperty.services.join(" + ")
      : "Select services";

  return (
    <div className="min-h-screen pt-24 pb-8 relative">
      <StarBackground />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground mb-3">
            Milkywayy Portal
          </p>
          <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Book Your Shoot
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Premium property media for Dubai&apos;s finest real estate
          </p>
        </div>

        {step === "details"
          ? <form onSubmit={handleSubmit(onContinue)}>
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
                <div className="space-y-6">
                  {properties?.map((property, index) => (
                    <PropertyCard
                      key={`${property.community || "property"}_${property.building || "building"}_${property.unitNumber || "unit"}_${property.propertyType || "type"}_${property.propertySize || "size"}_${index}`}
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
                    className="w-full text-muted-foreground border border-border border-dashed hover:border-solid hover:bg-accent/20 hover:text-foreground transition-all duration-200 group py-6 rounded-xl"
                  >
                    <Plus
                      size={18}
                      className="mr-2 group-hover:rotate-90 transition-transform duration-200"
                    />
                    Add Another Property
                  </Button>
                </div>

                <aside className="xl:sticky xl:top-28 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    Order Summary
                  </p>

                  <div className="rounded-xl border border-border bg-background/40 p-4 mb-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">
                          {primaryTitle || "Property Summary"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {primaryServices}
                        </p>
                      </div>
                      <span className="font-semibold text-sm whitespace-nowrap">
                        AED {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">Grand Total</p>
                    <p className="text-3xl font-semibold">
                      AED {totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                  >
                    {isSubmitting
                      ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      : "Continue to Payment"}
                  </Button>

                  <p className="text-[11px] leading-relaxed text-muted-foreground/70 mt-4">
                    Media is licensed for client marketing use. Milkywayy may
                    showcase selected work for portfolio and promotional
                    purposes.
                  </p>
                </aside>
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

        <footer className="mt-24 border-t border-border/40 pt-14 pb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo-texxt.png"
              height={40}
              width={220}
              alt="Milkywayy"
            />
          </div>
          <p className="text-muted-foreground mb-10">
            Don&apos;t Just List. Dominate.
          </p>
          <p className="text-sm text-muted-foreground/80">
            &copy; 2026 Milkywayy LLC | All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
