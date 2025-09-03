import React, { useState } from 'react';
import { Heart, Clock, Eye, Star } from 'lucide-react';
import { useMovies } from '../../contexts/MovieContext';
import tmdbService from '../../services/tmdbService';

const MovieCard = ({ movie }) => {
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatched,
    removeFromWatched,
    isInWatchlist,
    isInFavorites,
    isWatched,
    loading: movieLoading
  } = useMovies();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);
  const watched = isWatched(movie.id);

  const handleWatchlistClick = async () => {
    if (movieLoading) return;
    
    if (inWatchlist) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  const handleFavoritesClick = async () => {
    if (movieLoading) return;
    
    if (inFavorites) {
      await removeFromFavorites(movie.id);
    } else {
      await addToFavorites(movie);
    }
  };

  const handleWatchedClick = async () => {
    if (movieLoading) return;
    
    if (watched) {
      await removeFromWatched(movie.id);
    } else {
      await addToWatched(movie);
    }
  };

  const posterUrl = movie.poster_path 
    ? tmdbService.getImageUrl(movie.poster_path) 
    : '/placeholder-movie.jpg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 movie-card group">
      {/* Movie Poster */}
      <div className="relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="w-full h-80 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-4xl">🎬</div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className={`w-full h-80 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-80 bg-gray-200 flex flex-col items-center justify-center">
            <div className="text-gray-400 text-4xl mb-2">🎬</div>
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button
              onClick={handleWatchlistClick}
              disabled={movieLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                inWatchlist
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Clock className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleFavoritesClick}
              disabled={movieLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                inFavorites
                  ? 'bg-red-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              title={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${inFavorites ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleWatchedClick}
              disabled={movieLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                watched
                  ? 'bg-green-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              title={watched ? 'Mark as not watched' : 'Mark as watched'}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rating badge */}
        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{releaseYear}</span>
          <div className="flex space-x-2">
            {inWatchlist && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Watchlist
              </span>
            )}
            {inFavorites && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                Favorite
              </span>
            )}
            {watched && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Watched
              </span>
            )}
          </div>
        </div>

        {movie.overview && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {movie.overview}
          </p>
        )}

        {/* Action buttons for mobile */}
        <div className="flex space-x-2 md:hidden">
          <button
            onClick={handleWatchlistClick}
            disabled={movieLoading}
            className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
              inWatchlist
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            {inWatchlist ? 'Listed' : 'List'}
          </button>
          
          <button
            onClick={handleFavoritesClick}
            disabled={movieLoading}
            className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
              inFavorites
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 hover:bg-red-100 text-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 mr-1 ${inFavorites ? 'fill-current' : ''}`} />
            {inFavorites ? 'Liked' : 'Like'}
          </button>
          
          <button
            onClick={handleWatchedClick}
            disabled={movieLoading}
            className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
              watched
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 hover:bg-green-100 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 mr-1" />
            {watched ? 'Seen' : 'Mark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;