"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function HeaderBackground({ children, className, ...props }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}
