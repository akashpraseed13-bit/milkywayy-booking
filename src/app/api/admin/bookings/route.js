import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Booking from "@/lib/db/models/booking";
import Transaction from "@/lib/db/models/transaction";
import User from "@/lib/db/models/user";
import "@/lib/db/relations";

export async function GET() {
  try {
    const bookings = await Booking.findAll({
      where: {
        status: {
          [Op.in]: ["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"]
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "amount", "status", "invoiceUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
