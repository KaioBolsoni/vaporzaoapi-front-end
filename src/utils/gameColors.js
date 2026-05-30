export function toTitleCase(str = "") {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const PALETTE = [
  ["#06b6d4", "#0284c7"],
  ["#f59e0b", "#ea580c"],
  ["#06b6d4", "#ec4899"],
  ["#22c55e", "#65a30d"],
  ["#3b82f6", "#06b6d4"],
  ["#ec4899", "#a855f7"],
  ["#7c3aed", "#4f46e5"],
  ["#f97316", "#ef4444"],
  ["#10b981", "#0891b2"],
  ["#a855f7", "#ec4899"],
  ["#eab308", "#f97316"],
  ["#ef4444", "#be185d"],
];

export function getGameGradient(id) {
  const [from, to] = PALETTE[(id ?? 0) % PALETTE.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export function getGameInitials(titulo = "") {
  const words = titulo.split(" ").filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
