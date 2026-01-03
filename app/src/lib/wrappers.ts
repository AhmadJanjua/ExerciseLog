// wrapper to get uuid v4
function randomUUID(): string {
    return crypto.randomUUID();
}

export { randomUUID }