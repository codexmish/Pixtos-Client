// -----first letters of a name (Rahim Uddin -> RU)
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
