function toTitleCase(s: string): string {
    return s
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map((w) => {
            if (w.length === 0) return "";
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(" ");
}

export { toTitleCase }