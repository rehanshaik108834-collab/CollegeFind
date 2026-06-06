import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Heart, GitCompare, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useCompareStore } from '../../stores';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { ids } = useCompareStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/colleges', label: 'Explore' },
    { to: '/predictor', label: 'Predictor', badge: null },
    { to: '/discussions', label: 'Discussions', badge: null },
    { to: '/compare', label: 'Compare', badge: ids.length > 0 ? ids.length : null },
    ...(isAuthenticated ? [{ to: '/saved', label: 'Saved' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg text-primary-900 hidden sm:block">
              Campus<span className="text-primary-500">Find</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                {link.label}
                {link.badge ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-200">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <User size={13} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-primary-900">{user?.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-surface-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-surface-100 pt-3 mt-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700" onClick={() => setMobileOpen(false)}>
                <span>{link.label}</span>
                {link.badge ? <span className="w-5 h-5 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{link.badge}</span> : null}
              </Link>
            ))}
            <div className="pt-2 border-t border-surface-100">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={15} /> Sign out
                </button>
              ) : (
                <div className="flex gap-2 px-1">
                  <Link to="/login" className="flex-1 btn-secondary text-sm text-center py-2" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  <Link to="/register" className="flex-1 btn-primary text-sm text-center py-2" onClick={() => setMobileOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
