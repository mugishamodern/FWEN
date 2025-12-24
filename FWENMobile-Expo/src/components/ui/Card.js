import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, radius, colors } from '../../styles/webTheme';

const Card = ({ children, style, elevated = false }) => {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card;
