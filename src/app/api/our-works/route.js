import { NextResponse } from "next/server";
import OurWork from "@/lib/db/models/ourwork";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const type = searchParams.get("type");

    const where = {
      isVisible: true,
    };

    if (type) {
      where.type = type;
    }

    const options = {
      where,
      order: [["order", "ASC"]],
    };

    if (limit) {
      const parsedLimit = Number.parseInt(limit, 10);
      if (!Number.isNaN(parsedLimit)) {
        options.limit = parsedLimit;
      }
    }

    const works = await OurWork.findAll(options);

    return NextResponse.json(works);
  } catch (error) {
    console.error("Error fetching our works:", error);
    return NextResponse.json(
      { error: "Failed to fetch our works" },
      { status: 500 },
    );
  }
}
