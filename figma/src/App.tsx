import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { SendParcelPage } from './components/SendParcelPage';
import { TrackShipmentPage } from './components/TrackShipmentPage';
import { LastMileRidePage } from './components/LastMileRidePage';
import { ProfilePage } from './components/ProfilePage';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Toaster } from './components/ui/sonner';
import { createClient } from './utils/supabase/client';

export type Page = 'home' | 'login' | 'signup' | 'send-parcel' | 'track' | 'last-mile' | 'profile';

export interface User {
  id: string;
  name: string;
  email: string;
  district: string;
  phone?: string;
  fullName?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Check for existing session on mount and initialize demo account
  useEffect(() => {
    checkSession();
    initializeDemoAccount();
  }, []);

  const initializeDemoAccount = async () => {
    try {
      const { projectId, publicAnonKey } = await import('./utils/supabase/info');
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ae5d492/init-demo`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.log('Demo account initialization (non-critical):', error);
    }
  };

  const checkSession = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Get user data from backend
        const response = await fetch(
          `https://${(await import('./utils/supabase/info')).projectId}.supabase.co/functions/v1/make-server-0ae5d492/auth/session`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setUser({
              id: data.user.id,
              name: data.user.fullName || data.user.full_name || '',
              email: data.user.email,
              district: data.user.district || '',
              phone: data.user.phone || '',
              fullName: data.user.fullName || data.user.full_name || '',
            });
          }
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleLogin = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      const { authAPI } = await import('../FWENMobile-Expo/src/services/auth');
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setCurrentPage('home');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} onSignup={handleLogin} />;
      case 'send-parcel':
        return <SendParcelPage onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} user={user} />;
      case 'track':
        return <TrackShipmentPage onNavigate={setCurrentPage} />;
      case 'last-mile':
        return <LastMileRidePage onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} user={user} onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} />;
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#660000] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FWEN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {renderPage()}
      <AIChatAssistant />
      <Toaster />
    </div>
  );
}
