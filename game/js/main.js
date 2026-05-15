// GreenMountainFog - The Journey
// Phaser 3 RPG Game

// ─── Palette ────────────────────────────────────────────────────────────────
const PAL = {
  black:      0x0a0a0a,
  darkGray:   0x222222,
  gray:       0x555555,
  lightGray:  0xaaaaaa,
  white:      0xffffff,
  // nature
  grass:      0x3a7a2a,
  grassLight: 0x4e9e38,
  dirt:       0x8b6914,
  dirtLight:  0xb8891c,
  sand:       0xd4b483,
  // foliage
  treeGreen:  0x1e6b0a,
  treeTop:    0x2d9e14,
  // water
  water:      0x1a5fa8,
  waterLight: 0x2d7fd4,
  // buildings
  wallGray:   0x8a8a8a,
  wallDark:   0x555555,
  roof:       0x8b1a1a,
  roofDark:   0x5c1111,
  roofLight:  0xb52020,
  wood:       0x7a4a1a,
  woodLight:  0xa06424,
  // path
  path:       0xc8a060,
  pathDark:   0xa07840,
  // player / items
  elfGreen:   0x2e8b57,
  elfSkin:    0xf0c080,
  elfHair:    0xd4a030,
  swordBlue:  0x6090d0,
  shieldBrown:0x8b4513,
  mapYellow:  0xe8d060,
  // ui
  uiBg:       0x000000,
  uiBorder:   0xffd700,
  uiText:     0xffffff,
  hpGreen:    0x00cc44,
  hpRed:      0xcc2200,
  mpBlue:     0x2266ff,
  // rock
  rock:       0x888888,
  rockDark:   0x555555,
  rockLight:  0xaaaaaa,
};

// ─── Pixel-art drawing helpers ───────────────────────────────────────────────
function drawRect(g, x, y, w, h, color, alpha = 1) {
  g.fillStyle(color, alpha);
  g.fillRect(x, y, w, h);
}

function drawPixels(g, pixels, ox, oy, scale = 1) {
  // pixels = array of [col, row, color]
  for (const [col, row, color] of pixels) {
    g.fillStyle(color, 1);
    g.fillRect(ox + col * scale, oy + row * scale, scale, scale);
  }
}

// ─── Asset generators (called in BootScene preload) ─────────────────────────

