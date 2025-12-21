"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MediaRenderer from "../portfolio/MediaRenderer";

const OurWorkPreview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopWorks() {
      try {
        const res = await fetch("/api/our-works?limit=3");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch works:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopWorks();
  }, []);

  return (
    <section id="our-work" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our Work
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our portfolio of stunning property visuals across Dubai.
          </p>
        </div>

        {loading
          ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-muted animate-pulse rounded-xl"
                />
              ))}
            </div>
          : items.length > 0
            ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative aspect-[4/3] bg-card rounded-xl overflow-hidden cursor-pointer fade-in shadow-lg"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MediaRenderer
                      type={item.type}
                      url={item.mediaContent}
                      title={item.title}
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div>
                        <p className="font-bold text-lg">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            : <div className="text-center py-12 text-muted-foreground">
                No works to display yet.
              </div>}

        <div className="text-center mt-8">
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8"
            >
              See All Work
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurWorkPreview;
