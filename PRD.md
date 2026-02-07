# PRODUCT REQUIREMENTS DOCUMENT (PRD)
Version: v1.7 (FINAL & FROZEN)

## GAME TITLE
All Out Rush

## 1. PRODUCT OVERVIEW

**One-line description:**
A fast-paced, Subway Surfers–inspired endless runner where players dodge obstacles using lane movement, jumping, ducking, limited-use force fields, and special power-ups, while collecting coins and gems across runs, including special event modes with unique rules and environments.

**Core inspiration:**
Subway Surfers (endless running, movement, power-ups, events, multiplayer racing).

**Target audience:**
Kids, teenagers, and anyone.

**Platform:**
Web browser (desktop and mobile).

## 2. GAME MODES

The game supports up to 4 players.

**Supported modes:**
- Single-player
- Two-player multiplayer
- Three-player multiplayer
- Four-player multiplayer

All modes use the same character pool, economy, and control system.

## 3. CHARACTERS

**Character pool:**
- One global character pool
- Characters usable in all modes

**Visual identity system:**
Each character is defined by one unique color.
The same color is used for:
- Hair
- Outfit
- Shoes
- Force-field glow

No mixed colors per character.

**Character rules:**
- Characters differ only in color
- Characters have no abilities or powers
- Some characters have weaker force fields
- Differences are visual and durability-based only
- No character upgrades

**Unlocking:**
- Start with 4 characters unlocked
- 10 total characters in the game
- Unlocking all characters is intentionally difficult

**Multiplayer character selection:**
- Duplicate character selection is NOT allowed in multiplayer
- Each player must select a unique character
- Single-player has no restriction

## 4. CORE GAMEPLAY MECHANICS

**Core gameplay loop:**
Run → dodge obstacles → jump / duck / switch lanes → use force field or power-ups → collect coins → finish run → earn currency → replenish force fields → start next run

## 5. MOVEMENT & OBSTACLE SYSTEM

**Player movement:**
- Player runs forward automatically
- Lane switching (left/right)
- Jumping over obstacles
- Ducking under obstacles

**Obstacle categories:**
- Jump-over obstacles
- Duck-under obstacles
- Lane-switch obstacles
- Force-field-only obstacles

Obstacle types are visually distinct and readable at speed.

## 6. FORCE FIELD (PROTECTION SCREEN)

**Description:**
- Animated energy / force-field screen
- Semi-transparent glow
- Glow color matches the character's color
- Break animation when destroyed

**Usage rules:**
- Activated via button press
- Each player starts a run with 25 force fields
- Force fields are limited-use and consumable
- Last for a few seconds
- Break after blocking obstacles
- Cannot be upgraded
- Some characters have weaker force fields

**Design intent:**
- Force field is a last-resort tool
- Movement skill is primary
- Force field enables special interactions in event modes

## 7. CURRENCY & ECONOMY

**Coins:**
- Collected during runs
- Persist after the run ends

**Conversion:**
- 70 coins = 1 gem

**Gems:**
- Higher-value currency
- Each gem grants 10 force fields
- Force fields replenish between runs only

**Economy flow:**
Run → collect coins → convert to gems → gems convert to force fields → next run

## 8. WORLD & ENVIRONMENT

**Standard worlds:**
- Multiple worlds connected by portals
- Example progression:
  - Fantasy world
  - School world
  - City world
- Difficulty and speed increase over time

## 9. EVENT MODES

Event modes are special runs inspired by Subway Surfers events.

**Event rules:**
- Events may have a finish line
- Events may change world rules
- Events may introduce special movement constraints
- Events can be played in single-player or multiplayer

**Glacier / Ice Event:**

Environment rules:
- World is made of glaciers and ice
- Ice cannot be run on directly
- Safe surfaces include trucks, platforms, and moving objects

Movement rules:
- Touching ice without protection causes a crash

Force field interaction:
- Players can move on ice ONLY while the force field is active
- Player appears to slide or lie on their stomach on the force field
- Force field drains normally while on ice

## 10. POWER-UPS

Power-ups can appear during standard runs and event modes.

**Supported power-ups:**

**Jetpack:**
- Temporarily lifts the player above obstacles
- Player auto-moves forward
- Automatically collects coins
- Jumping and ducking are disabled during jetpack use

**Bounce:**
- Instantly launches the player upward
- Used to clear large obstacles or gaps

**Super Bouncy Boots:**
- Increase jump height
- Make jumps more forgiving
- Limited duration

**+2 Pickups:**
- Instant bonus effects such as:
  - +2 force fields
  - +2 seconds of power-up time
  - +2 score or distance bonus
- Exact effect can be configured per event or mode

## 11. MULTIPLAYER DESIGN

**Multiplayer model:**
- Real-time multiplayer with parallel worlds
- Players run side-by-side visually
- Each player has independent obstacles, physics, and power-ups

**Player interaction rules:**
- No collisions between players
- No interaction with other players' force fields or power-ups
- Players race to see who lasts longest or finishes first in events
- Players may lose independently

## 12. CONTROLS

**Mobile controls:**
- Swipe left/right to switch lanes
- Swipe up to jump
- Swipe down to duck
- On-screen button to activate force field

**Desktop controls:**
- Keyboard for lane movement
- Key for jump
- Key for duck
- Key or button for force field

## 13. VISUAL & UI CONSTRAINTS

**Design constraints:**
- No custom art assets
- Visuals created using shapes, colors, gradients, and animations

**Multiplayer layout:**
- Players displayed side-by-side
- Layout adapts dynamically for 1, 2, 3, or 4 players

## 14. TECHNICAL CONSTRAINTS

**Client:**
- Browser-based
- Canvas/WebGL rendering
- Deterministic, client-side gameplay logic

**Server (multiplayer):**
- Manages rooms and player state only
- Syncs:
  - Position
  - Speed
  - Jump/Duck state
  - Force-field count
  - Active power-ups
  - Alive/dead status
- Server does NOT run physics or obstacle logic

## 15. MVP SCOPE (VERSION 1)

**Must-have:**
- Single-player
- One standard world
- Four characters (color-based)
- Lane switching, jumping, ducking
- Force-field system (25 per run)
- Coin → gem → force-field economy

**Deferred:**
- Multiplayer
- Event modes
- Power-ups
- Additional worlds
- Additional characters

## 16. EXPLICIT NON-GOALS

- Character abilities or skill trees
- Force-field upgrades
- PvP interactions
- Shared obstacle physics
- In-game purchases
- Visual realism
