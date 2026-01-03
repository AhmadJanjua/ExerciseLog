// convert a date to YYYY-MM-DD format as string
function isoToDateStr(iso: string): string {
    return iso.split("T")[0];
}

// wrapper function for iso string
function dtIsoStr(): string {
    return new Date().toISOString();
}

export {isoToDateStr, dtIsoStr};