function generateTextures(scene) {
  const g = scene.add.graphics();

  // ── Grass tile 16×16 (NES RPG style with more detail)
  g.clear();
  drawRect(g, 0, 0, 16, 16, PAL.grass);
  // texture details - scattered lighter spots
  drawRect(g, 2, 2, 1, 1, PAL.grassLight);
  drawRect(g, 7, 1, 1, 1, PAL.grassLight);
  drawRect(g, 12, 3, 1, 1, PAL.grassLight);
  drawRect(g, 4, 6, 1, 1, PAL.grassLight);
  drawRect(g, 10, 5, 1, 1, PAL.grassLight);
  drawRect(g, 1, 9, 1, 1, PAL.grassLight);
  drawRect(g, 6, 10, 1, 1, PAL.grassLight);
  drawRect(g, 13, 9, 1, 1, PAL.grassLight);
  drawRect(g, 3, 13, 1, 1, PAL.grassLight);
  drawRect(g, 9, 12, 1, 1, PAL.grassLight);
  drawRect(g, 14, 14, 1, 1, PAL.grassLight);
  // darker spots for depth
  drawRect(g, 5, 3, 1, 1, 0x2a6a1e);
  drawRect(g, 11, 7, 1, 1, 0x2a6a1e);
  drawRect(g, 2, 11, 1, 1, 0x2a6a1e);
  drawRect(g, 8, 14, 1, 1, 0x2a6a1e);
  g.generateTexture('grass', 16, 16);

  // ── Grass variant tile
  g.clear();
  drawRect(g, 0, 0, 16, 16, 0x388a28);
  drawRect(g, 1, 1, 1, 1, PAL.grassLight);
  drawRect(g, 5, 4, 1, 1, PAL.grassLight);
  drawRect(g, 11, 2, 1, 1, PAL.grassLight);
  drawRect(g, 3, 8, 1, 1, PAL.grassLight);
  drawRect(g, 9, 10, 1, 1, PAL.grassLight);
  drawRect(g, 14, 6, 1, 1, PAL.grassLight);
  drawRect(g, 7, 13, 1, 1, PAL.grassLight);
  drawRect(g, 0, 14, 1, 1, 0x2a6a1e);
  drawRect(g, 12, 12, 1, 1, 0x2a6a1e);
  // small grass blades
  drawRect(g, 3, 5, 1, 2, 0x4eae38);
  drawRect(g, 10, 8, 1, 2, 0x4eae38);
  g.generateTexture('grass2', 16, 16);

  // ── Dirt / path tile 16×16
  g.clear();
  drawRect(g, 0, 0, 16, 16, PAL.path);
  drawRect(g, 3, 5,  2,  1, PAL.pathDark);
  drawRect(g, 11, 2, 2,  1, PAL.pathDark);
  g.generateTexture('dirt', 16, 16);

  // ── Tree 24×32 (NES RPG style - round canopy)
  g.clear();
  // trunk
  drawRect(g, 10, 22, 4, 10, PAL.wood);
  drawRect(g, 11, 22, 2, 10, PAL.woodLight);
  // canopy - round shape built up
  drawRect(g, 6, 16, 12, 6, PAL.treeGreen);
  drawRect(g, 4, 10, 16, 8, PAL.treeGreen);
  drawRect(g, 2, 6,  20, 8, PAL.treeGreen);
  drawRect(g, 4, 2,  16, 6, PAL.treeGreen);
  drawRect(g, 6, 0,  12, 4, PAL.treeGreen);
  // canopy highlights (top-left light source)
  drawRect(g, 6, 2,  6,  3, PAL.treeTop);
  drawRect(g, 4, 6,  8,  3, PAL.treeTop);
  drawRect(g, 3, 8,  4,  2, PAL.treeTop);
  // canopy shadow (bottom-right)
  drawRect(g, 14, 12, 4, 3, 0x145a06);
  drawRect(g, 10, 16, 6, 2, 0x145a06);
  // leaf detail dots
  drawRect(g, 8, 4, 1, 1, 0x3ab828);
  drawRect(g, 14, 7, 1, 1, 0x3ab828);
  drawRect(g, 6, 11, 1, 1, 0x3ab828);
  g.generateTexture('tree', 24, 32);

  // ── Rock 16×14 (NES style boulder)
  g.clear();
  // main body
  drawRect(g, 3, 6, 10, 8, PAL.rock);
  drawRect(g, 1, 8, 14, 4, PAL.rock);
  drawRect(g, 5, 4, 6, 4, PAL.rock);
  // rounded top
  drawRect(g, 4, 3, 8, 2, PAL.rock);
  drawRect(g, 6, 2, 4, 2, PAL.rockLight);
  // highlights (top-left light)
  drawRect(g, 4, 4, 3, 2, PAL.rockLight);
  drawRect(g, 3, 7, 2, 2, PAL.rockLight);
  // shadows (bottom-right)
  drawRect(g, 10, 8, 3, 3, PAL.rockDark);
  drawRect(g, 7, 12, 5, 2, PAL.rockDark);
  drawRect(g, 2, 12, 12, 1, 0x444444); // ground shadow
  // crack detail
  drawRect(g, 7, 6, 1, 3, PAL.rockDark);
  drawRect(g, 8, 8, 1, 1, PAL.rockDark);
  g.generateTexture('rock', 16, 14);

  // ── House exterior 48×48 (Dragon Quest village style)
  g.clear();
  // wall base
  drawRect(g, 2, 18, 44, 30, 0xd8c8a0); // cream stone wall
  drawRect(g, 2, 18, 44, 1, 0xc0b080);  // wall top edge
  drawRect(g, 2, 47, 44, 1, 0xa09060);  // wall bottom shadow
  // brick lines
  for (let by = 22; by < 47; by += 4) {
    drawRect(g, 2, by, 44, 1, 0xc8b890);
  }
  // wall side shading
  drawRect(g, 2, 18, 2, 30, 0xb8a880);
  drawRect(g, 44, 18, 2, 30, 0xb8a880);
  // roof - triangular look with tiles
  drawRect(g, 0, 8, 48, 12, PAL.roof);
  drawRect(g, 2, 6, 44, 4, PAL.roof);
  drawRect(g, 6, 4, 36, 4, PAL.roofDark);
  drawRect(g, 10, 2, 28, 4, PAL.roofDark);
  drawRect(g, 14, 0, 20, 3, PAL.roofDark);
  // roof tile lines
  drawRect(g, 0, 12, 48, 1, PAL.roofLight);
  drawRect(g, 0, 16, 48, 1, PAL.roofLight);
  drawRect(g, 2, 8, 44, 1, PAL.roofLight);
  // door
  drawRect(g, 19, 30, 10, 18, PAL.wood);
  drawRect(g, 20, 31, 8, 16, PAL.woodLight);
  drawRect(g, 20, 31, 8, 1, 0x5a3a10); // door top
  drawRect(g, 26, 38, 2, 2, 0xd4a030); // door knob
  // windows with frames
  drawRect(g, 5, 24, 10, 8, 0x4080c0);  // glass
  drawRect(g, 5, 24, 10, 1, PAL.wood);   // frame top
  drawRect(g, 5, 31, 10, 1, PAL.wood);   // frame bottom
  drawRect(g, 5, 24, 1, 8, PAL.wood);    // frame left
  drawRect(g, 14, 24, 1, 8, PAL.wood);   // frame right
  drawRect(g, 10, 24, 1, 8, PAL.wood);   // crossbar
  drawRect(g, 5, 28, 10, 1, PAL.wood);   // crossbar h
  // right window
  drawRect(g, 33, 24, 10, 8, 0x4080c0);
  drawRect(g, 33, 24, 10, 1, PAL.wood);
  drawRect(g, 33, 31, 10, 1, PAL.wood);
  drawRect(g, 33, 24, 1, 8, PAL.wood);
  drawRect(g, 42, 24, 1, 8, PAL.wood);
  drawRect(g, 38, 24, 1, 8, PAL.wood);
  drawRect(g, 33, 28, 10, 1, PAL.wood);
  g.generateTexture('house', 48, 48);

  // ── House interior 48×48
  g.clear();
  drawRect(g, 0, 0, 48, 48, 0x4a3820); // floor
  drawRect(g, 0, 0, 48, 2, PAL.wallDark);
  drawRect(g, 0, 46, 48, 2, PAL.wallDark);
  drawRect(g, 0, 0, 2, 48, PAL.wallDark);
  drawRect(g, 46, 0, 2, 48, PAL.wallDark);
  // rug
  drawRect(g, 8, 8, 32, 24, 0x6a1a1a);
  drawRect(g, 10, 10, 28, 20, 0x8a2a2a);
  drawRect(g, 12, 12, 24, 16, 0x6a1a1a);
  g.generateTexture('houseInterior', 48, 48);

  // ── Table 20×12
  g.clear();
  drawRect(g, 0, 0, 20, 8, PAL.wood);
  drawRect(g, 1, 1, 18, 5, PAL.woodLight);
  drawRect(g, 2, 8, 3, 4, PAL.wood);
  drawRect(g, 15, 8, 3, 4, PAL.wood);
  g.generateTexture('table', 20, 12);

  // ── Chest 16×14
  g.clear();
  drawRect(g, 0, 5, 16, 9, PAL.wood);
  drawRect(g, 0, 0, 16, 6, PAL.woodLight);
  drawRect(g, 1, 1, 14, 4, PAL.dirtLight);
  drawRect(g, 6, 4, 4, 3, PAL.dirtLight); // latch
  drawRect(g, 7, 5, 2, 2, PAL.dirt);
  g.generateTexture('chest', 16, 14);

  // ── Player (elf) sprite sheet: 16×16 per frame, 4 frames (down,up,left,right)
  // We'll generate 4 separate textures for simplicity
  const elfFrames = ['playerDown', 'playerUp', 'playerLeft', 'playerRight'];
  const dirColors = [PAL.elfGreen, PAL.elfGreen, PAL.elfGreen, PAL.elfGreen];

  function drawElf(facing) {
    g.clear();
    // body - tunic
    drawRect(g, 4, 7, 8, 7, PAL.elfGreen);
    // legs
    drawRect(g, 4, 13, 3, 3, 0x2a5a40);
    drawRect(g, 9, 13, 3, 3, 0x2a5a40);
    // boots
    drawRect(g, 3, 15, 4, 1, 0x3a2a10);
    drawRect(g, 9, 15, 4, 1, 0x3a2a10);
    // head
    drawRect(g, 4, 2, 8, 7, PAL.elfSkin);
    // ears (pointed - elf!)
    if (facing === 'left' || facing === 'down' || facing === 'up') {
      drawRect(g, 2, 3, 2, 3, PAL.elfSkin);
      drawRect(g, 2, 2, 1, 1, PAL.elfSkin);
    }
    if (facing === 'right' || facing === 'down' || facing === 'up') {
      drawRect(g, 12, 3, 2, 3, PAL.elfSkin);
      drawRect(g, 13, 2, 1, 1, PAL.elfSkin);
    }
    // hair
    drawRect(g, 4, 2, 8, 2, PAL.elfHair);
    drawRect(g, 3, 3, 2, 1, PAL.elfHair);
    drawRect(g, 11, 3, 2, 1, PAL.elfHair);
    // eyes
    if (facing === 'down') {
      drawRect(g, 6, 6, 1, 1, PAL.black);
      drawRect(g, 9, 6, 1, 1, PAL.black);
    } else if (facing === 'up') {
      // back of head, hair dominates
      drawRect(g, 4, 2, 8, 7, PAL.elfHair);
      drawRect(g, 4, 7, 8, 7, PAL.elfGreen);
    } else if (facing === 'left') {
      drawRect(g, 5, 6, 1, 1, PAL.black);
    } else if (facing === 'right') {
      drawRect(g, 10, 6, 1, 1, PAL.black);
    }
    // belt
    drawRect(g, 4, 11, 8, 1, PAL.dirtLight);
    // sword if facing right
    if (facing === 'right') {
      drawRect(g, 13, 8, 1, 6, PAL.swordBlue);
      drawRect(g, 12, 10, 2, 1, PAL.lightGray);
    } else if (facing === 'left') {
      drawRect(g, 2, 8, 1, 6, PAL.swordBlue);
      drawRect(g, 2, 10, 2, 1, PAL.lightGray);
    }
  }

  drawElf('down');  g.generateTexture('playerDown',  16, 16);
  drawElf('up');    g.generateTexture('playerUp',    16, 16);
  drawElf('left');  g.generateTexture('playerLeft',  16, 16);
  drawElf('right'); g.generateTexture('playerRight', 16, 16);

  // ── Professor NPC 16×16
  g.clear();
  // robe
  drawRect(g, 3, 7, 10, 9, 0x4a3080);
  drawRect(g, 4, 15, 4, 1, 0x2a1860);
  drawRect(g, 8, 15, 4, 1, 0x2a1860);
  // head
  drawRect(g, 4, 2, 8, 7, PAL.elfSkin);
  // white beard
  drawRect(g, 4, 7, 8, 4, PAL.white);
  // white hair
  drawRect(g, 3, 2, 10, 2, PAL.lightGray);
  drawRect(g, 2, 3, 2,  2, PAL.lightGray);
  drawRect(g, 12, 3, 2, 2, PAL.lightGray);
  // glasses
  drawRect(g, 5, 5, 2, 1, PAL.darkGray);
  drawRect(g, 9, 5, 2, 1, PAL.darkGray);
  drawRect(g, 7, 5, 2, 1, PAL.darkGray);
  // staff
  drawRect(g, 14, 4, 1, 12, PAL.wood);
  drawRect(g, 13, 3, 3, 2, 0xd4a030);
  g.generateTexture('professor', 16, 16);

  // ── Sword item 12×12
  g.clear();
  drawRect(g, 5, 0, 2, 10, PAL.swordBlue);
  drawRect(g, 5, 0, 2, 2,  PAL.white);
  drawRect(g, 3, 7, 6, 1,  PAL.lightGray);
  drawRect(g, 5, 9, 2, 3,  PAL.wood);
  g.generateTexture('itemSword', 12, 12);

  // ── Shield item 12×12
  g.clear();
  drawRect(g, 2, 0, 8, 10, PAL.shieldBrown);
  drawRect(g, 3, 1, 6, 7,  0xc46020);
  drawRect(g, 5, 3, 2, 3,  PAL.dirtLight);
  drawRect(g, 4, 9, 4, 2,  PAL.shieldBrown);
  g.generateTexture('itemShield', 12, 12);

  // ── Map item 12×12
  g.clear();
  drawRect(g, 0, 0, 12, 10, PAL.mapYellow);
  drawRect(g, 1, 1, 10, 8,  0xf0e0a0);
  drawRect(g, 2, 2, 3,  2,  PAL.grass);
  drawRect(g, 7, 4, 3,  3,  PAL.waterLight);
  drawRect(g, 3, 5, 2,  1,  PAL.dirt);
  drawRect(g, 4, 7, 4,  1,  PAL.dirt);
  drawRect(g, 0, 10, 12, 2, PAL.wood);
  g.generateTexture('itemMap', 12, 12);

  // ── Enemy (forest creature) 16×16
  g.clear();
  drawRect(g, 3, 2, 10, 12, 0x1a3a10);  // body
  drawRect(g, 5, 0, 6,  4,  0x2a5a18);  // head
  drawRect(g, 3, 2, 10, 3,  0x2a5a18);
  drawRect(g, 1, 5, 3,  5,  0x1a3a10);  // left arm
  drawRect(g, 12, 5, 3, 5,  0x1a3a10); // right arm
  drawRect(g, 5, 13, 3, 3,  0x1a3a10); // legs
  drawRect(g, 8, 13, 3, 3,  0x1a3a10);
  drawRect(g, 6, 1,  1, 1,  0xff4444);  // eyes
  drawRect(g, 9, 1,  1, 1,  0xff4444);
  drawRect(g, 6, 3,  4, 1,  0xffcc00);  // teeth
  g.generateTexture('enemy', 16, 16);

  // ── Combat BG (forest) - 480×64 strip
  g.clear();
  drawRect(g, 0, 0, 480, 64, 0x0a1a06);
  for (let i = 0; i < 480; i += 30) {
    drawRect(g, i, 0,    20, 40, PAL.treeGreen);
    drawRect(g, i+4, 0, 12, 35, PAL.treeTop);
    drawRect(g, i+8, 40, 4, 24, PAL.wood);
  }
  g.generateTexture('combatBgForest', 480, 64);

  g.destroy();
}

