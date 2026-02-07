// This file contains the Obstacle class
// Obstacles are things the player must avoid by jumping, ducking, or changing lanes

import Phaser from 'phaser';

// ============================================
// OBSTACLE CLASS
// ============================================
// This class creates obstacles that move toward the player
// There are 3 types: lane obstacles, jump obstacles, and duck obstacles

export default class Obstacle {
  constructor(scene, lane, type) {
    // Store references
    this.scene = scene;
    this.lane = lane; // Which lane (0=left, 1=center, 2=right)
    this.type = type; // Type: 'lane', 'jump', or 'duck'

    // ----------------------------------------
    // OBSTACLE PROPERTIES BY TYPE
    // ----------------------------------------
    // Each obstacle type has different size and color
    // This makes them visually distinct so the player knows what to do

    let width, height, color;

    if (type === 'lane') {
      // LANE OBSTACLE
      // A tall barrier that blocks the entire lane
      // Player must switch lanes to avoid it
      width = 40;
      height = 80;
      color = 0xff4444; // Red - danger!
    } else if (type === 'jump') {
      // JUMP OBSTACLE
      // A low, wide obstacle on the ground
      // Player must jump over it
      width = 50;
      height = 30;
      color = 0xffaa00; // Orange - jump over me!
    } else if (type === 'duck') {
      // DUCK OBSTACLE
      // A high, horizontal barrier
      // Player must duck under it
      width = 60;
      height = 20;
      color = 0x44aaff; // Blue - duck under me!
    }

    // ----------------------------------------
    // POSITION CALCULATION
    // ----------------------------------------
    // Obstacles spawn at the top of the screen
    // They appear in one of the three lanes

    const lanes = [-150, 0, 150]; // Same lane positions as Player
    const startX = scene.scale.width / 2 + lanes[lane]; // X position based on lane

    // ----------------------------------------
    // STARTING POSITION BY TYPE
    // ----------------------------------------
    // All obstacles start above the screen
    // Duck obstacles start higher to give more warning

    let startY;
    if (type === 'duck') {
      startY = -100; // Start higher for duck obstacles
    } else {
      startY = -50; // Standard starting position
    }

    // ----------------------------------------
    // CREATE THE VISUAL OBSTACLE
    // ----------------------------------------
    // Create a rectangle to represent the obstacle
    this.sprite = scene.add.rectangle(
      startX,
      startY,
      width,
      height,
      color
    );

    // Add physics so we can detect collisions
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setAllowGravity(false); // Obstacles don't fall

    // ----------------------------------------
    // MOVEMENT SPEED
    // ----------------------------------------
    // How fast the obstacle moves toward the player
    // This creates the "running forward" effect
    this.speed = 200; // Pixels per second

    console.log(`🚧 ${type} obstacle spawned in lane ${lane} at Y=${Math.round(startY)}`);
  }

  // ============================================
  // UPDATE
  // ============================================
  // Called every frame to move the obstacle
  update(delta) {
    // Delta is the time since last frame (in milliseconds)
    // We use it to make movement smooth regardless of frame rate

    // ----------------------------------------
    // MOVE TOWARD PLAYER
    // ----------------------------------------
    // ALL obstacles move downward continuously
    // They do NOT stop - they move toward the player and then past them

    const moveAmount = (this.speed * delta) / 1000; // Convert to pixels
    this.sprite.y += moveAmount;

    // ----------------------------------------
    // WHY THIS IS SIMPLE AND CORRECT
    // ----------------------------------------
    // OLD CODE: Duck obstacles were locked at a specific height
    // This prevented them from reaching the player or being removed
    //
    // NEW CODE: All obstacles just keep moving downward
    // - They reach the player (collision detection happens)
    // - They pass the player (continue moving)
    // - They go off-screen (get removed by isOffScreen())
    //
    // No special cases! Simple and reliable.
  }

  // ============================================
  // IS OFF SCREEN
  // ============================================
  // Check if the obstacle has passed the player and should be removed
  isOffScreen() {
    // If obstacle is below the screen, it's passed the player
    // This now works for ALL obstacle types (including duck obstacles!)
    const offScreen = this.sprite.y > this.scene.scale.height + 50;

    if (offScreen) {
      console.log(`🗑️ ${this.type} obstacle passed player and going off-screen`);
    }

    return offScreen;
  }

  // ============================================
  // DESTROY
  // ============================================
  // Remove the obstacle from the game
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }

  // ============================================
  // GET SPRITE
  // ============================================
  // Return the Phaser sprite for collision detection
  getSprite() {
    return this.sprite;
  }

  // ============================================
  // GET LANE
  // ============================================
  // Return which lane this obstacle is in
  getLane() {
    return this.lane;
  }

  // ============================================
  // GET TYPE
  // ============================================
  // Return the type of obstacle ('lane', 'jump', 'duck')
  getType() {
    return this.type;
  }
}
