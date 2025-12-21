import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/helpers/auth";
import PortfolioList from "./PortfolioList";

async function getPortfolioItems() {
  try {
    // We use the internal API route or direct DB access
    // For consistency with other admin pages, we use a similar pattern
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/our-works`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) throw new Error("Failed to fetch portfolio items");

    return await res.json();
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return [];
  }
}

export default async function PortfolioManagement() {
  const session = await getSessionUser();

  if (!session || session.role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  const items = await getPortfolioItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-gray-600 mt-2">
            Manage 'Our Works' entries shown on the landing page and portfolio
          </p>
        </div>
      </div>

      <PortfolioList initialItems={items} />
    </div>
  );
}
