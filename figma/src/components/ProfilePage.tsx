import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Page, User as UserType } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User, Mail, MapPin, Phone, CreditCard, LogOut, Package, Clock, Award, Gift, Star } from 'lucide-react';
import { Separator } from './ui/separator';
import { parcelAPI } from '../../FWENMobile-Expo/src/services/parcels';
import { supabase } from '../../FWENMobile-Expo/src/utils/supabase';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
  user: UserType | null;
  onLogout: () => void;
}

export function ProfilePage({ onNavigate, user, onLogout }: ProfilePageProps) {
  const [parcels, setParcels] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch parcels and profile in parallel
      try {
        const [parcelsData, profileData] = await Promise.all([
          parcelAPI.getParcels({ userId: user?.id }),
          supabase.from('users').select('*').eq('id', user?.id).maybeSingle(),
        ]);

        // parcelAPI.getParcels returns an array or throws
        setParcels(parcelsData || []);

        // profileData is Supabase response
        if (profileData && profileData.data) setProfile(profileData.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const totalParcels = parcels.length;
  const inTransitParcels = parcels.filter(p => 
    ['in_transit', 'dispatched', 'collected'].includes(p.status)
  ).length;
  const recentParcels = parcels.slice(0, 3);

  // Format member since date
  const getMemberSince = () => {
    if (profile?.createdAt) {
      const date = new Date(profile.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'November 2025';
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} currentPage="profile" isLoggedIn={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[#660000] mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and view your activity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="md:col-span-2">
              <Card className="border-[#660000]">
                <CardHeader>
                  <CardTitle className="text-[#660000]">Personal Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-[#660000] rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[#660000]">{user?.name}</h3>
                      <p className="text-sm text-gray-600">Member since {getMemberSince()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#660000]" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-[#660000]">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#660000]" />
                      <div>
                        <p className="text-sm text-gray-600">District</p>
                        <p className="text-[#660000]">{user?.district}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#660000]" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-[#660000]">{profile?.phone || user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-[#660000]">Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-[#660000]" />
                      <div>
                        <p className="text-[#660000]">MTN Mobile Money</p>
                        <p className="text-sm text-gray-600">**** **** 3456</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Rewards Section */}
              <Card className="border-[#DAA520] mb-4 bg-gradient-to-br from-[#F9F9F9] to-white">
                <CardHeader className="bg-gradient-to-r from-[#660000] to-[#4d0000] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-[#DAA520]">
                    <Award className="h-5 w-5" />
                    Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#DAA520] to-[#FFD700] rounded-full mb-3">
                      <Star className="h-10 w-10 text-[#660000]" />
                    </div>
                    <p className="text-4xl text-[#660000] mb-1">{isLoading ? '...' : (totalParcels * 50 + inTransitParcels * 30)}</p>
                    <p className="text-sm text-gray-600">Total Points</p>
                  </div>
                  
                  <div className="bg-white border border-[#DAA520] rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Next Reward</p>
                      <p className="text-xs text-[#660000]">{500 - ((totalParcels * 50 + inTransitParcels * 30) % 500)} pts</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#660000] to-[#DAA520] h-2 rounded-full" 
                        style={{ width: `${((totalParcels * 50 + inTransitParcels * 30) % 500) / 5}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Gift className="mr-2 h-4 w-4 text-[#660000]" />
                      Redeem Points
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Earn points with every delivery! 🎉
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-[#DAA520] mb-4">
                <CardHeader>
                  <CardTitle className="text-[#660000]">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-[#660000]" />
                      <p className="text-sm text-gray-600">Total Packages</p>
                    </div>
                    <p className="text-2xl text-[#660000]">{isLoading ? '...' : totalParcels}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-[#660000]" />
                      <p className="text-sm text-gray-600">In Transit</p>
                    </div>
                    <p className="text-2xl text-[#660000]">{isLoading ? '...' : inTransitParcels}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#660000]">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onNavigate('send-parcel')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Send Package
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onNavigate('track')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Track Shipment
                  </Button>
                  <Separator />
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={onLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Shipments */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-[#660000]">Recent Shipments</CardTitle>
              <CardDescription>Your latest package deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading parcels...</p>
                </div>
              ) : recentParcels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No shipments yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => onNavigate('send-parcel')}
                  >
                    Send Your First Package
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentParcels.map((parcel) => (
                    <div key={parcel.trackingNumber} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-[#660000]" />
                        <div>
                          <p className="text-[#660000]">{parcel.trackingNumber}</p>
                          <p className="text-sm text-gray-600">
                            {parcel.senderDistrict} → {parcel.receiverDistrict}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onNavigate('track')}>
                        Track
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
