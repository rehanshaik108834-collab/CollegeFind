import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, GraduationCap, TrendingUp, Star, Shield, Users, BookOpen, Zap } from 'lucide-react';
import { useState } from 'react';
import { collegesApi } from '../api';
import { CollegeCard } from '../components/college/CollegeCard';
import { CollegeCardSkeleton } from '../components/ui/Skeleton';
import { formatPackage } from '../utils';

const STATS = [
  { icon: GraduationCap, value: '20+', label: 'Top Colleges', color: 'text-primary-600 bg-primary-50' },
  { icon: Users, value: '50K+', label: 'Students Helped', color: 'text-purple-600 bg-purple-50' },
  { icon: TrendingUp, value: '₹35L', label: 'Highest Package', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Star, value: '4.8', label: 'Avg Platform Rating', color: 'text-amber-600 bg-amber-50' },
];

const FEATURES = [
  { icon: Search, title: 'Smart Search', desc: 'Search by name, city, state or course. Find exactly what you need.' },
  { icon: Zap, title: 'Advanced Filters', desc: 'Filter by fees, rating, type, state and sort to your preference.' },
  { icon: Shield, title: 'Verified Data', desc: 'All college data is verified and updated regularly for accuracy.' },
  { icon: BookOpen, title: 'Compare Colleges', desc: 'Compare up to 3 colleges side-by-side across all key metrics.' },
];

export function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-colleges'],
    queryFn: collegesApi.getFeatured,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
    else navigate('/colleges');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary-200">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              India's #1 College Discovery Platform
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">
                College in India
              </span>
            </h1>
            <p className="text-primary-200 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Explore, compare, and discover top colleges across India.
              Make data-driven decisions with real placement stats and verified information.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden p-1.5">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by college name, city, or state..."
                    className="flex-1 text-gray-800 placeholder-gray-400 text-sm py-2.5 outline-none bg-transparent"
                  />
                </div>
                <button type="submit" className="btn-primary text-sm px-6 py-2.5 rounded-xl flex-shrink-0">
                  Search
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span className="text-primary-400 text-sm">Popular:</span>
              {['IIT', 'IIM', 'BITS', 'AIIMS', 'NIT'].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/colleges?search=${term}`)}
                  className="text-sm text-primary-200 hover:text-white border border-primary-700 hover:border-primary-500 rounded-full px-3 py-1 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1200 60 900 0 720 20C540 40 240 0 0 30L0 60Z" fill="#fafaf9"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="card p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="font-display font-bold text-2xl text-primary-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-500 text-sm font-medium mb-1 uppercase tracking-wide">Top Picks</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-900">
              Featured Colleges
            </h2>
            <p className="text-gray-500 text-sm mt-1">Highest rated institutions across India</p>
          </div>
          <Link to="/colleges" className="btn-secondary text-sm flex items-center gap-2 hidden sm:flex">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)
            : featured?.slice(0, 6).map((college, i) => (
                <CollegeCard key={college.id} college={college} index={i} />
              ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/colleges" className="btn-primary inline-flex items-center gap-2">
            Explore All Colleges <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-medium uppercase tracking-wide mb-2">Why CampusFind</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-900">
              Everything you need to decide
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200">
                <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <f.icon size={20} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Start your college search today
            </h2>
            <p className="text-primary-200 mb-8 text-lg max-w-xl mx-auto">
              Join thousands of students who found their dream college using CampusFind.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/colleges" className="bg-white text-primary-700 font-semibold px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2">
                Browse Colleges <ArrowRight size={16} />
              </Link>
              <Link to="/compare" className="border border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Compare Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
