import {
  BadgeCheck,
  Building,
  Building2,
  Clock,
  Home,
  MapPin,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = ({ onWatchVideo }) => {
  const trustChips = [
    { icon: Clock, text: "Photos in 24h*" },
    { icon: BadgeCheck, text: "From AED 350" },
    { icon: MapPin, text: "Dubai-wide" },
  ];

  const propertyTypes = [
    { label: "Apartment", icon: Building2, active: true },
    { label: "Villa/Townhouse", icon: Home, active: false },
    { label: "Commercial", icon: Building, active: false },
  ];

  const serviceTypes = ["Photography", "Video", "360 Tour"];

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-background/50 border-b border-border/60" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 fade-in">
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-[0.96]">
              Don&apos;t Just List.
              <br />
              Dominate.
            </h1>
            <p className="text-2xl/8 text-muted-foreground max-w-2xl">
              Dubai&apos;s first structured real estate media booking system.
              Book photography, video walkthroughs, and 360 tours in seconds,
              then manage listings and invoices from one powerful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base px-9 rounded-2xl"
                >
                  Book Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border hover:bg-secondary text-base rounded-2xl"
                onClick={onWatchVideo}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch How It Works
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {trustChips.map((chip) => (
                <div
                  key={chip.text}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/40 border border-border rounded-full text-sm"
                >
                  <chip.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{chip.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              *Photos for any property are delivered within 24h.
            </p>
          </div>

          <div className="relative fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
            <div className="relative bg-card/80 border border-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex border-b border-border">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 text-xl font-medium bg-secondary/50 border-b-2 border-accent"
                >
                  Booking Flow
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 px-4 text-xl font-medium text-muted-foreground"
                >
                  Dashboard
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xl uppercase tracking-wider text-muted-foreground mb-3">
                    Property Type
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {propertyTypes.map((propertyType) => (
                      <div
                        key={propertyType.label}
                        className={`rounded-xl border p-4 text-center text-sm flex flex-col items-center justify-center gap-2 min-h-[100px] ${
                          propertyType.active
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border bg-background/30"
                        }`}
                      >
                        <propertyType.icon className="w-4 h-4" />
                        <span>{propertyType.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl uppercase tracking-wider text-muted-foreground mb-3">
                    Select Service
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {serviceTypes.map((service, idx) => (
                      <span
                        key={service}
                        className={`rounded-xl border px-3 py-3 text-center text-sm ${
                          idx === 0
                            ? "bg-background border-accent/70"
                            : "bg-background/40 border-border"
                        }`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl uppercase tracking-wider text-muted-foreground mb-3">
                    Schedule
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-secondary/50 rounded-xl text-sm text-center">
                      Dec 15, 2024
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl text-center">
                      <p className="text-sm">Morning</p>
                      <p className="text-xs text-muted-foreground">
                        Arrival: 9:30 - 10 AM
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground text-base rounded-xl">
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
