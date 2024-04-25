export function classNames(obj: Record<string, boolean>): string {
  return Object.keys(obj)
    .filter((key) => obj[key])
    .join(" ");
}
