import { hexToRGBA } from "@/hooks/hexToRGBA";
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";

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
    textHighLight: {
      background: ColorPalette.yellow[500],
      text: ColorPalette.white
    },
    zoomView: {
      text: ColorPalette.white,
      seats: {
        standard: ColorPalette.yellow[900],
        vip: ColorPalette.yellow[700],
        'sweet-box': ColorPalette.orange[700],
        selected: ColorPalette.yellow[500],
        unavailable: ColorPalette.gray.default,
      },
    },
    searchIcon: ColorPalette.orange[900],
    text: {
      default: ColorPalette.black,
      light: ColorPalette.gray.dark,
      dark: ColorPalette.orange[300],
      highlight: ColorPalette.gray.dark,
      disable: ColorPalette.gray.default
    },
    smallButton: {
      backgroundDefault: 'transparent',
      backgroundDisable: ColorPalette.yellow[300],
      textDisable: ColorPalette.gray.light,
      textDefault: ColorPalette.black
    },
    sheetIndicator: ColorPalette.black,
    background: {
      default: ColorPalette.white,
      highlight: ColorPalette.gray.light,
      bottomSheet: ColorPalette.yellow[900],
    },
    border: {
      default: ColorPalette.orange[300],
      disable: ColorPalette.gray.light
    },
    tint: tintColorLight,
    icon: {
      disable: ColorPalette.gray.light,
      enable: ColorPalette.gray.dark,
      highlight: ColorPalette.orange[500]
    },
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    blurBackground: hexToRGBA(ColorPalette.black, 0.5),
  },
  dark: {
    textHighLight: {
      background: ColorPalette.yellow[100],
      text: ColorPalette.yellow[600]
    },
    zoomView: {
      text: ColorPalette.white,
      seats: {
        standard: ColorPalette.yellow[200],
        vip: ColorPalette.yellow[400],
        'sweet-box': ColorPalette.orange[300],
        selected: ColorPalette.yellow[500],
        unavailable: ColorPalette.gray.dark,
      }
    },
    searchIcon: ColorPalette.yellow[100],
    text: {
      default: ColorPalette.white,
      light: ColorPalette.gray.default,
      dark: ColorPalette.white,
      highlight: ColorPalette.yellow[600],
      disable: ColorPalette.gray.dark
    },
    smallButton: {
      backgroundDefault: 'transparent',
      backgroundDisable: ColorPalette.yellow[300],
      textDefault: ColorPalette.white,
      textDisable: ColorPalette.gray.light
    },
    sheetIndicator: ColorPalette.white,
    background: {
      default: ColorPalette.black,
      highlight: ColorPalette.yellow[100],
      bottomSheet: ColorPalette.gray.dark
    },
    border: {
      default: ColorPalette.yellow[300],
      disable: ColorPalette.gray.dark
    },
    tint: tintColorDark,
    icon: {
      disable: ColorPalette.gray.dark,
      enable: ColorPalette.gray.default,
      highlight: ColorPalette.yellow[500]
    },
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    blurBackground: hexToRGBA(ColorPalette.black, 0.5),
  },
};

export type PaletteType = typeof Colors.light
