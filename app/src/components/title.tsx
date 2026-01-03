import type { ReactNode } from "react";

// Default page title format
export function Title({ children }: { children: ReactNode }) {
    return (
        <span className="text-4xl font-bold tracking-wide">
            {children}
        </span>
    );
}
