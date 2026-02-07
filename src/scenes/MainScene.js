// This is our main game scene
// A "scene" is like a screen in the game where things happen
// This is where the actual gameplay happens!

import Phaser from 'phaser';
import Player from '../Player.js';

// ============================================
// MAIN SCENE CLASS
// ============================================
export default class MainScene extends Phaser.Scene {
  constructor() {
    // Every scene needs a unique key/name
    super({ key: 'MainScene' });
  }

  // ============================================
  // CREATE METHOD
  // ============================================
  // This method runs once when the scene starts
  // We use it to set up everything we need
  create() {
    console.log('🎬 MainScene started - Phase 2!');

    // Get the width and height of our game screen
    const width = this.scale.width;
    const height = this.scale.height;

    // ----------------------------------------
    // CREATE GRADIENT BACKGROUND
    // ----------------------------------------
    // Same gradient from Phase 1 (blue to purple)
    const graphics = this.add.graphics();
    const gradientSteps = 20;
    const stepHeight = height / gradientSteps;

    for (let i = 0; i < gradientSteps; i++) {
      const blueValue = 0x4a90e2;
      const purpleValue = 0x9b59b6;

      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(blueValue),
        Phaser.Display.Color.ValueToColor(purpleValue),
        gradientSteps,
        i
      );

      graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
      graphics.fillRect(0, i * stepHeight, width, stepHeight);
    }

    // ----------------------------------------
    // CREATE GROUND LINE
    // ----------------------------------------
    // Draw a line to show where the ground is
    // This helps visualize where the player will run
    const groundY = height - 100; // Ground is 100 pixels from the bottom

    // Draw a thick white line for the ground
    const ground = this.add.rectangle(
      width / 2, // X position (center)
      groundY, // Y position
      width, // Width (full screen width)
      5, // Height (thin line)
      0xffffff, // White color
      0.5 // 50% transparent
    );

    // ----------------------------------------
    // CREATE LANE MARKERS (for debugging)
    // ----------------------------------------
    // Draw vertical lines to show where the 3 lanes are
    // This helps us see if the player is moving to the right positions

    const lanes = [-150, 0, 150]; // Same lane positions as in Player.js

    for (let laneOffset of lanes) {
      this.add.rectangle(
        width / 2 + laneOffset, // X position
        height / 2, // Y position (center height)
        2, // Width (thin line)
        height, // Height (full screen)
        0xffffff, // White color
        0.2 // 20% transparent (very faint)
      );
    }

    // ----------------------------------------
    // CREATE THE PLAYER
    // ----------------------------------------
    // Create the player in the center lane, just above the ground
    this.player = new Player(
      this, // Pass the scene to the player
      width / 2, // X position (center of screen)
      groundY - 30 // Y position (just above the ground)
    );

    console.log('✅ Player created');

    // ----------------------------------------
    // SET UP KEYBOARD CONTROLS
    // ----------------------------------------
    // Create keyboard input handlers for arrow keys and spacebar
    this.cursors = this.input.keyboard.createCursorKeys(); // Arrow keys
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Track if keys were just pressed (to prevent holding down keys)
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;

    // ----------------------------------------
    // SET UP TOUCH/SWIPE CONTROLS
    // ----------------------------------------
    // Add touch input for mobile devices
    this.input.on('pointerdown', (pointer) => {
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      // Calculate how far the finger moved
      const deltaX = pointer.x - this.touchStartX;
      const deltaY = pointer.y - this.touchStartY;

      // Minimum distance to count as a swipe (prevents accidental taps)
      const minSwipeDistance = 30;

      // Check if horizontal swipe (left or right)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // Swiped right
            this.player.moveRight();
          } else {
            // Swiped left
            this.player.moveLeft();
          }
        }
      } else {
        // Vertical swipe (up or down)
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY < 0) {
            // Swiped up
            this.player.jump();
          } else {
            // Swiped down
            this.player.duck();
          }
        }
      }
    });

    // ----------------------------------------
    // ADD STATUS TEXT
    // ----------------------------------------
    // Show that Phase 2 is running
    this.statusText = this.add.text(
      width / 2,
      30,
      '🎮 All Out Rush - Phase 2 Complete!',
      {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    this.statusText.setOrigin(0.5, 0.5);

    // Add instructions
    this.instructionsText = this.add.text(
      width / 2,
      height - 20,
      'Desktop: ← → to move lanes | ↑ or SPACE to jump | ↓ to duck  •  Mobile: Swipe!',
      {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'italic'
      }
    );
    this.instructionsText.setOrigin(0.5, 0.5);

    // Store game dimensions
    this.gameWidth = width;
    this.gameHeight = height;

    console.log('✅ Controls set up');
    console.log('🎮 Phase 2 ready! Try moving the player around!');
  }

  // ============================================
  // UPDATE METHOD
  // ============================================
  // This method runs every frame (about 60 times per second)
  update() {
    // ----------------------------------------
    // HANDLE KEYBOARD INPUT
    // ----------------------------------------
    // Check for key presses and call the appropriate player methods

    // LEFT ARROW - Move left
    if (this.cursors.left.isDown && !this.leftPressed) {
      this.player.moveLeft();
      this.leftPressed = true; // Mark as pressed so it doesn't repeat
    }
    if (this.cursors.left.isUp) {
      this.leftPressed = false; // Reset when key is released
    }

    // RIGHT ARROW - Move right
    if (this.cursors.right.isDown && !this.rightPressed) {
      this.player.moveRight();
      this.rightPressed = true;
    }
    if (this.cursors.right.isUp) {
      this.rightPressed = false;
    }

    // UP ARROW - Jump
    if (this.cursors.up.isDown && !this.upPressed) {
      this.player.jump();
      this.upPressed = true;
    }
    if (this.cursors.up.isUp) {
      this.upPressed = false;
    }

    // SPACE - Also jump (alternative to up arrow)
    if (this.spaceKey.isDown && !this.spacePressed) {
      this.player.jump();
      this.spacePressed = true;
    }
    if (this.spaceKey.isUp) {
      this.spacePressed = false;
    }

    // DOWN ARROW - Duck
    if (this.cursors.down.isDown && !this.downPressed) {
      this.player.duck();
      this.downPressed = true;
    }
    if (this.cursors.down.isUp) {
      this.downPressed = false;
    }

    // ----------------------------------------
    // UPDATE PLAYER
    // ----------------------------------------
    // Let the player update its own state (check for landing, etc.)
    this.player.update();
  }
}
