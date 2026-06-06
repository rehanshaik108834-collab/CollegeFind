import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-display font-semibold text-lg">Campus<span className="text-primary-400">Find</span></span>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed max-w-xs">
              India's smartest college discovery platform. Compare, explore, and find your perfect institution.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-primary-300 text-sm">
              <li><Link to="/colleges" className="hover:text-white transition-colors">All Colleges</Link></li>
              <li><Link to="/colleges?type=Engineering" className="hover:text-white transition-colors">Engineering</Link></li>
              <li><Link to="/colleges?type=Management" className="hover:text-white transition-colors">Management</Link></li>
              <li><Link to="/colleges?type=Medical" className="hover:text-white transition-colors">Medical</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Compare Colleges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-primary-300 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/saved" className="hover:text-white transition-colors">Saved Colleges</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-400 text-xs">© 2024 CampusFind. Built for Track B — College Discovery Platform.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg text-primary-400 hover:text-white hover:bg-primary-800 transition-colors"><Globe size={16} /></a>
            <a href="#" className="p-2 rounded-lg text-primary-400 hover:text-white hover:bg-primary-800 transition-colors"><Mail size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
