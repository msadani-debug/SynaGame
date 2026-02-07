// This file tells Vite how to build and serve our game
// Vite is a tool that helps us run our game in the browser

import { defineConfig } from 'vite';

export default defineConfig({
  // The base path for our game (can be changed when deploying)
  base: './',

  // Server settings for when we run the game locally
  server: {
    port: 3000, // The game will run on http://localhost:3000
    open: true  // Automatically open the browser when we start the game
  },

  // Build settings for when we want to publish the game
  build: {
    outDir: 'dist', // Where the final game files will go
    assetsDir: 'assets', // Where images and sounds will go (when we add them later)
    minify: 'terser', // Makes the final game files smaller
    sourcemap: false // We don't need debug files for the final version
  }
});