// ─── BootScene ───────────────────────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    generateTextures(this);

    // Title screen
    this.add.rectangle(240, 180, 480, 360, PAL.black);

    // Title text
    const titleStyle = { fontSize: '20px', fill: '#ffd700', fontFamily: 'Courier New', stroke: '#000', strokeThickness: 4 };
    this.add.text(240, 80, 'GreenMountainFog', titleStyle).setOrigin(0.5);
    this.add.text(240, 108, 'The Journey', { ...titleStyle, fontSize: '14px', fill: '#aaffaa' }).setOrigin(0.5);

    // Draw mini elf on title
    const g = this.add.graphics();
    // simple elf silhouette
    g.fillStyle(PAL.elfGreen, 1); g.fillRect(224, 150, 32, 28);
    g.fillStyle(PAL.elfSkin, 1); g.fillRect(228, 138, 24, 18);
    g.fillStyle(PAL.elfHair, 1); g.fillRect(228, 138, 24, 6);

    const startText = this.add.text(240, 220, 'PRESS START', {
      fontSize: '12px', fill: '#ffffff', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(240, 240, 'Tap anywhere or press SPACE', {
      fontSize: '8px', fill: '#888888', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(240, 340, '© 2024 GreenMountainFog', {
      fontSize: '7px', fill: '#555555', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Blink start text
    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => { startText.setVisible(!startText.visible); }
    });

    const startGame = () => this.scene.start('Overworld');
    this.input.keyboard.once('keydown-ENTER', startGame);
    this.input.keyboard.once('keydown-SPACE', startGame);
    this.input.once('pointerdown', startGame);
  }
}

// ─── UIScene (inventory overlay) ─────────────────────────────────────────────
class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI', active: false });
    this.inventory = [];
    this.messageQueue = [];
    this.messageTimer = null;
  }

  create() {
    this.invBg = this.add.rectangle(382, 12, 184, 52, PAL.uiBg, 0.85).setOrigin(0, 0);
    this.add.rectangle(382, 12, 184, 52, PAL.uiBorder, 0).setStrokeStyle(2, PAL.uiBorder).setOrigin(0, 0);
    this.invLabel = this.add.text(390, 18, 'ITEMS:', {
      fontSize: '9px', fill: '#ffd700', fontFamily: 'Courier New'
    });

    this.itemSlots = [];
    this.itemIcons = [];
    const items = ['itemSword', 'itemShield', 'itemMap'];
    const labels = ['Sword', 'Shield', 'Map'];
    for (let i = 0; i < 3; i++) {
      const sx = 390 + i * 56;
      const sy = 32;
      const slot = this.add.rectangle(sx + 12, sy + 12, 28, 28, 0x333333, 0.9).setStrokeStyle(1, 0x666666);
      this.itemSlots.push(slot);
      const icon = this.add.image(sx + 12, sy + 12, items[i]).setAlpha(0.25).setScale(1.8);
      this.itemIcons.push(icon);
      this.add.text(sx + 2, sy + 28, labels[i], {
        fontSize: '7px', fill: '#888888', fontFamily: 'Courier New'
      });
    }

    // Message box (bottom)
    this.msgBox = this.add.rectangle(8, 290, 464, 60, PAL.uiBg, 0).setOrigin(0, 0);
    this.msgText = this.add.text(16, 298, '', {
      fontSize: '10px', fill: PAL.uiText, fontFamily: 'Courier New',
      wordWrap: { width: 448 }, lineSpacing: 4
    });
    this.hideMessage();
  }

  updateInventory(inv) {
    this.inventory = inv;
    const keys = ['sword', 'shield', 'map'];
    for (let i = 0; i < 3; i++) {
      if (inv.includes(keys[i])) {
        this.itemIcons[i].setAlpha(1);
        this.itemSlots[i].setFillStyle(0x224422, 0.9).setStrokeStyle(1, PAL.uiBorder);
      }
    }
  }

  showMessage(text, duration = 3000) {
    this.msgBox.setFillStyle(PAL.uiBg, 0.92).setStrokeStyle(2, PAL.uiBorder);
    this.msgText.setText(text);
    this.msgText.setVisible(true);
    if (this.messageTimer) this.messageTimer.remove();
    if (duration > 0) {
      this.messageTimer = this.time.delayedCall(duration, () => this.hideMessage());
    }
  }

  hideMessage() {
    this.msgBox.setFillStyle(PAL.uiBg, 0);
    this.msgBox.setStrokeStyle(0, 0x000000);
    this.msgText.setVisible(false);
  }
}

