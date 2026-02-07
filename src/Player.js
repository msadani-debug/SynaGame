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
    // This checks if the player has landed after jumping

    if (this.isJumping) {
      // Player is in the air - check if they've landed

      // CRITICAL FIX: Check velocity direction FIRST
      // Why? When jump() is called, velocity is set to -600 (upward)
      // But the physics engine hasn't moved the player yet!
      // So we must check: is the player falling DOWN (not going up)?

      const velocityY = this.sprite.body.velocity.y;

      // Is the player moving downward (falling)?
      if (velocityY >= 0) {
        // YES - player is falling or at peak of jump
        // Now check if they've reached the ground

        if (this.sprite.y >= this.groundY) {
          // Player has landed!

          console.log('📍 Landed! (Falling & reached ground)');

          // STEP 1: Snap player to ground (prevent sinking)
          this.sprite.y = this.groundY;

          // STEP 2: Stop vertical movement (prevent bouncing)
          this.sprite.body.setVelocityY(0);

          // STEP 3: Reset jump state (allow next jump)
          this.isJumping = false;

          console.log('   ✅ isJumping reset - can jump again!');
        }
        // else: player is falling but hasn't reached ground yet
      }
      // else: player is moving upward, still rising from jump

    } else {
      // Player is on the ground - make sure they stay there

      // Safety check: if player somehow fell below ground
      if (this.sprite.y > this.groundY) {
        console.log('⚠️ Player below ground - snapping up');
        this.sprite.y = this.groundY;
        this.sprite.body.setVelocityY(0);
      }
    }

    // ----------------------------------------
    // WHY THIS WORKS NOW
    // ----------------------------------------
    // OLD CODE: Checked position only (sprite.y >= groundY)
    // PROBLEM: Position didn't change immediately when velocity was set
    // RESULT: isJumping reset in same frame it was set!
    //
    // NEW CODE: Checks velocity AND position
    // - Jump sets velocity to -600 (upward)
    // - First update(): velocityY < 0, so skip landing check
    // - Player moves upward for several frames
    // - At peak: velocityY becomes 0, then positive (falling)
    // - Now landing check can run
    // - When sprite.y >= groundY while falling, player has landed
    //
    // This ensures isJumping stays true for the ENTIRE jump duration!
  }

  // ============================================
  // GET SPRITE
  // ============================================
  // Return the Phaser sprite object (useful for physics or checking position)
  getSprite() {
    return this.sprite;
  }
}
