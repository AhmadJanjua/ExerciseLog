import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./theme-toggle";

function NavButton({ to, label }: { to: string; label: string }) {
    const is_active = useLocation().pathname === to;

    const formatting = [
        "text-xl font-semibold tracking-wide",
        is_active ? "underline underline-offset-10" : "",
    ].join(" ")

    return (
        <NavigationMenuItem><NavigationMenuLink asChild>
            <Link to={to} className={formatting}>
                {label}
            </Link>
        </NavigationMenuLink></NavigationMenuItem>
    );
}

export default function NavBar() {
    return (
        <header className="px-2 py-2 shadow-md dark:shadow-ring/12">
            <NavigationMenu className="!max-w-none !justify-start">
                <NavigationMenuList className="gap-2">
                    <NavButton to="/" label="Home" />
                    <NavButton to="/log" label="Log" />
                    <NavButton to="/stats" label="Stats" />
                    <NavButton to="/manage" label="Manage" />
                </NavigationMenuList>
                <span className="ml-auto item-center">
                    <ThemeToggle />
                </span>
            </NavigationMenu>
        </header>
    );
}
