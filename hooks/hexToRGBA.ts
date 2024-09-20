export const hexToRGBA = (hex: string, alpha: number) => {
  // remove '#' from hex if it's there
  hex = hex.replace('#', '');

  // check hex is valid or not
  if (hex.length !== 3 && hex.length !== 6) {
    throw new Error('Hex not valid');
  }

  // Changed hex to 6 characters if it's 3 characters
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // change hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}