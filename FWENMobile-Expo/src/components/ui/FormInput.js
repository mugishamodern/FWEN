import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { spacing, colors, radius, type } from '../../styles/webTheme';

const FormInput = ({ style, ...props }) => {
  return <TextInput placeholderTextColor={colors.muted} style={[styles.input, style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    fontSize: type.body,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
});

export default FormInput;
