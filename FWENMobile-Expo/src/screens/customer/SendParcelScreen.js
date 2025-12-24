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
import { useSelector } from 'react-redux';
import Snackbar from '../../components/ui/Snackbar';
import * as theme from '../../styles/webTheme';
import FormInput from '../../components/ui/FormInput';
import CTAButton from '../../components/ui/CTAButton';
import RNLabel from '../../components/ui/RNLabel';
import RNSelect from '../../components/ui/RNSelect';
import RNRadioGroup from '../../components/ui/RNRadioGroup';

const { colors, spacing, radius } = theme;
const typography = theme.type;

/**
 * SendParcelScreen - Create a new parcel shipment
 * Integrates with Redux createParcel thunk (to be created in Phase 5)
 */
const SendParcelScreen = () => {
  const navigation = useNavigation();
  // const dispatch = useDispatch(); // Will be used in Phase 5 for createParcel thunk
  const { loading, error } = useSelector((state) => state.parcel);
  const { user } = useSelector((state) => state.auth);

  // Demo data (will be fetched from Supabase in Phase 5)
  const DEMO_DISTRICTS = [
    { label: 'Accra', value: 1 },
    { label: 'Kumasi', value: 2 },
    { label: 'Takoradi', value: 3 },
    { label: 'Cape Coast', value: 4 },
  ];

  const PRIORITY_OPTIONS = [
    { label: 'Standard (3-5 days)', value: 'standard' },
    { label: 'Express (1-2 days)', value: 'express' },
    { label: 'Fragile (special handling)', value: 'fragile' },
  ];

  const PAYMENT_METHODS = [
    { label: 'Mobile Money', value: 'mobile_money' },
    { label: 'Card', value: 'card' },
    { label: 'Cash on Delivery', value: 'cod' },
  ];

  const [formData, setFormData] = useState({
    senderName: user?.full_name || '',
    senderPhone: user?.phone_number || '',
    recipientName: '',
    recipientPhone: '',
    originDistrict: user?.district_id || null,
    destinationDistrict: null,
    packageWeight: '',
    packageDimensions: '',
    packageDescription: '',
    priority: 'standard',
    paymentMethod: 'mobile_money',
  });

  const [estimatedCost, setEstimatedCost] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCost = () => {
    // Demo calculation: base cost + weight surcharge + priority multiplier
    if (!formData.originDistrict || !formData.destinationDistrict) {
      showSnackbar('Please select both origin and destination', 'error');
      return;
    }

    const baseCost = 35; // GHS
    const weightSurcharge = Math.max(0, (parseFloat(formData.packageWeight) - 1) * 5);
    const priorityMultiplier = { standard: 1, express: 1.5, fragile: 1.2 }[formData.priority] || 1;
    const total = (baseCost + weightSurcharge) * priorityMultiplier;

    setEstimatedCost(total.toFixed(2));
  };

  const validateForm = () => {
    if (!formData.senderName.trim()) {
      showSnackbar('Please enter sender name', 'error');
      return false;
    }
    if (!formData.senderPhone.trim()) {
      showSnackbar('Please enter sender phone', 'error');
      return false;
    }
    if (!formData.recipientName.trim()) {
      showSnackbar('Please enter recipient name', 'error');
      return false;
    }
    if (!formData.recipientPhone.trim()) {
      showSnackbar('Please enter recipient phone', 'error');
      return false;
    }
    if (!formData.originDistrict || !formData.destinationDistrict) {
      showSnackbar('Please select origin and destination', 'error');
      return false;
    }
    if (!formData.packageWeight) {
      showSnackbar('Please enter package weight', 'error');
      return false;
    }
    if (!estimatedCost) {
      showSnackbar('Please calculate estimated cost', 'error');
      return false;
    }
    return true;
  };

  const handleSendParcel = async () => {
    if (!validateForm()) return;

    // Dispatch createParcel thunk (to be created in Phase 5)
    // const result = await dispatch(createParcel({ ...formData, totalCost: estimatedCost }));
    // if (createParcel.rejected.match(result)) {
    //   Alert.alert('Error', result.payload?.message || 'Failed to send parcel');
    // }

    // Demo: show success
    showSnackbar(`Parcel sent! Cost: GHS ${estimatedCost}`, 'success');
    setTimeout(() => navigation.goBack(), 900);
  };

  const [snack, setSnack] = React.useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => setSnack({ visible: true, message, type });
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
          <Text style={styles.title}>Send Parcel</Text>
          <Text style={styles.subtitle}>Enter package details</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Sender Details</Text>

          <RNLabel required>Sender Name</RNLabel>
          <FormInput
            placeholder="Your name"
            value={formData.senderName}
            onChangeText={(val) => handleChange('senderName', val)}
            editable={!loading}
          />

          <RNLabel required>Sender Phone</RNLabel>
          <FormInput
            placeholder="Your phone number"
            value={formData.senderPhone}
            onChangeText={(val) => handleChange('senderPhone', val)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Recipient Details</Text>

          <RNLabel required>Recipient Name</RNLabel>
          <FormInput
            placeholder="Recipient name"
            value={formData.recipientName}
            onChangeText={(val) => handleChange('recipientName', val)}
            editable={!loading}
          />

          <RNLabel required>Recipient Phone</RNLabel>
          <FormInput
            placeholder="Recipient phone number"
            value={formData.recipientPhone}
            onChangeText={(val) => handleChange('recipientPhone', val)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Shipment Details</Text>

          <RNLabel required>Origin District</RNLabel>
          <RNSelect
            options={DEMO_DISTRICTS}
            value={formData.originDistrict}
            onSelect={(val) => handleChange('originDistrict', val)}
            placeholder="Select origin"
          />

          <RNLabel required>Destination District</RNLabel>
          <RNSelect
            options={DEMO_DISTRICTS}
            value={formData.destinationDistrict}
            onSelect={(val) => handleChange('destinationDistrict', val)}
            placeholder="Select destination"
          />

          <RNLabel required>Package Weight (kg)</RNLabel>
          <FormInput
            placeholder="0.5"
            value={formData.packageWeight}
            onChangeText={(val) => handleChange('packageWeight', val)}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <RNLabel>Dimensions (L x W x H cm)</RNLabel>
          <FormInput
            placeholder="30 x 20 x 15"
            value={formData.packageDimensions}
            onChangeText={(val) => handleChange('packageDimensions', val)}
            editable={!loading}
          />

          <RNLabel>Description</RNLabel>
          <FormInput
            placeholder="What is in the package?"
            value={formData.packageDescription}
            onChangeText={(val) => handleChange('packageDescription', val)}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          <RNLabel required>Priority</RNLabel>
          <RNRadioGroup
            options={PRIORITY_OPTIONS}
            selected={formData.priority}
            onSelect={(val) => handleChange('priority', val)}
          />

          <RNLabel required>Payment Method</RNLabel>
          <RNRadioGroup
            options={PAYMENT_METHODS}
            selected={formData.paymentMethod}
            onSelect={(val) => handleChange('paymentMethod', val)}
          />

          <CTAButton
            text="Calculate Cost"
            onPress={calculateCost}
            disabled={loading}
            variant="secondary"
            style={styles.calculateButton}
          />

          {estimatedCost && (
            <View style={styles.costContainer}>
              <Text style={styles.costLabel}>Estimated Cost:</Text>
              <Text style={styles.costValue}>GHS {estimatedCost}</Text>
            </View>
          )}

          <CTAButton
            text={loading ? 'Sending...' : 'Send Parcel'}
            onPress={handleSendParcel}
            disabled={loading || !estimatedCost}
            variant="primary"
            style={styles.button}
          />
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
  },
  form: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  calculateButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  costContainer: {
    padding: spacing.md,
    backgroundColor: '#f0fdf4',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginBottom: spacing.lg,
  },
  costLabel: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  costValue: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.success,
  },
  button: {
    marginTop: spacing.lg,
  },
});

export default SendParcelScreen;
