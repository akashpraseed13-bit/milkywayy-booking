"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import NewNavbar from "@/components/NewNavbar";
import MediaRenderer from "@/components/portfolio/MediaRenderer";
import StarBackground from "@/components/StarBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const categories = [
    // { label: "All", value: "ALL" },
    { label: "Photography", value: OUR_WORK_TYPES.IMAGE },
    { label: "360°", value: OUR_WORK_TYPES.THREE_SIXTY },
    { label: "Short-form", value: OUR_WORK_TYPES.SHORT_VIDEO },
    { label: "Long-form", value: OUR_WORK_TYPES.VIDEO },
  ];

  const renderGrid = (filteredItems) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-y-6 py-8 items-center">
      {filteredItems.map((item, index) => (
        <div
          key={item.id}
          className="group flex flex-col gap-4 fade-in mx-auto"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className={`relative min-w-[60vw] md:min-w-[40vw] lg:min-w-[25vw] ${item.type!=='SHORT_VIDEO' ? 'aspect-4/3' : ''} bg-card rounded-2xl overflow-hidden shadow-xl border border-white/10`}>
            <MediaRenderer
              type={item.type}
              url={item.mediaContent}
              title={item.title}
            />
          </div>
          <div className="px-2">
            <h3 className="font-bold text-xl text-white">{item.title}</h3>
            {item.subtitle && (
              <p className="text-white/60 text-sm mt-1">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen text-white bg-background">
      <StarBackground />
      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBar />
          <NewNavbar />
        </div>

        <main className="pt-40 pb-24 container mx-auto px-6 md:px-4 lg:px-0">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 font-heading">
              Our Works
            </h1>
            <p className="text-xl text-muted-foreground">
              A collection of our premium real estate media across the UAE.
            </p>
          </div>

          {loading
            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="aspect-video bg-white/5 animate-pulse rounded-2xl" />
                    <div className="h-5 w-2/3 bg-white/5 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            : <Tabs defaultValue={categories[0].value} className="w-full">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <TabsList className="bg-white/5 border border-white/10 h-auto md:p-1.5 gap-1 md:gap-1.5 rounded-full">
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat.value}
                        value={cat.value}
                        className="rounded-full px-2 md:px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-black transition-all font-medium"
                      >
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {categories.map((cat) => (
                  <TabsContent key={cat.value} value={cat.value}>
                    {renderGrid(items.filter((i) => i.type === cat.value))}
                  </TabsContent>
                ))}

                {!loading && items.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-lg">
                      No entries found in this category.
                    </p>
                  </div>
                )}
              </Tabs>}
        </main>

        <Footer />
      </div>
    </div>
  );
}
