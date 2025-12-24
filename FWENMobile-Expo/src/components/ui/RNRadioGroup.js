import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing } = theme;
const typography = theme.type;

/**
 * Radio Group component (multiple radio buttons)
 * @param {array} options - Array of { label, value }
 * @param {*} selected - Currently selected value
 * @param {function} onSelect - Callback when selection changes
 */
const RNRadioGroup = ({ options = [], selected, onSelect = () => {} }) => (
  <View style={styles.container}>
    {options.map((option) => (
      <TouchableOpacity
        key={option.value}
        style={styles.radioWrapper}
        onPress={() => onSelect(option.value)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.radio,
            selected === option.value && styles.radioSelected,
          ]}
        >
          {selected === option.value && (
            <View style={styles.radioDot} />
          )}
        </View>
        <Text style={styles.label}>{option.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: typography.body,
    color: colors.text,
    flex: 1,
  },
});

export default RNRadioGroup;
