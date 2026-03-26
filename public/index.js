const defaultTextStyle = {
  fontFamily: '"Pixelify Sans"',
  fontSize: "16px",
  color: "#333",
};

class Sprite {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
  }
}

const createBackground = (context) => {
  const { width, height } = context.scale;
  context.bg = context.add
    .tileSprite(0, 160, 1440, 320, "graduation_background")
    .setScale(1, 1);
};

const playMusic = (context, soundName, isLoop = true) => {
  if (!context.music) {
    context.music = context.sound.add(soundName);
    context.music.play();
    // Optional: Loop the music
    context.music.setLoop(isLoop);
  } else {
    context.music.play();
  }
};

const playEffect = (context, soundName) => {
  // register sound first
  context[soundName].play();
};
// --- 1. BOOT SCENE: Generates simple graphics so we don't need external image files ---
class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }
  preload() {
    // Sprites
    this.load.atlas(
      "player",
      "assets/sprites/kristen_spritesheet.png",
      "assets/sprites/kristen_spritesheet.json"
    );

    this.load.atlas(
      "professor",
      "assets/sprites/professor_spritesheet.png",
      "assets/sprites/professor_spritesheet.json"
    );

    this.load.atlas(
      "exman",
      "assets/sprites/exman_spritesheet.png",
      "assets/sprites/exman_spritesheet.json"
    );

    this.load.atlas(
      "brain",
      "assets/sprites/brain_spritesheet.png",
      "assets/sprites/brain_spritesheet.json"
    );

    this.load.atlas(
      "naptime",
      "assets/sprites/naptime_spritesheet.png",
      "assets/sprites/naptime_spritesheet.json"
    );

    this.load.atlas(
      "matcha",
      "assets/sprites/matcha_spritesheet.png",
      "assets/sprites/matcha_spritesheet.json"
    );

    this.load.atlas(
      "fleabag",
      "assets/sprites/fleabag_spritesheet.png",
      "assets/sprites/fleabag_spritesheet.json"
    );

    // BG
    this.load.image(
      "graduation_background",
      "assets/sprites/graduation_background.png"
    );

    // Audio
    this.load.audio("theme", ["assets/audio/theme.mp3"]);
    this.load.audio("game", ["assets/audio/game.mp3"]);
    this.load.audio("win", ["assets/audio/win.mp3"]);

    // Audio effects
    this.load.audio("jump", ["assets/audio/jump.mp3"]);
  }

  create() {
    let graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Draw Obstacle (A simple red block/stack of books)
    graphics.clear();

    // Draw Ground
    graphics.clear();
    graphics.fillStyle(0x555555);
    graphics.fillRect(0, 0, 800, 20);
    graphics.generateTexture("ground", 800, 20);

    this.scene.start("StartScene");
  }
}

class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  create() {
    const centerX = 240;
    const centerY = 50;
    playMusic(this, "theme");

    // Use a list to manage your tutorial steps
    this.tutorialSteps = [
      {
        text: "This is you, on your way to graduate.\nYou need 1000 points!",
        sprite: "player",
      },
      {
        text: "However, you have some ops...",
        sprite: null,
      },
      {
        text: "The Professor: Avoid them at all costs,\nor they will fail you.",
        sprite: "professor",
      },
      {
        text: "The Flying Brain: Personal doubt and fear.\n(Don't jump too high!)",
        sprite: "brain",
      },
      {
        text: "The Naptime Sheep:\nWe know you love napping.",
        sprite: "naptime",
      },
      {
        text: "That Weird Ex:\n UH OH",
        sprite: "exman",
      },
      {
        text: "Luckily, there are some power-ups\nto help you out!",
        sprite: null,
      },
      { text: "Matcha! Drink this to score +50 points.", sprite: "matcha" },
      {
        text: "Your favourite show! Gain 5-second invincibility\nagainst the baddies.",
        sprite: "fleabag",
      },
      {
        text: "Jump and avoid enemies to graduate.\nGood luck!",
        sprite: "player",
      },
    ];

    this.currentStep = 0;

    // Create UI elements
    this.instructionText = this.add
      .text(centerX, centerY, "", {
        fontSize: "16px",
        fill: "#000",
        align: "center",
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5);

    this.displaySprite = this.add
      .sprite(centerX, centerY + 150, "player")
      .setScale(2);

    this.add
      .text(centerX, 300, "Tap or press space to continue...", {
        fontSize: "12px",
        fill: "#aaa",
      })
      .setOrigin(0.5);

    // Input listener
    this.input.on("pointerdown", () => this.nextStep());
    this.input.on("keydown-SPACE", () => this.nextStep());

    // Show the first step
    this.updateStep();
  }

