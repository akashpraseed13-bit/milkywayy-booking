import { cn } from "@/lib/utils";

export function OptionCard({ className, isSelected, children, ...props }) {
    return (
        <div
            className={cn(
                className || '',
                "cursor-pointer rounded-xl border p-6 text-center transition-all",
                isSelected
                    ? "border-border bg-accent/10 text-foreground"
                    : "border-border/10 text-muted-foreground hover:border-border/50",
            )}
            {...props}
        >
            {children}
        </div>
    );
}
