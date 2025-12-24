import { useState } from 'react';
import { Navigation } from './Navigation';
import { Page } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { MapPin, Bike, Car, User, Phone, Sparkles, Heart, Award, Smile } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface LastMileRidePageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
}

export function LastMileRidePage({ onNavigate, isLoggedIn }: LastMileRidePageProps) {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
    vehicleType: 'boda',
    recipientName: '',
    recipientPhone: '',
  });

  const [estimatedCost, setEstimatedCost] = useState(5000);
  const [rideScheduled, setRideScheduled] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [assignedDriver, setAssignedDriver] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Please login to schedule a ride');
      onNavigate('login');
      return;
    }

    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.recipientName || !formData.recipientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate driver assignment
    const driver = {
      name: 'Moses Okello',
      rating: 4.8,
      vehicle: formData.vehicleType === 'boda' ? 'Boda Boda' : 'Taxi',
      vehicleNumber: 'UBE 234R',
      eta: '10 mins',
    };

    // Calculate reward points (10 points per 1000 UGX)
    const points = Math.floor(estimatedCost / 1000) * 10;
    
    setAssignedDriver(driver);
    setRewardPoints(points);
    setRideScheduled(true);
    toast.success('Ride scheduled successfully!');
  };

  // Calculate cost based on vehicle type
  const handleVehicleChange = (type: string) => {
    setFormData({ ...formData, vehicleType: type });
    const baseCost = type === 'boda' ? 5000 : 15000;
    setEstimatedCost(baseCost);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onNavigate={onNavigate} currentPage="last-mile" isLoggedIn={false} />
        <div className="container mx-auto px-4 py-16 text-center">
          <Bike className="h-16 w-16 text-[#660000] mx-auto mb-4" />
          <h2 className="mb-4 text-[#660000]">Last-Mile Delivery</h2>
          <p className="text-gray-600 mb-6">Login to schedule last-mile delivery from bus terminal to doorstep</p>
          <Button onClick={() => onNavigate('login')} className="bg-[#660000] hover:bg-[#4d0000]">
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  // Success/Thank You Page
  if (rideScheduled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#660000] to-[#4d0000]">
        <Navigation onNavigate={onNavigate} currentPage="last-mile" isLoggedIn={isLoggedIn} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-[#DAA520] shadow-2xl">
              <CardContent className="pt-12 pb-12 text-center">
                {/* Smiling Emoji */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#DAA520] to-[#FFD700] rounded-full">
                    <Smile className="h-20 w-20 text-[#660000]" />
                  </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-4xl text-[#660000] mb-4">Thank You! 😊</h1>
                <p className="text-xl text-gray-700 mb-2">
                  For trusting <span className="text-[#660000]">FWEN</span>
                </p>
                <p className="text-lg text-[#660000] mb-8">
                  Your New Delivery Friend! 🚚💛
                </p>

                <div className="bg-[#F9F9F9] rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Heart className="h-6 w-6 text-[#660000]" />
                    <p className="text-gray-600">Your ride has been successfully scheduled</p>
                  </div>
                  
                  {assignedDriver && (
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">Your Driver</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#660000] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-[#660000]">{assignedDriver.name}</p>
                          <p className="text-sm text-gray-600">⭐ {assignedDriver.rating} • {assignedDriver.vehicleNumber}</p>
                          <p className="text-sm text-[#660000]">ETA: {assignedDriver.eta}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rewards Section */}
                <div className="bg-gradient-to-r from-[#660000] to-[#4d0000] rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Award className="h-8 w-8 text-[#DAA520]" />
                    <h3 className="text-2xl text-[#DAA520]">Reward Points Earned!</h3>
                  </div>
                  <p className="text-5xl text-white mb-2">{rewardPoints}</p>
                  <p className="text-sm text-gray-300">Points added to your account</p>
                  <div className="mt-4 bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-200">
                      💡 Use your points for discounts on future deliveries!
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => onNavigate('track')}
                    className="w-full bg-[#660000] hover:bg-[#4d0000] text-white"
                    size="lg"
                  >
                    Track My Package
                  </Button>
                  <Button
                    onClick={() => onNavigate('home')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Back to Home
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  We appreciate your trust in FWEN! 💛
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} currentPage="last-mile" isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[#660000] mb-2">Schedule Last-Mile Delivery</h1>
            <p className="text-gray-600">Get your package delivered from the bus terminal to the recipient's doorstep</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-[#660000]">
                <CardHeader>
                  <CardTitle className="text-[#660000]">Ride Details</CardTitle>
                  <CardDescription>Schedule pickup from bus terminal</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tracking Number */}
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
                      <Input
                        id="trackingNumber"
                        placeholder="FWEN 2345TR"
                        value={formData.trackingNumber}
                        onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">Enter your tracking number to auto-fill details</p>
                    </div>

                    {/* Pickup Location */}
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="pickupLocation"
                          placeholder="Bus terminal, district"
                          value={formData.pickupLocation}
                          onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Drop-off Location */}
                    <div className="space-y-2">
                      <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dropoffLocation"
                          placeholder="Final delivery address"
                          value={formData.dropoffLocation}
                          onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Recipient Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Name *</Label>
                        <Input
                          id="recipientName"
                          placeholder="Jane Doe"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">Recipient Phone *</Label>
                        <Input
                          id="recipientPhone"
                          placeholder="0700123456"
                          value={formData.recipientPhone}
                          onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Vehicle Type Selection */}
                    <div className="space-y-3">
                      <Label>Select Vehicle Type</Label>
                      <RadioGroup 
                        value={formData.vehicleType} 
                        onValueChange={handleVehicleChange}
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="boda" id="boda" />
                          <Label htmlFor="boda" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Bike className="h-5 w-5 text-[#660000]" />
                            <div>
                              <p className="text-[#660000]">Boda Boda</p>
                              <p className="text-sm text-gray-600">Fast & affordable - UGX 5,000</p>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="taxi" id="taxi" />
                          <Label htmlFor="taxi" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Car className="h-5 w-5 text-[#660000]" />
                            <div>
                              <p className="text-[#660000]">Taxi</p>
                              <p className="text-sm text-gray-600">Comfortable & safe - UGX 15,000</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#660000] hover:bg-[#4d0000]"
                    >
                      Schedule Ride
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Cost Estimate */}
            <div className="lg:col-span-1">
              <Card className="border-[#DAA520] sticky top-4 mb-4">
                <CardHeader className="bg-gradient-to-r from-[#660000] to-[#4d0000] text-white">
                  <CardTitle className="text-[#DAA520]">Ride Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-3xl text-[#660000]">
                        UGX {estimatedCost.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {formData.vehicleType === 'boda' ? (
                            <Bike className="h-5 w-5 text-[#660000]" />
                          ) : (
                            <Car className="h-5 w-5 text-[#660000]" />
                          )}
                          <p className="text-[#660000]">
                            {formData.vehicleType === 'boda' ? 'Boda Boda' : 'Taxi'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <Sparkles className="h-4 w-4 inline mr-1" />
                        Earn {Math.floor(estimatedCost / 1000) * 10} reward points with this ride!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
