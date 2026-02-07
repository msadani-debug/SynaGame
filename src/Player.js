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
    // GROUND LEVEL
    // ----------------------------------------
    // Remember where the ground is so we know when the player lands
    this.groundY = y;

    console.log('👤 Player created at lane', this.currentLane);
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
    // CHECK IF PLAYER LANDED
    // ----------------------------------------
    // If the player is jumping and touches the ground, they've landed
    if (this.isJumping && this.sprite.body.touching.down) {
      console.log('📍 Landed');
      this.isJumping = false;
    }

    // ----------------------------------------
    // PREVENT FALLING THROUGH FLOOR
    // ----------------------------------------
    // Make sure the player stays above the ground
    // (This is a backup in case physics glitches)
    if (this.sprite.y > this.groundY && !this.isJumping) {
      this.sprite.y = this.groundY;
      this.sprite.body.setVelocityY(0);
    }
  }

  // ============================================
  // GET SPRITE
  // ============================================
  // Return the Phaser sprite object (useful for physics or checking position)
  getSprite() {
    return this.sprite;
  }
}
