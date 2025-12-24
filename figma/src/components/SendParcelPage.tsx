import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Page } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Package, User, Phone, MapPin, Banknote, Clock, Sparkles, CreditCard, Smartphone, Shield, Truck } from 'lucide-react';
import { UGANDAN_DISTRICTS, BUS_ROUTES } from '../data/districts';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface SendParcelPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  user: { name: string; email: string; district: string } | null;
}

// Distance data between major districts (simplified - in km)
const DISTRICT_DISTANCES: { [key: string]: number } = {
  'Kampala-Kampala': 0,
  'Kampala-Wakiso': 20,
  'Kampala-Mukono': 25,
  'Kampala-Entebbe': 37,
  'Kampala-Jinja': 87,
  'Kampala-Mbarara': 266,
  'Kampala-Gulu': 333,
  'Kampala-Arua': 516,
  'Kampala-Mbale': 220,
  'Kampala-Fort Portal': 296,
  'Kampala-Hoima': 219,
  'Kampala-Masaka': 128,
  'Kampala-Lira': 350,
  'Kampala-Soroti': 315,
  'Kampala-Kabale': 414,
};

// Helper function to estimate distance between any two districts
function estimateDistance(from: string, to: string): number {
  if (from === to) return 0;
  
  // Check direct distance
  const directKey = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  
  if (DISTRICT_DISTANCES[directKey]) return DISTRICT_DISTANCES[directKey];
  if (DISTRICT_DISTANCES[reverseKey]) return DISTRICT_DISTANCES[reverseKey];
  
  // Estimate via Kampala if not found
  const fromToKampala = DISTRICT_DISTANCES[`Kampala-${from}`] || DISTRICT_DISTANCES[`${from}-Kampala`] || 200;
  const kampalaToTo = DISTRICT_DISTANCES[`Kampala-${to}`] || DISTRICT_DISTANCES[`${to}-Kampala`] || 200;
  
  return fromToKampala + kampalaToTo;
}

