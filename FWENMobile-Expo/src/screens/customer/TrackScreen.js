import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Snackbar from '../../components/ui/Snackbar';
import * as theme from '../../styles/webTheme';
import FormInput from '../../components/ui/FormInput';
import CTAButton from '../../components/ui/CTAButton';
import RNLabel from '../../components/ui/RNLabel';
import RNBadge from '../../components/ui/RNBadge';

const { colors, spacing, radius } = theme;
const typography = theme.type;

/**
 * TrackScreen - Track parcel shipment status
 * Integrates with Redux trackParcel thunk (to be created in Phase 5)
 */
const TrackScreen = () => {
  const navigation = useNavigation();
  // const dispatch = useDispatch(); // Will be used in Phase 5 for trackParcel thunk
  const { loading, error } = useSelector((state) => state.parcel);
  const { user } = useSelector((state) => state.auth);

  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelData, setParcelData] = useState(null);

  // Demo status timeline
  const DEMO_TIMELINE = [
    { status: 'pending', label: 'Pending Pickup', date: '2024-01-15', time: '10:00 AM', location: 'Accra' },
    { status: 'in_transit', label: 'In Transit', date: '2024-01-16', time: '2:30 PM', location: 'Between Accra and Kumasi' },
    { status: 'out_for_delivery', label: 'Out for Delivery', date: '2024-01-17', time: '9:00 AM', location: 'Kumasi' },
  ];

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      showSnackbar('Please enter a tracking number', 'error');
      return;
    }

    // Dispatch trackParcel thunk (to be created in Phase 5)
    // const result = await dispatch(trackParcel({ trackingNumber }));
    // if (trackParcel.rejected.match(result)) {
    //   Alert.alert('Error', result.payload?.message || 'Tracking number not found');
    //   return;
    // }

    // Demo: show parcel data
    setParcelData({
      trackingNumber,
      recipientName: 'John Doe',
      recipientPhone: '+233123456789',
      originDistrict: 'Accra',
      destinationDistrict: 'Kumasi',
      packageWeight: '2.5 kg',
      currentStatus: 'in_transit',
      timeline: DEMO_TIMELINE,
    });
  };

  const [snack, setSnack] = React.useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => setSnack({ visible: true, message, type });
  const hideSnackbar = () => setSnack((s) => ({ ...s, visible: false }));

  const getStatusColor = (status) => {
    const variants = {
      pending: 'default',
      in_transit: 'warning',
      out_for_delivery: 'warning',
      delivered: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      in_transit: '🚚',
      out_for_delivery: '📦',
      delivered: '✓',
      cancelled: '✗',
    };
    return icons[status] || '?';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        {user ? (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Track Parcel</Text>
            <Text style={styles.subtitle}>Enter tracking number to see status</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Track Your Parcel</Text>
            <Text style={styles.subtitle}>Enter tracking number below</Text>
          </>
        )}
      </View>

      <Snackbar visible={snack.visible} message={snack.message} type={snack.type} onDismiss={hideSnackbar} />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <RNLabel required>Tracking Number</RNLabel>
        <View style={styles.inputWrapper}>
          <FormInput
            placeholder="e.g., FWEN-2024-001234"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            editable={!loading}
          />
          <CTAButton
            text={loading ? 'Searching...' : 'Search'}
            onPress={handleTrack}
            disabled={loading}
            variant="primary"
            style={styles.searchButton}
          />
        </View>
      </View>

      {parcelData && (
        <View style={styles.parcelContainer}>
          <View style={styles.parcelHeader}>
            <View>
              <Text style={styles.trackingLabel}>Tracking #</Text>
              <Text style={styles.trackingNumber}>{parcelData.trackingNumber}</Text>
            </View>
            <RNBadge variant={getStatusColor(parcelData.currentStatus)}>
              {getStatusIcon(parcelData.currentStatus)} {parcelData.currentStatus.replace(/_/g, ' ').toUpperCase()}
            </RNBadge>
          </View>

          <View style={styles.parcelDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient:</Text>
              <Text style={styles.detailValue}>{parcelData.recipientName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{parcelData.recipientPhone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Route:</Text>
              <Text style={styles.detailValue}>
                {parcelData.originDistrict} → {parcelData.destinationDistrict}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>{parcelData.packageWeight}</Text>
            </View>
          </View>

          <Text style={styles.timelineTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            {parcelData.timeline.map((event, index) => (
              <View key={index} style={styles.timelineEvent}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      event.status === parcelData.currentStatus && styles.timelineDotActive,
                    ]}
                  >
                    <Text style={styles.timelineDotText}>
                      {getStatusIcon(event.status)}
                    </Text>
                  </View>
                  {index < parcelData.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={styles.timelineLabel}>{event.label}</Text>
                  <Text style={styles.timelineDate}>
                    {event.date} at {event.time}
                  </Text>
                  <Text style={styles.timelineLocation}>{event.location}</Text>
                </View>
              </View>
            ))}
          </View>

          <CTAButton
            text="Back to Search"
            onPress={() => {
              setParcelData(null);
              setTrackingNumber('');
            }}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
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
  inputWrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  searchButton: {
    height: 50,
    width: 100,
  },
  parcelContainer: {
    marginTop: spacing.lg,
  },
  parcelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  trackingLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  trackingNumber: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  parcelDetails: {
    padding: spacing.md,
    backgroundColor: '#f9fafb',
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.muted,
  },
  detailValue: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  timelineTitle: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  timeline: {
    marginBottom: spacing.lg,
  },
  timelineEvent: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 40,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
  },
  timelineDotText: {
    fontSize: 16,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  timelineRight: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  timelineLabel: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  timelineLocation: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default TrackScreen;
