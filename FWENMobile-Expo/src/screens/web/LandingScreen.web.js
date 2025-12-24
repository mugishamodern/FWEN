import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CTAButton from '../../components/ui/CTAButton';
import Card from '../../components/ui/Card';
import WebLayout from '../../components/web/WebLayout';
import * as theme from '../../styles/webTheme';

const { colors } = theme;
const width = 1000; // For web, assume desktop width

const LandingScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const FeatureCard = ({ icon, title, description }) => (
    <Card style={styles.featureCard}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </Card>
  );

  const StepItem = ({ number, title, description }) => (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <WebLayout
      user={user}
      onNavigate={(screen) => {
        if (screen === 'Send') navigation.navigate('SendParcel');
        if (screen === 'Track') navigation.navigate('Track');
        if (screen === 'Login') navigation.navigate('Login');
        if (screen === 'Signup') navigation.navigate('Signup');
        if (screen === 'Profile') navigation.navigate('Profile');
      }}
      onLogout={() => {
        // Logout will be handled in Phase 5
      }}
    >
      <View style={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
        <View style={styles.heroLeft}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>♥ Built for Everyone with Love</Text>
          </View>
          
          <Text style={styles.heroTitle}>Send Packages Across Uganda with Ease</Text>
          
          <Text style={styles.heroSubtitle}>
            More than just packages—we connect communities across Uganda with reliable service you can trust, backed by the warmth of Ugandan hospitality.
          </Text>

          <View style={styles.heroBtns}>
            <CTAButton onPress={() => navigation.navigate('SendPackage')} style={styles.primaryBtn} accessibilityLabel="Send a package">📦 Send Package</CTAButton>
            <CTAButton variant="secondary" onPress={() => navigation.navigate('Track')} style={styles.secondaryBtn} accessibilityLabel="Track shipment">📍 Track Shipment</CTAButton>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <View>
                <Text style={styles.featureLabel}>Real-time</Text>
                <Text style={styles.featureValue}>Tracking</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <View>
                <Text style={styles.featureLabel}>100%</Text>
                <Text style={styles.featureValue}>Secure Delivery</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <View>
                <Text style={styles.featureLabel}>AI-Powered</Text>
                <Text style={styles.featureValue}>Smart Routes</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.heroRight}>
          <Card style={styles.statsCard} elevated>
            <Text style={styles.statsIcon}>👥</Text>
            <Text style={styles.statsNumber}>135 Districts</Text>
            <Text style={styles.statsLabel}>Connected</Text>
          </Card>
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📦</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Why Choose FWEN Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose FWEN?</Text>
        
        <View style={styles.featureGrid}>
          <FeatureCard 
            icon="📈"
            title="AI-Powered Routing"
            description="Our AI analyzes traffic patterns, bus schedules, and historical data to provide optimal routes and accurate delivery times"
          />
          
          <FeatureCard 
            icon="📦"
            title="District-to-District Coverage"
            description="Connect all Ugandan districts with reliable bus-based delivery and optional last-mile service to your doorstep"
          />
          
          <FeatureCard 
            icon="🛡️"
            title="Secure Payments"
            description="Pay safely with Mobile Money (MTN/Airtel) or Visa with built-in AI fraud detection for your protection"
          />
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.stepsContainer}>
          <StepItem 
            number="1"
            title="Create Your Account"
            description="Sign up with your details and link your Mobile Money or Visa card for seamless payments"
          />
          
          <StepItem 
            number="2"
            title="Book Your Delivery"
            description="Enter sender and recipient details. Our AI suggests the best route and calculates cost instantly"
          />
          
          <StepItem 
            number="3"
            title="Track in Real-Time"
            description="Monitor your parcel's journey with live updates and AI-powered ETA predictions"
          />
          
          <StepItem 
            number="4"
            title="Last-Mile Delivery (Optional)"
            description="Schedule a boda or taxi to deliver from the bus terminal to the recipient's doorstep"
          />
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of Ugandans using FWEN for reliable district-to-district deliveries
        </Text>
        
        <CTAButton style={styles.ctaBtn} accessibilityLabel="Create free account">Create Free Account</CTAButton>
      </View>
      </View>
    </WebLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width > 768 ? 40 : 20,
    paddingVertical: 16,
    backgroundColor: colors.primary,
    flexWrap: 'wrap',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  logoText: {
    fontSize: 20,
    marginRight: 4,
  },
  logoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B0F1A',
  },
  nav: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  navItem: {
    paddingVertical: 8,
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  loginBtnText: {
    color: '#6B0F1A',
    fontWeight: '600',
    fontSize: 14,
  },

  // Hero Section
  hero: {
    flexDirection: width > 768 ? 'row' : 'column',
    backgroundColor: '#6B0F1A',
    paddingHorizontal: width > 768 ? 40 : 20,
    paddingVertical: 60,
    gap: 40,
  },
  heroLeft: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D4A017',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  badgeText: {
    color: '#D4A017',
    fontSize: 14,
  },
  heroTitle: {
    fontSize: width > 768 ? 48 : 36,
    fontWeight: '700',
    color: '#D4A017',
    marginBottom: 16,
    lineHeight: width > 768 ? 56 : 44,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    lineHeight: 24,
  },
  heroBtns: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 12,
    marginBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 160,
  },
  primaryBtnText: {
    color: '#6B0F1A',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 160,
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  features: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureLabel: {
    color: '#D4A017',
    fontSize: 14,
    fontWeight: '600',
  },
  featureValue: {
    color: '#fff',
    fontSize: 12,
  },
  heroRight: {
    flex: 1,
    position: 'relative',
  },
  statsCard: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D4A017',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    zIndex: 10,
    minWidth: 140,
  },
  statsIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B0F1A',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B0F1A',
  },
  imageContainer: {
    marginTop: 60,
  },
  imagePlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },

  // Sections
  section: {
    paddingHorizontal: width > 768 ? 40 : 20,
    paddingVertical: 60,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6B0F1A',
    textAlign: 'center',
    marginBottom: 40,
  },

  // Feature Cards
  featureGrid: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: 24,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B0F1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B0F1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Steps
  stepsContainer: {
    gap: 32,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B0F1A',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#6B0F1A',
    paddingHorizontal: width > 768 ? 40 : 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D4A017',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
  },
  ctaBtn: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
  },
  ctaBtnText: {
    color: '#6B0F1A',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LandingScreen;