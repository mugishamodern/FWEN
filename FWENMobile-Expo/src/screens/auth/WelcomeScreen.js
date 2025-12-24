import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🚚</Text>
        <Text style={styles.title}>FWEN Logistics</Text>
        <Text style={styles.subtitle}>Fast, Wise, Efficient Network</Text>
      </View>

      <Text style={styles.description}>
        Connecting Uganda through reliable parcel delivery
      </Text>
      
      <View style={styles.features}>
        <Text style={styles.feature}>✓ Real-time tracking</Text>
        <Text style={styles.feature}>✓ Secure delivery</Text>
        <Text style={styles.feature}>✓ Digital payments</Text>
        <Text style={styles.feature}>✓ Nationwide coverage</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Helping businesses and individuals across Uganda
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
  description: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  features: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WelcomeScreen;