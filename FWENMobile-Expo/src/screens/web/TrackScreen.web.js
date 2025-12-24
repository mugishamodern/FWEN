import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Snackbar from '../../components/ui/Snackbar';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CTAButton from '../../components/ui/CTAButton';
import PageContainer from '../../components/ui/PageContainer';
import FormInput from '../../components/ui/FormInput';
import WebLayout from '../../components/web/WebLayout';

const TrackScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useSelector((s) => s.auth || {});
  const [trackingId, setTrackingId] = useState('');
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => setSnack({ visible: true, message, type });
  const hideSnackbar = () => setSnack((s) => ({ ...s, visible: false }));

  const lookup = () => {
    if (!trackingId) {
      showSnackbar('Please provide a tracking number.', 'error');
      return;
    }

    if (isAuthenticated) {
      showSnackbar(`Showing status for ${trackingId} (placeholder).`, 'success');
      navigation.navigate('CustomerDashboard');
    } else {
      showSnackbar('Please log in to view detailed tracking.', 'error');
      navigation.navigate('Login');
    }
  };

  return (
    <WebLayout
      user={null}
      onNavigate={(screen) => {
        if (screen === 'Login') navigation.navigate('Login');
        if (screen === 'Home') navigation.navigate('Landing');
      }}
    >
      <PageContainer>
        <Text style={styles.title}>Track a Package</Text>

        <FormInput placeholder="Enter tracking number" value={trackingId} onChangeText={setTrackingId} style={styles.input} />

        <View style={styles.btnWrap}>
          <CTAButton onPress={lookup}>Lookup</CTAButton>
        </View>
        <Snackbar visible={snack.visible} message={snack.message} type={snack.type} onDismiss={hideSnackbar} />
      </PageContainer>
    </WebLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  btnWrap: {
    marginTop: 8,
  },
});

export default TrackScreen;
