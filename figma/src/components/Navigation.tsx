import { MapPin, Truck, User, Home, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Page } from '../App';
import fwenLogo from 'figma:asset/bee263e0b6723324bbe9d3501714aaedf1074ff5.png';

interface NavigationProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
  isLoggedIn: boolean;
}

export function Navigation({ onNavigate, currentPage, isLoggedIn }: NavigationProps) {
  return (
    <nav className="bg-[#660000] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <img src={fwenLogo} alt="FWEN Logo" className="h-10 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={currentPage === 'home' ? 'secondary' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="text-white hover:text-[#DAA520] hover:bg-[#4d0000]"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant={currentPage === 'send-parcel' ? 'secondary' : 'ghost'}
              onClick={() => onNavigate('send-parcel')}
              className="text-white hover:text-[#DAA520] hover:bg-[#4d0000]"
            >
              <Package className="h-4 w-4 mr-2" />
              Send Package
            </Button>
            <Button
              variant={currentPage === 'track' ? 'secondary' : 'ghost'}
              onClick={() => onNavigate('track')}
              className="text-white hover:text-[#DAA520] hover:bg-[#4d0000]"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Track
            </Button>
            <Button
              variant={currentPage === 'last-mile' ? 'secondary' : 'ghost'}
              onClick={() => onNavigate('last-mile')}
              className="text-white hover:text-[#DAA520] hover:bg-[#4d0000]"
            >
              <Truck className="h-4 w-4 mr-2" />
              Last-Mile
            </Button>
          </div>

          <div>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                onClick={() => onNavigate('profile')}
                className="text-white hover:text-[#DAA520] hover:bg-[#4d0000]"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-[#DAA520] text-[#660000] hover:bg-[#C8941D]"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
