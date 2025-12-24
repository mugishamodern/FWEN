import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '../../components/ui/Snackbar';
import * as theme from '../../styles/webTheme';
import FormInput from '../../components/ui/FormInput';
import CTAButton from '../../components/ui/CTAButton';
import RNLabel from '../../components/ui/RNLabel';
import RNSelect from '../../components/ui/RNSelect';
import RNCheckbox from '../../components/ui/RNCheckbox';

const { colors, spacing, radius } = theme;
const typography = theme.type;

/**
 * SignupScreen - User registration
 * Integrates with Redux signupUser thunk (to be created in Phase 5)
 */
const SignupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Demo districts (will be fetched from Supabase in Phase 5)
  const DEMO_DISTRICTS = [
    { label: 'Accra', value: 1 },
    { label: 'Kumasi', value: 2 },
    { label: 'Takoradi', value: 3 },
    { label: 'Cape Coast', value: 4 },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: null,
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    if (!formData.email.includes('@')) return 'Please enter a valid email address';
    if (formData.phone.length < 10) return 'Please enter a valid phone number';
    if (!formData.district) return 'Please select your district';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.termsAccepted) return 'You must accept the terms and conditions';
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      showSnackbar(validationError, 'error');
      return;
    }
    // Dispatch signupUser thunk
    try {
      const { signupUser } = await import('../../store/authSlice');
      const resultAction = await dispatch(
        signupUser({
          email: formData.email,
          password: formData.password,
          metadata: {
            fullName: formData.fullName,
            phone: formData.phone,
            district: formData.district,
          },
        })
      );

      if (signupUser.rejected.match(resultAction)) {
        const payload = resultAction.payload || resultAction.error?.message;
        showSnackbar(payload || 'Signup failed', 'error');
        return;
      }

      // Successful signup — user is signed in
      showSnackbar('Account created! You are now logged in.', 'success');
      setTimeout(() => navigation.navigate('Home'), 900);
    } catch (err) {
      console.error('Signup flow error:', err);
      showSnackbar(err?.message || 'An unexpected error occurred', 'error');
    }
  };

  // Snackbar state and helper
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => {
    setSnack({ visible: true, message, type });
  };
  const hideSnackbar = () => setSnack((s) => ({ ...s, visible: false }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join FWEN to send parcels</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <RNLabel required>Full Name</RNLabel>
          <FormInput
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(val) => handleChange('fullName', val)}
            editable={!loading}
          />

          <RNLabel required>Email Address</RNLabel>
          <FormInput
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <RNLabel required>Phone Number</RNLabel>
          <FormInput
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(val) => handleChange('phone', val)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <RNLabel required>District</RNLabel>
          <RNSelect
            options={DEMO_DISTRICTS}
            value={formData.district}
            onSelect={(val) => handleChange('district', val)}
            placeholder="Select your district"
          />

          <RNLabel required>Password</RNLabel>
          <FormInput
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChangeText={(val) => handleChange('password', val)}
            secureTextEntry
            editable={!loading}
          />

          <RNLabel required>Confirm Password</RNLabel>
          <FormInput
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(val) => handleChange('confirmPassword', val)}
            secureTextEntry
            editable={!loading}
          />

          <RNCheckbox
            checked={formData.termsAccepted}
            onChange={(val) => handleChange('termsAccepted', val)}
            label="I agree to the Terms and Conditions"
          />

          <CTAButton
            text={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={loading}
            variant="primary"
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Snackbar visible={snack.visible} message={snack.message} type={snack.type} onDismiss={hideSnackbar} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.body,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.muted,
    fontSize: typography.body,
  },
  loginLink: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

export default SignupScreen;
