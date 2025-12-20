import { redirect } from "next/navigation";
import { getWalletData } from "@/lib/actions/wallet";
import { auth } from "@/lib/helpers/auth";
import WalletView from "./WalletView";

export default async function WalletPage() {
  const session = await auth();
  if (!session) redirect("/");

  const res = await getWalletData();
  const data = res.success ? res.data : { balance: 0, transactions: [] };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <WalletView data={data} />
      </div>
    </div>
  );
}
