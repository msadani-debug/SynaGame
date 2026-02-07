// This is our main game scene
// A "scene" is like a screen in the game where things happen
// Think of it like a movie scene - it has a setup, action, and can change to other scenes

import Phaser from 'phaser';

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
    console.log('🎬 MainScene started!');

    // Get the width and height of our game screen
    const width = this.scale.width;
    const height = this.scale.height;

    // ----------------------------------------
    // CREATE GRADIENT BACKGROUND
    // ----------------------------------------
    // We'll create a nice gradient background using rectangles
    // This shows we can draw graphics without needing image files

    // Create a graphics object (this lets us draw shapes)
    const graphics = this.add.graphics();

    // Draw multiple rectangles with different colors to make a gradient effect
    // We'll go from blue at the top to purple at the bottom
    const gradientSteps = 20; // How many color steps in our gradient
    const stepHeight = height / gradientSteps; // Height of each color step

    for (let i = 0; i < gradientSteps; i++) {
      // Calculate color (blend from blue to purple)
      // Colors use hexadecimal: 0x4a90e2 is blue, 0x9b59b6 is purple
      const blueValue = 0x4a90e2;
      const purpleValue = 0x9b59b6;

      // Simple color blending (this is just for demonstration)
      const ratio = i / gradientSteps;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(blueValue),
        Phaser.Display.Color.ValueToColor(purpleValue),
        gradientSteps,
        i
      );

      // Set the fill color for this rectangle
      graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));

      // Draw a rectangle at this position
      graphics.fillRect(0, i * stepHeight, width, stepHeight);
    }

    // ----------------------------------------
    // ADD ANIMATED MOVING CIRCLES
    // ----------------------------------------
    // Create some circles that move across the screen
    // This proves our game loop is working

    this.circles = []; // Array to store our circles

    // Create 5 circles
    for (let i = 0; i < 5; i++) {
      // Create a circle
      const circle = this.add.circle(
        Math.random() * width,  // Random X position
        Math.random() * height, // Random Y position
        20 + Math.random() * 30, // Random size (radius between 20 and 50)
        0xffffff, // White color
        0.3 // 30% transparency so we can see through them
      );

      // Give each circle a random speed
      circle.speedX = (Math.random() - 0.5) * 3; // Random horizontal speed
      circle.speedY = (Math.random() - 0.5) * 3; // Random vertical speed

      // Store the circle so we can animate it later
      this.circles.push(circle);
    }

    // ----------------------------------------
    // ADD TEXT TO SHOW THE GAME IS RUNNING
    // ----------------------------------------
    this.statusText = this.add.text(
      width / 2, // X position (center of screen)
      50, // Y position (near the top)
      '🎮 Game Running - Phase 1 Complete!', // The text to show
      {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000', // Black outline
        strokeThickness: 4 // Thickness of the outline
      }
    );
    // Center the text
    this.statusText.setOrigin(0.5, 0.5);

    // Add a subtitle with instructions
    this.infoText = this.add.text(
      width / 2,
      height - 50,
      'Watch the circles move to see the game loop in action',
      {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'italic'
      }
    );
    this.infoText.setOrigin(0.5, 0.5);

    // Store game dimensions for later use
    this.gameWidth = width;
    this.gameHeight = height;
  }

  // ============================================
  // UPDATE METHOD
  // ============================================
  // This method runs every frame (about 60 times per second)
  // We use it to animate things and update the game state
  update() {
    // Animate each circle
    for (let circle of this.circles) {
      // Move the circle based on its speed
      circle.x += circle.speedX;
      circle.y += circle.speedY;

      // If the circle goes off the screen, wrap it around to the other side
      // This makes the circles loop forever

      // Check horizontal boundaries
      if (circle.x < -50) {
        circle.x = this.gameWidth + 50; // Wrap to right side
      } else if (circle.x > this.gameWidth + 50) {
        circle.x = -50; // Wrap to left side
      }

      // Check vertical boundaries
      if (circle.y < -50) {
        circle.y = this.gameHeight + 50; // Wrap to bottom
      } else if (circle.y > this.gameHeight + 50) {
        circle.y = -50; // Wrap to top
      }
    }
  }
}
