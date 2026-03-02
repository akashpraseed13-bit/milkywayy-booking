import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderBackground from "@/components/HeaderBackground";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth";
import VideoModal from "./VideoModal";

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
    { label: "Our Work", action: () => scrollToSection("our-work") },
    { label: "Reviews", action: () => scrollToSection("reviews") },
    { label: "FAQ", action: () => scrollToSection("faq") },
    { label: "Contact", action: () => scrollToSection("contact") },
  ];

  return (
    <>
      <HeaderBackground>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Milkywayy Logo"
                width={220}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-7">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/booking">
                <Button className="bg-white/12 border border-white/20 text-white hover:bg-white/20 rounded-xl px-7">
                  Book Now
                </Button>
              </Link>
              <Button
                onClick={handleDashboardClick}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-xl px-6"
              >
                Dashboard
              </Button>
            </div>

            <button
              type="button"
              className="lg:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 px-4 space-y-4 border-t border-border pt-4 bg-background/90 backdrop-blur-lg shadow-lg">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action?.();
                    if (item.label !== "How it works") {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="block w-full text-left text-sm font-medium hover:text-accent transition-colors"
                >
                  {item.label}
                </button>
              ))}
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
