import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth";
import VideoModal from "./VideoModal";
import HeaderBackground from "@/components/HeaderBackground";

const logo = "/logo-with-title.png";

const NewNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [pendingDashboardRedirect, setPendingDashboardRedirect] =
    useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { authState, login } = useAuth();

  useEffect(() => {
    if (pendingDashboardRedirect && authState.isAuthenticated) {
      router.push("/dashboard");
      setPendingDashboardRedirect(false);
    }
  }, [authState.isAuthenticated, pendingDashboardRedirect, router]);

  const scrollToSection = (id) => {
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleDashboardClick = () => {
    if (authState.isAuthenticated) {
      router.push("/dashboard");
    } else {
      setPendingDashboardRedirect(true);
      login();
    }
  };

  const navItems = [
    { label: "Services", action: () => scrollToSection("services") },
    { label: "How it works", action: () => setShowVideoModal(true) },
    { label: "Our Work", href: "/portfolio" },
    { label: "Reviews", action: () => scrollToSection("reviews") },
    { label: "FAQ", action: () => scrollToSection("faq") },
    { label: "Contact", action: () => scrollToSection("contact") },
  ];

  return (
    <>
      <HeaderBackground>
        <div className="container mx-auto pl-2 pr-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src={logo} alt="Milkywayy Logo" className="h-10 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) =>
                item.href
                  ? <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  : <button
                      key={item.label}
                      onClick={item.action}
                      className="text-sm font-medium hover:text-accent transition-colors"
                    >
                      {item.label}
                    </button>,
              )}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/booking">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 glow-pulse">
                  Book Now
                </Button>
              </Link>
              <Button
                onClick={handleDashboardClick}
                variant="outline"
                className="border-border hover:bg-secondary"
              >
                Dashboard
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 px-4 space-y-4 border-t border-border pt-4 bg-background/90 backdrop-blur-lg shadow-lg">
              {navItems.map((item) =>
                item.href
                  ? <Link
                      key={item.label}
                      href={item.href}
                      className="block text-sm font-medium hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  : <button
                      key={item.label}
                      onClick={() => {
                        item.action?.();
                        if (item.label !== "How it works")
                          setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-sm font-medium hover:text-accent transition-colors"
                    >
                      {item.label}
                    </button>,
              )}
              <div className="space-y-2 pt-2">
                <Link
                  href="/booking"
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Now
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    handleDashboardClick();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-border"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </HeaderBackground>

      <VideoModal open={showVideoModal} onOpenChange={setShowVideoModal} />
    </>
  );
};

export default NewNavbar;
