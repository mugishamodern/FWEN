import { useState } from 'react';
import { Navigation } from './Navigation';
import { Page, User as UserType } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { User, Mail, Phone, MapPin, Lock, CreditCard, CheckCircle } from 'lucide-react';
import { UGANDAN_DISTRICTS } from '../data/districts';
import { Checkbox } from './ui/checkbox';
import { authAPI } from '../../FWENMobile-Expo/src/services/auth';
import { Alert, AlertDescription } from './ui/alert';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
  onSignup: (userData: UserType) => void;
}

export function SignupPage({ onNavigate, onSignup }: SignupPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: '',
    password: '',
    confirmPassword: '',
  });
  const [linkMobileMoney, setLinkMobileMoney] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const validatePhone = (phone: string) => {
    const ugandaPhoneRegex = /^(0|\+256)?[37]\d{8}$/;
    return ugandaPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.email || !formData.district || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid Ugandan phone number');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authAPI.register({
        email: formData.email,
        password: formData.password,
        metadata: {
          fullName: formData.fullName,
          phone: formData.phone,
          district: formData.district,
        },
      });

      // Supabase returns data on signUp; we simulate OTP flow similarly
      if (result) {
        setShowOTP(true);
        toast.success('Account created! Enter OTP to verify.');
        setTimeout(() => {
          setOtp('123456');
          toast.info('Demo OTP: 123456');
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Signup failed. Please try again.';
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        toast.error('This email is already registered. Please login instead.');
      } else {
        toast.error(errorMessage);
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate OTP verification and auto-login
      try {
        const loginResult = await authAPI.login(formData.email, formData.password);
        if (loginResult && loginResult.user) {
          toast.success('Account created successfully!');
          onSignup({
            id: loginResult.user.id,
            name: loginResult.user.fullName || loginResult.user.full_name || formData.fullName,
            email: loginResult.user.email,
            district: loginResult.user.district || formData.district,
            phone: loginResult.user.phone || formData.phone,
            fullName: loginResult.user.fullName || loginResult.user.full_name || formData.fullName,
          });
        }
      } catch (err) {
        toast.error(err?.message || 'Auto-login failed after signup');
        console.error('Auto-login after signup failed:', err);
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} currentPage="signup" isLoggedIn={false} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-[#800000]">
            <CardHeader>
              <CardTitle className="text-[#800000]">Create FWEN Account</CardTitle>
              <CardDescription>
                {showOTP ? 'Verify your phone number' : 'Join Uganda\'s smartest delivery platform'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showOTP ? (
                <>
                  <Alert className="mb-4 border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-gray-700">
                      Creating an account is quick and free! Get instant access to AI-powered delivery tracking.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="0700123456"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {formData.phone && !validatePhone(formData.phone) && (
                        <p className="text-sm text-red-500">Invalid phone number</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {formData.email && !validateEmail(formData.email) && (
                        <p className="text-sm text-red-500">Invalid email address</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                      >
                        <SelectTrigger className="w-full">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <SelectValue placeholder="Select district" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {UGANDAN_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="mobileMoney"
                      checked={linkMobileMoney}
                      onCheckedChange={(checked) => setLinkMobileMoney(checked as boolean)}
                    />
                    <label
                      htmlFor="mobileMoney"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Link Mobile Money account for easy payments (Optional)
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#800000] hover:bg-[#600000] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('login')}
                        className="text-[#800000] hover:underline"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-[#FFD700] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-[#800000]" />
                    </div>
                    <p className="text-gray-600">
                      We've sent a 6-digit OTP to <span className="text-[#800000]">{formData.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    className="w-full bg-[#800000] hover:bg-[#600000] text-white"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => toast.success('New OTP sent!')}
                      className="text-sm text-[#800000] hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
