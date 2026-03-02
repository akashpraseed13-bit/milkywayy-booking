import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/helpers/auth";
import ReviewList from "./ReviewList";

async function getReviews() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/reviews`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) throw new Error("Failed to fetch reviews");

    return await res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export default async function ReviewsManagement() {
  const session = await getSessionUser();

  if (!session || session.role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  const items = await getReviews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-gray-600 mt-2">
          Manage testimonial reviews shown on the landing page
        </p>
      </div>

      <ReviewList initialItems={items} />
    </div>
  );
}
