import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CustomerDashboard from '../screens/customer/DashboardScreen';
import AgentDashboard from '../screens/agent/DashboardScreen';
import AdminDashboard from '../screens/admin/DashboardScreen';

// Web screens (lightweight placeholders)
import LandingScreen from '../screens/web/LandingScreen.web';
import SendPackageScreen from '../screens/web/SendPackageScreen.web';
import TrackScreen from '../screens/web/TrackScreen.web';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth || {});

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {Platform.OS === 'web' && (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="SendPackage" component={SendPackageScreen} />
            <Stack.Screen name="Track" component={TrackScreen} />
          </>
        )}

        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : userRole === 'agent' ? (
          // Agent Stack
          <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
        ) : userRole === 'admin' ? (
          // Admin Stack
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          // Customer Stack (default)
          <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;