// ─── OverworldScene ───────────────────────────────────────────────────────────
class OverworldScene extends Phaser.Scene {
  constructor() {
    super('Overworld');
    this.inventory = [];
    this.interactables = [];
    this.inHouse = false;
    this.questTriggered = false;
    this.questComplete = false;
    this.professorActive = false;
    this.dialogueLine = 0;
    this.inDialogue = false;
  }

  create() {
    this.scene.launch('UI');
    this.ui = this.scene.get('UI');

    this.buildVillage();
    this.createPlayer();
    this.createInteractables();
    this.createProfessor();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.cameras.main.setBounds(0, 0, 576, 576);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Show intro dialogue sequence
    this.introActive = true;
    this.introLines = [
      "Welcome, young elf. Today feels\ndifferent somehow...",
      "Perhaps you should look around\nthe village before setting off.",
      "Check inside the houses, under\nrocks, and in the trees...",
      "You never know what you\nmight find.",
    ];
    this.introIndex = 0;
    this.time.delayedCall(500, () => {
      this.showIntroLine();
    });
  }

  showIntroLine() {
    if (this.introIndex >= this.introLines.length) {
      this.introActive = false;
      this.ui.hideMessage();
      return;
    }
    const line = this.introLines[this.introIndex];
    const prompt = this.introIndex < this.introLines.length - 1 ? '\n\n[SPACE / TAP A to continue]' : '\n\n[SPACE / TAP A to begin]';
    this.ui.showMessage(line + prompt, 0);
  }

