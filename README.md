# 🎬 Movie Watchlist App

A modern, responsive movie watchlist application built with React, Vite, Firebase, and The Movie Database (TMDB) API. Users can discover movies, manage their watchlist, favorites, and track watched movies with Firebase authentication.
[link](https://movie-watchlist-web.netlify.app/)

## ✨ Features

- **🔐 User Authentication**: Firebase Auth with email/password and Google sign-in
- **🎭 Movie Discovery**: Browse popular, top-rated, and upcoming movies
- **🔍 Search Functionality**: Search for movies using TMDB API
- **📋 Watchlist Management**: Add/remove movies to/from watchlist
- **❤️ Favorites**: Mark movies as favorites
- **✅ Watched Movies**: Track movies you've already watched
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔄 Real-time Sync**: Data syncs across devices using Firestore
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **API**: The Movie Database (TMDB) API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deepanshuc7/movie-watchlist.git
   cd movie-watchlist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Get your Firebase config

4. **Set up TMDB API**
   - Go to [TMDB](https://www.themoviedb.org/)
   - Create an account and get your API key

5. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase and TMDB credentials:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your_app_
