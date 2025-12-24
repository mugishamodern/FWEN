import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, type, radius } from '../../styles/webTheme';

const CTAButton = ({ children, onPress, variant = 'primary', style, accessibilityLabel }) => {
  const variantStyles = variant === 'primary'
    ? { backgroundColor: colors.accent, textColor: colors.primary }
    : variant === 'secondary'
    ? { backgroundColor: 'transparent', textColor: colors.background, borderColor: colors.background }
    : { backgroundColor: 'transparent', textColor: colors.primary, borderColor: colors.border };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && { backgroundColor: variantStyles.backgroundColor },
        variant === 'secondary' && { borderWidth: 1, borderColor: variantStyles.borderColor },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'primary' ? { color: colors.primary } : { color: variantStyles.textColor }]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  text: {
    fontSize: type.subtitle,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});

export default CTAButton;
