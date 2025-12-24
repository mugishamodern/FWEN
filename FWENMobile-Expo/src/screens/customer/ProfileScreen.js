import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import * as theme from '../../styles/webTheme';
import CTAButton from '../../components/ui/CTAButton';
import Card from '../../components/ui/Card';
import RNBadge from '../../components/ui/RNBadge';
import Snackbar from '../../components/ui/Snackbar';

const { colors, spacing } = theme;
const typography = theme.type;

/**
 * ProfileScreen - User profile and settings
 */
const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'parcels'

  const [snack, setSnack] = useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => setSnack({ visible: true, message, type });
  const hideSnackbar = () => setSnack((s) => ({ ...s, visible: false }));

  // Demo payment methods
  const DEMO_PAYMENT_METHODS = [
    { id: 1, type: 'mobile_money', provider: 'MTN Mobile Money', lastDigits: '****1234', isDefault: true },
    { id: 2, type: 'card', provider: 'Visa', lastDigits: '****5678', isDefault: false },
  ];

  // Demo parcel history
  const DEMO_PARCELS = [
    {
      id: 1,
      trackingNumber: 'FWEN-2024-001234',
      recipient: 'John Doe',
      destination: 'Kumasi',
      status: 'delivered',
      date: '2024-01-17',
    },
    {
      id: 2,
      trackingNumber: 'FWEN-2024-001235',
      recipient: 'Jane Smith',
      destination: 'Takoradi',
      status: 'in_transit',
      date: '2024-01-16',
    },
    {
      id: 3,
      trackingNumber: 'FWEN-2024-001236',
      recipient: 'Bob Johnson',
      destination: 'Cape Coast',
      status: 'pending',
      date: '2024-01-15',
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(logoutUser());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        },
        style: 'destructive',
      },
    ]);
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      pending: 'default',
      in_transit: 'warning',
      delivered: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
          <Text style={styles.userType}>
            {user?.user_type ? user.user_type.toUpperCase() : 'CUSTOMER'}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'profile' && styles.tabTextActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'parcels' && styles.tabActive]}
          onPress={() => setActiveTab('parcels')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'parcels' && styles.tabTextActive,
            ]}
          >
            My Parcels
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user?.phone_number || 'Not provided'}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Verified:</Text>
              <Text style={styles.infoValue}>
                {user?.is_verified ? '✓ Yes' : '✗ No'}
              </Text>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {DEMO_PAYMENT_METHODS.map((method) => (
            <Card key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentProvider}>{method.provider}</Text>
                  <Text style={styles.paymentDigits}>{method.lastDigits}</Text>
                </View>
                {method.isDefault && (
                  <RNBadge variant="success">Default</RNBadge>
                )}
              </View>
              <View style={styles.paymentActions}>
                <TouchableOpacity>
                  <Text style={styles.paymentAction}>Edit</Text>
                </TouchableOpacity>
                <Text style={styles.paymentDivider}>|</Text>
                <TouchableOpacity>
                  <Text style={styles.paymentAction}>Remove</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}

          <CTAButton
            text="Add Payment Method"
            onPress={() => showSnackbar('Payment method addition coming soon', 'info')}
            variant="secondary"
            style={styles.button}
          />

          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.settingCard}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.settingCard}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.settingCard}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
          </Card>

          <CTAButton
            text={loading ? 'Logging out...' : 'Logout'}
            onPress={handleLogout}
            disabled={loading}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>
      )}

      {/* Parcels Tab */}
      {activeTab === 'parcels' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Parcel History</Text>
          {DEMO_PARCELS.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No parcels sent yet</Text>
            </View>
          ) : (
            DEMO_PARCELS.map((parcel) => (
              <Card key={parcel.id} style={styles.parcelCard}>
                <View style={styles.parcelHeader}>
                  <View>
                    <Text style={styles.parcelTracking}>{parcel.trackingNumber}</Text>
                    <Text style={styles.parcelRecipient}>To: {parcel.recipient}</Text>
                  </View>
                  <RNBadge variant={getStatusBadgeVariant(parcel.status)}>
                    {parcel.status.replace(/_/g, ' ')}
                  </RNBadge>
                </View>
                <View style={styles.parcelDetails}>
                  <Text style={styles.parcelDetail}>📍 {parcel.destination}</Text>
                  <Text style={styles.parcelDetail}>📅 {parcel.date}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    showSnackbar(`Tracking: ${parcel.trackingNumber}`, 'info');
                  }}
                >
                  <Text style={styles.trackLink}>View Details →</Text>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </View>
      )}
    </ScrollView>
    <Snackbar visible={snack.visible} message={snack.message} type={snack.type} onDismiss={hideSnackbar} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  userType: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.body,
    color: colors.muted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.muted,
  },
  infoValue: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  paymentCard: {
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentProvider: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  paymentDigits: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  paymentActions: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paymentAction: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    paddingVertical: spacing.xs,
  },
  paymentDivider: {
    color: colors.border,
    marginHorizontal: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
  settingCard: {
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 18,
    color: colors.muted,
  },
  logoutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.muted,
  },
  parcelCard: {
    marginBottom: spacing.md,
  },
  parcelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  parcelTracking: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  parcelRecipient: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  parcelDetails: {
    marginVertical: spacing.sm,
  },
  parcelDetail: {
    fontSize: 12,
    color: colors.text,
    marginVertical: 2,
  },
  trackLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
