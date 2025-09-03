import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No movies found</h3>
          <p className="text-gray-500">
            {title === "Your Watchlist" && "Movies you add to your watchlist will appear here."}
            {title === "Your Favorites" && "Movies you mark as favorites will appear here."}
            {title === "Watched Movies" && "Movies you've watched will appear here."}
            {title === "Discover Movies" && "Try searching for movies or check your connection."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;