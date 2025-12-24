import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing, radius } = theme;
const typography = theme.type;

/**
 * Navigation Component - Top navbar for web
 * Shows logo, nav links, and user menu
 */
const Navigation = ({ user = null, onLogout = () => {}, onNavigate = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (Platform.OS !== 'web') return null;

  return (
    <View style={styles.nav}>
      <View style={styles.container}>
        {/* Logo / Brand */}
        <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.logo}>
          <Text style={styles.logoText}>FWEN</Text>
          <Text style={styles.logoSubtext}>Parcel Delivery</Text>
        </TouchableOpacity>

        {/* Center Links */}
        <View style={styles.links}>
          <TouchableOpacity onPress={() => onNavigate('Send')} style={styles.link}>
            <Text style={styles.linkText}>Send Parcel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Track')} style={styles.link}>
            <Text style={styles.linkText}>Track</Text>
          </TouchableOpacity>
          {user?.user_type === 'agent' && (
            <TouchableOpacity onPress={() => onNavigate('Agent')} style={styles.link}>
              <Text style={styles.linkText}>Agent Dashboard</Text>
            </TouchableOpacity>
          )}
          {user?.user_type === 'admin' && (
            <TouchableOpacity onPress={() => onNavigate('Admin')} style={styles.link}>
              <Text style={styles.linkText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Section - Auth or User Menu */}
        <View style={styles.right}>
          {user ? (
            <View style={styles.userMenu}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.userName}>{user.full_name}</Text>
                  <Text style={styles.userType}>{user.user_type}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.menuToggle}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <Text style={styles.menuIcon}>⋯</Text>
              </TouchableOpacity>

              {menuOpen && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      onNavigate('Profile');
                      setMenuOpen(false);
                    }}
                  >
                    <Text style={styles.menuItemText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => onNavigate('Login')}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => onNavigate('Signup')}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
    minHeight: 70,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logo: {
    flexDirection: 'column',
    minWidth: 120,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
  },
  logoSubtext: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 2,
  },
  links: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
  },
  link: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: typography.body,
    color: '#ffffff',
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
    justifyContent: 'flex-end',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userName: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  userType: {
    fontSize: 11,
    color: colors.accent,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  menuToggle: {
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  logoutText: {
    color: colors.danger,
  },
  authButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  signInButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  signInText: {
    fontSize: typography.body,
    color: colors.accent,
    fontWeight: '600',
  },
  signUpButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  signUpText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default Navigation;
