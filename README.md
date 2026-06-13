# CineMind AI

A personalized movie recommendation platform with a sleek, cinematic, dark-themed UI.

## Features
- **AI Recommendation Engine**: Content-based filtering built with TF-IDF vectors and cosine similarity, computed entirely client-side.
- **Dynamic Watch History**: Keep track of what you've watched, liked, and saved.
- **Cinematic UI**: Glassmorphism, smooth Framer Motion page transitions, and skeleton loading states.
- **TMDB Integration**: Millions of movies with live trailers.
- **Firebase Auth & Firestore**: Secure per-user data isolation.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_TMDB_API_KEY=your_tmdb_read_access_token_v4_or_v3_key
   ```

3. **Firebase Setup**
   - Enable Authentication (Email/Password & Google)
   - Enable Firestore Database
   - Deploy security rules: `firebase deploy --only firestore:rules`

4. **Build Movie Corpus (Optional, dummy corpus provided)**
   ```bash
   node scripts/buildMovieCorpus.mjs
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

## Production Deployment
Build the SPA and deploy to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

---
*This product uses the TMDB API but is not endorsed or certified by TMDB.*
