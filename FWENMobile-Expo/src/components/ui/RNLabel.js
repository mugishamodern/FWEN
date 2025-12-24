import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing } = theme;
const typography = theme.type;

/**
 * Label component for form fields
 * @param {string} children - Label text
 * @param {object} style - Additional styles
 */
const RNLabel = ({ children, required = false, style }) => (
  <Text style={[styles.label, style]}>
    {children}
    {required && <Text style={styles.required}>*</Text>}
  </Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.danger,
    marginLeft: 2,
  },
});

export default RNLabel;
