import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing, radius } = theme;
const typography = theme.type;

/**
 * Checkbox component
 * @param {boolean} checked - Is checkbox checked
 * @param {function} onChange - Callback when toggled
 * @param {string} label - Checkbox label
 */
const RNCheckbox = ({ checked = false, onChange = () => {}, label = '' }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onChange(!checked)}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
      ]}
    >
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    {label && <Text style={styles.label}>{label}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: typography.body,
    color: colors.text,
    flex: 1,
  },
});

export default RNCheckbox;
