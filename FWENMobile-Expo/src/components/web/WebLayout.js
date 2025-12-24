import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import * as theme from '../../styles/webTheme';
import Navigation from './Navigation';
import Footer from './Footer';

const { colors, spacing } = theme;

/**
 * WebLayout - Wrapper component for web pages
 * Includes Navigation, main content area, and Footer
 */
const WebLayout = ({
  children,
  user = null,
  onLogout = () => {},
  onNavigate = () => {},
  noContainer = false,
}) => {
  if (Platform.OS !== 'web') {
    return children;
  }

  return (
    <View style={styles.wrapper}>
      <Navigation user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scroll}
      >
        {noContainer ? (
          children
        ) : (
          <View style={styles.container}>
            {children}
          </View>
        )}
        <Footer onNavigate={onNavigate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
  },
});

export default WebLayout;
