"use client";

import { Download } from "lucide-react";

export default function FileList({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-400">No files available for download.</p>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-card/70 p-6 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div>
            <div className="text-lg mb-1 font-semibold text-white">
                {[
                  booking.propertyDetails?.unit,
                  booking.propertyDetails?.building,
                  booking.propertyDetails?.community,
                ]
                  .filter(Boolean)
                  .join(", ") || "Property Shoot"}
            </div>
            <p className="text-gray-400 text-sm">Date: {booking.date}</p>
          </div>

          <a
            href={booking.filesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg gap-2 px-4 py-2 ring-offset-background focus-visible:ring-2 bg-accent text-accent-foreground rounded-md text-sm font-semibold transition-colors"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
