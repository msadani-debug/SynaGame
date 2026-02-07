// This file contains the Player class
// The player is the character you control in the game

import Phaser from 'phaser';

// ============================================
// PLAYER CLASS
// ============================================
// This class handles everything about the player:
// - Drawing the player on screen
// - Moving between lanes (left/right)
// - Jumping
// - Ducking

export default class Player {
  constructor(scene, x, y) {
    // Store a reference to the scene (so we can add things to it)
    this.scene = scene;

    // ----------------------------------------
    // LANE SYSTEM
    // ----------------------------------------
    // The game has 3 lanes: left, center, right
    // The player can move between these lanes

    this.lanes = [-150, 0, 150]; // X positions for each lane (relative to center)
    this.currentLane = 1; // Start in the middle lane (0=left, 1=center, 2=right)

    // ----------------------------------------
    // PLAYER SIZE
    // ----------------------------------------
    this.normalWidth = 40; // Normal width of the player
    this.normalHeight = 60; // Normal height when standing
    this.duckHeight = 30; // Height when ducking (smaller)

    // ----------------------------------------
    // PLAYER STATE
    // ----------------------------------------
    this.isDucking = false; // Is the player currently ducking?
    this.isJumping = false; // Is the player currently in the air?
    this.isMovingBetweenLanes = false; // Is the player switching lanes right now?

    // ----------------------------------------
    // CREATE THE PLAYER SHAPE
    // ----------------------------------------
    // For now, we'll use a simple rectangle to represent the player
    // Later we can make it fancier with colors from the character system

    this.sprite = scene.add.rectangle(
      x + this.lanes[this.currentLane], // X position (center of screen + current lane offset)
      y, // Y position (near bottom of screen)
      this.normalWidth, // Width
      this.normalHeight, // Height
      0xff6b6b // Red color (we'll change this to character colors later)
    );

    // ----------------------------------------
    // ADD PHYSICS
    // ----------------------------------------
    // Physics lets the player fall with gravity and jump
    scene.physics.add.existing(this.sprite);

    // Set the physics body properties
    this.sprite.body.setCollideWorldBounds(true); // Don't let player fall off screen
    this.sprite.body.setGravityY(1500); // How fast the player falls (higher = falls faster)

    // ----------------------------------------
    // GROUND LEVEL (CRITICAL FOR LANDING)
    // ----------------------------------------
    // This is the Y position where the player's CENTER should be when on the ground
    // We store this so we can check if the player has landed
    this.groundY = y;

    console.log('👤 Player created at lane', this.currentLane);
    console.log(`   Ground Y position: ${this.groundY}`);
  }

  // ============================================
  // MOVE LEFT
  // ============================================
  // Move the player one lane to the left
  moveLeft() {
    // Can't move left if we're already in the leftmost lane
    if (this.currentLane <= 0) {
      console.log('❌ Already in leftmost lane');
      return;
    }

    // Can't switch lanes while already switching
    if (this.isMovingBetweenLanes) {
      console.log('❌ Already moving between lanes');
      return;
    }

    // Move to the lane on the left
    this.currentLane -= 1;
    console.log('⬅️ Moving to lane', this.currentLane);

    // Smoothly move to the new lane position (tween = smooth animation)
    this.isMovingBetweenLanes = true;
    this.scene.tweens.add({
      targets: this.sprite, // What to animate
      x: this.scene.scale.width / 2 + this.lanes[this.currentLane], // Where to move
      duration: 200, // How long the movement takes (in milliseconds)
      ease: 'Sine.easeInOut', // Type of movement (starts slow, speeds up, slows down)
      onComplete: () => {
        this.isMovingBetweenLanes = false; // Movement finished
      }
    });
  }

