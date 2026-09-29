import type { TextStyle } from 'react-native';

export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
} as const;

export const typography = {
  screenTitle: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  cardTitle: { fontFamily: fonts.medium, fontSize: 18, lineHeight: 27 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  sectionTitle: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  overview: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 19 },
  chip: { fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 18 },
  releaseLabel: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  button: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 21 },
  tabLabel: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 15 },
  tabLabelActive: { fontFamily: fonts.semiBold, fontSize: 10, lineHeight: 15 },
} satisfies Record<string, TextStyle>;
