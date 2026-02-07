// This is the main file that starts our game
// It tells Phaser how big the game should be and which scenes to use

// Import Phaser library (the game engine we're using)
import Phaser from 'phaser';

// Import our main game scene (we'll create this next)
import MainScene from './scenes/MainScene.js';

// ============================================
// GAME CONFIGURATION
// ============================================
// This object tells Phaser how to set up our game
const config = {
  // What type of rendering to use (AUTO means Phaser picks the best one)
  type: Phaser.AUTO,

  // Game canvas size
  width: 800,  // Game width in pixels
  height: 600, // Game height in pixels

  // Where to put the game on the webpage
  parent: 'game-container', // The ID from our HTML file

  // Background color (dark gray)
  backgroundColor: '#2d2d2d',

  // Physics settings (we'll use this later for jumping and gravity)
  physics: {
    default: 'arcade', // Arcade physics is simple and perfect for our game
    arcade: {
      gravity: { y: 0 }, // No gravity yet (we'll add it when we add the player)
      debug: false // Set to true to see physics boundaries (helpful for debugging)
    }
  },

  // Scenes are like different "screens" in our game
  // For now, we only have one scene (MainScene)
  scene: [MainScene],

  // Scale settings (makes the game work on different screen sizes)
  scale: {
    mode: Phaser.Scale.FIT, // Fit the game to the screen
    autoCenter: Phaser.Scale.CENTER_BOTH // Center the game on the screen
  }
};

// ============================================
// START THE GAME
// ============================================
// Create a new Phaser game with our configuration
const game = new Phaser.Game(config);

// Log a message to the console so we know the game started
console.log('🎮 Game initialized!');