  // ============================================
  // MOVE RIGHT
  // ============================================
  // Move the player one lane to the right
  moveRight() {
    // Can't move right if we're already in the rightmost lane
    if (this.currentLane >= this.lanes.length - 1) {
      console.log('❌ Already in rightmost lane');
      return;
    }

    // Can't switch lanes while already switching
    if (this.isMovingBetweenLanes) {
      console.log('❌ Already moving between lanes');
      return;
    }

    // Move to the lane on the right
    this.currentLane += 1;
    console.log('➡️ Moving to lane', this.currentLane);

    // Smoothly move to the new lane position
    this.isMovingBetweenLanes = true;
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.scene.scale.width / 2 + this.lanes[this.currentLane],
      duration: 200,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isMovingBetweenLanes = false;
      }
    });
  }

  // ============================================
  // JUMP
  // ============================================
  // Make the player jump into the air
  jump() {
    // Can only jump if we're on the ground (no double jumping!)
    if (this.isJumping) {
      console.log('❌ Already jumping');
      return;
    }

    // Can't jump while ducking
    if (this.isDucking) {
      console.log('❌ Cannot jump while ducking');
      return;
    }

    console.log('⬆️ Jump!');
    this.isJumping = true;

    // Give the player an upward velocity (negative Y = up)
    // The gravity will automatically pull them back down
    this.sprite.body.setVelocityY(-600); // Jump strength (higher = jump higher)
  }

  // ============================================
  // DUCK
  // ============================================
  // Make the player duck down (get shorter)
  duck() {
    // Can't duck while in the air
    if (this.isJumping) {
      console.log('❌ Cannot duck while jumping');
      return;
    }

    // Can't duck if already ducking
    if (this.isDucking) {
      console.log('❌ Already ducking');
      return;
    }

    console.log('⬇️ Duck!');
    this.isDucking = true;

    // Make the player shorter
    this.sprite.setSize(this.normalWidth, this.duckHeight);
    this.sprite.displayHeight = this.duckHeight;

    // Automatically stand back up after a short time
    this.scene.time.delayedCall(400, () => {
      this.standUp();
    });
  }

  // ============================================
  // STAND UP
  // ============================================
  // Return to normal height after ducking
  standUp() {
    if (!this.isDucking) {
      return; // Not ducking, nothing to do
    }

    console.log('🧍 Standing up');
    this.isDucking = false;

    // Return to normal size
    this.sprite.setSize(this.normalWidth, this.normalHeight);
    this.sprite.displayHeight = this.normalHeight;
  }

  // ============================================
  // UPDATE
  // ============================================
  // Called every frame to update the player's state
  update() {
    // ----------------------------------------
    // GROUND DETECTION & LANDING (FIXED!)
    // ----------------------------------------
    // This is the CORRECT way to detect landing:
    // Check the player's Y position directly instead of relying on physics collisions

    if (this.isJumping) {
      // Player is in the air - check if they've reached the ground

      // Has the player fallen back to (or below) the ground level?
      if (this.sprite.y >= this.groundY) {
        // YES - Player has landed!

        console.log('📍 Landed! (Y position reached ground)');

        // STEP 1: Snap the player exactly to the ground position
        // This prevents them from sinking below the ground
        this.sprite.y = this.groundY;

        // STEP 2: Stop all vertical movement
        // Without this, the player would keep falling or bouncing
        this.sprite.body.setVelocityY(0);

        // STEP 3: Reset the jumping state
        // Now the player can jump again!
        this.isJumping = false;

        console.log('   ✅ isJumping reset to false - can jump again!');
      }
    } else {
      // Player is on the ground - make sure they stay there

      // If the player somehow got below ground (shouldn't happen, but just in case)
      if (this.sprite.y > this.groundY) {
        console.log('⚠️ Player below ground - snapping back up');
        this.sprite.y = this.groundY;
        this.sprite.body.setVelocityY(0);
      }

      // If the player is above ground but not jumping (shouldn't happen normally)
      if (this.sprite.y < this.groundY) {
        // This can happen if something else moves the player up
        // Just let gravity pull them back down naturally
        // Don't interfere - gravity will handle it
      }
    }

    // ----------------------------------------
    // WHY THIS WORKS
    // ----------------------------------------
    // The old code relied on "sprite.body.touching.down" which only works
    // if the player is touching another physics body (like a ground object).
    // Since we don't have a ground object, touching.down never became true!
    //
    // The NEW code checks the player's Y position directly:
    // - If player Y >= groundY, they've reached the ground
    // - We snap them to groundY and reset isJumping
    // - This works 100% of the time, regardless of physics bodies
    //
    // Simple and reliable!
  }

  // ============================================
  // GET SPRITE
  // ============================================
  // Return the Phaser sprite object (useful for physics or checking position)
  getSprite() {
    return this.sprite;
  }
}