  advanceIntro() {
    this.introIndex++;
    this.showIntroLine();
  }

  buildVillage() {
    const W = 36, H = 36; // tiles
    this.tileW = 16; this.tileH = 16;
    this.mapWidth  = W * this.tileW;
    this.mapHeight = H * this.tileH;

    // Ground layer with variation
    for (let row = 0; row < H; row++) {
      for (let col = 0; col < W; col++) {
        const tex = ((col + row * 7) % 3 === 0) ? 'grass2' : 'grass';
        this.add.image(col * 16 + 8, row * 16 + 8, tex).setDepth(0);
      }
    }

    // Paths (horizontal + vertical cross through center)
    // Vertical path col 16-19
    for (let row = 0; row < H; row++) {
      for (let pc = 16; pc <= 19; pc++) {
        this.add.image(pc * 16 + 8, row * 16 + 8, 'dirt').setDepth(1);
      }
    }
    // Horizontal path row 16-19
    for (let col = 0; col < W; col++) {
      for (let pr = 16; pr <= 19; pr++) {
        this.add.image(col * 16 + 8, pr * 16 + 8, 'dirt').setDepth(1);
      }
    }

    // Collision walls (invisible, static physics)
    this.walls = this.physics.add.staticGroup();

    // Border walls
    this.addWallRect(0, 0, W * 16, 16);
    this.addWallRect(0, (H - 1) * 16, W * 16, 16);
    this.addWallRect(0, 0, 16, H * 16);
    this.addWallRect((W - 1) * 16, 0, 16, H * 16);

    // ── Houses ──
    // House 1: top-left area (col 4, row 4)
    this.placeHouse(64, 64, 'House 1');
    // House 2: top-right area
    this.placeHouse(400, 64, 'House 2');
    // House 3: bottom-left
    this.placeHouse(64, 400, 'House 3');
    // House 4 (Professor's house): bottom-right
    this.placeHouse(400, 400, "Professor's House");

    // ── Trees ── (scatter around edges)
    const treePositions = [
      [32, 160],[32, 200],[32, 240],[32, 288],[32, 320],
      [544, 160],[544, 200],[544, 240],[544, 288],[544, 320],
      [160, 32],[200, 32],[240, 32],[288, 32],[320, 32],[360, 32],
      [160, 544],[200, 544],[240, 544],[288, 544],[320, 544],[360, 544],
      [120, 120],[136, 96],[96, 136],
      [420, 120],[436, 96],[456, 136],
      [120, 420],[136, 450],[96, 440],
      [456, 420],[436, 450],[480, 440],
    ];
    this.trees = [];
    for (const [tx, ty] of treePositions) {
      const t = this.add.image(tx, ty, 'tree').setOrigin(0.5, 1).setDepth(3);
      this.trees.push(t);
      // Collision body at trunk
      const w = this.walls.create(tx, ty - 4, null).setVisible(false);
      w.setSize(10, 8).refreshBody();
    }

    // ── Rocks ──
    const rockPositions = [
      [200, 200],[340, 200],[200, 340],[340, 340],
      [160, 260],[380, 260],
    ];
    this.rocks = [];
    for (const [rx, ry] of rockPositions) {
      const r = this.add.image(rx, ry, 'rock').setDepth(2);
      this.rocks.push({ sprite: r, x: rx, y: ry });
      const w = this.walls.create(rx, ry, null).setVisible(false);
      w.setSize(14, 10).refreshBody();
    }

    // ── Village sign ──
    const sg = this.add.graphics();
    drawRect(sg, 0, 0, 40, 20, PAL.wood);
    drawRect(sg, 1, 1, 38, 18, PAL.woodLight);
    drawRect(sg, 18, 20, 4, 12, PAL.wood);
    sg.generateTexture('sign', 40, 32);
    this.add.image(288, 310, 'sign').setDepth(2);
    this.add.text(270, 303, 'Greenvale', {
      fontSize: '7px', fill: '#3a1a00', fontFamily: 'Courier New'
    }).setDepth(3);

    // ── Well ──
    const wg = this.add.graphics();
    drawRect(wg, 2, 6, 20, 16, PAL.gray);
    drawRect(wg, 0, 4, 24, 4, PAL.darkGray);
    drawRect(wg, 8, 0, 2, 8, PAL.wood);
    drawRect(wg, 14, 0, 2, 8, PAL.wood);
    drawRect(wg, 7, 0, 10, 2, PAL.wood);
    drawRect(wg, 6, 8, 12, 2, PAL.waterLight);
    wg.generateTexture('well', 24, 22);
    this.add.image(288, 288, 'well').setDepth(2);
    const wellWall = this.walls.create(288, 288, null).setVisible(false);
    wellWall.setSize(24, 22).refreshBody();
    sg.destroy();
    wg.destroy();
  }

