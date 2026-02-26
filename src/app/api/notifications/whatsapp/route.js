import { NextResponse } from "next/server";
import { auth } from "@/lib/helpers/auth";
import { USER_ROLES } from "@/lib/config/app.config";
import {
  sendPreShootReminder,
  sendTeamArrived,
  sendTeamOnTheWay,
} from "@/lib/actions/notifications";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== USER_ROLES.SUPERADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { type, bookingId } = await request.json();
    if (!type || !bookingId) {
      return NextResponse.json(
        { error: "type and bookingId are required" },
        { status: 400 },
      );
    }

    if (type === "shoot_reminder") {
      const result = await sendPreShootReminder(bookingId);
      return NextResponse.json(result);
    }
    if (type === "team_on_the_way") {
      const result = await sendTeamOnTheWay(bookingId);
      return NextResponse.json(result);
    }
    if (type === "team_arrived") {
      const result = await sendTeamArrived(bookingId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown template type" }, { status: 400 });
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
