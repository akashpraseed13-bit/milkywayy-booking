"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelBooking } from "@/lib/actions/bookings";

export default function BookingList({ bookings }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setLoadingId(id);
    try {
      const res = await cancelBooking(id);
      if (!res.success) throw new Error(res.message);
      router.refresh();
    } catch (error) {
      alert(error.message || "Failed to cancel booking");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReschedule = (id) => {
    alert("Reschedule functionality coming soon!");
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  };

  const getStatusChip = (booking) => {
    if (booking.cancelledAt) {
      return (
        <span className="text-red-500 text-sm font-medium">Cancelled</span>
      );
    } else if (booking.completedAt) {
      return (
        <span className="text-green-500 text-sm font-medium">Completed</span>
      );
    } else {
      return (
        <span className="text-zinc-400 text-sm">
          {booking.slot === 1
            ? "10:00 AM"
            : booking.slot === 2
              ? "02:00 PM"
              : "06:00 PM"}
        </span>
      );
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border">
        <p className="">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-card/70 p-5 rounded-xl border hover:bg-secondary transition-all cursor-pointer group"
          onClick={() => handleBookingClick(booking)}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 leading-tight">
                {[
                  booking.propertyDetails?.unit,
                  booking.propertyDetails?.building,
                  booking.propertyDetails?.community,
                ]
                  .filter(Boolean)
                  .join(", ") || "Property Shoot"}
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                {booking.shootDetails?.services?.join(" + ") ||
                  "Standard Shoot"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-zinc-100 font-bold">
                {formatDate(booking.date)}
              </div>
              <div className="mt-1">{getStatusChip(booking)}</div>
            </div>
          </div>

          {!booking.cancelledAt && !booking.completedAt && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReschedule(booking.id);
                }}
                className="px-4 py-1.5 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-all"
              >
                Reschedule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel(booking.id);
                }}
                disabled={loadingId === booking.id}
                className="px-4 py-1.5 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 text-red-500 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                {loadingId === booking.id ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          )}
        </div>
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl bg-[#181818] border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-zinc-800 pb-4">
            <DialogTitle>Booking Details #{selectedBooking?.id}</DialogTitle>
            <DialogDescription className="hidden">
              Details for booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Date & Slot</p>
                  <p className="font-medium">{selectedBooking.date}</p>
                  <p className="text-sm text-zinc-400">
                    Slot:{" "}
                    {selectedBooking.slot === 1
                      ? "Morning"
                      : selectedBooking.slot === 2
                        ? "Afternoon"
                        : "Evening"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Status</p>
                  {getStatusChip(selectedBooking)}
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="font-semibold mb-3 text-zinc-300">Services</h3>
                <p className="text-sm text-zinc-400">
                  {selectedBooking.shootDetails?.services?.join(", ") ||
                    "No services specified."}
                </p>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="font-semibold mb-3 text-zinc-300">
                  Property Details
                </h3>
                <div className="text-sm text-zinc-400 space-y-1">
                  <p>
                    <span className="font-medium text-zinc-300">Type:</span>{" "}
                    {selectedBooking.propertyDetails?.type}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-300">Size:</span>{" "}
                    {selectedBooking.propertyDetails?.size}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-300">Address:</span>{" "}
                    {[
                      selectedBooking.propertyDetails?.unit,
                      selectedBooking.propertyDetails?.building,
                      selectedBooking.propertyDetails?.community,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="font-semibold mb-3 text-zinc-300">
                  Contact Details
                </h3>
                <div className="text-sm text-zinc-400 space-y-1">
                  <p>
                    <span className="font-medium text-zinc-300">Name:</span>{" "}
                    {selectedBooking.contactDetails?.name}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-300">Phone:</span>{" "}
                    {selectedBooking.contactDetails?.phone}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-300">Email:</span>{" "}
                    {selectedBooking.contactDetails?.email}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="font-semibold mb-3 text-zinc-300">
                  Transaction
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-zinc-500 text-sm">Amount</p>
                    <p className="font-medium">
                      AED {selectedBooking.transaction?.amount}
                    </p>
                  </div>
                  {selectedBooking.transaction?.invoiceUrl ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link
                        href={selectedBooking.transaction.invoiceUrl}
                        target="_blank"
                      >
                        Download Invoice
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">
                      No invoice available
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-zinc-800 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
