import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { setTheme as changeDocTheme, getTheme, type Theme } from "@/lib/themes";

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(getTheme());

    function toggle() {
        const next = theme === "dark" ? "light" : "dark";
        changeDocTheme(next);
        setTheme(next);
    }

    return (
        <Toggle
            onClick={toggle}
            className="h-10 w-10 hover:bg-transparent data-[state=on]:bg-transparent"
        >
            {theme === "dark" ?
                <Sun className="stroke-ring" />
                :
                <Moon className="fill-ring stroke-ring" />
            }
        </Toggle>
    );
}
