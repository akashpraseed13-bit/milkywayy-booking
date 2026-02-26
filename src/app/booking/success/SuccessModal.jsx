"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SuccessModal() {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-lg bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Payment Successful
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Your booking has been confirmed.</p>
          <p>We’ve sent a confirmation message with the arrival window details.</p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button asChild variant="secondary">
            <Link href="/dashboard/bookings">Go to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/booking">Book Another Property</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
