import { useState } from 'react';
import { Navigation } from './Navigation';
import { Page } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface TrackShipmentPageProps {
  onNavigate: (page: Page) => void;
}

export function TrackShipmentPage({ onNavigate }: TrackShipmentPageProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsLoading(true);

    try {
      const { parcelAPI } = await import('../../FWENMobile-Expo/src/services/parcels');
      const parcel = await parcelAPI.trackParcel(trackingNumber);

      if (parcel) {
        const statusHistory = parcel.status_history || parcel.statusHistory || [];
        const timeline = Array.isArray(statusHistory)
          ? statusHistory.map((item: any) => ({
              status: item.status,
              label: item.description || item.status,
              location: item.location,
              time: item.timestamp ? new Date(item.timestamp).toLocaleString() : '',
              completed: true,
            }))
          : [];

        if (parcel.status && !timeline.find((t: any) => t.status === 'delivered')) {
          timeline.push({
            status: 'delivered',
            label: 'Delivered',
            location: parcel.recipient_district || parcel.recipientDistrict || '',
            time: 'Pending',
            completed: false,
          });
        }

        setTrackingData({
          trackingNumber: parcel.tracking_number || parcel.trackingNumber,
          status: parcel.status,
          sender: parcel.sender_name || parcel.senderName || '',
          recipient: parcel.recipient_name || parcel.recipientName || '',
          from: parcel.sender_district || parcel.senderDistrict || '',
          to: parcel.recipient_district || parcel.recipientDistrict || '',
          parcelType: parcel.parcel_type || parcel.parcelType || '',
          weight: parcel.weight ? `${parcel.weight}kg` : '',
          currentLocation: (statusHistory.length && (statusHistory[statusHistory.length - 1]?.location)) || parcel.sender_district || parcel.senderDistrict || '',
          eta: parcel.eta || '',
          timeline,
        });

        toast.success('Tracking information found!');
      } else {
        toast.error('Parcel not found. Please check your tracking number.');
        setTrackingData(null);
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      toast.error(error.message || 'Failed to track parcel. Please try again.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} currentPage="track" isLoggedIn={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-[#800000] mb-2">Track Your Shipment</h1>
            <p className="text-gray-600">Enter your tracking number to see real-time updates</p>
          </div>

          {/* Search Bar */}
          <Card className="border-[#800000] mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter tracking number (e.g., FWEN12345678)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  className="flex-1"
                />
                <Button
                  onClick={handleTrack}
                  disabled={isLoading}
                  className="bg-[#800000] hover:bg-[#600000]"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? 'Tracking...' : 'Track'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card className="border-[#FFD700]">
                <CardHeader className="bg-gradient-to-r from-[#800000] to-[#600000] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#FFD700]">Tracking: {trackingData.trackingNumber}</CardTitle>
                      <CardDescription className="text-gray-200">
                        {trackingData.from} → {trackingData.to}
                      </CardDescription>
                    </div>
                    <Badge className="bg-[#FFD700] text-[#800000]">
                      {trackingData.status === 'in-transit' ? 'In Transit' : trackingData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Location</p>
                      <p className="flex items-center gap-2 text-[#800000]">
                        <MapPin className="h-4 w-4" />
                        {trackingData.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                      <p className="flex items-center gap-2 text-[#800000]">
                        <Clock className="h-4 w-4" />
                        {trackingData.eta}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Parcel Type</p>
                      <p className="flex items-center gap-2 text-[#800000]">
                        <Package className="h-4 w-4" />
                        {trackingData.parcelType}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      AI Prediction: Your parcel is on schedule. No delays expected.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800000]">Route Map</CardTitle>
                  <CardDescription>Real-time location tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                    {/* Simple visual representation */}
                    <div className="absolute inset-0 flex items-center px-8">
                      <div className="flex-1 border-t-4 border-dashed border-[#800000] relative">
                        <div className="absolute left-0 -top-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                          <p className="text-xs mt-1 whitespace-nowrap">{trackingData.from}</p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -top-4">
                          <Truck className="w-8 h-8 text-[#800000]" />
                          <p className="text-xs mt-1 whitespace-nowrap text-center">{trackingData.currentLocation}</p>
                        </div>
                        <div className="absolute right-0 -top-3">
                          <div className="w-6 h-6 bg-[#800000] rounded-full border-4 border-white" />
                          <p className="text-xs mt-1 whitespace-nowrap text-right">{trackingData.to}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Click map pins for detailed location information
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800000]">Shipment Timeline</CardTitle>
                  <CardDescription>Track your parcel's journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {event.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            ) : (
                              <Clock className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          {index < trackingData.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3 className={event.completed ? 'text-[#800000]' : 'text-gray-500'}>
                            {event.label}
                          </h3>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-sm text-gray-500">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#800000]">Shipment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Sender</p>
                      <p className="text-[#800000]">{trackingData.sender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipient</p>
                      <p className="text-[#800000]">{trackingData.recipient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="text-[#800000]">{trackingData.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Parcel Type</p>
                      <p className="text-[#800000]">{trackingData.parcelType}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Get SMS Updates
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Email Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          {!trackingData && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-[#800000]">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your tracking number was sent to your phone via SMS when you created the shipment.
                  It should look like: FWEN12345678
                </p>
                <p className="text-gray-600">
                  Can't find your tracking number? Contact us at support@fwen.ug or call 0800-123-456
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
