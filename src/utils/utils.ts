const colors: {
  [key: string]: string;
} = {
  WATER: '#ABEBEF',
  FIRE: '#EFCCAB',
  PLANT: '#ABEFB6',
  FLYING: '#D8CCFC',
  PSYCHIC: '#FFD0E7',
  BUG: '#EDF998',
  POISON: '#E4C3E4',
  ELECTRIC: '#FFE783',
  ROCK: '#DFDFDF',
  IRON: '#D7D7ED'
};

/**
 * @param {string} type The loomie type
 * @returns The hex color according to the loomie type or a default color
 */
export function getLoomieColorFromType(type: string): string {
  const color = colors[type.toUpperCase()] || '5C5C5C';
  return color;
}
