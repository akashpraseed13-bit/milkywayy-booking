import {
  Building,
  Building2,
  Calendar,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Home,
  Trash2,
  Video,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import DateSlotPicker from "@/components/DateSlotPicker";
import PhoneNumberInput from "@/components/PhoneInput";
import { OptionCard } from "./OptionCard";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPE_ORDER, SERVICE_ORDER, VIDEOGRAPHY_SUB_SERVICES, VIDEOGRAPHY_SUB_SERVICE_ORDER, VIDEOGRAPHY_SUB_CATEGORIES } from "@/lib/config/pricing";

const SERVICE_ICONS = {
  Photography: Camera,
  Videography: Video,
  "360° Tour": Globe,
};

const PROPERTY_TYPE_ICONS = {
  Apartment: Building2,
  Villa: Home,
  "Townhouse/Penthouse": Home,
  Commercial: Building,
};

const SERVICE_SUBTITLES = {
  // Videography: "30 - 90 secs walkthroughs",
  Videography: "Walkthrough Reels",
  // Videography: "Short-Form Walkthroughs (30-90s)",
};

export function PropertyCard({
  index,
  property,
  isOpen,
  onToggle,
  onDuplicate,
  onRemove,
  control,
  setValue,
  errors,
  pricingConfig,
  getPropertyPrice,
  getPropertyDurationAndEvening,
  getOccupiedSlots,
  toggleService,
  updatePropertyField,
  isOnlyProperty,
}) {
  const price = getPropertyPrice(property);
  const titleParts = [];
  if (property.community) titleParts.push(property.community);
  if (property.propertyType) titleParts.push(property.propertyType);
  if (property.propertySize) titleParts.push(property.propertySize);

  const { duration, allowEvening } = getPropertyDurationAndEvening(property);

  return (
    <Card
      className={cn(
        "bg-card/80 border border-zinc-800 shadow-none overflow-visible",
        isOpen ? "relative z-10" : "relative z-0",
      )}
    >
      <CardHeader
        className="flex flex-row justify-between items-center pb-4 cursor-pointer space-y-0"
        onClick={onToggle}
      >
        <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2 text-base md:text-xl font-semibold text-foreground">
          {!isOpen && titleParts.length > 0 ? (
            titleParts.map((part, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <span>{part}</span>
                {idx < titleParts.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                )}
              </div>
            ))
          ) : (
            <span>Property {index + 1}</span>
          )}
          {price > 0 && (
            <div className="w-full md:hidden mt-1">
              <span className="bg-zinc-800 px-3 py-1 rounded-md text-sm font-medium text-foreground">
                AED {price}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {price > 0 && (
            <div className="hidden md:block bg-zinc-800 px-3 py-1 rounded-md text-sm font-medium text-foreground mr-2">
              AED {price}
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-accent-foreground h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(index);
            }}
            title="Duplicate"
          >
            <Copy size={18} />
          </Button>
          {!isOnlyProperty && (
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              title="Remove"
            >
              <Trash2 size={18} />
            </Button>
          )}
          <div className="ml-2">
            {isOpen ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {!isOpen && (
        <CardContent className="pt-0 pb-4 space-y-4">
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{property.preferredDate || "Select Date"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="capitalize">
                {property.startTime || property.timeSlot || "Select Time"}
              </span>
            </div>
          </div>

          <div>
            <div className="text-md text-foreground mb-2">Services:</div>
            <div className="flex flex-wrap gap-2">
              {property.services?.length > 0 ? (
                property.services.map((s) => (
                  <span
                    key={s}
                    className="bg-zinc-800 text-muted-foreground px-3 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">
                  No services selected
                </span>
              )}
            </div>
          </div>

          {errors.properties?.[index] && (
            <p className="text-red-500 text-xs mt-2">Please fill all fields</p>
          )}
        </CardContent>
      )}

      {isOpen && (
        <>
          <Separator className="bg-border" />
          <CardContent className="pt-6 space-y-8 overflow-visible">
            {/* Property Type Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Property Type
              </label>
              <Controller
                name={`properties.${index}.propertyType`}
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROPERTY_TYPE_ORDER.map((type) => {
                      if (!pricingConfig[type]) return null;
                      const Icon = PROPERTY_TYPE_ICONS[type] || Building;
                      return (
                        <OptionCard
                          key={type}
                          className="p-4 text-center flex flex-col items-center justify-center gap-3 min-h-24"
                          isSelected={field.value === type}
                          onClick={() => {
                            updatePropertyField(index, "propertyType", type);
                            setValue(`properties.${index}.propertySize`, "");
                            setValue(`properties.${index}.services`, []);
                          }}
                        >
                          <Icon size={24} />
                          <span className="text-sm font-medium">{type}</span>
                        </OptionCard>
                      );
                    })}
                  </div>
                )}
              />
              {errors.properties?.[index]?.propertyType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.properties[index].propertyType.message}
                </p>
              )}
            </div>

            {/* Property Size Selection */}
            {property.propertyType && pricingConfig && pricingConfig[property.propertyType] && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {property.propertyType === "Commercial" ? "Select Package" : "Property Size"}
                </label>
                <Controller
                  name={`properties.${index}.propertySize`}
                  control={control}
                  render={({ field }) => (
                    <div className={property.propertyType === "Commercial" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 w-full" : "grid grid-cols-2 lg:grid-cols-4 gap-3 w-full"}>
                      {pricingConfig[property.propertyType].sizes.map((sizeObj) => {
                        if (property.propertyType === "Commercial") {
                          const isSelected = field.value === sizeObj.label;
                          
                          const TIER_META = {
                            Basic: {
                              icon: Building,
                              subtitle: "Small offices / retail units",
                            },
                            Essential: {
                              icon: Building2,
                              subtitle: "Showrooms / partitioned offices",
                              badge: "Most Popular",
                            },
                            Premium: {
                              icon: Video,
                              subtitle: "Full floors / larger commercial spaces",
                            },
                            Elite: {
                              icon: Calendar,
                              subtitle: "HQs / Warehouses / Corporate facilities",
                              badge: "Priority Delivery",
                            },
                          };

                          const meta = TIER_META[sizeObj.label];
                          const Icon = meta?.icon || Building;

                          return (
                            <div
                              key={sizeObj.label}
                              onClick={() => {
                                updatePropertyField(index, "propertySize", sizeObj.label);
                                setValue(`properties.${index}.services`, []);
                              }}
                              className={cn(
                                "relative cursor-pointer rounded-xl border transition-all duration-300 p-6 text-center flex flex-col items-center justify-center gap-3",
                                isSelected
                                  ? "border-yellow-500 bg-zinc-900 shadow-lg scale-[1.02]"
                                  : "border-zinc-700 bg-[#1f1f1f] hover:border-zinc-500"
                              )}
                            >
                              {/* Badge */}
                              {meta?.badge && (
                                <div
                                  className={cn(
                                    "absolute -top-3 px-3 py-1 text-xs font-medium rounded-full",
                                    meta.badge === "Most Popular"
                                      ? "bg-yellow-500 text-black"
                                      : "bg-red-600 text-white"
                                  )}
                                >
                                  {meta.badge}
                                </div>
                              )}

                              <div
                                className={cn(
                                  "p-3 rounded-full",
                                  isSelected
                                    ? "bg-yellow-500/20"
                                    : "bg-zinc-800"
                                )}
                              >
                                <Icon
                                  size={28}
                                  className={
                                    isSelected ? "text-yellow-400" : "text-muted-foreground"
                                  }
                                />
                              </div>

                              <div className="font-semibold text-lg text-foreground">
                                {sizeObj.label}
                              </div>

                              <div className="text-sm text-muted-foreground">
                                {meta?.subtitle}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <OptionCard
                              isSelected={field.value === sizeObj.label}
                              key={sizeObj.label}
                              className="px-4 py-3"
                              onClick={() => {
                                updatePropertyField(
                                  index,
                                  "propertySize",
                                  sizeObj.label,
                                );
                                setValue(`properties.${index}.services`, []);
                              }}
                            >
                              {sizeObj.label}
                            </OptionCard>
                          );
                        }
                      })}
                    </div>
                  )}
                />
                {errors.properties?.[index]?.propertySize && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.properties[index].propertySize.message}
                  </p>
                )}
              </div>
            )}

            {/* Services Selection */}
            {property.propertySize && property.propertyType && pricingConfig && pricingConfig[property.propertyType] && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Services (Multiple Selection)
                </label>
                <Controller
                  name={`properties.${index}.services`}
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                      {(() => {
                        const typeConfig = pricingConfig[property.propertyType];
                        const sizeConfig = typeConfig.sizes.find(
                          (s) => s.label === property.propertySize,
                        );
                        if (!sizeConfig) return null;

                        return SERVICE_ORDER.map((serviceName) => {
                          // Filter services based on commercial tier
                          if (property.propertyType === "Commercial") {
                            const availableServices = {
                              "Basic": ["Photography", "Videography"],
                              "Essential": ["Photography", "Videography", "360° Tour"],
                              "Premium": ["Photography", "Videography", "360° Tour"],
                              "Elite": ["Photography", "Videography", "360° Tour"]
                            };
                            
                            if (!availableServices[property.propertySize]?.includes(serviceName)) {
                              return null;
                            }
                          }
                          
                          let priceConfig = sizeConfig.prices[serviceName];
                          if (priceConfig === undefined) return null;

                          // Handle videography sub-service pricing
                          let price;
                          if (
                            serviceName === "Videography" &&
                            property.videographySubService &&
                            typeof priceConfig === "object"
                          ) {
                            const [mainService] = property.videographySubService.split(".");
                            
                            // For commercial properties, use simplified pricing (no subcategories)
                            if (property.propertyType === "Commercial") {
                              price = priceConfig?.[mainService]?.price || 0;
                            } else {
                              // For non-commercial, keep existing subcategory logic
                              const subCategory = property.videographySubService.split(".")[1];
                              if (subCategory) {
                                price =
                                  priceConfig?.[mainService]?.[subCategory]?.price || 0;
                              } else {
                                price = priceConfig?.[mainService]?.price || 0;
                              }
                            }
                          } else {
                            price = typeof priceConfig === "object"
                              ? priceConfig.price || 0
                              : priceConfig || 0;
                          }

                          const Icon = SERVICE_ICONS[serviceName] || Camera;
                          const isSelected = field.value?.includes(serviceName);
                          return (
                            <OptionCard
                              key={serviceName}
                              isSelected={isSelected}
                              onClick={() =>
                                toggleService(
                                  index,
                                  serviceName,
                                  field.value || [],
                                )
                              }
                            >
                              <div className="flex justify-items-center flex-col items-center gap-3">
                                <Icon
                                  size={32}
                                  className={
                                    isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }
                                />
                                <div className="">
                                  <div className="font-semibold mb-1">
                                    {serviceName}
                                  </div>
                                  {property.propertyType === "Commercial" ? (
                                    <div className="text-xs text-muted-foreground mb-1">
                                      {serviceName === "Photography" && "Up to 10 edited photos"}
                                      {serviceName === "Videography" && property.videographySubService?.includes("Short") && "60–90 sec"}
                                      {serviceName === "Videography" && property.videographySubService?.includes("Long") && "8–15 mins max"}
                                      {serviceName === "360° Tour" && "Up to 20 hotspots"}
                                    </div>
                                  ) : SERVICE_SUBTITLES[serviceName] ? (
                                    <div className="text-xs text-muted-foreground mb-1">
                                      {SERVICE_SUBTITLES[serviceName]}
                                    </div>
                                  ) : null}
                                  {property.propertyType === "Commercial" ? (
                                    <div className="text-sm text-muted-foreground">
                                      {serviceName !== "Videography" && `AED ${price}`}
                                    </div>
                                  ) : serviceName !== "Videography" && (
                                    <div className="text-sm text-muted-foreground">
                                      AED {price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </OptionCard>
                          );
                        });
                      })()}
                    </div>
                  )}
                />
                {errors.properties?.[index]?.services && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.properties[index].services.message}
                  </p>
                )}
              </div>
            )}

            {/* Videography Sub-Service Selection */}
            {property.services?.includes("Videography") && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {property.propertyType === "Commercial" ? "Videography Package" : "Videography Duration"}
                </label>
                <Controller
                  name={`properties.${index}.videographySubService`}
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      {/* Main Service Selection */}
                      <div className={property.propertyType === "Commercial" && property.propertySize === "Basic" ? "grid grid-cols-1 gap-4 w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"}>
                        {VIDEOGRAPHY_SUB_SERVICE_ORDER.map((subService) => {
                          // Filter videography sub-services for commercial Basic tier
                          if (property.propertyType === "Commercial" && property.propertySize === "Basic") {
                            if (subService !== VIDEOGRAPHY_SUB_SERVICES.SHORT_FORM) {
                              return null;
                            }
                          }
                          
                          const typeConfig = pricingConfig[property.propertyType];
                          const sizeConfig = typeConfig?.sizes?.find(
                            (s) => s.label === property.propertySize,
                          );
                          const servicePriceConfig = sizeConfig?.prices?.["Videography"]?.[subService];
                          
                          // Calculate base price for display
                          let basePrice;
                          if (property.propertyType === "Commercial") {
                            // For commercial, use simplified pricing
                            basePrice = servicePriceConfig?.price || 0;
                          } else {
                            // For non-commercial, keep existing logic
                            if (subService === VIDEOGRAPHY_SUB_SERVICES.SHORT_FORM) {
                              basePrice = servicePriceConfig?.price || 0;
                            } else {
                              // For Long Form, show minimum of subcategories ("From")
                              if (!servicePriceConfig || typeof servicePriceConfig !== "object") {
                                basePrice = 0;
                              } else {
                                const values = Object.values(servicePriceConfig);
                                const count = values.length;
                                basePrice = count
                                  ? Math.min(
                                      ...values.map((cat) =>
                                        typeof cat?.price === "number" ? cat.price : Infinity,
                                      ),
                                    )
                                  : 0;
                                if (basePrice === Infinity) basePrice = 0;
                              }
                            }
                          }

                          return (
                            <OptionCard
                              key={subService}
                              isSelected={field.value?.split('.')?.[0] === subService}
                              onClick={() => {
                                if (property.propertyType === "Commercial") {
                                  // For commercial, just select the sub-service directly
                                  updatePropertyField(index, "videographySubService", subService);
                                } else {
                                  // For non-commercial, keep existing logic
                                  if (subService === VIDEOGRAPHY_SUB_SERVICES.SHORT_FORM) {
                                    updatePropertyField(index, "videographySubService", subService);
                                  } else {
                                    // For Long Form, select first subcategory
                                    const categoriesObj = VIDEOGRAPHY_SUB_CATEGORIES?.[subService];
                                    const firstCategoryLabel = categoriesObj
                                      ? Object.values(categoriesObj)[0]
                                      : undefined;
                                    if (!firstCategoryLabel) {
                                      updatePropertyField(index, "videographySubService", subService);
                                      return;
                                    }
                                    updatePropertyField(
                                      index,
                                      "videographySubService",
                                      `${subService}.${firstCategoryLabel}`,
                                    );
                                  }
                                }
                              }}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <div className="font-semibold">{subService}</div>
                                {property.propertyType === "Commercial" ? (
                                  <div className="text-sm text-muted-foreground">
                                    AED {basePrice}
                                  </div>
                                ) : (
                                  subService === VIDEOGRAPHY_SUB_SERVICES.SHORT_FORM && (
                                    <div className="text-sm text-muted-foreground">
                                      AED {basePrice}
                                    </div>
                                  )
                                )}
                              </div>
                            </OptionCard>
                          );
                        })}
                      </div>

                      {/* Sub-Category Selection - Show only for Long Form and non-commercial properties */}
                      {field.value?.split('.')?.[0] === VIDEOGRAPHY_SUB_SERVICES.LONG_FORM && property.propertyType !== "Commercial" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-muted-foreground mb-3">
                            {field.value.split('.')[0]} Options
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(() => {
                              const [mainService, selectedCategoryLabel] = field.value?.split('.') || [];
                              const categories = VIDEOGRAPHY_SUB_CATEGORIES[mainService];
                              
                              if (!categories) return null;

                              const currentCategory =
                                selectedCategoryLabel || Object.values(categories)[0];
                               
                              return Object.entries(categories).map(([categoryKey, categoryName]) => {
                                const typeConfig = pricingConfig[property.propertyType];
                                const sizeConfig = typeConfig?.sizes?.find(
                                  (s) => s.label === property.propertySize,
                                );
                                const priceConfig = sizeConfig?.prices?.["Videography"]?.[mainService]?.[categoryName];
                                const price = priceConfig?.price || 0;

                                return (
                                  <OptionCard
                                    key={categoryKey}
                                    isSelected={currentCategory === categoryName}
                                    onClick={() => {
                                      updatePropertyField(index, "videographySubService", `${mainService}.${categoryName}`);
                                    }}
                                  >
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="font-medium text-sm">{categoryName}</div>
                                      <div className="text-xs text-muted-foreground">
                                        AED {price}
                                      </div>
                                    </div>
                                  </OptionCard>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.properties?.[index]?.videographySubService && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.properties[index].videographySubService.message}
                  </p>
                )}
              </div>
            )}

            {/* Date and Time Details */}
            <div>
              <DateSlotPicker
                date={property.preferredDate}
                slot={property.startTime}
                duration={property.duration || 1}
                allowEvening={allowEvening}
                blockedSlotsMap={getOccupiedSlots(index)}
                onDateChange={(d) =>
                  updatePropertyField(index, "preferredDate", d)
                }
                onSlotChange={(s) => updatePropertyField(index, "startTime", s)}
                error={
                  errors.properties?.[index]?.preferredDate?.message ||
                  errors.properties?.[index]?.startTime?.message
                }
              />
            </div>

            <Separator className="bg-zinc-800 my-2" />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Controller
                name={`properties.${index}.building`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="group flex flex-col gap-1.5">
                    <label className="text-sm text-muted-foreground">
                      Building / Tower Name
                    </label>
                    <Input
                      {...field}
                      placeholder="eg. Burj Khalifa"
                      className="bg-[#272727] border-zinc-700 hover:border-zinc-500 focus-visible:border-white text-foreground"
                    />
                    {fieldState.error && (
                      <div className="text-red-500 text-xs ml-1 mt-1">
                        {fieldState.error.message}
                      </div>
                    )}
                  </div>
                )}
              />

              <Controller
                name={`properties.${index}.community`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="group flex flex-col gap-1.5">
                    <label className="text-sm text-muted-foreground">
                      Community / Area
                    </label>
                    <Input
                      {...field}
                      placeholder="eg. Downtown"
                      className="bg-[#272727] border-zinc-700 hover:border-zinc-500 focus-visible:border-white text-foreground"
                    />
                    {fieldState.error && (
                      <div className="text-red-500 text-xs ml-1 mt-1">
                        {fieldState.error.message}
                      </div>
                    )}
                  </div>
                )}
              />

              <Controller
                name={`properties.${index}.unitNumber`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="group flex flex-col gap-1.5">
                    <label className="text-sm text-muted-foreground">
                      Unit Number (Optional)
                    </label>
                    <Input
                      {...field}
                      placeholder="eg. 1205"
                      className="bg-[#272727] border-zinc-700 hover:border-zinc-500 focus-visible:border-white text-foreground"
                    />
                    {fieldState.error && (
                      <div className="text-red-500 text-xs ml-1 mt-1">
                        {fieldState.error.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <Separator className="bg-zinc-800 my-2" />

            {/* Point of Contact */}
            {/*
            <div>
              <h3 className="text-md font-medium text-foreground mb-4">
                Point of Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Controller
                  name={`properties.${index}.contactName`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="group flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">
                        Name
                      </label>
                      <Input
                        {...field}
                        placeholder="Enter contact name"
                        className="bg-[#272727] border-zinc-700 hover:border-zinc-500 focus-visible:border-white text-foreground"
                      />
                      {fieldState.error && (
                        <div className="text-red-500 text-xs ml-1 mt-1">
                          {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name={`properties.${index}.contactPhone`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="group flex flex-col gap-1.5">
                      <label className="block text-sm text-muted-foreground">
                        Phone Number
                      </label>
                      <PhoneNumberInput
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        name={field.name}
                        classNames={{
                          inputWrapper:
                            "flex items-center w-full px-3 rounded-xl bg-[#272727] border-2 border-zinc-700 hover:border-zinc-500 focus-within:!border-white transition-colors h-10",
                          input:
                            "bg-transparent border-none outline-none text-foreground w-full placeholder:text-muted-foreground text-sm h-full",
                          countryIcon: "mr-2 flex items-center h-full",
                        }}
                      />
                      {fieldState.error && (
                        <div className="text-red-500 text-xs ml-1 mt-1">
                          {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name={`properties.${index}.contactEmail`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="group flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">
                        Email Address (Optional)
                      </label>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                        className="bg-[#272727] border-zinc-700 hover:border-zinc-500 focus-visible:border-white text-foreground"
                      />
                      {fieldState.error && (
                        <div className="text-red-500 text-xs ml-1 mt-1">
                          {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          */}
          </CardContent>
        </>
      )}
    </Card>
  );
}