export function SendParcelPage({ onNavigate, isLoggedIn, user }: SendParcelPageProps) {
  const [formData, setFormData] = useState({
    senderName: user?.name || '',
    senderPhone: '',
    senderDistrict: user?.district || '',
    senderPickupLocation: '',
    recipientName: '',
    recipientPhone: '',
    recipientDistrict: '',
    recipientDeliveryLocation: '',
    packageType: '',
    weight: '',
    size: 'small',
    priority: 'standard',
    busRoute: '',
    addInsurance: false,
  });

  const [cost, setCost] = useState(0);
  const [eta, setEta] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLastMilePrompt, setShowLastMilePrompt] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  // Calculate cost based on inputs
  useEffect(() => {
    if (formData.senderDistrict && formData.recipientDistrict && formData.weight) {
      const weight = parseFloat(formData.weight);
      const distance = estimateDistance(formData.senderDistrict, formData.recipientDistrict);
      
      // Base fare: 6000 UGX per 50km per kg
      const distanceUnits = Math.ceil(distance / 50);
      let baseCost = 6000 * distanceUnits * weight;
      
      // Minimum charge
      if (baseCost < 6000) baseCost = 6000;
      
      // Size factor
      if (formData.size === 'medium') baseCost *= 1.3;
      if (formData.size === 'large') baseCost *= 1.6;
      
      // Priority factor
      if (formData.priority === 'express') baseCost *= 1.5;
      if (formData.priority === 'urgent') baseCost *= 2;
      
      // Insurance add-on
      if (formData.addInsurance) {
        baseCost += 4000;
      }
      
      // Cap at 50,000 UGX
      if (baseCost > 50000) baseCost = 50000;
      
      setCost(Math.round(baseCost));
      
      // Calculate ETA based on priority - cap at 15 hours
      let hours = 12; // Standard delivery
      if (formData.priority === 'express') hours = 8;
      if (formData.priority === 'urgent') hours = 4;
      
      const route = BUS_ROUTES.find(r => 
        (r.from === formData.senderDistrict && r.to === formData.recipientDistrict) ||
        (r.to === formData.senderDistrict && r.from === formData.recipientDistrict)
      );
      
      if (route) {
        const etaMax = Math.min(hours + 3, 15);
        setEta(`${hours}-${etaMax} hours`);
      } else {
        const etaMax = Math.min(hours + 5, 15);
        setEta(`${hours}-${etaMax} hours (via connecting route)`);
      }
    }
  }, [formData]);

  // Get available bus routes based on selected districts
  const availableRoutes = BUS_ROUTES.filter(route => 
    (route.from === formData.senderDistrict || route.to === formData.senderDistrict) &&
    (route.from === formData.recipientDistrict || route.to === formData.recipientDistrict)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Please login to send a package');
      onNavigate('login');
      return;
    }

    // Validation
    if (!formData.recipientName || !formData.recipientPhone || !formData.recipientDistrict || 
        !formData.packageType || !formData.weight || !formData.senderPickupLocation || !formData.recipientDeliveryLocation) {
      toast.error('Please fill in all required fields including pickup and delivery locations');
      return;
    }

    setShowConfirmation(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      toast.loading('Processing payment and creating package...');

      const packageData = {
        ...formData,
        cost,
        eta,
        paymentMethod,
      };

      try {
        const { parcelAPI } = await import('../../FWENMobile-Expo/src/services/parcels');
        const result = await parcelAPI.createParcel(packageData);

        if (result) {
          const tn = result.tracking_number || result.trackingNumber || '';
          setTrackingNumber(tn);
          toast.dismiss();
          toast.success(`Package booking confirmed! Tracking number: ${tn}`);
          setShowConfirmation(false);
          setTimeout(() => setShowLastMilePrompt(true), 500);
        }
      } catch (error: any) {
        toast.dismiss();
        toast.error(error.message || 'Failed to create package. Please try again.');
        console.error('Create package error:', error);
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to create package. Please try again.');
      console.error('Create package error:', error);
    }
  };

  const handleLastMileResponse = (scheduleRide: boolean) => {
    setShowLastMilePrompt(false);
    if (scheduleRide) {
      onNavigate('last-mile');
    } else {
      onNavigate('track');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onNavigate={onNavigate} currentPage="send-parcel" isLoggedIn={false} />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 text-[#660000] mx-auto mb-4" />
          <h2 className="mb-4 text-[#660000]">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to send a package</p>
          <Button onClick={() => onNavigate('login')} className="bg-[#660000] hover:bg-[#4d0000]">
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} currentPage="send-parcel" isLoggedIn={isLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[#660000] mb-2">Send a Package</h1>
            <p className="text-gray-600">Fill in the details below and let our AI calculate the best route and price</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-[#660000]">
                <CardHeader>
                  <CardTitle className="text-[#660000]">Package Details</CardTitle>
                  <CardDescription>Enter sender and recipient information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div>
                      <h3 className="mb-4 text-[#660000] flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Sender Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="senderName">Full Name</Label>
                          <Input
                            id="senderName"
                            value={formData.senderName}
                            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderPhone">Phone Number</Label>
                          <Input
                            id="senderPhone"
                            placeholder="0700123456"
                            value={formData.senderPhone}
                            onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="senderDistrict">District</Label>
                          <Select
                            value={formData.senderDistrict}
                            onValueChange={(value) => setFormData({ ...formData, senderDistrict: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
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
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="senderPickupLocation">Pickup Location *</Label>
                          <Input
                            id="senderPickupLocation"
                            placeholder="e.g., Plot 23, Kampala Road, near Shell Station"
                            value={formData.senderPickupLocation}
                            onChange={(e) => setFormData({ ...formData, senderPickupLocation: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recipient Information */}
                    <div>
                      <h3 className="mb-4 text-[#660000] flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Recipient Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">Full Name *</Label>
                          <Input
                            id="recipientName"
                            placeholder="Jane Doe"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipientPhone">Phone Number *</Label>
                          <Input
                            id="recipientPhone"
                            placeholder="0700123456"
                            value={formData.recipientPhone}
                            onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="recipientDistrict">District *</Label>
                          <Select
                            value={formData.recipientDistrict}
                            onValueChange={(value) => setFormData({ ...formData, recipientDistrict: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
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
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="recipientDeliveryLocation">Delivery Location *</Label>
                          <Input
                            id="recipientDeliveryLocation"
                            placeholder="e.g., House 45, Jinja Road, opposite City Mall"
                            value={formData.recipientDeliveryLocation}
                            onChange={(e) => setFormData({ ...formData, recipientDeliveryLocation: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Package Information */}
                    <div>
                      <h3 className="mb-4 text-[#660000] flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Package Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="packageType">Package Type *</Label>
                          <Input
                            id="packageType"
                            placeholder="e.g., Documents, Electronics"
                            value={formData.packageType}
                            onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg) *</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="5"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Package Size</Label>
                          <Select
                            value={formData.size}
                            onValueChange={(value) => setFormData({ ...formData, size: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (Shoebox)</SelectItem>
                              <SelectItem value="medium">Medium (Suitcase)</SelectItem>
                              <SelectItem value="large">Large (Cargo box)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Delivery Priority</Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => setFormData({ ...formData, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Insurance Add-on */}
                      <div className="mt-4 flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Checkbox 
                          id="insurance" 
                          checked={formData.addInsurance}
                          onCheckedChange={(checked) => setFormData({ ...formData, addInsurance: checked as boolean })}
                        />
                        <div className="flex-1">
                          <Label htmlFor="insurance" className="cursor-pointer flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#660000]" />
                            <span className="text-[#660000]">Add Insurance Protection</span>
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Protect your package with full coverage for loss or damage. Only UGX 4,000
                          </p>
                        </div>
                      </div>
                    </div>

                    {availableRoutes.length > 0 && (
                      <div className="space-y-2">
                        <Label>Available Bus Routes</Label>
                        <Select
                          value={formData.busRoute}
                          onValueChange={(value) => setFormData({ ...formData, busRoute: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bus route" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoutes.map((route, idx) => (
                              <SelectItem key={idx} value={`${route.from}-${route.to}`}>
                                {route.from} → {route.to} ({route.operator}) - {route.duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-[#660000] hover:bg-[#4d0000]"
                    >
                      Proceed to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Cost Calculator Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-[#DAA520] sticky top-4">
                <CardHeader className="bg-gradient-to-r from-[#660000] to-[#4d0000] text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#DAA520]" />
                    Smart Cost Calculator
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    AI-powered pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-3xl text-[#660000]">
                        UGX {cost.toLocaleString()}
                      </p>
                    </div>

                    {eta && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-[#660000]" />
                          <p className="text-sm text-gray-600">Predicted ETA</p>
                        </div>
                        <p className="text-lg text-[#660000]">{eta}</p>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Cost Breakdown:</p>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Base fare: UGX 6,000/50km/kg</li>
                        <li>• Weight: {formData.weight || 0} kg</li>
                        <li>• Size: {formData.size}</li>
                        <li>• Priority: {formData.priority}</li>
                        {formData.addInsurance && <li>• Insurance: UGX 4,000</li>}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <Sparkles className="h-4 w-4 inline mr-1" />
                        AI suggests: {formData.priority === 'urgent' ? 'Consider Express for better value' : 'Best route selected'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#660000]">Complete Payment</DialogTitle>
            <DialogDescription>
              Confirm your package details and payment method
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl text-[#660000]">UGX {cost.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="mtn" id="mtn" />
                  <Label htmlFor="mtn" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-4 w-4 text-yellow-500" />
                    MTN Mobile Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="airtel" id="airtel" />
                  <Label htmlFor="airtel" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-4 w-4 text-red-500" />
                    Airtel Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="visa" id="visa" />
                  <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Visa Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handlePaymentConfirm}
              className="w-full bg-[#660000] hover:bg-[#4d0000]"
            >
              <Banknote className="mr-2 h-4 w-4" />
              Pay UGX {cost.toLocaleString()}
            </Button>

            <p className="text-xs text-center text-gray-500">
              AI fraud detection active • Secure payment gateway
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Last-Mile Delivery Prompt */}
      <AlertDialog open={showLastMilePrompt} onOpenChange={setShowLastMilePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#660000] flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Schedule Last-Mile Delivery?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Your package has been successfully booked!</p>
              <p className="text-[#660000]">Tracking Number: <strong>{trackingNumber}</strong></p>
              <p>Would you like to schedule a last-mile delivery ride to ensure your package reaches its final destination quickly?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleLastMileResponse(false)}>
              No Thanks
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleLastMileResponse(true)}
              className="bg-[#660000] hover:bg-[#4d0000]"
            >
              <Truck className="mr-2 h-4 w-4" />
              Schedule Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
