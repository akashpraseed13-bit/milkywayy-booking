"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";
import { isTouchDevice } from "@/lib/helpers/ui";
import MediaRenderer from "../portfolio/MediaRenderer";

const OurWorkPreview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(OUR_WORK_TYPES.IMAGE);
  const [isTouch, setIsTouch] = useState(false);

  const categories = [
    { label: "Photography", value: OUR_WORK_TYPES.IMAGE },
    { label: "360°", value: OUR_WORK_TYPES.THREE_SIXTY },
    { label: "Short-form", value: OUR_WORK_TYPES.SHORT_VIDEO },
    { label: "Long-form", value: OUR_WORK_TYPES.VIDEO },
  ];

  useEffect(() => {
    setIsTouch(isTouchDevice());

    async function fetchWorks() {
      try {
        const res = await fetch("/api/our-works");
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

    fetchWorks();
  }, []);

  const filteredItems = items
    .filter((item) => item.type === activeCategory)
    .slice(0, 6);

  return (
    <section id="our-work" className="py-24">
      <div className="container mx-auto px-6 lg:px-2">
        <div className="text-center mb-12 fade-in">
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            Our Work
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-xl">
            Showcase of recent real estate projects across Dubai.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 fade-in">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading
          ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-muted/60 animate-pulse rounded-xl"
                />
              ))}
            </div>
          : filteredItems.length > 0
            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group fade-in"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div
                      className={`relative ${item.type !== "SHORT_VIDEO" ? "aspect-4/3" : ""} min-h-[240px] bg-card rounded-xl overflow-hidden border border-border/60`}
                    >
                      <div
                        className={
                          item.type === OUR_WORK_TYPES.IMAGE && !isTouch
                            ? "photography-grayscale h-full w-full"
                            : "h-full w-full"
                        }
                      >
                        <MediaRenderer
                          type={item.type}
                          url={item.mediaContent}
                          title={item.title}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`placeholder_${i}`}
                    className="aspect-[4/3] rounded-xl border border-border/60 bg-gradient-to-br from-card to-secondary/30"
                  />
                ))}
              </div>}

        <div className="text-center">
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 rounded-xl"
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
