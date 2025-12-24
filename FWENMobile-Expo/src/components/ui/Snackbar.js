import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing } = theme;

const Snackbar = ({ visible, message, type = 'info', onDismiss }) => {
  const translateY = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      const t = setTimeout(() => onDismiss && onDismiss(), 4000);
      return () => clearTimeout(t);
    } else {
      Animated.timing(translateY, { toValue: 60, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible, onDismiss, translateY]);

  if (!visible) return null;

  const backgroundColor = type === 'error' ? '#B00020' : type === 'success' ? '#1E7F37' : colors.primary;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={[styles.snack, { backgroundColor }]}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={() => onDismiss && onDismiss()} style={styles.action}>
          <Text style={styles.actionText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    zIndex: 9999,
  },
  snack: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  message: {
    color: '#fff',
    flex: 1,
    marginRight: spacing.md,
  },
  action: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Snackbar;
