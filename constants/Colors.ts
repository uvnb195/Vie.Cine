const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const ColorPalette = {
  'black': '#110E0B',
  'white': '#FEF5EB',
  yellow: {
    '900': '#F4EDB9',
    '800': '#EBDF84',
    '700': '#E2D150',
    '600': '#DDC82C',
    '500': '#AB9A1C',
    '400': '#857718',
    '300': '#5E5414',
    '200': '#383110',
    '100': '#25200E',
  },
  orange: {
    '900': '#FEC486',
    '800': '#FDA649',
    '700': '#FB890E',
    '600': '#DD7403',
    '500': '#914C02',
    '400': '#844502',
    '300': '#643502',
    '200': '#3C2001',
    '100': '#281601',
  },
  gray: {
    default: '#9C9C9C',
    light: '#D3D3D3',
    dark: '#5C5C5C'
  }
}

export const Colors = {
  light: {
    text: {
      default: ColorPalette.black,
      light: ColorPalette.gray.dark,
      dark: ColorPalette.orange[300]
    },
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: {
      default: ColorPalette.white,
      light: ColorPalette.gray.default,
      dark: ColorPalette.white
    },
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export type PaletteType = typeof Colors.light
