import { NextResponse } from "next/server";
import { sequelize } from "@/lib/db/db";
import OurWork from "@/lib/db/models/ourwork";

export async function PATCH(request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Payload must be an array of objects with id and order" },
        { status: 400 },
      );
    }

    await sequelize.transaction(async (t) => {
      for (const item of body) {
        if (item.id !== undefined && item.order !== undefined) {
          await OurWork.update(
            { order: item.order },
            { where: { id: item.id }, transaction: t },
          );
        }
      }
    });

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error reordering our works:", error);
    return NextResponse.json(
      { error: "Failed to reorder our works" },
      { status: 500 },
    );
  }
}
