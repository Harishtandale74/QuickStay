import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Hotel, 
  Search, 
  Settings,
  Home,
  MapPin,
  Calendar,
  Star,
  Phone,
  Info,
  ChevronDown,
  Bell,
  Shield,
  Compass,
  Building,
  MessageCircle
} from 'lucide-react';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import NotificationCenter from '../RealTime/NotificationCenter';
import ConnectionStatus from '../RealTime/ConnectionStatus';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Device detection and responsive handling
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
        setShowUserMenu(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  // Navigation items with device-specific visibility
  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4" />,
      description: 'Discover hotels in Nagpur',
      showOn: ['mobile', 'tablet', 'desktop']
    },
    {
      name: 'Hotels',
      path: '/hotels',
      icon: <Search className="h-4 w-4" />,
      description: 'Search & book hotels',
      badge: 'Popular',
      showOn: ['mobile', 'tablet', 'desktop']
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: <Compass className="h-4 w-4" />,
      description: 'Nagpur attractions & guide',
      badge: 'New',
      showOn: ['mobile', 'tablet', 'desktop']
    },
    {
      name: 'About',
      path: '/about',
      icon: <Info className="h-4 w-4" />,
      description: 'About QuickStay',
      showOn: ['tablet', 'desktop']
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Phone className="h-4 w-4" />,
      description: 'Get support',
      showOn: ['tablet', 'desktop']
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-600';
      case 'hotelOwner': return 'from-blue-500 to-blue-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'hotelOwner': return 'Hotel Owner';
      default: return 'Traveler';
    }
  };

  // Filter navigation items based on device
  const visibleNavItems = navigationItems.filter(item => 
    item.showOn.includes(deviceType)
  );

  // Responsive sizing
  const logoSize = deviceType === 'mobile' ? 'h-5 w-5' : 'h-6 w-6';
  const headerHeight = deviceType === 'mobile' ? 'h-14' : 'h-16';
  const padding = deviceType === 'mobile' ? 'px-4' : 'px-4 sm:px-6 lg:px-8';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-200' 
        : 'bg-white shadow-sm border-b border-gray-200'
    }`}>
      <div className={`max-w-7xl mx-auto ${padding}`}>
        <div className={`flex justify-between items-center ${headerHeight}`}>
          {/* Logo - Responsive */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className={`bg-gradient-to-r from-orange-500 to-red-600 p-2 md:p-2.5 rounded-xl group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-300 ${
              scrolled ? 'shadow-lg' : ''
            }`}>
              <Hotel className={`${logoSize} text-white`} />
            </div>
            <div>
              <span className={`${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-gray-900 group-hover:text-orange-600 transition-colors`}>
                QuickStay
              </span>
              <div className="flex items-center space-x-1 text-xs text-orange-600">
                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span className="font-medium">Nagpur</span>
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-3 xl:px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActivePath(item.path)
                    ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 shadow-sm'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50'
                }`}
              >
                <div className={`transition-transform duration-300 ${
                  isActivePath(item.path) ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <span className="text-sm xl:text-base">{item.name}</span>
                
                {/* Badge */}
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    item.badge === 'New' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip - Desktop only */}
                {deviceType === 'desktop' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.description}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Connection Status */}
            <ConnectionStatus />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Notifications */}
                <NotificationCenter />
                
                {/* Quick Actions - Desktop Only */}
                {deviceType === 'desktop' && (
                  <div className="hidden xl:flex items-center space-x-2">
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        isActivePath('/dashboard')
                          ? 'text-orange-600 bg-orange-50 shadow-sm'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                          isActivePath('/admin')
                            ? 'text-purple-600 bg-purple-50 shadow-sm'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}

                    {user?.role === 'hotelOwner' && (
                      <Link
                        to="/dashboard/add-hotel"
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 text-sm"
                      >
                        <Building className="h-4 w-4" />
                        <span>Add Hotel</span>
                      </Link>
                    )}
                  </div>
                )}
                
                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-orange-600 transition-colors p-2 rounded-xl hover:bg-orange-50 group"
                  >
                    <div className={`${deviceType === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r ${getRoleColor(user?.role || 'user')} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 text-sm`}>
                      {user?.name ? getUserInitials(user.name) : <User className="h-4 w-4" />}
                    </div>
                    {deviceType !== 'mobile' && (
                      <div className="text-left">
                        <div className="font-medium text-sm">{user?.name}</div>
                        <div className="text-xs text-gray-500">{getRoleLabel(user?.role || 'user')}</div>
                      </div>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 ${deviceType === 'mobile' ? 'w-64' : 'w-72'} bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-scale-in`}>
                      {/* User Info Header */}
                      <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`${deviceType === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-r ${getRoleColor(user?.role || 'user')} rounded-full flex items-center justify-center text-white font-bold`}>
                            {user?.name ? getUserInitials(user.name) : <User className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm md:text-base">{user?.name}</p>
                            <p className="text-xs md:text-sm text-gray-600">{user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user?.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-700'
                                  : user?.role === 'hotelOwner'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {getRoleLabel(user?.role || 'user')}
                              </span>
                              {user?.loyaltyPoints && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-gray-600 font-medium">{user.loyaltyPoints} pts</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                        
                        {user?.role === 'hotelOwner' && (
                          <>
                            <Link
                              to="/dashboard/add-hotel"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Building className="h-4 w-4" />
                              <span>Add Hotel</span>
                            </Link>
                            <Link
                              to="/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Hotel className="h-4 w-4" />
                              <span>Manage Hotels</span>
                            </Link>
                          </>
                        )}

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-3">
                <Link
                  to="/login"
                  className={`text-gray-700 hover:text-orange-600 font-medium transition-colors px-3 md:px-4 py-2 rounded-lg hover:bg-orange-50 ${
                    deviceType === 'mobile' ? 'text-sm' : 'text-base'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    deviceType === 'mobile' ? 'text-sm' : 'text-base'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50 mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 animate-fade-in mobile-menu">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-red-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          item.badge === 'New' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-3"></div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {user?.role === 'hotelOwner' && (
                    <Link
                      to="/dashboard/add-hotel"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building className="h-4 w-4" />
                      <span>Add Hotel</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;