  placeHouse(x, y, label) {
    this.add.image(x + 24, y + 24, 'house').setDepth(2);
    // Wall collider for house
    const hw = this.walls.create(x + 24, y + 40, null).setVisible(false);
    hw.setSize(48, 16).refreshBody();
    const hwTop = this.walls.create(x + 24, y, null).setVisible(false);
    hwTop.setSize(48, 16).refreshBody();
    const hwL = this.walls.create(x, y + 24, null).setVisible(false);
    hwL.setSize(16, 48).refreshBody();
    const hwR = this.walls.create(x + 48, y + 24, null).setVisible(false);
    hwR.setSize(16, 48).refreshBody();
  }

  addWallRect(x, y, w, h) {
    const wall = this.walls.create(x + w / 2, y + h / 2, null).setVisible(false);
    wall.setSize(w, h).refreshBody();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(288, 288, 'playerDown');
    this.player.setDepth(5);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(10, 8).setOffset(3, 8);
    this.physics.add.collider(this.player, this.walls);
    this.facing = 'down';
    this.moveSpeed = 90;
    this.lastInteract = 0;
  }

  createInteractables() {
    // ── Rock (shield) — rock at 340, 200
    this.rockInteract = {
      x: 340, y: 200, radius: 22,
      item: 'shield', itemKey: 'itemShield',
      collected: false,
      onInteract: () => this.collectItem('shield', 'You found a SHIELD hidden under the rock!'),
    };

    // ── Tree (map) — tree at 136, 96 area; use the one at 240,32
    this.treeInteract = {
      x: 240, y: 32, radius: 24,
      item: 'map', itemKey: 'itemMap',
      collected: false,
      onInteract: () => this.collectItem('map', 'You found a MAP hidden in the branches of the tree!'),
    };

    // ── House door (sword) — House 1 at 64,64; door is around 64+18=82, 64+42=106
    this.houseDoor = {
      x: 88, y: 110, radius: 18,
      label: 'Enter House',
      onInteract: () => this.enterHouse(),
    };

    this.interactables = [this.rockInteract, this.treeInteract, this.houseDoor];
  }

  collectItem(itemName, message) {
    if (this.inventory.includes(itemName)) return;
    this.inventory.push(itemName);
    this.ui.updateInventory(this.inventory);
    this.ui.showMessage(message, 3000);

    // Flash effect
    this.cameras.main.flash(200, 255, 255, 255);

    // Check quest trigger
    if (this.inventory.length === 3 && !this.questTriggered) {
      this.time.delayedCall(3500, () => this.triggerProfessor());
    }
  }

  enterHouse() {
    if (this.inHouse) return;
    this.inHouse = true;
    this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
      if (progress === 1) this.showHouseInterior();
    });
  }

  showHouseInterior() {
    // Show interior overlay
    this.houseOverlay = this.add.container(0, 0).setDepth(20);
    const bg = this.add.rectangle(288, 200, 240, 200, 0x000000, 0.95);
    const interior = this.add.image(288, 190, 'houseInterior').setScale(4);
    const table    = this.add.image(270, 175, 'table').setScale(2);
    const chest    = this.add.image(340, 155, 'chest').setScale(2.5);
    const exitText = this.add.text(200, 270, '[SPACE/TAP A] Take item / [Q] Exit', {
      fontSize: '9px', fill: '#aaaaaa', fontFamily: 'Courier New'
    });
    const titleText = this.add.text(215, 105, '~ Inside the House ~', {
      fontSize: '10px', fill: '#ffd700', fontFamily: 'Courier New'
    });
    this.houseOverlay.add([bg, interior, table, chest, exitText, titleText]);

    let swordTaken = this.inventory.includes('sword');
    let swordIcon;
    if (!swordTaken) {
      swordIcon = this.add.image(340, 155, 'itemSword').setScale(2).setDepth(21);
      this.add.text(312, 170, 'Sword!', { fontSize: '8px', fill: '#6090d0', fontFamily: 'Courier New' }).setDepth(21);
      this.houseOverlay.add(swordIcon);
    } else {
      this.add.text(308, 155, '(empty)', { fontSize: '8px', fill: '#555555', fontFamily: 'Courier New' }).setDepth(21);
      this.houseOverlay.add(this.children.list[this.children.list.length - 1]);
    }

    this.cameras.main.fadeIn(300);

    // Interact to take sword (keyboard + touch)
    const takeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const qKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    const doTake = () => {
      if (!this.inventory.includes('sword')) {
        this.collectItem('sword', 'You found a SWORD inside the chest!');
      }
      this.exitHouse();
      qKey.off('down', doExit);
      this.input.off('pointerdown', doTake);
    };

    const doExit = () => {
      this.exitHouse();
      takeKey.off('down', doTake);
      this.input.off('pointerdown', doTake);
    };

    takeKey.once('down', doTake);
    qKey.once('down', doExit);
    // Touch: tap anywhere to take/exit
    this.input.once('pointerdown', doTake);
  }

  exitHouse() {
    this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
      if (progress === 1) {
        this.houseOverlay.destroy();
        this.inHouse = false;
        this.cameras.main.fadeIn(300);
        this.ui.showMessage('You left the house.', 1500);
      }
    });
  }

  createProfessor() {
    this.professor = this.physics.add.sprite(320, 288, 'professor');
    this.professor.setDepth(5).setAlpha(0);
    this.professor.setImmovable(true);
    this.professorVisible = false;

    this.professorDialogue = [
      "Ah, there you are! I've been looking for you.",
      "My daughter, Elara, traveled through the Dark Woods to visit\nan old family friend in Maplehollow.",
      "The friend had written a letter saying a troublemaker\nhad come to their village causing problems.",
      "Elara went to help, but I've heard nothing since.\nI fear for her safety.",
      "You are the bravest soul in Greenvale.\nWill you venture through the Dark Woods and find her?",
      "Take the map — it will guide your way.\nThe path into the woods lies to the east. Good luck!",
      "[ To be continued... ]",
    ];
  }

  triggerProfessor() {
    if (this.questTriggered) return;
    this.questTriggered = true;
    this.professor.setAlpha(1);
    this.professorVisible = true;

    this.ui.showMessage('A figure approaches from the village...', 2000);

    // Walk professor toward player
    this.physics.moveTo(this.professor, 288, 272, 40);
    this.time.delayedCall(2500, () => {
      this.professor.setVelocity(0, 0);
      this.startDialogue();
    });
  }

  startDialogue() {
    this.inDialogue = true;
    this.dialogueLine = 0;
    this.showDialogueLine();
  }

  showDialogueLine() {
    const line = this.professorDialogue[this.dialogueLine];
    const isLast = this.dialogueLine === this.professorDialogue.length - 1;
    const prefix = isLast ? '' : 'Professor: ';

    if (isLast) {
      this.ui.showMessage(line, 0); // persist
      this.inDialogue = false;
      this.questComplete = true;
      this.time.delayedCall(4000, () => {
        this.ui.showMessage('Thank you for playing GreenMountainFog - The Journey!\n(More content coming soon...)', 0);
      });
    } else {
      this.ui.showMessage(prefix + line + '\n\n[SPACE / TAP A to continue]', 0);
    }
  }

  advanceDialogue() {
    this.dialogueLine++;
    if (this.dialogueLine < this.professorDialogue.length) {
      this.showDialogueLine();
    }
  }

  update(time, delta) {
    if (this.inHouse) return;

    // Read touch input from HTML overlay
    const td = window.touchDir || {};
    const touchJust = window.touchActionJust || false;
    if (touchJust) window.touchActionJust = false;

    const speed = this.moveSpeed;
    let vx = 0, vy = 0;

    const canMove = (!this.inDialogue && !this.introActive) || this.questComplete;
    if (canMove) {
      if (this.cursors.left.isDown || td.left)   { vx = -speed; this.facing = 'left';  this.player.setTexture('playerLeft'); }
      if (this.cursors.right.isDown || td.right)  { vx =  speed; this.facing = 'right'; this.player.setTexture('playerRight'); }
      if (this.cursors.up.isDown || td.up)        { vy = -speed; this.facing = 'up';    this.player.setTexture('playerUp'); }
      if (this.cursors.down.isDown || td.down)    { vy =  speed; this.facing = 'down';  this.player.setTexture('playerDown'); }
    }

    this.player.setVelocity(vx, vy);

    // Depth sort player vs trees
    this.player.setDepth(5 + this.player.y / 1000);

    // Interact
    const interactPressed = Phaser.Input.Keyboard.JustDown(this.interactKey) ||
                            Phaser.Input.Keyboard.JustDown(this.enterKey) ||
                            touchJust;

    if (interactPressed) {
      if (this.introActive) {
        this.advanceIntro();
        return;
      }
      if (this.inDialogue) {
        this.advanceDialogue();
        return;
      }
      this.checkInteract();
    }
  }

  checkInteract() {
    const px = this.player.x, py = this.player.y;

    for (const ia of this.interactables) {
      if (ia.collected) continue;
      const dist = Phaser.Math.Distance.Between(px, py, ia.x, ia.y);
      if (dist < ia.radius) {
        ia.collected = true;
        ia.onInteract();
        return;
      }
    }

    // Professor interaction
    if (this.professorVisible && !this.inDialogue && !this.questComplete) {
      const dist = Phaser.Math.Distance.Between(px, py, this.professor.x, this.professor.y);
      if (dist < 40) {
        this.startDialogue();
      }
    }
  }
}

