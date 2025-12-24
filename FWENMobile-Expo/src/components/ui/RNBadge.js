import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing, radius } = theme;

/**
 * Badge component for status indicators
 * @param {string} children - Badge text
 * @param {'default'|'success'|'warning'|'danger'} variant - Style variant
 * @param {object} style - Additional styles
 */
const RNBadge = ({ children, variant = 'default', style }) => {
  const variantStyles = {
    default: { backgroundColor: colors.surface, color: colors.text },
    success: { backgroundColor: colors.success, color: '#ffffff' },
    warning: { backgroundColor: '#f59e0b', color: '#ffffff' },
    danger: { backgroundColor: colors.danger, color: '#ffffff' },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <View style={[styles.badge, { backgroundColor: currentVariant.backgroundColor }, style]}>
      <Text style={[styles.badgeText, { color: currentVariant.color }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RNBadge;
