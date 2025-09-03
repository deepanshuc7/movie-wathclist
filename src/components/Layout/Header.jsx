import React from 'react';
import { LogOut, User, Heart, Clock, Eye, Film } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMovies } from '../../contexts/MovieContext';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { getMovieStats } = useMovies();
  const stats = getMovieStats();

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Film },
    { id: 'watchlist', label: 'Watchlist', icon: Clock, count: stats.watchlistCount },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: stats.favoritesCount },
    { id: 'watched', label: 'Watched', icon: Eye, count: stats.watchedCount },
  ];

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MovieList
          </h1>
          
          <nav className="flex space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === item.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      currentView === item.id 
                        ? 'bg-blue-700' 
                        : 'bg-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.displayName || user?.email?.split('@')[0]}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MovieList
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm">
                <User className="w-4 h-4" />
                <span>{user?.displayName || user?.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="flex space-x-2 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    currentView === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-1 py-0.5 text-xs rounded-full ${
                      currentView === item.id 
                        ? 'bg-blue-700' 
                        : 'bg-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;