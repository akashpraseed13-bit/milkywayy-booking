import {
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  FolderDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PortalUSPSection = () => {
  const features = [
    { icon: Calendar, text: "Instant booking & scheduling" },
    { icon: DollarSign, text: "Transparent pricing" },
    {
      icon: FolderDown,
      text: "Files stored permanently (photo / video / 360)",
    },
    { icon: FileText, text: "Invoices downloadable anytime" },
    {
      icon: CheckCircle2,
      text: "Clear status tracking (Booked -> Scheduled -> Delivered)",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative fade-in order-2 lg:order-1">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
            <div className="relative bg-card/80 border border-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex border-b border-border">
                {["Bookings", "Files", "Invoices"].map((tab, i) => (
                  <button
                    type="button"
                    key={tab}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      i === 0
                        ? "bg-secondary/50 border-b-2 border-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-secondary/30 rounded-xl p-4 border border-border/60">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-muted-foreground">UPCOMING</span>
                    <span className="text-muted-foreground">
                      Tomorrow 10:00 AM
                    </span>
                  </div>
                  <p className="font-semibold mb-1">Marina Tower - Unit 2304</p>
                  <p className="text-sm text-muted-foreground">
                    Photography + Video
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs rounded-lg"
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs rounded-lg text-destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="bg-secondary/20 rounded-xl p-4 border border-border/60">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-muted-foreground">DELIVERED</span>
                    <span className="text-muted-foreground">Dec 10, 2024</span>
                  </div>
                  <p className="font-semibold mb-1">Palm Jumeirah Villa</p>
                  <p className="text-sm text-muted-foreground">
                    45 photos ready
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 rounded-lg bg-white/20 text-white hover:bg-white/30"
                  >
                    Download Files
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="fade-in order-1 lg:order-2"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-8">
              Everything in one Dashboard
            </h2>
            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-4 text-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border/60">
                    <feature.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-9"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalUSPSection;