  updateStep() {
    const step = this.tutorialSteps[this.currentStep];

    this.instructionText.setText(step.text);

    if (step.sprite) {
      this.displaySprite.setTexture(step.sprite).setVisible(true);
    } else {
      this.displaySprite.setVisible(false);
    }
  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep < this.tutorialSteps.length) {
      this.updateStep();
    } else {
      this.music.stop(); // stop music
      this.scene.start("GameScene"); // Transition to your actual game
    }
  }
}

// --- 2. START SCENE: Displays the greeting and waits for input ---
class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    createBackground(this);

    this.cameras.main.setBackgroundColor("#f7f7f7");

    this.add
      .text(240, 150, "Happy Graduation Kristen!", {
        ...defaultTextStyle,
        fontSize: "32px",
        fill: "white",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(240, 200, "Tap, Click, or Press Space", {
        ...defaultTextStyle,
        fontSize: "20px",
        fill: "white",
      })
      .setOrigin(0.5, 0.5);
    // Listen for Spacebar, Mouse Click, or Mobile Tap
    this.input.on("pointerdown", () => this.scene.start("TutorialScene"));
    this.input.keyboard.on("keydown-SPACE", () =>
      this.scene.start("TutorialScene")
    );
  }
}

// --- 3. MAIN GAME SCENE: Handles the jumping, obstacles, and scoring ---
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  handlePowerupCollision(player, powerup) {
    switch (powerup.texture.key) {
      case "matcha":
        this.player.setBlendMode(Phaser.BlendModes.COLOR);

        this.score += 50;

        this.time.delayedCall(500, () => {
          this.player.setBlendMode(Phaser.BlendModes.NORMAL);
        });
        break;
      case "fleabag":
        this.player.invincible = true;
        this.player.setBlendMode(Phaser.BlendModes.MULTIPLY);

        // 5 seconds of invincibility
        this.time.delayedCall(5000, () => {
          this.player.invincible = false;
          this.player.setBlendMode(Phaser.BlendModes.NORMAL);
        });
        break;
    }

    // Common action: destroy the powerup after collection
    powerup.destroy();
  }

  create() {
    createBackground(this);
    playMusic(this, "game");
    this.jumpSound = this.sound.add("jump");
    // this.jumpSound.setLoop(false);

    this.enemySpawnX = 750;
    this.endScore = 1000;
    this.cameras.main.setBackgroundColor("#f7f7f7");

    // Ground setup
    this.ground = this.physics.add.staticImage(200, 320, "ground");
    this.ground.alpha = 0;
    this.player = this.physics.add.sprite(50, 200, "player");

    // play sprite
    // Player setup
    this.anims.create({
      key: "walking", // This must match exactly
      frames: this.anims.generateFrameNames("player", {
        prefix: "sprite",
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.player.anims.play("walking", true);
    this.player.setGravityY(1800); // Pulls player down fast
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    // Obstacles setup
    this.obstacles = this.physics.add.group();

    // Powerups
    this.powerups = this.physics.add.group();

    this.physics.add.collider(this.obstacles, this.ground);
    this.anims.create({
      key: "walkingProfessor", // This must match exactly
      frames: this.anims.generateFrameNames("professor", {
        prefix: "sprite",
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walkingExman", // This must match exactly
      frames: this.anims.generateFrameNames("exman", {
        prefix: "sprite",
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "flyingBrain", // This must match exactly
      frames: this.anims.generateFrameNames("brain", {
        prefix: "sprite",
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "walkingNaptime", // This must match exactly
      frames: this.anims.generateFrameNames("naptime", {
        prefix: "sprite",
        end: 7,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "movingMatcha", // This must match exactly
      frames: this.anims.generateFrameNames("matcha", {
        prefix: "sprite",
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "movingFleabag", // This must match exactly
      frames: this.anims.generateFrameNames("fleabag", {
        prefix: "sprite",
        end: 1,
      }),
      frameRate: 1,
    });

    // If player overlaps with obstacle, trigger game over
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.gameOver,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.powerups,
      this.handlePowerupCollision,
      null,
      this
    );

    // Input handlers
    this.input.on("pointerdown", this.jump, this);
    this.input.keyboard.on("keydown-SPACE", this.jump, this);

    // Game variables
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      ...defaultTextStyle,
      fontSize: "24px",
      fill: "black",
    });
    this.obstacleSpeed = -150;

    // Timer to spawn obstacles or powerups
    this.spawnTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawn,
      callbackScope: this,
      loop: true,
    });
  }

  jump() {
    // Only jump if touching the ground (prevents infinite flying)
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-1000);
      this.jumpSound.play();
    }
  }

  createObstacle() {
    // TODO score dependent
    this.enemyPicker = Phaser.Math.Between(1, 4);
    let obstacle;
    switch (this.enemyPicker) {
      case 1:
        obstacle = this.obstacles.create(this.enemySpawnX, 270, "professor");

        obstacle.setVelocityX(this.obstacleSpeed);
        obstacle.setImmovable(true);
        obstacle.body.setAllowGravity(false);
        obstacle.anims.play("walkingProfessor", true);
        return;
      case 2:
        obstacle = this.obstacles.create(this.enemySpawnX, 290, "naptime");

        obstacle.setVelocityX(this.obstacleSpeed);
        obstacle.setImmovable(true);
        obstacle.body.setAllowGravity(false);
        obstacle.anims.play("walkingNaptime", true);
        return;

      case 3:
        obstacle = this.obstacles.create(this.enemySpawnX, 280, "exman");

        obstacle.setVelocityX(this.obstacleSpeed);
        obstacle.setImmovable(true);
        obstacle.body.setAllowGravity(false);
        obstacle.anims.play("walkingExman", true);
        return;
      default:
        let y = Phaser.Math.Between(10, 90);
        obstacle = this.obstacles.create(this.enemySpawnX, y, "brain");

        obstacle.setVelocityX(this.obstacleSpeed + 2);
        obstacle.setImmovable(true);
        obstacle.body.setAllowGravity(false);
        obstacle.anims.play("flyingBrain", true);
        return;
    }
  }

  spawn() {
    // Randomize the time between obstacles so it's not perfectly predictable
    this.spawnTimer.delay = Phaser.Math.Between(1500, 2500);
    let randomSpawnPicker = Phaser.Math.Between(0, 6);

    // 1 in 5 chance to spawn a powerup
    switch (randomSpawnPicker) {
      case 1:
        return this.createPowerup();
      default:
        return this.createObstacle();
    }
  }

  createPowerup() {
    let powerup;
    let y;
    switch (Phaser.Math.Between(0, 2)) {
      case 1:
        y = Phaser.Math.Between(100, 200);
        powerup = this.powerups.create(this.enemySpawnX, y, "fleabag");
        powerup.setVelocityX(this.obstacleSpeed + 2);
        powerup.setImmovable(true);
        powerup.body.setAllowGravity(false);
        powerup.anims.play("movingFleabag", true);

        return;
      default:
        y = Phaser.Math.Between(100, 200);
        powerup = this.powerups.create(this.enemySpawnX, y, "matcha");

        powerup.setVelocityX(this.obstacleSpeed + 2);
        powerup.setImmovable(true);
        powerup.body.setAllowGravity(false);
        powerup.anims.play("movingMatcha", true);

        return;
    }
  }

  update() {
    this.bg.tilePositionX += 2;
    // Increase score
    this.score += 0.2;
    let score = Math.floor(this.score);
    this.scoreText.setText("Score: " + score);

    if (score > this.endScore) {
      this.music.stop();
      this.scene.start("GameWinScene", {
        score: Math.floor(this.score),
      });
      return;
    }

    // Increase speed slightly over time to make it harder
    this.obstacleSpeed -= 0.1;

    // Clean up obstacles that go off screen to save memory
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.x < -50) {
        obstacle.destroy();
      }
    });

    // Clean up obstacles that go off screen to save memory
    this.powerups.getChildren().forEach((powerup) => {
      if (powerup.x < -50) {
        powerup.destroy();
      }
    });
  }

  gameOver() {
    if (!this.player.invincible) {
      this.physics.pause();
      this.player.setTint(0xff0000); // Turn player red
      this.time.removeAllEvents(); // Stop spawning obstacles

      // Go to Game Over scene after a tiny delay
      this.time.delayedCall(500, () => {
        this.music.stop();

        this.scene.start("GameOverScene", {
          score: Math.floor(this.score),
        });
      });
    }
  }

  gameWin() {
    this.physics.pause();
    this.player.setTint(0xff0000); // Turn player red

    this.time.removeAllEvents(); // Stop spawning obstacles

    // Go to Game Win scene after a tiny delay
    this.time.delayedCall(500, () => {
      this.scene.start("GameWinScene", {
        score: Math.floor(this.score),
      });
    });
  }
}

// --- 4. GAME OVER SCENE ---
class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    this.cameras.main.setBackgroundColor("#f7f7f7");
    const gameOverTextY = 100;
    const spacingTextY = 40;
    this.add
      .text(240, gameOverTextY, "Almost there!", {
        ...defaultTextStyle,
        fontSize: "32px",
        fill: "#d9534f",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        240,
        gameOverTextY + spacingTextY,
        "Final Score: " + this.finalScore,
        {
          ...defaultTextStyle,
          fontSize: "18px",
          fill: "#333",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        240,
        gameOverTextY + spacingTextY * 2,
        "You must reach 1000 points to graduate.",
        {
          ...defaultTextStyle,
          fontSize: "15px",
          fill: "#666",
        }
      )
      .setOrigin(0.5);

    this.replayButton = this.add.text(
      240,
      gameOverTextY + spacingTextY * 3,
      "Replay Game",
      {
        ...defaultTextStyle,
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "green",
        padding: { x: 14, y: 5 },
      }
    );

    this.goHomeButton = this.add.text(
      100,
      gameOverTextY + spacingTextY * 3,
      "Return Home",
      {
        ...defaultTextStyle,
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "red",
        padding: { x: 14, y: 5 },
      }
    );
    this.goHomeButton.setInteractive({ useHandCrsor: true });
    this.replayButton.setInteractive({ useHandCrsor: true });

    // Wait a moment before allowing restart so they don't accidentally click it immediately
    this.time.delayedCall(300, () => {
      this.replayButton.on("pointerdown", () => {
        this.scene.start("GameScene");
      });

      this.goHomeButton.on("pointerdown", () => {
        this.scene.start("BootScene");
      });
    });
  }
}

// --- 4. GAME WIN SCENE ---
class GameWinScene extends Phaser.Scene {
  constructor() {
    super("GameWinScene");
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    playMusic(this, "win");

    const gameWinTextX = 240;
    const gameWinTextY = 100;
    const spacingTextY = 40;
    this.cameras.main.setBackgroundColor("#f7f7f7");
    this.add
      .text(gameWinTextX, gameWinTextY, "You graduated!", {
        ...defaultTextStyle,
        fontSize: "24px",
        fill: "green",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        gameWinTextX,
        gameWinTextY + spacingTextY,
        "Final Score: " + this.finalScore,
        {
          ...defaultTextStyle,
          fontSize: "16px",
          fill: "#333",
        }
      )
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        gameWinTextX,
        gameWinTextY + spacingTextY * 2,
        "Congratulations on finishing your degree!",
        {
          ...defaultTextStyle,

          fontSize: "16px",
          fill: "#666",
        }
      )
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        gameWinTextX,
        gameWinTextY + spacingTextY * 3,
        "Tap, Click, or Press Space to Play Again",
        {
          ...defaultTextStyle,

          fontSize: "16px",
          fill: "#666",
        }
      )
      .setOrigin(0.5, 0.5);

    // Wait a moment before allowing restart so they don't accidentally click it immediately
    this.time.delayedCall(300, () => {
      this.input.on("pointerdown", () => {
        this.music.stop();
        this.scene.start("GameScene");
      });
      this.input.keyboard.on("keydown-SPACE", () => {
        this.music.stop();
        this.scene.start("GameScene");
      });
    });
  }
}
// --- GAME CONFIGURATION ---
const config = {
  type: Phaser.CANVAS, // must be canvas for raspberry pi
  width: 320,
  height: 480,
  backgroundColor: "#f7f7f7",
  scale: {
    mode: Phaser.Scale.FIT, // or Phaser.Scale.RESIZE
    parent: "game-container", // optional, id of the parent DOM element
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    StartScene,
    TutorialScene,
    GameScene,
    GameWinScene,
    GameOverScene,
  ],
};

setTimeout(() => {
  new Phaser.Game(config);
}, 100);
