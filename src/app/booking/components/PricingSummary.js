import { Card, CardContent } from "@/components/ui/card";

export function PricingSummary({ propertyCount, totalAmount }) {
    return (
        <Card className="bg-[#181818bb] border border-zinc-800 shadow-none">
            <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Pricing Summary
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {propertyCount} {propertyCount === 1 ? "Property" : "Properties"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Grand Total</p>
                        <p className="text-2xl font-bold text-foreground">
                            AED {totalAmount.toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
