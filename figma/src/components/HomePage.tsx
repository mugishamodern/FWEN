import { Package, MapPin, Truck, TrendingUp, Shield, Zap, Heart, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Navigation } from './Navigation';
import { Page } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import fwenLogo from 'figma:asset/bee263e0b6723324bbe9d3501714aaedf1074ff5.png';
import deliveryPerson from 'figma:asset/1cde2be07a254cb66bac0ce209fc5bb42883339f.png';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
}

export function HomePage({ onNavigate, isLoggedIn }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Navigation onNavigate={onNavigate} currentPage="home" isLoggedIn={isLoggedIn} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#660000] to-[#4d0000] text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#DAA520]/20 border border-[#DAA520] rounded-full px-4 py-2 mb-6">
                <Heart className="h-4 w-4 text-[#DAA520]" />
                <span className="text-sm text-[#DAA520]">Built for Everyone with Love</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl mb-6 text-[#DAA520]">
                Send Packages Across Uganda with Ease
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                More than just packages—we connect communities across Uganda with reliable service you can trust, backed by the warmth of Ugandan hospitality.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <Button
                  onClick={() => onNavigate('send-parcel')}
                  size="lg"
                  className="bg-[#DAA520] text-[#660000] hover:bg-[#C8941D]"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Send Package
                </Button>
                <Button
                  onClick={() => onNavigate('track')}
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#660000] hover:bg-gray-100 border-2"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Track Shipment
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#DAA520]" />
                  <div>
                    <p className="text-[#DAA520]">Real-time</p>
                    <p className="text-gray-300 text-xs">Tracking</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#DAA520]" />
                  <div>
                    <p className="text-[#DAA520]">100%</p>
                    <p className="text-gray-300 text-xs">Secure Delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#DAA520]" />
                  <div>
                    <p className="text-[#DAA520]">AI-Powered</p>
                    <p className="text-gray-300 text-xs">Smart Routes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#DAA520]">
                  <img 
                    src={deliveryPerson} 
                    alt="Trusted delivery person with packages" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating Trust Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#660000] rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[#DAA520]" />
                  </div>
                  <div>
                    <p className="text-[#660000]">Trusted Service</p>
                    <p className="text-sm text-gray-600">Since 2024</p>
                  </div>
                </div>

                {/* Floating Community Badge */}
                <div className="absolute -top-6 -right-6 bg-[#DAA520] rounded-xl shadow-xl p-4 text-center">
                  <Users className="h-8 w-8 text-[#660000] mx-auto mb-2" />
                  <p className="text-[#660000]">135 Districts</p>
                  <p className="text-xs text-[#660000]/80">Connected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-[#660000]">Why Choose FWEN?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#660000] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#660000] p-4 rounded-full">
                    <TrendingUp className="h-8 w-8 text-[#DAA520]" />
                  </div>
                </div>
                <h3 className="text-center mb-3 text-[#660000]">AI-Powered Routing</h3>
                <p className="text-center text-gray-600">
                  Our AI analyzes traffic patterns, bus schedules, and historical data to provide optimal routes and accurate delivery times
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#660000] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#660000] p-4 rounded-full">
                    <Package className="h-8 w-8 text-[#DAA520]" />
                  </div>
                </div>
                <h3 className="text-center mb-3 text-[#660000]">District-to-District Coverage</h3>
                <p className="text-center text-gray-600">
                  Connect all Ugandan districts with reliable bus-based delivery and optional last-mile service to your doorstep
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#660000] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#660000] p-4 rounded-full">
                    <Shield className="h-8 w-8 text-[#DAA520]" />
                  </div>
                </div>
                <h3 className="text-center mb-3 text-[#660000]">Secure Payments</h3>
                <p className="text-center text-gray-600">
                  Pay safely with Mobile Money (MTN/Airtel) or Visa with built-in AI fraud detection for your protection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-[#660000]">How It Works</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#660000] text-[#DAA520] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="mb-2 text-[#660000]">Create Your Account</h3>
                <p className="text-gray-600">Sign up with your details and link your Mobile Money or Visa card for seamless payments</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#660000] text-[#DAA520] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="mb-2 text-[#660000]">Book Your Delivery</h3>
                <p className="text-gray-600">Enter sender and recipient details. Our AI suggests the best route and calculates cost instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#660000] text-[#DAA520] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="mb-2 text-[#660000]">Track in Real-Time</h3>
                <p className="text-gray-600">Monitor your parcel's journey with live updates and AI-powered ETA predictions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#660000] text-[#DAA520] rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="mb-2 text-[#660000]">Last-Mile Delivery (Optional)</h3>
                <p className="text-gray-600">Schedule a boda or taxi to deliver from the bus terminal to the recipient's doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#660000] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-[#DAA520]">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of Ugandans using FWEN for reliable district-to-district deliveries
          </p>
          <Button
            onClick={() => onNavigate(isLoggedIn ? 'send-parcel' : 'signup')}
            size="lg"
            className="bg-[#DAA520] text-[#660000] hover:bg-[#C8941D]"
          >
            {isLoggedIn ? 'Send Your First Parcel' : 'Create Free Account'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={fwenLogo} alt="FWEN Logo" className="h-12 w-auto" />
          </div>
          <p className="text-gray-400">
            AI-Powered District-to-District Delivery Platform for Uganda
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 FWEN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
