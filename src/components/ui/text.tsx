import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { Type, useTheme, type ThemeColors, type TypeVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  color?: keyof ThemeColors;
};

export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const theme = useTheme();
  return <RNText style={[Type[variant], { color: theme[color] }, style]} {...rest} />;
}
