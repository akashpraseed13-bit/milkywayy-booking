import { Check, X } from "lucide-react";

const PainSolutionSection = () => {
  const beforeItems = [
    "Availability ping-pong",
    "Unclear packages & pricing",
    "No tracking",
    "Chasing files",
    "Varying styles across listings",
  ];

  const afterItems = [
    "Book instantly",
    "Clear options upfront",
    "Track every shoot",
    "Download files & invoices anytime",
    "Consistent quality, every time",
  ];

  return (
    <section className="py-24 relative border-t border-border/40">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14 fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Stop Coordinating. Start Listing.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-7 max-w-6xl mx-auto">
          <div className="bg-card/40 border border-border rounded-2xl p-8 fade-in">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-4xl font-semibold text-muted-foreground">
                Traditional Booking
              </h3>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground/80 text-xl"
                >
                  <X className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-card/40 border border-border rounded-2xl p-8 fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Check className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading text-4xl font-semibold">
                Milkywayy Portal
              </h3>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-xl">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;
