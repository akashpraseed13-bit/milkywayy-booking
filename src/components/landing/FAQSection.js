import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How fast is delivery?",
      answer:
        "Photos are delivered in 24 hours for standard listings. Video and 360 timelines are shown during booking.",
    },
    {
      question: "How do I receive my files?",
      answer:
        "All files are delivered directly inside your dashboard and remain available for download anytime.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We currently cover all key real estate communities across Dubai.",
    },
    {
      question: "Is pricing transparent?",
      answer:
        "Yes. The portal shows clear package pricing before payment, including applicable discounts.",
    },
    {
      question: "Can I reschedule, cancel, or request a refund?",
      answer:
        "Yes. You can reschedule or request support from your dashboard and our team for case-by-case requests.",
    },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-4">
              FAQ
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4 fade-in">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="bg-card/50 border border-border rounded-xl px-6 data-[state=open]:border-accent/50"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
