import { GAME_MIN_REQUIRED_EXPERIENCE, GAME_EXPERIENCE_FACTOR } from '@env';
import { ImageSourcePropType } from 'react-native';

export const colors: {
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

export const images: {
  [key: string]: ImageSourcePropType;
} = {
  '001': require('@assets/images/loomies/001.png'),
  '002': require('@assets/images/loomies/002.png'),
  '003': require('@assets/images/loomies/003.png'),
  '004': require('@assets/images/loomies/004.png'),
  '005': require('@assets/images/loomies/005.png'),
  '006': require('@assets/images/loomies/006.png'),
  '007': require('@assets/images/loomies/007.png'),
  '008': require('@assets/images/loomies/008.png'),
  '009': require('@assets/images/loomies/009.png'),
  '010': require('@assets/images/loomies/010.png'),
  '011': require('@assets/images/loomies/011.png'),
  '012': require('@assets/images/loomies/012.png'),
  '013': require('@assets/images/loomies/013.png'),
  '014': require('@assets/images/loomies/014.png'),
  '015': require('@assets/images/loomies/015.png'),
  '016': require('@assets/images/loomies/016.png'),
  '017': require('@assets/images/loomies/017.png'),
  '018': require('@assets/images/loomies/018.png'),
  '019': require('@assets/images/loomies/019.png')
};

export function getRequiredExperienceFromLevel(level: number): number {
  return (
    Math.log10(level) * GAME_EXPERIENCE_FACTOR + GAME_MIN_REQUIRED_EXPERIENCE
  );
}

export function incrementStatFromLevel(stat: number, level: number): number {
  const factor = level > 1 ? 1 / 8 : 0;
  const largeDecimal = stat + stat * (factor * level);

  // Fix to 2 decimals
  return Number(largeDecimal.toFixed(2));
}
