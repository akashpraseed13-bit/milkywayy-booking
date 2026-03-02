import { NextResponse } from "next/server";
import Review from "@/lib/db/models/review";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const review = await Review.findByPk(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await review.update({
      name: body.name !== undefined ? body.name : review.name,
      role: body.role !== undefined ? body.role : review.role,
      company: body.company !== undefined ? body.company : review.company,
      quote: body.quote !== undefined ? body.quote : review.quote,
      rating: body.rating !== undefined ? body.rating : review.rating,
      source: body.source !== undefined ? body.source : review.source,
      featured: body.featured !== undefined ? body.featured : review.featured,
      order: body.order !== undefined ? body.order : review.order,
      isVisible:
        body.isVisible !== undefined ? body.isVisible : review.isVisible,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const review = await Review.findByPk(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await review.destroy();

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
