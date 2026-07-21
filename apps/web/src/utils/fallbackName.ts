export const fallbackName = (fullName: string) => {
  return fullName
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() : ""))
    .slice(0, 2)
    .join("");
};
