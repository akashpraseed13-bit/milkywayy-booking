import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { verifyStripeSession } from "@/lib/actions/bookings";

export default async function BookingSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (session_id) {
    await verifyStripeSession(session_id);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Your booking has been confirmed. We have sent a confirmation email to
          your registered address.
        </p>
        <div className="pt-4">
          <Link
            href="/booking"
            className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Another Property
          </Link>
        </div>
      </div>
    </div>
  );
}
