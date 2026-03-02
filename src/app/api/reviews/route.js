import { NextResponse } from "next/server";
import Review from "@/lib/db/models/review";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const options = {
      where: { isVisible: true },
      order: [
        ["featured", "DESC"],
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    };

    if (limit) {
      const parsedLimit = Number.parseInt(limit, 10);
      if (!Number.isNaN(parsedLimit)) {
        options.limit = parsedLimit;
      }
    }

    const reviews = await Review.findAll(options);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
