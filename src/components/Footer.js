"use client";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = ({ hideLinks }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <footer className="relative overflow-hidden border-t border-border py-12">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70"></div>

      <div className="container mx-auto px-0 relative z-10">
        {hideLinks ? (
          <div className="flex flex-col justify-center items-center mb-8">
            <div className="text-center">
              <img
                src={"/logo-with-title.png"}
                alt="Milkywayy Logo"
                className="h-18 w-auto mb-3 object-fit rounded-none ml-0"
              />
              <p
                className={`text-sm text-muted-foreground ${hideLinks ? "" : "ml-6"}`}
              >
                The Launchpad for Your Listings.
              </p>
            </div>
          </div>
        ): (
          <div
            className="grid grid-cols-1 md:grid-cols-3"
          >
            {/* Left: Logo + Tagline */}
            <div className="text-center">
              <img
                src={"/logo-with-title.png"}
                alt="Milkywayy Logo"
                className="h-12 w-auto mb-3 object-fit rounded-none ml-0"
              />
              <p
                className="text-sm text-muted-foreground ml-6"
              >
                The Launchpad for Your Listings.
              </p>
            </div>

              {/* Center: Quick Links */}
              <div className="flex flex-col px-6 space-y-2">
                <h4 className="font-heading font-semibold mb-2">Quick Links</h4>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors text-left"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors text-left"
                >
                  Projects
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors text-left"
                >
                  Contact
                </button>
              </div>

              {/* Right: Social Icons */}
              <div className="flex flex-col ml-6">
                <h4 className="font-heading font-semibold mb-2">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/milkywayy_com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://linkedin.com/company/milkywayy-com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
          </div>
        )}

        {/* Bottom Line */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Milkywayy LLC | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
