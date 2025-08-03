import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  MessageCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized device detection for performance
  const updateDeviceType = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setDeviceType('mobile');
    } else if (width < 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setScrolled(scrollTop > 20);
  }, []);

  // Device detection and responsive handling
  useEffect(() => {
    updateDeviceType();
    
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDeviceType, 150);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [updateDeviceType]);

  // Throttled scroll effect for performance
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 16); // ~60fps
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [dispatch, navigate]);

  // Memoized navigation items for performance
  const navigationItems = useMemo(() => [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4" />,
      description: 'Discover hotels in Nagpur',
      showOn: ['mobile', 'tablet', 'desktop'] as const
    },
    {
      name: 'Hotels',
      path: '/hotels',
      icon: <Search className="h-4 w-4" />,
      description: 'Search & book hotels',
      badge: 'Popular',
      showOn: ['mobile', 'tablet', 'desktop'] as const
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: <Compass className="h-4 w-4" />,
      description: 'Nagpur attractions & guide',
      badge: 'New',
      showOn: ['mobile', 'tablet', 'desktop'] as const
    },
    {
      name: 'About',
      path: '/about',
      icon: <Info className="h-4 w-4" />,
      description: 'About QuickStay',
      showOn: ['tablet', 'desktop'] as const
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Phone className="h-4 w-4" />,
      description: 'Get support',
      showOn: ['tablet', 'desktop'] as const
    }
  ], []);

  const isActivePath = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const getUserInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-600';
      case 'hotelOwner': return 'from-blue-500 to-blue-600';
      default: return 'from-green-500 to-green-600';
    }
  }, []);

  const getRoleLabel = useCallback((role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'hotelOwner': return 'Hotel Owner';
      default: return 'Traveler';
    }
  }, []);

  // Filter navigation items based on device
  const visibleNavItems = useMemo(() => 
    navigationItems.filter(item => item.showOn.includes(deviceType)),
    [navigationItems, deviceType]
  );

  // Responsive sizing configuration
  const config = useMemo(() => ({
    logoSize: deviceType === 'mobile' ? 'h-5 w-5' : 'h-6 w-6',
    headerHeight: deviceType === 'mobile' ? 'h-14' : 'h-16',
    padding: deviceType === 'mobile' ? 'px-4' : 'px-4 sm:px-6 lg:px-8',
    fontSize: deviceType === 'mobile' ? 'text-sm' : 'text-base',
    spacing: deviceType === 'mobile' ? 'space-x-2' : 'space-x-3'
  }), [deviceType]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-200' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}
      role="banner"
    >
      <div className={`max-w-7xl mx-auto ${config.padding}`}>
        <div className={`flex justify-between items-center ${config.headerHeight}`}>
          {/* Logo - Responsive */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 md:space-x-3 group focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
            aria-label="QuickStay Home"
          >
            <div className={`bg-gradient-to-r from-orange-500 to-red-600 p-2 md:p-2.5 rounded-xl group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-300 ${
              scrolled ? 'shadow-lg' : ''
            }`}>
              <Hotel className={`${config.logoSize} text-white`} aria-hidden="true" />
            </div>
            <div>
              <span className={`${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-gray-900 group-hover:text-orange-600 transition-colors`}>
                QuickStay
              </span>
              <div className="flex items-center space-x-1 text-xs text-orange-600">
                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" aria-hidden="true" />
                <span className="font-medium">Nagpur</span>
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" aria-hidden="true"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-3 xl:px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isActivePath(item.path)
                    ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 shadow-sm'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50'
                }`}
                aria-current={isActivePath(item.path) ? 'page' : undefined}
              >
                <div className={`transition-transform duration-300 ${
                  isActivePath(item.path) ? 'scale-110' : 'group-hover:scale-110'
                }`} aria-hidden="true">
                  {item.icon}
                </div>
                <span className="text-sm xl:text-base">{item.name}</span>
                
                {/* Badge */}
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    item.badge === 'New' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`} aria-label={`${item.name} is ${item.badge}`}>
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip - Desktop only */}
                {deviceType === 'desktop' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
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
            <div className={`inline-flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
              isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`} aria-label={`Connection status: ${isOnline ? 'Online' : 'Offline'}`}>
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              } ${isOnline ? 'animate-pulse' : ''}`} aria-hidden="true"></div>
              {isOnline ? <Wifi className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" /> : <WifiOff className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />}
              <span className="hidden sm:inline">{isOnline ? 'Live' : 'Offline'}</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold" aria-label="3 unread notifications">
                      3
                    </span>
                  </button>
                </div>
                
                {/* Quick Actions - Desktop Only */}
                {deviceType === 'desktop' && (
                  <div className="hidden xl:flex items-center space-x-2">
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isActivePath('/dashboard')
                          ? 'text-orange-600 bg-orange-50 shadow-sm'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isActivePath('/admin')
                            ? 'text-purple-600 bg-purple-50 shadow-sm'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        <span>Admin</span>
                      </Link>
                    )}

                    {user?.role === 'hotelOwner' && (
                      <Link
                        to="/dashboard/add-hotel"
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Building className="h-4 w-4" aria-hidden="true" />
                        <span>Add Hotel</span>
                      </Link>
                    )}
                  </div>
                )}
                
                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-orange-600 transition-colors p-2 rounded-xl hover:bg-orange-50 group focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="User menu"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className={`${deviceType === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r ${getRoleColor(user?.role || 'user')} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 text-sm`}>
                      {user?.name ? getUserInitials(user.name) : <User className="h-4 w-4" aria-hidden="true" />}
                    </div>
                    {deviceType !== 'mobile' && (
                      <div className="text-left">
                        <div className="font-medium text-sm">{user?.name}</div>
                        <div className="text-xs text-gray-500">{getRoleLabel(user?.role || 'user')}</div>
                      </div>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  
                  {showUserMenu && (
                    <div 
                      className={`absolute right-0 mt-2 ${deviceType === 'mobile' ? 'w-64' : 'w-72'} bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-scale-in`}
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {/* User Info Header */}
                      <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`${deviceType === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-r ${getRoleColor(user?.role || 'user')} rounded-full flex items-center justify-center text-white font-bold`}>
                            {user?.name ? getUserInitials(user.name) : <User className="h-5 w-5" aria-hidden="true" />}
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
                                  <Star className="h-3 w-3 text-yellow-500" aria-hidden="true" />
                                  <span className="text-xs text-gray-600 font-medium">{user.loyaltyPoints} pts</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2" role="none">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                          role="menuitem"
                        >
                          <User className="h-4 w-4" aria-hidden="true" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                          role="menuitem"
                        >
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          <span>My Bookings</span>
                        </Link>
                        
                        {user?.role === 'hotelOwner' && (
                          <>
                            <Link
                              to="/dashboard/add-hotel"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                              role="menuitem"
                            >
                              <Building className="h-4 w-4" aria-hidden="true" />
                              <span>Add Hotel</span>
                            </Link>
                            <Link
                              to="/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                              role="menuitem"
                            >
                              <Hotel className="h-4 w-4" aria-hidden="true" />
                              <span>Manage Hotels</span>
                            </Link>
                          </>
                        )}

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                            role="menuitem"
                          >
                            <Shield className="h-4 w-4" aria-hidden="true" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2" role="none">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 md:px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left focus:outline-none focus:bg-red-50"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
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
                  className={`text-gray-700 hover:text-orange-600 font-medium transition-colors px-3 md:px-4 py-2 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 ${config.fontSize}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${config.fontSize}`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50 mobile-menu focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t py-4 animate-fade-in mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isActivePath(item.path)
                      ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-red-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActivePath(item.path) ? 'page' : undefined}
                >
                  <div aria-hidden="true">{item.icon}</div>
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
                  <div className="border-t border-gray-200 my-3" role="none"></div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {user?.role === 'hotelOwner' && (
                    <Link
                      to="/dashboard/add-hotel"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building className="h-4 w-4" aria-hidden="true" />
                      <span>Add Hotel</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;