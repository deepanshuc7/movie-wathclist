import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useMovies } from './contexts/MovieContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import MovieGrid from './components/Movies/MovieGrid';
import SearchBar from './components/Movies/SearchBar';
import LoadingSpinner from './components/Layout/LoadingSpinner';
import tmdbService from './services/tmdbService';
import toast from 'react-hot-toast';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { watchlist, favorites, watched } = useMovies();
  const [currentView, setCurrentView] = useState('discover');
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load initial movies when component mounts
  useEffect(() => {
    if (user && currentView === 'discover') {
      loadMovies('popular');
    }
  }, [user, currentView]);

  const loadMovies = async (type = 'popular', page = 1) => {
    try {
      setLoading(true);
      let response;
      
      switch (type) {
        case 'popular':
          response = await tmdbService.getPopularMovies(page);
          break;
        case 'top_rated':
          response = await tmdbService.getTopRatedMovies(page);
          break;
        case 'upcoming':
          response = await tmdbService.getUpcomingMovies(page);
          break;
        default:
          response = await tmdbService.getPopularMovies(page);
      }
      
      setMovies(response.results || []);
    } catch (error) {
      console.error('Error loading movies:', error);
      toast.error('Failed to load movies');
      // Fallback to mock data if API fails
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMovies('popular');
      return;
    }

    try {
      setLoading(true);
      const response = await tmdbService.searchMovies(searchTerm);
      setMovies(response.results || []);
      toast.success(`Found ${response.results?.length || 0} movies`);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast.error('Search failed. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'discover':
        return (
          <div>
            <div className="mb-6">
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
              />
              
              {/* Movie category buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <button
                  onClick={() => loadMovies('popular')}
                  className="btn-primary"
                >
                  Popular
                </button>
                <button
                  onClick={() => loadMovies('top_rated')}
                  className="btn-primary"
                >
                  Top Rated
                </button>
                <button
                  onClick={() => loadMovies('upcoming')}
                  className="btn-primary"
                >
                  Upcoming
                </button>
              </div>
            </div>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <MovieGrid movies={movies} title="Discover Movies" />
            )}
          </div>
        );
      
      case 'watchlist':
        return <MovieGrid movies={watchlist} title="Your Watchlist" />;
      
      case 'favorites':
        return <MovieGrid movies={favorites} title="Your Favorites" />;
      
      case 'watched':
        return <MovieGrid movies={watched} title="Watched Movies" />;
      
      default:
        return <MovieGrid movies={movies} title="Discover Movies" />;
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;