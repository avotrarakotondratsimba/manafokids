// utils/avatar.js

export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function getRandomColor(name) {
  const colors = [
    "#FF6B6B",
    "#6BCB77",
    "#4D96FF",
    "#FFB347",
    "#A084E8",
    "#00B8A9",
    "#FFB6C1",
    "#FFD93D",
    "#845EC2",
    "#00C9A7",
  ];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
