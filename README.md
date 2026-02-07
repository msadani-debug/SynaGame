# 🎮 All Out Rush

A fast-paced, Subway Surfers-inspired endless runner built with Phaser.js!

## 📁 Project Structure

```
SynaGame/
├── src/
│   ├── scenes/
│   │   └── MainScene.js    # Main game scene with animated background
│   └── main.js             # Game initialization and configuration
├── index.html              # Entry point (HTML page)
├── vite.config.js          # Vite build tool configuration
├── package.json            # Project dependencies
├── PRD.md                  # Product Requirements Document
└── README.md              # This file!
```

## 🚀 Getting Started

### Prerequisites

You need to have **Node.js** installed on your computer.
- Download it from: https://nodejs.org/
- Choose the "LTS" (Long Term Support) version

### Step 1: Install Dependencies

Open your terminal (or command prompt) in the project folder and run:

```bash
npm install
```

This will download and install Phaser.js and Vite, which we need to run the game.

### Step 2: Run the Game

After the installation is complete, start the development server:

```bash
npm run dev
```

This command will:
1. Start a local web server
2. Automatically open your browser
3. Show you the game running at `http://localhost:3000`

### Step 3: See It Running!

You should see:
- A beautiful gradient background (blue to purple)
- White circles floating and moving around
- Text saying "Game Running - Phase 1 Complete!"

The moving circles prove that the game loop is working correctly!

## 🛠️ Available Commands

- `npm run dev` - Start development server (use this to run the game)
- `npm run build` - Build the game for production (creates final files)
- `npm run preview` - Preview the production build

## 📚 What's Included?

### Phase 1 ✅
- Project setup with Vite and Phaser.js
- Basic game initialization
- MainScene with animated background
- Working game loop (update function)

### Phase 2 ✅
- Playable character (red rectangle)
- 3-lane system with smooth movement
- Jumping with gravity
- Ducking/sliding
- Keyboard controls (arrow keys + spacebar)
- Touch/swipe controls for mobile
- Ground and lane visual guides

## 🎮 How to Play

**Desktop Controls:**
- `←` `→` Arrow keys - Move between lanes
- `↑` Arrow or `SPACE` - Jump
- `↓` Arrow - Duck/Slide

**Mobile Controls:**
- Swipe left/right - Move between lanes
- Swipe up - Jump
- Swipe down - Duck/Slide

## ⏭️ What's Next?

Phase 2 is complete! The player movement system is fully functional.

In future phases, we'll add:
- Obstacles to dodge
- Force field system
- Coins and gems
- Score tracking
- And much more!

## 🎓 Learning Resources

- **Phaser Documentation**: https://photonstorm.github.io/phaser3-docs/
- **Phaser Examples**: https://phaser.io/examples
- **JavaScript Basics**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript

## 🐛 Troubleshooting

**Game won't start?**
- Make sure you ran `npm install` first
- Check if Node.js is installed: run `node --version` in terminal
- Try closing the browser and running `npm run dev` again

**Port 3000 already in use?**
- Another app might be using that port
- Open `vite.config.js` and change `port: 3000` to `port: 3001`

**Nothing shows up in the browser?**
- Open the browser console (F12 key)
- Look for any error messages in red
- Check if you see "Game initialized!" message

---

**Have fun coding! 🚀**
