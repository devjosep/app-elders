import { BASE, COMPLEMENTARY, GREY_SCALE, RATE } from './colors';

export type ITheme = {
  light: ThemeComponent;
  dark: ThemeComponent;
};

export type ThemeComponent = {
  primary: string;
  secondary: string;
  bgDefault: string;
  bgSecondary: string;
  bgTertiary: string;
  bgAccent: string;
  cAlert: string;
  fontColorBase: string;
  fontColorAux: string;
  fontColorNegative: string;
  fontColorAccent: string;
  fontColorDisabled: string;
  divider: string;
  bgHeaderChat: string;
  cGoBack: string;
  backgroundDateChat: string;
  bgChatMsg: string;
  bgChatCurrentMsg: string;
  bgBtnPrimary: string;
  bgBtnNegative: string;
  bgBtnSecondFocus: string;
  bcInputElders: string;
  bcInputFocus: string;
  bcInputVolunteers: string;
  fcInputPlaceholder: string;
  fcInput: string;
  fcInputFocus: string;
  bcBubble: string;
  cTagFilterSelected: string;
  bcTagFilter: string;
  info: string;
  error: string;
  success: string;
  cLink: string;
  shadowColor: string;
  buttonSendDisabled: string;
  rateSelected: string;
  seekBartintColor: string;
  buttonSheetBg: string;
  buttonDownload: string;
  downloadTextWhite: string;
  downloadTextBlack: string;
};

const defaultTheme: ITheme = {
  light: {
    primary: BASE.PRIMARY,
    secondary: BASE.SECONDARY,
    bgDefault: GREY_SCALE.LIGHT_GREY,
    bgSecondary: GREY_SCALE.BRIGHT,
    bgTertiary: GREY_SCALE.DARK_GREY,
    bgAccent: BASE.SECONDARY,
    cAlert: BASE.SECONDARY,
    fontColorBase: GREY_SCALE.DARK_GREY,
    fontColorAux: GREY_SCALE.MEDIUM_GREY,
    fontColorNegative: GREY_SCALE.BRIGHT,
    fontColorAccent: BASE.PRIMARY,
    fontColorDisabled: GREY_SCALE.SOFT_GREY,
    divider: GREY_SCALE.SOFT_GREY,
    bgHeaderChat: GREY_SCALE.BRIGHT,
    cGoBack: BASE.SECONDARY,
    backgroundDateChat: BASE.SECONDARY,
    bgChatMsg: GREY_SCALE.BRIGHT,
    bgChatCurrentMsg: BASE.PRIMARY,
    bgBtnPrimary: GREY_SCALE.DARK_GREY,
    bgBtnNegative: GREY_SCALE.BRIGHT,
    bgBtnSecondFocus: GREY_SCALE.LIGHT_GREY,
    bcInputElders: GREY_SCALE.DARK_GREY,
    bcInputFocus: BASE.PRIMARY,
    bcInputVolunteers: GREY_SCALE.LIGHT_GREY,
    fcInputPlaceholder: GREY_SCALE.MEDIUM_GREY,
    fcInput: BASE.PRIMARY,
    fcInputFocus: GREY_SCALE.DARK,
    bcBubble: GREY_SCALE.DARK_GREY,
    cTagFilterSelected: BASE.PRIMARY,
    bcTagFilter: GREY_SCALE.MEDIUM_GREY,
    info: COMPLEMENTARY.INFO,
    error: COMPLEMENTARY.ERROR,
    success: COMPLEMENTARY.SUCCESS,
    cLink: BASE.SECONDARY,
    shadowColor: GREY_SCALE.DARK,
    buttonSendDisabled: GREY_SCALE.SOFT_GREY,
    rateSelected: RATE.SELECTED,
    seekBartintColor: BASE.SECONDARY,
    buttonSheetBg: GREY_SCALE.BRIGHT,
    buttonDownload: GREY_SCALE.BRIGHT,
    downloadTextBlack: GREY_SCALE.DARK_GREY,
    downloadTextWhite: GREY_SCALE.BRIGHT
  },
  dark: {
    primary: BASE.PRIMARY,
    secondary: BASE.SECONDARY,
    bgDefault: GREY_SCALE.LIGHT_GREY,
    bgSecondary: GREY_SCALE.BRIGHT,
    bgTertiary: GREY_SCALE.DARK_GREY,
    bgAccent: BASE.SECONDARY,
    cAlert: BASE.SECONDARY,
    fontColorBase: GREY_SCALE.DARK_GREY,
    fontColorAux: GREY_SCALE.MEDIUM_GREY,
    fontColorNegative: GREY_SCALE.BRIGHT,
    fontColorAccent: BASE.PRIMARY,
    fontColorDisabled: GREY_SCALE.SOFT_GREY,
    divider: GREY_SCALE.SOFT_GREY,
    bgHeaderChat: GREY_SCALE.BRIGHT,
    cGoBack: BASE.SECONDARY,
    backgroundDateChat: BASE.SECONDARY,
    bgChatMsg: GREY_SCALE.BRIGHT,
    bgChatCurrentMsg: BASE.PRIMARY,
    bgBtnPrimary: GREY_SCALE.DARK_GREY,
    bgBtnNegative: GREY_SCALE.BRIGHT,
    bgBtnSecondFocus: GREY_SCALE.LIGHT_GREY,
    bcInputElders: GREY_SCALE.DARK_GREY,
    bcInputFocus: BASE.PRIMARY,
    bcInputVolunteers: GREY_SCALE.LIGHT_GREY,
    fcInputPlaceholder: GREY_SCALE.MEDIUM_GREY,
    fcInput: BASE.PRIMARY,
    fcInputFocus: GREY_SCALE.DARK,
    bcBubble: GREY_SCALE.DARK_GREY,
    cTagFilterSelected: BASE.PRIMARY,
    bcTagFilter: GREY_SCALE.MEDIUM_GREY,
    info: COMPLEMENTARY.INFO,
    error: COMPLEMENTARY.ERROR,
    success: COMPLEMENTARY.SUCCESS,
    cLink: BASE.SECONDARY,
    shadowColor: GREY_SCALE.DARK,
    buttonSendDisabled: GREY_SCALE.SOFT_GREY,
    rateSelected: RATE.SELECTED,
    seekBartintColor: BASE.SECONDARY,
    buttonSheetBg: GREY_SCALE.BRIGHT,
    buttonDownload: GREY_SCALE.BRIGHT,
    downloadTextBlack: GREY_SCALE.DARK_GREY,
    downloadTextWhite: GREY_SCALE.BRIGHT
  }
};

export { defaultTheme };
