import { verifyStripeSession } from "@/lib/actions/bookings";
import SuccessModal from "./SuccessModal";

export default async function BookingSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (session_id) {
    await verifyStripeSession(session_id);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SuccessModal />
    </div>
  );
}
