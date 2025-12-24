import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as theme from '../../styles/webTheme';

const { colors, spacing } = theme;
const typography = theme.type;

/**
 * Footer Component - Bottom footer for web
 * Shows links, copyright, and company info
 */
const Footer = ({ onNavigate = () => {} }) => {
  if (Platform.OS !== 'web') return null;

  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        {/* Column 1: Company */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>FWEN</Text>
          <Text style={styles.columnSubtitle}>Fast & Reliable Parcel Delivery</Text>
          <Text style={styles.companyDescription}>
            Delivering your packages across Ghana with speed and reliability.
          </Text>
          <View style={styles.socialLinks}>
            <Text style={styles.socialLink}>📘 Facebook</Text>
            <Text style={styles.socialLink}>𝕏 Twitter</Text>
            <Text style={styles.socialLink}>📷 Instagram</Text>
          </View>
        </View>

        {/* Column 2: Services */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Services</Text>
          <TouchableOpacity onPress={() => onNavigate('Send')}>
            <Text style={styles.link}>Send Parcel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Track')}>
            <Text style={styles.link}>Track Parcel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Pricing')}>
            <Text style={styles.link}>Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Schedule')}>
            <Text style={styles.link}>Schedule Pickup</Text>
          </TouchableOpacity>
        </View>

        {/* Column 3: Company */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Company</Text>
          <TouchableOpacity onPress={() => onNavigate('About')}>
            <Text style={styles.link}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Careers')}>
            <Text style={styles.link}>Careers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Blog')}>
            <Text style={styles.link}>Blog</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Contact')}>
            <Text style={styles.link}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Column 4: Support */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Support</Text>
          <TouchableOpacity onPress={() => onNavigate('Help')}>
            <Text style={styles.link}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('FAQ')}>
            <Text style={styles.link}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Privacy')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('Terms')}>
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © {currentYear} FWEN. All rights reserved.
        </Text>
        <View style={styles.bottomLinks}>
          <TouchableOpacity>
            <Text style={styles.bottomLink}>Privacy</Text>
          </TouchableOpacity>
          <Text style={styles.bottomLinkDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.bottomLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.bottomLinkDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.bottomLink}>Cookies</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.primary,
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.primaryDark,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: spacing.lg,
  },
  columnTitle: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  columnSubtitle: {
    fontSize: typography.body,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  companyDescription: {
    fontSize: 13,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  link: {
    fontSize: 13,
    color: '#cccccc',
    marginVertical: spacing.xs,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  socialLink: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryDark,
    marginVertical: spacing.lg,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
  },
  copyright: {
    fontSize: 12,
    color: '#999999',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomLink: {
    fontSize: 12,
    color: '#cccccc',
  },
  bottomLinkDivider: {
    fontSize: 12,
    color: '#666666',
  },
});

export default Footer;
