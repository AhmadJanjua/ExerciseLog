// storage key - for reuse & update
const THEME_KEY = "theme_key_v1";

// valid themes
type Theme = "light" | "dark";

// update app theme and update stored value
function setTheme(theme: Theme): void {
    document
        .documentElement
        .classList
        .toggle("dark", theme === "dark");

    localStorage.setItem(THEME_KEY, theme);
}

// try and get theme from storage otherwise device preference
function getTheme(): Theme {
    const prev_theme: string | null = localStorage.getItem(THEME_KEY);

    if (prev_theme === "light" || prev_theme === "dark") {
        return prev_theme;
    }

    return window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light";
}

export {type Theme, getTheme, setTheme}