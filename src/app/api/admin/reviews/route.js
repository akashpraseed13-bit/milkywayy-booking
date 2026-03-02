import { NextResponse } from "next/server";
import Review from "@/lib/db/models/review";

export async function GET() {
  try {
    const reviews = await Review.findAll({
      order: [
        ["featured", "DESC"],
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      role,
      company,
      quote,
      rating,
      source,
      featured,
      order,
      isVisible,
    } = body;

    if (!name || !role || !company || !quote) {
      return NextResponse.json(
        { error: "Name, role, company and quote are required" },
        { status: 400 },
      );
    }

    const review = await Review.create({
      name,
      role,
      company,
      quote,
      rating: rating || 5,
      source: source || "Google",
      featured: featured === true,
      order: order || 0,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
