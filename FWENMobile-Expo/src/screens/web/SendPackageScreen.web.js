import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Snackbar from '../../components/ui/Snackbar';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CTAButton from '../../components/ui/CTAButton';
import PageContainer from '../../components/ui/PageContainer';
import FormInput from '../../components/ui/FormInput';
import WebLayout from '../../components/web/WebLayout';

const SendPackageScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useSelector((s) => s.auth || {});

  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message, type = 'info') => setSnack({ visible: true, message, type });
  const hideSnackbar = () => setSnack((s) => ({ ...s, visible: false }));

  const submit = () => {
    if (!recipient || !address) {
      showSnackbar('Please enter recipient and address.', 'error');
      return;
    }

    if (isAuthenticated) {
      showSnackbar('Your package was submitted (placeholder).', 'success');
      navigation.navigate('CustomerDashboard');
    } else {
      showSnackbar('Please log in to send packages.', 'error');
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
        <Text style={styles.title}>Send a Package</Text>

        <FormInput placeholder="Recipient name" value={recipient} onChangeText={setRecipient} style={styles.input} />

        <FormInput placeholder="Delivery address" value={address} onChangeText={setAddress} style={[styles.input, styles.textArea]} multiline />

        <View style={styles.btnWrap}>
          <CTAButton onPress={submit}>Submit</CTAButton>
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
    alignItems: 'stretch',
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
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  btnWrap: {
    marginTop: 8,
  },
});

export default SendPackageScreen;