// ─── CombatScene (Final Fantasy-style framework) ──────────────────────────────
class CombatScene extends Phaser.Scene {
  constructor() {
    super('Combat');
    this.playerHP = 100; this.playerMaxHP = 100;
    this.playerMP = 40;  this.playerMaxMP = 40;
    this.enemyHP  = 60;  this.enemyMaxHP  = 60;
    this.turn = 'player'; // 'player' | 'enemy'
    this.menuIndex = 0;
    this.menuOptions = ['Attack', 'Defend', 'Item'];
    this.defending = false;
    this.battleLog = [];
    this.busy = false;
  }

  create() {
    const W = 480, H = 360;

    // Background - forest
    this.add.image(240, 40, 'combatBgForest').setOrigin(0.5, 0).setScale(1, 1);
    this.add.rectangle(240, 180, W, H, 0x0a0e0a);
    this.add.image(240, 40, 'combatBgForest').setOrigin(0.5, 0).setScale(1, 1).setAlpha(0.9);

    // Ground line
    this.add.rectangle(240, 160, W, 4, 0x1a3a10);

    // Enemy sprite
    this.enemySprite = this.add.image(340, 130, 'enemy').setScale(4).setFlipX(true);

    // Player sprite (combat pose)
    this.playerSprite = this.add.image(120, 140, 'playerRight').setScale(4);

    // ── HP/MP bars ──
    // Player panel
    this.add.rectangle(100, 195, 180, 50, PAL.uiBg, 0.9).setStrokeStyle(2, PAL.uiBorder);
    this.add.text(16, 180, 'HERO', { fontSize: '9px', fill: '#ffd700', fontFamily: 'Courier New' });
    this.add.text(16, 192, 'HP', { fontSize: '9px', fill: '#aaffaa', fontFamily: 'Courier New' });
    this.playerHPBar = this.drawBar(40, 190, 130, 10, PAL.hpGreen);
    this.add.text(16, 206, 'MP', { fontSize: '9px', fill: '#aaaaff', fontFamily: 'Courier New' });
    this.playerMPBar = this.drawBar(40, 204, 130, 10, PAL.mpBlue);
    this.playerHPText = this.add.text(176, 190, `${this.playerHP}`, { fontSize: '8px', fill: '#ffffff', fontFamily: 'Courier New' });
    this.playerMPText = this.add.text(176, 204, `${this.playerMP}`, { fontSize: '8px', fill: '#ffffff', fontFamily: 'Courier New' });

    // Enemy panel
    this.add.rectangle(360, 195, 180, 30, PAL.uiBg, 0.9).setStrokeStyle(2, PAL.uiBorder);
    this.add.text(276, 182, 'CREATURE', { fontSize: '9px', fill: '#ff8888', fontFamily: 'Courier New' });
    this.add.text(276, 194, 'HP', { fontSize: '9px', fill: '#aaffaa', fontFamily: 'Courier New' });
    this.enemyHPBar = this.drawBar(300, 192, 130, 10, PAL.hpGreen);
    this.enemyHPText = this.add.text(436, 192, `${this.enemyHP}`, { fontSize: '8px', fill: '#ffffff', fontFamily: 'Courier New' });

    // ── Menu panel ──
    this.menuPanel = this.add.rectangle(100, 295, 180, 90, PAL.uiBg, 0.92).setStrokeStyle(2, PAL.uiBorder);
    this.menuTitle = this.add.text(18, 258, 'COMMAND', { fontSize: '9px', fill: '#ffd700', fontFamily: 'Courier New' });
    this.menuTexts = this.menuOptions.map((opt, i) =>
      this.add.text(28, 272 + i * 14, opt, { fontSize: '10px', fill: '#ffffff', fontFamily: 'Courier New' })
    );
    this.menuCursor = this.add.text(18, 272, '>', { fontSize: '10px', fill: '#ffd700', fontFamily: 'Courier New' });

    // ── Battle log ──
    this.logPanel = this.add.rectangle(330, 295, 290, 90, PAL.uiBg, 0.92).setStrokeStyle(2, PAL.uiBorder);
    this.logTexts = [];
    for (let i = 0; i < 4; i++) {
      this.logTexts.push(this.add.text(192, 262 + i * 14, '', { fontSize: '9px', fill: '#dddddd', fontFamily: 'Courier New' }));
    }

    // ── Input ──
    this.cursors = this.input.keyboard.createCursorKeys();
    this.confirmKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.addLog('A wild creature appears!');
    this.addLog('What will you do?');
    this.updateMenuCursor();
    this.updateBars();
  }

