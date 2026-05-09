export const PLAYER_COLORS = [
  '#e63329','#f5c842','#1db954','#3b82f6','#a855f7',
  '#f97316','#ec4899','#06b6d4','#84cc16','#f43f5e'
]

export function getInitials(name) {
  return name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase()
}
