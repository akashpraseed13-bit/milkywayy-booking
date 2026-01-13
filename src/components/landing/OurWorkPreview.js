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
    { label: "Videography", value: OUR_WORK_TYPES.SHORT_VIDEO },
    { label: "360° Tour", value: OUR_WORK_TYPES.THREE_SIXTY },
    // { label: "Long-form", value: OUR_WORK_TYPES.VIDEO },
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
    .slice(0, 3);

  return (
    <section id="our-work" className="py-24">
      <div className="container mx-auto px-6 lg:px-2">
        <div className="text-center mb-12 fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our Work
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our portfolio of stunning property visuals across Dubai.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 fade-in">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value
                  ? "bg-accent text-accent-foreground shadow-lg scale-105"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading
          ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="aspect-[4/3] bg-muted animate-pulse rounded-xl" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          : filteredItems.length > 0
            ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 justify-between mb-12">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-4 fade-in mx-auto"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`relative ${item.type!=='SHORT_VIDEO' ? 'aspect-4/3' : ''} min-w-[80vw] lg:min-w-[25vw] bg-card rounded-xl overflow-hidden shadow-md`}>
                      <div className={item.type === OUR_WORK_TYPES.IMAGE && !isTouch ? "photography-grayscale h-full w-full" : "h-full w-full"}>
                        <MediaRenderer
                          type={item.type}
                          url={item.mediaContent}
                          title={item.title}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            : <div className="text-center py-12 text-muted-foreground">
                No works to display in this category.
              </div>}

        <div className="text-center">
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
