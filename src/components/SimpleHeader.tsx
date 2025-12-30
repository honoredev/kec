import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, TrendingUp, Heart, Activity, Gavel } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import LoginModal from "./LoginModal";

const navItems = [
  { to: "/", label: "Home", icon: <Home className="w-4 h-4 mr-2" /> },
  { to: "/politics", label: "Politics", icon: <Activity className="w-4 h-4 mr-2" /> },
  { to: "/economics", label: "Economics", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
  { to: "/sports", label: "Sports", icon: <Activity className="w-4 h-4 mr-2" /> },
  { to: "/health", label: "Health", icon: <Heart className="w-4 h-4 mr-2" /> },
  { to: "/entertainment", label: "Entertainment", icon: <Activity className="w-4 h-4 mr-2" /> },
  { to: "/auctions", label: "Auctions", icon: <Gavel className="w-4 h-4 mr-2" /> },
];

const SimpleHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="fixed w-full top-0 z-50 bg-gradient-to-r from-green-600 to-green-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-white">KEC</span>
              <div className="text-xs text-white/70 hidden sm:block">Kigali Eye Channel</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center rounded-lg",
                    isActive 
                      ? "bg-green-700 text-white" 
                      : "text-white hover:bg-green-700/50"
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Login Button */}
            <Button
              onClick={() => setShowLoginModal(true)}
              className="w-10 h-10 p-0 rounded-full bg-white text-green-600 hover:bg-green-50"
              size="icon"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden w-10 h-10 text-white",
                isMenuOpen ? "bg-green-700" : "hover:bg-green-700/50"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white rounded-b-xl mx-2 mb-2 shadow-lg">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                      isActive 
                        ? "bg-green-50 text-green-600" 
                        : "text-gray-600 hover:bg-green-50/50 hover:text-green-600"
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
              
              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default SimpleHeader;