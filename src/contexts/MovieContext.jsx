import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const MovieContext = createContext({});

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen to user document changes
  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setFavorites([]);
      setWatched([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setWatchlist(data.watchlist || []);
        setFavorites(data.favorites || []);
        setWatched(data.watched || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Helper function to update user document
  const updateUserDocument = async (field, newArray) => {
    if (!user) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', user.uid), {
        [field]: newArray
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Watchlist functions
  const addToWatchlist = async (movie) => {
    if (!user) {
      toast.error('Please sign in to add movies to watchlist');
      return;
    }

    if (isInWatchlist(movie.id)) {
      toast.error('Movie already in watchlist');
      return;
    }

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: new Date().toISOString()
    };

    const newWatchlist = [...watchlist, movieData];
    await updateUserDocument('watchlist', newWatchlist);
    toast.success('Added to watchlist');
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return;

    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    await updateUserDocument('watchlist', newWatchlist);
    toast.success('Removed from watchlist');
  };

  // Favorites functions
  const addToFavorites = async (movie) => {
    if (!user) {
      toast.error('Please sign in to add movies to favorites');
      return;
    }

    if (isInFavorites(movie.id)) {
      toast.error('Movie already in favorites');
      return;
    }

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: new Date().toISOString()
    };

    const newFavorites = [...favorites, movieData];
    await updateUserDocument('favorites', newFavorites);
    toast.success('Added to favorites');
  };

  const removeFromFavorites = async (movieId) => {
    if (!user) return;

    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    await updateUserDocument('favorites', newFavorites);
    toast.success('Removed from favorites');
  };

  // Watched functions
  const addToWatched = async (movie) => {
    if (!user) {
      toast.error('Please sign in to mark movies as watched');
      return;
    }

    if (isWatched(movie.id)) {
      toast.error('Movie already marked as watched');
      return;
    }

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      watchedAt: new Date().toISOString()
    };

    const newWatched = [...watched, movieData];
    const newWatchlist = watchlist.filter(m => m.id !== movie.id); // Remove from watchlist

    // Update both watched and watchlist
    await Promise.all([
      updateUserDocument('watched', newWatched),
      updateUserDocument('watchlist', newWatchlist)
    ]);
    
    toast.success('Marked as watched');
  };

  const removeFromWatched = async (movieId) => {
    if (!user) return;

    const newWatched = watched.filter(movie => movie.id !== movieId);
    await updateUserDocument('watched', newWatched);
    toast.success('Removed from watched');
  };

  // Helper functions to check movie status
  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const isInFavorites = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const isWatched = (movieId) => {
    return watched.some(movie => movie.id === movieId);
  };

  // Get movie stats
  const getMovieStats = () => {
    return {
      watchlistCount: watchlist.length,
      favoritesCount: favorites.length,
      watchedCount: watched.length,
      totalMovies: watchlist.length + favorites.length + watched.length
    };
  };

  // Clear all lists (useful for sign out)
  const clearAllLists = () => {
    setWatchlist([]);
    setFavorites([]);
    setWatched([]);
  };

  const value = {
    // State
    watchlist,
    favorites,
    watched,
    loading,
    
    // Watchlist functions
    addToWatchlist,
    removeFromWatchlist,
    
    // Favorites functions
    addToFavorites,
    removeFromFavorites,
    
    // Watched functions
    addToWatched,
    removeFromWatched,
    
    // Helper functions
    isInWatchlist,
    isInFavorites,
    isWatched,
    getMovieStats,
    clearAllLists
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};