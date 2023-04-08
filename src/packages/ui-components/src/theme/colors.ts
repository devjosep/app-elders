const BASE = {
  PRIMARY: '#1045EC',
  SECONDARY: '#DA1C5C'
};

const BASE_DARK = {
  PRIMARY: '#1045EC',
  SECONDARY: '#DA1C5C'
};

const GREY_SCALE = {
  DARK: '#000000',
  DARK_GREY: '#121237',
  MEDIUM_GREY: 'rgba(18,18,55,0.6)',
  SOFT_GREY: '#CECCDC',
  LIGHT_GREY: '#EDECF6',
  BRIGHT: '#FFFFFF'
};

const COMPLEMENTARY = {
  SUCCESS: '#50ca50',
  ERROR: '#da261d',
  INFO: '#2f96b4'
};

const RATE = {
  SELECTED: '#f1c40f'
};

const convertHexadecimalToDecimal = (strNumber: string): number =>
  parseInt(strNumber, 16);

const getRedNumbers = (colorNumber: string): string => colorNumber.substr(0, 2);

const getGreenNumbers = (colorNumber: string): string =>
  colorNumber.substr(2, 2);

const getBlueNumbers = (colorNumber: string): string =>
  colorNumber.substr(4, 2);

const checkColorRgb = (color: string): boolean => {
  const colorRgbRegex = new RegExp('^#?([A-Fa-f0-9]{6})$');
  return colorRgbRegex.test(color);
};

const getNumbersFromColor = (color: string): string => color.replace('#', '');

const getRgbaStrFromHexColor = (color: string, opacity: number): string => {
  if (!checkColorRgb(color))
    throw new Error('colors are not in correct format (#546655 | 546655)');

  const colorNumbers = getNumbersFromColor(color);

  const r = convertHexadecimalToDecimal(getRedNumbers(colorNumbers));
  const g = convertHexadecimalToDecimal(getGreenNumbers(colorNumbers));
  const b = convertHexadecimalToDecimal(getBlueNumbers(colorNumbers));

  return `rgba(${r},${g},${b}, ${opacity})`;
};

export {
  BASE,
  BASE_DARK,
  GREY_SCALE,
  COMPLEMENTARY,
  RATE,
  getRgbaStrFromHexColor
};
