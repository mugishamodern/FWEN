import { useState } from 'react';
import { Navigation } from './Navigation';
import { Page, User } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Mail, Lock, Info } from 'lucide-react';
import { authAPI } from '../../FWENMobile-Expo/src/services/auth';
import { Alert, AlertDescription } from './ui/alert';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (userData: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.login(email, password);

      if (result && result.user) {
        toast.success('Login successful!');
        onLogin({
          id: result.user.id,
          name: result.user.fullName || result.user.full_name || result.user.email || '',
          email: result.user.email,
          district: result.user.district || '',
          phone: result.user.phone || '',
          fullName: result.user.fullName || result.user.full_name || result.user.email || '',
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage.includes('Invalid') ? 'Invalid email or password.' : errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const result = await authAPI.login('demo@fwen.ug', 'demo123');
      if (result && result.user) {
        toast.success('Logged in as Demo User!');
        onLogin({
          id: result.user.id,
          name: result.user.fullName || result.user.full_name || 'Demo User',
          email: result.user.email,
          district: result.user.district || 'Kampala',
          phone: result.user.phone || '0700000000',
          fullName: result.user.fullName || result.user.full_name || 'Demo User',
        });
      }
    } catch (error: any) {
      toast.error('Demo account not available. Please create an account to continue.');
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navigation onNavigate={onNavigate} currentPage="login" isLoggedIn={false} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-[#660000]">
            <CardHeader>
              <CardTitle className="text-[#660000]">Welcome Back</CardTitle>
              <CardDescription>Login to your FWEN account</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-[#DAA520] bg-[#DAA520]/10">
                <Info className="h-4 w-4 text-[#660000]" />
                <AlertDescription className="text-sm text-gray-700">
                  <strong>New here?</strong> Try the demo account to explore all features without signing up!
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#660000] hover:bg-[#4d0000] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#660000] text-[#660000] hover:bg-[#660000] hover:text-white"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Try Demo Account
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('signup')}
                      className="text-[#660000] hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
