import CustomerHeader from "@/components/CustomerHeader";

export default function BookingLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      <main>{children}</main>
    </div>
  );
}
