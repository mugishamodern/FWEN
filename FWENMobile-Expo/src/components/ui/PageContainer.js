import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { spacing, colors } from '../../styles/webTheme';

const PageContainer = ({ children, style, contentContainerStyle }) => {
  return (
    <ScrollView contentContainerStyle={[styles.container, contentContainerStyle]} style={style}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
});

export default PageContainer;
