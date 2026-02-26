import { redirect } from "next/navigation";
import { getBookings } from "@/lib/actions/bookings";
import { auth } from "@/lib/helpers/auth";
import BookingList from "./BookingList";

export default async function BookingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const res = await getBookings(session.id);
  const bookings = res.success ? res.data : [];
  const plainBookings = bookings
    .map((b) => b.toJSON())
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    );

  return (
    <div className="text-white">
      <div className="w-full">
        <BookingList bookings={plainBookings} />
      </div>
    </div>
  );
}
