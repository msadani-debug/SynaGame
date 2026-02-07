// This is our main game scene
// A "scene" is like a screen in the game where things happen
// This is where the actual gameplay happens!

import Phaser from 'phaser';
import Player from '../Player.js';
import Obstacle from '../Obstacle.js';

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
    console.log('🎬 MainScene started - Phase 3!');

    // Get the width and height of our game screen
    const width = this.scale.width;
    const height = this.scale.height;

    // ----------------------------------------
    // GAME STATE
    // ----------------------------------------
    // Track whether the game is over or still playing
    this.isGameOver = false;

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
    const groundY = height - 100; // Ground is 100 pixels from the bottom

    const ground = this.add.rectangle(
      width / 2,
      groundY,
      width,
      5,
      0xffffff,
      0.5
    );

    // ----------------------------------------
    // CREATE LANE MARKERS (for debugging)
    // ----------------------------------------
    // Draw vertical lines to show where the 3 lanes are
    const lanes = [-150, 0, 150]; // Same lane positions as in Player.js

    for (let laneOffset of lanes) {
      this.add.rectangle(
        width / 2 + laneOffset,
        height / 2,
        2,
        height,
        0xffffff,
        0.2
      );
    }

    // ----------------------------------------
    // CREATE THE PLAYER
    // ----------------------------------------
    // Create the player in the center lane, just above the ground
    this.player = new Player(
      this,
      width / 2,
      groundY - 30
    );

    console.log('✅ Player created');

    // ----------------------------------------
    // OBSTACLE SYSTEM
    // ----------------------------------------
    // Array to store all active obstacles
    this.obstacles = [];

    // How often to spawn new obstacles (in milliseconds)
    this.spawnInterval = 2000; // Spawn every 2 seconds

    // Timer to track when to spawn next obstacle
    this.spawnTimer = 0;

    console.log('✅ Obstacle system initialized');

    // ----------------------------------------
    // SET UP KEYBOARD CONTROLS
    // ----------------------------------------
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); // For restart

    // Track if keys were just pressed
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;
    this.rPressed = false;

    // ----------------------------------------
    // SET UP TOUCH/SWIPE CONTROLS
    // ----------------------------------------
    this.input.on('pointerdown', (pointer) => {
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      // If game is over, restart on tap
      if (this.isGameOver) {
        this.restartGame();
        return;
      }

      // Calculate swipe distance
      const deltaX = pointer.x - this.touchStartX;
      const deltaY = pointer.y - this.touchStartY;
      const minSwipeDistance = 30;

      // Check horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            this.player.moveRight();
          } else {
            this.player.moveLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY < 0) {
            this.player.jump();
          } else {
            this.player.duck();
          }
        }
      }
    });

    // ----------------------------------------
    // ADD STATUS TEXT
    // ----------------------------------------
    this.statusText = this.add.text(
      width / 2,
      30,
      '🎮 All Out Rush - Phase 3!',
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
      'Desktop: ← → to move | ↑/SPACE to jump | ↓ to duck | R to restart  •  Mobile: Swipe!',
      {
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'italic'
      }
    );
    this.instructionsText.setOrigin(0.5, 0.5);

    // Create game over text (hidden initially)
    this.gameOverText = this.add.text(
      width / 2,
      height / 2,
      '💥 GAME OVER!\nPress R or Tap to Restart',
      {
        fontSize: '48px',
        color: '#ff4444',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center'
      }
    );
    this.gameOverText.setOrigin(0.5, 0.5);
    this.gameOverText.setVisible(false); // Hidden until game over

    // ----------------------------------------
    // ADD DEBUG INFO (VISIBLE ON SCREEN)
    // ----------------------------------------
    // This shows player state on screen so we can see what's happening
    this.debugText = this.add.text(
      10,
      10,
      'Debug Info',
      {
        fontSize: '16px',
        color: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 10 }
      }
    );

    // Store game dimensions
    this.gameWidth = width;
    this.gameHeight = height;

    console.log('✅ Controls set up');
    console.log('🎮 Phase 3 ready! Avoid the obstacles!');
    console.log('📊 Debug text added to top-left corner');
  }

  // ============================================
  // SPAWN OBSTACLE
  // ============================================
  // Create a new obstacle at a random lane with a random type
  spawnObstacle() {
    // Choose a random lane (0, 1, or 2)
    const randomLane = Phaser.Math.Between(0, 2);

    // Choose a random obstacle type
    const types = ['lane', 'jump', 'duck'];
    const randomType = Phaser.Utils.Array.GetRandom(types);

    // Create the obstacle
    const obstacle = new Obstacle(this, randomLane, randomType);

    // Add it to our list of active obstacles
    this.obstacles.push(obstacle);

    console.log(`✨ Spawned ${randomType} obstacle in lane ${randomLane}`);
  }

  // ============================================
  // CHECK COLLISION
  // ============================================
  // Check if the player hit an obstacle
  checkCollision(obstacle) {
    // Log that collision check is running
    console.log('🔍 Checking collision...');

    const playerSprite = this.player.getSprite();
    const obstacleSprite = obstacle.getSprite();

    // Check if the sprites are overlapping
    const bounds1 = playerSprite.getBounds();
    const bounds2 = obstacleSprite.getBounds();

    console.log(`   Player bounds: x=${Math.round(bounds1.x)}, y=${Math.round(bounds1.y)}, w=${Math.round(bounds1.width)}, h=${Math.round(bounds1.height)}`);
    console.log(`   Obstacle bounds: x=${Math.round(bounds2.x)}, y=${Math.round(bounds2.y)}, w=${Math.round(bounds2.width)}, h=${Math.round(bounds2.height)}`);

    // First check: Are the rectangles touching?
    if (Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2)) {
      console.log('   ✓ Rectangles ARE intersecting!');
      // They're touching! Now check if it's a valid collision
      // based on the obstacle type and player state

      const obstacleType = obstacle.getType();
      const obstacleLane = obstacle.getLane();
      const playerLane = this.player.currentLane;

      // Get player state for debugging
      const isJumping = this.player.isJumping;
      const isDucking = this.player.isDucking;

      // ----------------------------------------
      // COLLISION RULES (EXPLAINED SIMPLY)
      // ----------------------------------------

      if (obstacleType === 'lane') {
        // LANE OBSTACLE (RED BARRIER)
        // Rule: Only hits if player is in the same lane
        // Why: You avoid it by switching to a different lane

        if (playerLane === obstacleLane) {
          console.log('💥 COLLISION! Lane obstacle hit!');
          console.log(`   Player in lane ${playerLane}, obstacle in lane ${obstacleLane}`);
          return true; // Game over!
        } else {
          console.log('✅ Safe! Lane obstacle avoided (different lane)');
          return false; // Safe!
        }

      } else if (obstacleType === 'jump') {
        // JUMP OBSTACLE (ORANGE LOW BLOCK)
        // Rule: Hits if player is NOT jumping (regardless of lane)
        // Why: You must jump over it - being in a different lane doesn't help

        console.log(`🟠 Jump obstacle collision check:`);
        console.log(`   Player lane: ${playerLane}, Obstacle lane: ${obstacleLane}`);
        console.log(`   Player is jumping: ${isJumping}`);

        // Only check if player is in the same lane as the obstacle
        if (playerLane === obstacleLane) {
          if (!isJumping) {
            // Player is on the ground - HIT!
            console.log('💥 COLLISION! Jump obstacle hit (not jumping)');
            return true; // Game over!
          } else {
            // Player is jumping - SAFE!
            console.log('✅ Safe! Jumped over obstacle');
            return false; // Safe!
          }
        } else {
          console.log('✅ Safe! Jump obstacle in different lane');
          return false; // Safe - different lane
        }

      } else if (obstacleType === 'duck') {
        // DUCK OBSTACLE (BLUE HIGH BAR)
        // Rule: Hits if player is NOT ducking (regardless of lane)
        // Why: You must duck under it - being in a different lane doesn't help

        console.log(`🔵 Duck obstacle collision check:`);
        console.log(`   Player lane: ${playerLane}, Obstacle lane: ${obstacleLane}`);
        console.log(`   Player is ducking: ${isDucking}`);

        // Only check if player is in the same lane as the obstacle
        if (playerLane === obstacleLane) {
          if (!isDucking) {
            // Player is standing - HIT!
            console.log('💥 COLLISION! Duck obstacle hit (not ducking)');
            return true; // Game over!
          } else {
            // Player is ducking - SAFE!
            console.log('✅ Safe! Ducked under obstacle');
            return false; // Safe!
          }
        } else {
          console.log('✅ Safe! Duck obstacle in different lane');
          return false; // Safe - different lane
        }
      }
    } else {
      console.log('   ✗ Rectangles NOT intersecting - no collision');
    }

    return false; // No collision (rectangles not touching)
  }

  // ============================================
  // GAME OVER
  // ============================================
  // Called when the player hits an obstacle
  gameOver() {
    console.log('☠️ GAME OVER!');

    this.isGameOver = true;

    // Show game over text
    this.gameOverText.setVisible(true);

    // Stop the player from moving
    this.player.getSprite().body.setVelocity(0, 0);
  }

  // ============================================
  // RESTART GAME
  // ============================================
  // Restart the game from the beginning
  restartGame() {
    console.log('🔄 Restarting game...');

    // Simply restart the scene
    // This will call create() again and set everything up fresh
    this.scene.restart();
  }

  // ============================================
  // UPDATE METHOD
  // ============================================
  // This method runs every frame (about 60 times per second)
  update(time, delta) {
    // Don't update gameplay if game is over
    if (this.isGameOver) {
      // Only check for restart input
      if (this.rKey.isDown && !this.rPressed) {
        this.restartGame();
        this.rPressed = true;
      }
      if (this.rKey.isUp) {
        this.rPressed = false;
      }
      return; // Skip the rest of the update
    }

    // ----------------------------------------
    // SPAWN OBSTACLES
    // ----------------------------------------
    // Increase the spawn timer
    this.spawnTimer += delta;

    // If enough time has passed, spawn a new obstacle
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTimer = 0; // Reset the timer
    }

    // ----------------------------------------
    // UPDATE OBSTACLES
    // ----------------------------------------
    // Move each obstacle and check if it should be removed
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];

      // Move the obstacle
      obstacle.update(delta);

      // Check if obstacle has passed the player
      if (obstacle.isOffScreen()) {
        console.log('🗑️ Removing obstacle (off screen)');
        obstacle.destroy();
        this.obstacles.splice(i, 1); // Remove from array
        continue; // Skip collision check for this obstacle
      }

      // Check for collision with player
      if (this.checkCollision(obstacle)) {
        this.gameOver();
        return; // Stop updating after game over
      }
    }

    // ----------------------------------------
    // HANDLE KEYBOARD INPUT
    // ----------------------------------------
    // LEFT ARROW - Move left
    if (this.cursors.left.isDown && !this.leftPressed) {
      this.player.moveLeft();
      this.leftPressed = true;
    }
    if (this.cursors.left.isUp) {
      this.leftPressed = false;
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

    // SPACE - Also jump
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
    // UPDATE DEBUG TEXT (ON SCREEN)
    // ----------------------------------------
    // Show player state and obstacle count on screen
    const debugInfo = [
      `Player Lane: ${this.player.currentLane} (0=Left, 1=Center, 2=Right)`,
      `Jumping: ${this.player.isJumping ? 'YES' : 'NO'}`,
      `Ducking: ${this.player.isDucking ? 'YES' : 'NO'}`,
      `Obstacles: ${this.obstacles.length}`,
      `Game Over: ${this.isGameOver ? 'YES' : 'NO'}`,
      ``,
      `Press F12 to see detailed console logs`
    ].join('\n');

    this.debugText.setText(debugInfo);

    // ----------------------------------------
    // UPDATE PLAYER
    // ----------------------------------------
    this.player.update();
  }
}