  drawBar(x, y, w, h, color) {
    const bg = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x333333);
    const bar = this.add.rectangle(x + w / 2, y + h / 2, w, h, color);
    return { bg, bar, maxW: w, x, y, h };
  }

  setBar(barObj, current, max) {
    const pct = Phaser.Math.Clamp(current / max, 0, 1);
    const newW = Math.max(1, barObj.maxW * pct);
    barObj.bar.setSize(newW, barObj.h);
    barObj.bar.setX(barObj.x + newW / 2);
    // color shift
    const color = pct > 0.5 ? PAL.hpGreen : pct > 0.25 ? 0xffcc00 : PAL.hpRed;
    barObj.bar.setFillStyle(color);
  }

  updateBars() {
    this.setBar(this.playerHPBar, this.playerHP, this.playerMaxHP);
    this.setBar(this.playerMPBar, this.playerMP, this.playerMaxMP);
    this.setBar(this.enemyHPBar,  this.enemyHP,  this.enemyMaxHP);
    this.playerHPText.setText(`${this.playerHP}`);
    this.playerMPText.setText(`${this.playerMP}`);
    this.enemyHPText.setText(`${this.enemyHP}`);
  }

  addLog(text) {
    this.battleLog.push(text);
    const recent = this.battleLog.slice(-4);
    for (let i = 0; i < 4; i++) {
      this.logTexts[i].setText(recent[i] || '');
    }
  }

  updateMenuCursor() {
    this.menuCursor.setY(272 + this.menuIndex * 14);
  }

  update() {
    if (this.busy || this.turn !== 'player') return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.menuIndex = (this.menuIndex - 1 + 3) % 3;
      this.updateMenuCursor();
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.menuIndex = (this.menuIndex + 1) % 3;
      this.updateMenuCursor();
    }

    const confirm = Phaser.Input.Keyboard.JustDown(this.confirmKey) ||
                    Phaser.Input.Keyboard.JustDown(this.enterKey);
    if (confirm) {
      this.executePlayerAction(this.menuOptions[this.menuIndex]);
    }
  }

  executePlayerAction(action) {
    this.busy = true;
    this.defending = false;

    if (action === 'Attack') {
      const dmg = Phaser.Math.Between(12, 22);
      this.enemyHP = Math.max(0, this.enemyHP - dmg);
      this.addLog(`Hero attacks for ${dmg} damage!`);
      this.tweens.add({ targets: this.playerSprite, x: '+=40', duration: 80, yoyo: true });

      if (this.enemyHP === 0) {
        this.updateBars();
        this.time.delayedCall(400, () => {
          this.addLog('Enemy defeated! Victory!');
          this.busy = false;
        });
        return;
      }
    } else if (action === 'Defend') {
      this.defending = true;
      this.addLog('Hero takes a defensive stance!');
    } else if (action === 'Item') {
      const heal = 20;
      this.playerHP = Math.min(this.playerMaxHP, this.playerHP + heal);
      this.addLog(`Used Potion! Restored ${heal} HP.`);
    }

    this.updateBars();
    this.time.delayedCall(600, () => this.enemyTurn());
  }

  enemyTurn() {
    this.turn = 'enemy';
    const baseDmg = Phaser.Math.Between(8, 16);
    const dmg = this.defending ? Math.floor(baseDmg / 2) : baseDmg;
    this.playerHP = Math.max(0, this.playerHP - dmg);
    const suffix = this.defending ? ' (blocked half!)' : '';
    this.addLog(`Creature attacks for ${dmg} dmg!${suffix}`);
    this.tweens.add({ targets: this.enemySprite, x: '-=30', duration: 80, yoyo: true });
    this.updateBars();

    if (this.playerHP === 0) {
      this.time.delayedCall(400, () => {
        this.addLog('Hero has fallen... Game Over.');
        this.busy = false;
        this.turn = 'player'; // allow restart
      });
      return;
    }

    this.time.delayedCall(600, () => {
      this.turn = 'player';
      this.busy = false;
      this.addLog('Your turn. Choose an action.');
    });
  }
}

// ─── Game Config ─────────────────────────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 360,
  parent: 'game-container',
  backgroundColor: '#0a0a0a',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene, OverworldScene, UIScene, CombatScene],
};

const game = new Phaser.Game(config);
