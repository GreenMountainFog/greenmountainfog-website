/* ===== GreenMountainFog - The Journey =====
   NES-style JRPG built with Phaser 3
   All graphics generated programmatically */

const TILE = 16;
const MAP_W = 30, MAP_H = 30;
const GAME_W = 256, GAME_H = 240;
const SPEED = 80;

// NES Color Palette
const C = {
  grass1: 0x38b764, grass2: 0x2d9e54,
  path: 0xd2a068, pathEdge: 0xb8884a,
  trunk: 0x5c3a1e, canopy: 0x1e6b38, canopyLight: 0x38b764,
  wall: 0x8b4513, wallLight: 0xa0622e, roof: 0xcc3333, roofDark: 0x992222,
  door: 0x6b3410, window: 0x3388de,
  water: 0x3388de, waterLight: 0x55aaee,
  rock: 0x888888, rockDark: 0x666666, rockLight: 0xaaaaaa,
  skin: 0xf8c890, tunic: 0x38b764, tunicDark: 0x1e6b38,
  hair: 0xd4a03c, hat: 0x1e6b38,
  sword: 0xcccccc, shield: 0x3366aa, mapItem: 0xd4a03c,
  profRobe: 0x5544aa, profHair: 0xcccccc,
  black: 0x000000, white: 0xffffff,
  textBg: 0x000030, uiBorder: 0xffffff,
  enemy: 0x884422, enemyEye: 0xff0000,
};

// Helper: fill rect on a Phaser Graphics object
function fr(g, x, y, w, h, color) {
  g.fillStyle(color, 1);
  g.fillRect(x, y, w, h);
}

// ===== TEXTURE GENERATION =====
function genTextures(scene) {
  // -- Grass tiles (2 variants) --
  for (let v = 0; v < 2; v++) {
    const g = scene.make.graphics({add:false});
    fr(g, 0, 0, TILE, TILE, v === 0 ? C.grass1 : C.grass2);
    // scattered detail pixels
    for (let i = 0; i < 4; i++) {
      const px = Math.floor(Math.random()*14)+1;
      const py = Math.floor(Math.random()*14)+1;
      fr(g, px, py, 1, 1, v === 0 ? 0x2d9e54 : 0x48c874);
    }
    g.generateTexture('grass'+v, TILE, TILE);
    g.destroy();
  }

  // -- Path tile --
  let g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.path);
  for (let i = 0; i < 6; i++) {
    fr(g, Math.floor(Math.random()*14)+1, Math.floor(Math.random()*14)+1, 1, 1, C.pathEdge);
  }
  g.generateTexture('path', TILE, TILE);
  g.destroy();

  // -- Tree --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1); // bg
  fr(g, 6, 8, 4, 8, C.trunk); // trunk
  fr(g, 2, 1, 12, 9, C.canopy); // canopy
  fr(g, 4, 2, 8, 6, C.canopyLight); // canopy highlight
  fr(g, 6, 0, 4, 3, C.canopy); // top
  g.generateTexture('tree', TILE, TILE);
  g.destroy();

  // -- Special tree (has Map item) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  fr(g, 6, 8, 4, 8, C.trunk);
  fr(g, 2, 1, 12, 9, 0x2a7d3a); // slightly different canopy
  fr(g, 4, 2, 8, 6, 0x44bb55);
  fr(g, 6, 0, 4, 3, 0x2a7d3a);
  fr(g, 7, 5, 2, 2, C.mapItem); // glint
  g.generateTexture('treeSpecial', TILE, TILE);
  g.destroy();

  // -- Rock --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  fr(g, 2, 4, 12, 10, C.rock);
  fr(g, 3, 5, 10, 8, C.rockLight);
  fr(g, 4, 3, 8, 4, C.rock);
  fr(g, 5, 6, 3, 3, C.rockDark); // shadow
  g.generateTexture('rock', TILE, TILE);
  g.destroy();

  // -- Special rock (has Shield) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  fr(g, 2, 4, 12, 10, 0x7777aa);
  fr(g, 3, 5, 10, 8, 0x9999cc);
  fr(g, 4, 3, 8, 4, 0x7777aa);
  fr(g, 7, 7, 2, 2, C.shield); // glint
  g.generateTexture('rockSpecial', TILE, TILE);
  g.destroy();

  // -- Water --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.water);
  fr(g, 2, 4, 6, 1, C.waterLight);
  fr(g, 8, 10, 5, 1, C.waterLight);
  g.generateTexture('water', TILE, TILE);
  g.destroy();

  // -- House wall --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall);
  fr(g, 0, 0, TILE, 1, C.wallLight);
  fr(g, 0, 0, 1, TILE, C.wallLight);
  g.generateTexture('houseWall', TILE, TILE);
  g.destroy();

  // -- House roof --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.roof);
  fr(g, 0, TILE-2, TILE, 2, C.roofDark);
  fr(g, 2, 2, TILE-4, 2, 0xdd4444);
  g.generateTexture('houseRoof', TILE, TILE);
  g.destroy();

  // -- Door --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall);
  fr(g, 3, 2, 10, 14, C.door);
  fr(g, 4, 3, 8, 12, 0x4a2008);
  fr(g, 10, 9, 2, 2, C.mapItem); // doorknob
  g.generateTexture('door', TILE, TILE);
  g.destroy();

  // -- Window tile --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall);
  fr(g, 3, 3, 10, 10, C.window);
  fr(g, 4, 4, 8, 8, 0x55bbff);
  fr(g, 7, 3, 2, 10, C.wall); // cross
  fr(g, 3, 7, 10, 2, C.wall);
  g.generateTexture('window', TILE, TILE);
  g.destroy();

  // -- House interior floor --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x8b6c42);
  for (let i = 0; i < 3; i++) {
    fr(g, Math.floor(Math.random()*14)+1, Math.floor(Math.random()*14)+1, 1, 1, 0x7a5c35);
  }
  g.generateTexture('floor', TILE, TILE);
  g.destroy();

  // -- Interior wall --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x6b5b3a);
  fr(g, 0, TILE-2, TILE, 2, 0x5a4a2a);
  g.generateTexture('intWall', TILE, TILE);
  g.destroy();

  // -- Player sprites (4 directions) --
  const dirs = ['down','up','left','right'];
  dirs.forEach(dir => {
    g = scene.make.graphics({add:false});
    // Body
    fr(g, 4, 2, 8, 6, C.hat); // hat
    fr(g, 5, 5, 6, 4, C.skin); // face
    fr(g, 3, 9, 10, 5, C.tunic); // tunic
    fr(g, 3, 14, 4, 2, C.tunicDark); // left leg
    fr(g, 9, 14, 4, 2, C.tunicDark); // right leg
    // Eyes depend on direction
    if (dir === 'down') {
      fr(g, 6, 6, 2, 2, C.black); fr(g, 9, 6, 2, 2, C.black); // eyes
      fr(g, 7, 8, 2, 1, C.skin); // mouth area
    } else if (dir === 'up') {
      fr(g, 4, 2, 8, 7, C.hat); // back of hat covers face
    } else if (dir === 'left') {
      fr(g, 5, 6, 2, 2, C.black); // one eye
      fr(g, 3, 9, 10, 5, C.tunic);
    } else {
      fr(g, 10, 6, 2, 2, C.black); // one eye
      fr(g, 3, 9, 10, 5, C.tunic);
    }
    g.generateTexture('player_'+dir, TILE, TILE);
    g.destroy();
  });

  // -- Walking frames (slight leg shift) --
  dirs.forEach(dir => {
    g = scene.make.graphics({add:false});
    fr(g, 4, 2, 8, 6, C.hat);
    fr(g, 5, 5, 6, 4, C.skin);
    fr(g, 3, 9, 10, 5, C.tunic);
    fr(g, 4, 14, 3, 2, C.tunicDark);
    fr(g, 10, 14, 3, 2, C.tunicDark);
    if (dir === 'down') {
      fr(g, 6, 6, 2, 2, C.black); fr(g, 9, 6, 2, 2, C.black);
    } else if (dir === 'up') {
      fr(g, 4, 2, 8, 7, C.hat);
    } else if (dir === 'left') {
      fr(g, 5, 6, 2, 2, C.black);
    } else {
      fr(g, 10, 6, 2, 2, C.black);
    }
    g.generateTexture('player_'+dir+'_walk', TILE, TILE);
    g.destroy();
  });

  // -- Item sprites --
  // Sword
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x000000); g.clear();
  fr(g, 7, 1, 2, 10, C.sword); // blade
  fr(g, 6, 0, 4, 2, 0xeeeeee); // tip
  fr(g, 4, 10, 8, 2, C.mapItem); // guard
  fr(g, 7, 11, 2, 4, 0x6b3410); // handle
  g.generateTexture('item_sword', TILE, TILE);
  g.destroy();

  // Shield
  g = scene.make.graphics({add:false});
  fr(g, 3, 2, 10, 12, C.shield);
  fr(g, 4, 3, 8, 10, 0x4477bb);
  fr(g, 6, 5, 4, 6, C.mapItem); // emblem
  fr(g, 7, 6, 2, 4, 0xddaa33);
  g.generateTexture('item_shield', TILE, TILE);
  g.destroy();

  // Map
  g = scene.make.graphics({add:false});
  fr(g, 2, 2, 12, 12, 0xf0e0c0);
  fr(g, 3, 3, 10, 10, 0xe8d4a8);
  fr(g, 5, 5, 3, 1, 0x884422); // path line
  fr(g, 7, 5, 1, 4, 0x884422);
  fr(g, 8, 8, 3, 1, 0x884422);
  fr(g, 4, 9, 2, 2, 0xcc3333); // X mark
  g.generateTexture('item_map', TILE, TILE);
  g.destroy();

  // -- Professor NPC --
  g = scene.make.graphics({add:false});
  fr(g, 5, 1, 6, 5, C.profHair); // hair/head
  fr(g, 6, 3, 4, 3, C.skin); // face
  fr(g, 7, 4, 1, 1, C.black); fr(g, 9, 4, 1, 1, C.black); // eyes
  fr(g, 4, 6, 8, 8, C.profRobe); // robe
  fr(g, 5, 14, 3, 2, 0x443388); // feet
  fr(g, 9, 14, 3, 2, 0x443388);
  g.generateTexture('professor', TILE, TILE);
  g.destroy();

  // -- Enemy (goblin) --
  g = scene.make.graphics({add:false});
  fr(g, 4, 2, 8, 6, 0x556b2f); // head
  fr(g, 5, 3, 2, 2, C.enemyEye); fr(g, 9, 3, 2, 2, C.enemyEye); // eyes
  fr(g, 6, 6, 4, 1, 0xffffff); // teeth
  fr(g, 3, 8, 10, 6, C.enemy); // body
  fr(g, 2, 9, 3, 4, 0x556b2f); // left arm
  fr(g, 11, 9, 3, 4, 0x556b2f); // right arm
  fr(g, 4, 14, 3, 2, C.enemy); fr(g, 9, 14, 3, 2, C.enemy); // feet
  g.generateTexture('enemy_goblin', TILE, TILE);
  g.destroy();

  // -- Chest (for house interior) --
  g = scene.make.graphics({add:false});
  fr(g, 2, 4, 12, 10, 0x8b6914);
  fr(g, 3, 5, 10, 8, 0xa07828);
  fr(g, 2, 8, 12, 2, 0x6b5010);
  fr(g, 6, 6, 4, 3, C.mapItem); // lock
  g.generateTexture('chest', TILE, TILE);
  g.destroy();

  // -- Exit mat --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x8b6c42); // floor bg
  fr(g, 2, 6, 12, 6, 0xcc6633);
  fr(g, 4, 8, 8, 2, 0xffcc66);
  g.generateTexture('exitMat', TILE, TILE);
  g.destroy();

  // -- Sparkle (for collectible indicators) --
  g = scene.make.graphics({add:false});
  fr(g, 7, 0, 2, 4, 0xffffaa);
  fr(g, 0, 7, 4, 2, 0xffffaa);
  fr(g, 12, 7, 4, 2, 0xffffaa);
  fr(g, 7, 12, 2, 4, 0xffffaa);
  fr(g, 6, 6, 4, 4, 0xffffff);
  g.generateTexture('sparkle', TILE, TILE);
  g.destroy();
}

// ===== MAP GENERATION =====
// Tile codes: 0=grass, 1=path, 2=tree, 3=rock, 4=water,
//   10=houseRoof, 11=houseWall, 12=door, 13=window,
//   20=specialTree(map item), 21=specialRock(shield item),
//   30=professor, 40=chest(sword - inside house)
function makeMap() {
  const m = [];
  for (let y = 0; y < MAP_H; y++) {
    m[y] = [];
    for (let x = 0; x < MAP_W; x++) {
      m[y][x] = 0; // grass default
    }
  }

  // Border of trees
  for (let x = 0; x < MAP_W; x++) {
    m[0][x] = 2; m[1][x] = 2; m[MAP_H-1][x] = 2; m[MAP_H-2][x] = 2;
  }
  for (let y = 0; y < MAP_H; y++) {
    m[y][0] = 2; m[y][1] = 2; m[y][MAP_W-1] = 2; m[y][MAP_W-2] = 2;
  }

  // Winding main road (horizontal, curves up and down)
  const roadY = [];
  let ry = 15;
  for (let x = 2; x < MAP_W-2; x++) {
    roadY[x] = ry;
    m[ry][x] = 1;
    m[ry-1][x] = 1; // 2-wide road
    if (Math.random() < 0.35) ry += (Math.random() < 0.5 ? 1 : -1);
    ry = Math.max(8, Math.min(MAP_H-8, ry));
  }

  // Winding vertical road
  let rx = 15;
  for (let y = 3; y < MAP_H-3; y++) {
    m[y][rx] = 1;
    m[y][rx+1] = 1;
    if (Math.random() < 0.35) rx += (Math.random() < 0.5 ? 1 : -1);
    rx = Math.max(6, Math.min(MAP_W-6, rx));
  }

  // Branch paths to houses/features
  function pathTo(sx, sy, ex, ey) {
    let cx = sx, cy = sy;
    while (cx !== ex || cy !== ey) {
      m[cy][cx] = 1;
      if (Math.random() < 0.6) {
        cx += (ex > cx ? 1 : ex < cx ? -1 : 0);
      } else {
        cy += (ey > cy ? 1 : ey < cy ? -1 : 0);
      }
      cx = Math.max(2, Math.min(MAP_W-3, cx));
      cy = Math.max(2, Math.min(MAP_H-3, cy));
    }
    m[ey][ex] = 1;
  }

  // House 1 (has the sword chest) - upper left area
  const h1x = 6, h1y = 6;
  pathTo(8, roadY[8] || 14, h1x+1, h1y+3);
  // roof row
  m[h1y][h1x] = 10; m[h1y][h1x+1] = 10; m[h1y][h1x+2] = 10; m[h1y][h1x+3] = 10;
  // wall row 1
  m[h1y+1][h1x] = 11; m[h1y+1][h1x+1] = 13; m[h1y+1][h1x+2] = 13; m[h1y+1][h1x+3] = 11;
  // wall row 2 with door
  m[h1y+2][h1x] = 11; m[h1y+2][h1x+1] = 11; m[h1y+2][h1x+2] = 12; m[h1y+2][h1x+3] = 11;

  // House 2 - lower right area
  const h2x = 21, h2y = 20;
  pathTo(20, roadY[20] || 15, h2x+1, h2y+3);
  m[h2y][h2x] = 10; m[h2y][h2x+1] = 10; m[h2y][h2x+2] = 10; m[h2y][h2x+3] = 10;
  m[h2y+1][h2x] = 11; m[h2y+1][h2x+1] = 13; m[h2y+1][h2x+2] = 13; m[h2y+1][h2x+3] = 11;
  m[h2y+2][h2x] = 11; m[h2y+2][h2x+1] = 12; m[h2y+2][h2x+2] = 11; m[h2y+2][h2x+3] = 11;

  // Special rock (shield) - near a clearing
  m[10][22] = 21;
  pathTo(18, roadY[18] || 14, 22, 11);

  // Special tree (map) - tucked in forest area
  m[22][8] = 20;
  pathTo(10, roadY[10] || 14, 8, 21);

  // Professor NPC - near village center crossroads
  m[13][16] = 30;

  // Small pond
  for (let py = 17; py <= 19; py++) {
    for (let px = 23; px <= 26; px++) {
      if (m[py][px] === 0) m[py][px] = 4;
    }
  }

  // Scatter trees and rocks on empty grass
  for (let y = 3; y < MAP_H-3; y++) {
    for (let x = 3; x < MAP_W-3; x++) {
      if (m[y][x] === 0) {
        const r = Math.random();
        if (r < 0.18) m[y][x] = 2; // tree
        else if (r < 0.22) m[y][x] = 3; // rock
      }
    }
  }

  return m;
}

// ===== GAME STATE =====
const STATE = {
  items: { sword: false, shield: false, map: false },
  itemCount: 0,
  questStarted: false,
  inHouse: false,
  currentHouse: 0,
  messages: [],
  showingMessage: false,
  combatActive: false,
  playerHP: 30, playerMaxHP: 30,
  playerMP: 10, playerMaxMP: 10,
};

// ===== BOOT SCENE (Title Screen) =====
class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    genTextures(this);
    const cx = GAME_W/2, cy = GAME_H/2;

    // Dark gradient sky background
    const bg = this.add.graphics();
    for (let y = 0; y < GAME_H; y++) {
      const t = y / GAME_H;
      const r = Math.floor(5 + t * 15);
      const g = Math.floor(10 + t * 30);
      const b = Math.floor(30 + t * 40);
      bg.fillStyle((r << 16) | (g << 8) | b, 1);
      bg.fillRect(0, y, GAME_W, 1);
    }

    // Mountain silhouettes
    const mtn = this.add.graphics();
    mtn.fillStyle(0x1a3a1a, 1);
    for (let x = 0; x < GAME_W; x++) {
      const h1 = Math.sin(x * 0.02) * 30 + Math.sin(x * 0.05) * 15;
      const h2 = Math.sin(x * 0.03 + 1) * 25 + Math.sin(x * 0.07 + 2) * 10;
      const mh = Math.max(h1, h2);
      mtn.fillRect(x, 130 - mh, 1, mh + 110);
    }

    // Foreground trees silhouette
    mtn.fillStyle(0x0d2a0d, 1);
    for (let x = 0; x < GAME_W; x += 8) {
      const h = 20 + Math.sin(x * 0.1) * 10 + Math.random() * 8;
      // Triangle tree
      for (let ty = 0; ty < h; ty++) {
        const w = Math.floor((ty / h) * 6) + 1;
        mtn.fillRect(x + 4 - w, 200 - h + ty, w * 2, 1);
      }
    }

    // Ground
    mtn.fillStyle(0x1a3a1a, 1);
    mtn.fillRect(0, 200, GAME_W, 40);

    // Stars
    const stars = this.add.graphics();
    stars.fillStyle(0xffffff, 1);
    for (let i = 0; i < 30; i++) {
      stars.fillRect(Math.random()*GAME_W, Math.random()*120, 1, 1);
    }

    // Moon
    const moon = this.add.graphics();
    moon.fillStyle(0xffeeaa, 1);
    moon.fillCircle(200, 35, 12);
    moon.fillStyle(0x0a1430, 1);
    moon.fillCircle(205, 32, 10); // crescent cutout

    // Title text
    this.add.text(cx, 60, 'GREENMOUNTAINFOG', {
      fontFamily: 'Courier New', fontSize: '14px', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(cx, 78, 'The Journey', {
      fontFamily: 'Courier New', fontSize: '20px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Blinking "Press Start" text
    const start = this.add.text(cx, 170, 'PRESS START', {
      fontFamily: 'Courier New', fontSize: '10px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: start, alpha: 0, duration: 500,
      yoyo: true, repeat: -1
    });

    // Start game on input
    const startGame = () => {
      this.scene.start('OverworldScene');
    };
    this.input.keyboard.on('keydown-ENTER', startGame);
    this.input.keyboard.on('keydown-SPACE', startGame);
    this.input.on('pointerdown', startGame);
  }
}

// ===== OVERWORLD SCENE =====
class OverworldScene extends Phaser.Scene {
  constructor() { super('OverworldScene'); }

  create() {
    this.mapData = makeMap();
    this.tileSprites = [];
    this.colliders = [];
    this.interactables = [];

    // Render tiles
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = this.mapData[y][x];
        const px = x * TILE, py = y * TILE;
        let tex = 'grass' + ((x + y) % 2);

        if (t === 1) tex = 'path';
        else if (t === 2) tex = 'tree';
        else if (t === 3) tex = 'rock';
        else if (t === 4) tex = 'water';
        else if (t === 10) tex = 'houseRoof';
        else if (t === 11) tex = 'houseWall';
        else if (t === 12) tex = 'door';
        else if (t === 13) tex = 'window';
        else if (t === 20) tex = 'treeSpecial';
        else if (t === 21) tex = 'rockSpecial';

        const sprite = this.add.image(px + TILE/2, py + TILE/2, tex);
        this.tileSprites.push(sprite);

        // Professor NPC
        if (t === 30) {
          // Place grass underneath, professor on top
          this.add.image(px + TILE/2, py + TILE/2, 'path');
          this.professor = this.physics.add.sprite(px + TILE/2, py + TILE/2, 'professor');
          this.professor.setImmovable(true);
          this.professor.body.setSize(TILE, TILE);
        }

        // Collision for solid tiles
        if ([2, 3, 4, 10, 11, 13, 20, 21].includes(t)) {
          const block = this.physics.add.staticImage(px + TILE/2, py + TILE/2, tex);
          block.setVisible(false);
          block.body.setSize(TILE, TILE);
          block.tileType = t;
          block.tileX = x;
          block.tileY = y;
          this.colliders.push(block);
        }
      }
    }

    // Sparkle effects on special items (if not collected)
    this.sparkles = {};
    if (!STATE.items.map) {
      // Find special tree position
      for (let y = 0; y < MAP_H; y++)
        for (let x = 0; x < MAP_W; x++)
          if (this.mapData[y][x] === 20) {
            this.sparkles.map = this.add.sprite(x*TILE+TILE/2, y*TILE+TILE/2, 'sparkle').setAlpha(0.7);
            this.tweens.add({ targets: this.sparkles.map, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
          }
    }
    if (!STATE.items.shield) {
      for (let y = 0; y < MAP_H; y++)
        for (let x = 0; x < MAP_W; x++)
          if (this.mapData[y][x] === 21) {
            this.sparkles.shield = this.add.sprite(x*TILE+TILE/2, y*TILE+TILE/2, 'sparkle').setAlpha(0.7);
            this.tweens.add({ targets: this.sparkles.shield, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
          }
    }

    // Player spawn - find a path tile near center
    let spawnX = 15, spawnY = 15;
    for (let r = 0; r < 5; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          const tx = 15+dx, ty = 15+dy;
          if (tx >= 0 && tx < MAP_W && ty >= 0 && ty < MAP_H && this.mapData[ty][tx] === 1) {
            spawnX = tx; spawnY = ty; r = 99; break;
          }
        }
        if (r === 99) break;
      }
    }

    this.player = this.physics.add.sprite(spawnX*TILE+TILE/2, spawnY*TILE+TILE/2, 'player_down');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(12, 14);
    this.player.setDepth(10);
    this.facing = 'down';
    this.walkFrame = 0;
    this.walkTimer = 0;

    // Collisions
    this.colliderGroup = this.physics.add.staticGroup();
    this.colliders.forEach(c => this.colliderGroup.add(c));
    this.physics.add.collider(this.player, this.colliderGroup);
    if (this.professor) {
      this.physics.add.collider(this.player, this.professor);
    }

    // Camera - ZOOMED IN (key fix!)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Launch UI overlay
    this.scene.launch('UIScene');
    this.ui = this.scene.get('UIScene');

    // Action cooldown
    this.actionCooldown = 0;

    // Show intro message
    if (!STATE.questStarted) {
      this.time.delayedCall(500, () => {
        this.ui.showMessage('Welcome to Evergreen Village! Explore and find the 3 hidden items: a Sword, a Shield, and a Map.');
      });
    }
  }

  update(time, delta) {
    if (STATE.showingMessage || STATE.combatActive) {
      this.player.setVelocity(0, 0);
      return;
    }

    // Movement - touch or keyboard
    let vx = 0, vy = 0;
    const td = window.touchDir || {};
    const keys = this.cursors;

    if (td.up || keys.up.isDown) { vy = -SPEED; this.facing = 'up'; }
    else if (td.down || keys.down.isDown) { vy = SPEED; this.facing = 'down'; }
    if (td.left || keys.left.isDown) { vx = -SPEED; this.facing = 'left'; }
    else if (td.right || keys.right.isDown) { vx = SPEED; this.facing = 'right'; }

    this.player.setVelocity(vx, vy);

    // Walking animation
    if (vx !== 0 || vy !== 0) {
      this.walkTimer += delta;
      if (this.walkTimer > 200) {
        this.walkTimer = 0;
        this.walkFrame = 1 - this.walkFrame;
      }
      const suffix = this.walkFrame === 1 ? '_walk' : '';
      this.player.setTexture('player_' + this.facing + suffix);
    } else {
      this.player.setTexture('player_' + this.facing);
      this.walkTimer = 0;
      this.walkFrame = 0;
    }

    // Action button
    this.actionCooldown -= delta;
    const actionPressed = window.touchActionJust ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey);

    if (actionPressed && this.actionCooldown <= 0) {
      window.touchActionJust = false;
      this.actionCooldown = 300;
      this.handleAction();
    }
  }

  handleAction() {
    const px = this.player.x, py = this.player.y;

    // Check what's in front of player
    let checkX = px, checkY = py;
    if (this.facing === 'up') checkY -= TILE;
    else if (this.facing === 'down') checkY += TILE;
    else if (this.facing === 'left') checkX -= TILE;
    else if (this.facing === 'right') checkX += TILE;

    const tileX = Math.floor(checkX / TILE);
    const tileY = Math.floor(checkY / TILE);

    if (tileX < 0 || tileX >= MAP_W || tileY < 0 || tileY >= MAP_H) return;
    const tile = this.mapData[tileY][tileX];

    // Door - enter house
    if (tile === 12) {
      // Determine which house
      if (tileX <= 15) {
        this.enterHouse(1);
      } else {
        this.enterHouse(2);
      }
      return;
    }

    // Special tree - collect Map
    if (tile === 20 && !STATE.items.map) {
      STATE.items.map = true;
      STATE.itemCount++;
      this.ui.showMessage('You found the MAP hidden in the tree! The map shows a path through the Dark Woods...');
      if (this.sparkles.map) this.sparkles.map.destroy();
      // Replace with normal tree
      this.mapData[tileY][tileX] = 2;
      this.checkAllItems();
      return;
    }

    // Special rock - collect Shield
    if (tile === 21 && !STATE.items.shield) {
      STATE.items.shield = true;
      STATE.itemCount++;
      this.ui.showMessage('You found the SHIELD under the rock! Its surface gleams with ancient runes.');
      if (this.sparkles.shield) this.sparkles.shield.destroy();
      this.mapData[tileY][tileX] = 3;
      this.checkAllItems();
      return;
    }

    // Professor
    if (tile === 30 || (this.professor && Phaser.Math.Distance.Between(px, py, this.professor.x, this.professor.y) < TILE * 2)) {
      this.talkToProfessor();
      return;
    }

    // Generic interactions
    if (tile === 2) this.ui.showMessage('A sturdy tree. Nothing unusual here.');
    else if (tile === 3) this.ui.showMessage('A plain rock. Nothing underneath.');
  }

  enterHouse(houseNum) {
    STATE.inHouse = true;
    STATE.currentHouse = houseNum;
    this.scene.start('HouseScene', { houseNum: houseNum });
  }

  talkToProfessor() {
    if (STATE.itemCount < 3) {
      this.ui.showMessage('Professor Oak: "Hello, young adventurer! I see you are exploring our village. Find all three hidden items and come talk to me."');
    } else if (!STATE.questStarted) {
      STATE.questStarted = true;
      this.ui.showMessageSequence([
        'Professor Oak: "You found all three items! Well done!"',
        '"I have an urgent matter to discuss with you..."',
        '"My daughter, Elara, left for Maplehollow village a week ago."',
        '"She went to help an old family friend who wrote us a letter."',
        '"The friend said a troublemaker has been causing havoc in their village."',
        '"Elara must travel through the Dark Woods to reach Maplehollow."',
        '"I fear the Dark Woods are more dangerous than she expected. Will you follow and help her?"',
        '"Take the path east out of the village. Be careful, brave adventurer!"',
      ]);
    } else {
      this.ui.showMessage('Professor Oak: "Please hurry to Maplehollow through the Dark Woods! My daughter Elara needs your help!"');
    }
  }

  checkAllItems() {
    if (STATE.itemCount === 3) {
      this.time.delayedCall(2000, () => {
        this.ui.showMessage('You have all 3 items! The Professor is waving at you from the village center!');
      });
    }
  }
}

// ===== HOUSE INTERIOR SCENE =====
class HouseScene extends Phaser.Scene {
  constructor() { super('HouseScene'); }

  create(data) {
    this.houseNum = data.houseNum || 1;
    const W = 8, H = 6; // interior size in tiles

    // Draw interior
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x * TILE + 64, py = y * TILE + 56;
        if (y === 0) {
          this.add.image(px + TILE/2, py + TILE/2, 'intWall');
        } else {
          this.add.image(px + TILE/2, py + TILE/2, 'floor');
        }
      }
    }

    // Walls (colliders on edges)
    const walls = this.physics.add.staticGroup();
    for (let x = 0; x < W; x++) {
      walls.add(this.physics.add.staticImage(x*TILE+64+TILE/2, 56+TILE/2, 'intWall').setVisible(false));
    }
    // Side walls
    for (let y = 0; y < H; y++) {
      const lw = this.add.image(64-TILE/2, y*TILE+56+TILE/2, 'intWall');
      walls.add(this.physics.add.staticImage(64-TILE/2, y*TILE+56+TILE/2, 'intWall').setVisible(false));
      const rw = this.add.image(64+W*TILE+TILE/2, y*TILE+56+TILE/2, 'intWall');
      walls.add(this.physics.add.staticImage(64+W*TILE+TILE/2, y*TILE+56+TILE/2, 'intWall').setVisible(false));
    }

    // Exit mat at bottom center
    const exitX = 64 + 3*TILE + TILE/2, exitY = 56 + (H-1)*TILE + TILE/2;
    this.add.image(exitX, exitY, 'exitMat');
    this.exitZone = this.add.zone(exitX, exitY + TILE/2, TILE, 8);
    this.physics.add.existing(this.exitZone, true);

    // Chest in house 1 (contains sword)
    if (this.houseNum === 1 && !STATE.items.sword) {
      this.chest = this.physics.add.sprite(64+2*TILE+TILE/2, 56+TILE+TILE/2, 'chest');
      this.chest.setImmovable(true);
    }

    // Table in house 2
    if (this.houseNum === 2) {
      const tbl = this.add.graphics();
      fr(tbl, 64+4*TILE, 56+2*TILE, TILE*2, TILE, 0x6b4226);
      fr(tbl, 64+4*TILE+2, 56+2*TILE+2, TILE*2-4, TILE-4, 0x8b5a36);
      const tblBlock = this.physics.add.staticImage(64+5*TILE, 56+2*TILE+TILE/2, 'intWall').setVisible(false);
      walls.add(tblBlock);
    }

    // Player
    this.player = this.physics.add.sprite(exitX, exitY - TILE, 'player_up');
    this.player.body.setSize(12, 14);
    this.player.setDepth(10);
    this.facing = 'up';
    this.walkFrame = 0;
    this.walkTimer = 0;

    this.physics.add.collider(this.player, walls);
    if (this.chest) this.physics.add.collider(this.player, this.chest);

    // Exit overlap
    this.physics.add.overlap(this.player, this.exitZone, () => {
      if (this.facing === 'down') {
        STATE.inHouse = false;
        this.scene.start('OverworldScene');
      }
    });

    // Camera
    this.cameras.main.setZoom(2);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.actionCooldown = 0;

    this.scene.launch('UIScene');
    this.ui = this.scene.get('UIScene');

    this.time.delayedCall(300, () => {
      if (this.houseNum === 1 && !STATE.items.sword) {
        this.ui.showMessage('You entered a dusty cabin. There is a wooden chest here...');
      } else if (this.houseNum === 2) {
        this.ui.showMessage('A cozy cottage. A warm fire crackles in the hearth.');
      } else {
        this.ui.showMessage('You entered the cabin.');
      }
    });
  }

  update(time, delta) {
    if (STATE.showingMessage) {
      this.player.setVelocity(0, 0);
      return;
    }

    let vx = 0, vy = 0;
    const td = window.touchDir || {};
    if (td.up || this.cursors.up.isDown) { vy = -SPEED; this.facing = 'up'; }
    else if (td.down || this.cursors.down.isDown) { vy = SPEED; this.facing = 'down'; }
    if (td.left || this.cursors.left.isDown) { vx = -SPEED; this.facing = 'left'; }
    else if (td.right || this.cursors.right.isDown) { vx = SPEED; this.facing = 'right'; }
    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.walkTimer += delta;
      if (this.walkTimer > 200) { this.walkTimer = 0; this.walkFrame = 1 - this.walkFrame; }
      this.player.setTexture('player_' + this.facing + (this.walkFrame ? '_walk' : ''));
    } else {
      this.player.setTexture('player_' + this.facing);
    }

    // Action
    this.actionCooldown -= delta;
    const act = window.touchActionJust || Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey);
    if (act && this.actionCooldown <= 0) {
      window.touchActionJust = false;
      this.actionCooldown = 300;
      // Open chest
      if (this.chest && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.chest.x, this.chest.y) < TILE * 1.5) {
        STATE.items.sword = true;
        STATE.itemCount++;
        this.chest.destroy();
        this.chest = null;
        this.ui.showMessage('You found the SWORD inside the chest! Its blade shines with a faint blue light.');
        if (STATE.itemCount === 3) {
          this.time.delayedCall(2000, () => {
            this.ui.showMessage('You have all 3 items! Go talk to the Professor in the village!');
          });
        }
      }
    }
  }
}

// ===== UI SCENE (Overlay) =====
class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }

  create() {
    // Text box graphics (hidden initially)
    this.textBox = this.add.graphics();
    this.textBox.setVisible(false);
    this.textBox.setScrollFactor(0);
    this.textBox.setDepth(100);

    // Message text
    this.msgText = this.add.text(12, GAME_H - 52, '', {
      fontFamily: 'Courier New', fontSize: '8px', color: '#ffffff',
      wordWrap: { width: GAME_W - 24 }, lineSpacing: 2
    });
    this.msgText.setScrollFactor(0);
    this.msgText.setDepth(101);
    this.msgText.setVisible(false);

    // Prompt text (press A / space)
    this.promptText = this.add.text(GAME_W - 16, GAME_H - 10, '▼', {
      fontFamily: 'Courier New', fontSize: '8px', color: '#ffdd44'
    });
    this.promptText.setOrigin(1, 1);
    this.promptText.setScrollFactor(0);
    this.promptText.setDepth(101);
    this.promptText.setVisible(false);
    this.tweens.add({ targets: this.promptText, alpha: 0.3, duration: 400, yoyo: true, repeat: -1 });

    // Inventory display
    this.invText = this.add.text(4, 4, '', {
      fontFamily: 'Courier New', fontSize: '7px', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 2
    });
    this.invText.setScrollFactor(0);
    this.invText.setDepth(90);

    // Message queue
    this.messageQueue = [];
    this.currentMessage = '';
    this.displayedChars = 0;
    this.charTimer = 0;
    this.messageComplete = false;
  }

  update(time, delta) {
    // Update inventory display
    const inv = [];
    if (STATE.items.sword) inv.push('Sword');
    if (STATE.items.shield) inv.push('Shield');
    if (STATE.items.map) inv.push('Map');
    this.invText.setText(inv.length > 0 ? 'Items: ' + inv.join(', ') : '');

    // Letter-by-letter text
    if (STATE.showingMessage && !this.messageComplete) {
      this.charTimer += delta;
      if (this.charTimer > 30) {
        this.charTimer = 0;
        this.displayedChars++;
        this.msgText.setText(this.currentMessage.substring(0, this.displayedChars));
        if (this.displayedChars >= this.currentMessage.length) {
          this.messageComplete = true;
          this.promptText.setVisible(true);
        }
      }
    }

    // Dismiss message on action
    if (STATE.showingMessage && this.messageComplete) {
      const act = window.touchActionJust ||
        Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE')) ||
        Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ENTER'));
      if (act) {
        window.touchActionJust = false;
        if (this.messageQueue.length > 0) {
          this.showNextMessage();
        } else {
          this.hideMessage();
        }
      }
    }
  }

  showMessage(text) {
    this.messageQueue = [];
    this.startMessage(text);
  }

  showMessageSequence(messages) {
    this.messageQueue = messages.slice(1);
    this.startMessage(messages[0]);
  }

  startMessage(text) {
    STATE.showingMessage = true;
    this.currentMessage = text;
    this.displayedChars = 0;
    this.charTimer = 0;
    this.messageComplete = false;

    // Draw text box
    this.textBox.clear();
    this.textBox.fillStyle(C.textBg, 0.92);
    this.textBox.fillRect(6, GAME_H - 60, GAME_W - 12, 54);
    this.textBox.lineStyle(2, C.uiBorder, 1);
    this.textBox.strokeRect(6, GAME_H - 60, GAME_W - 12, 54);
    this.textBox.setVisible(true);

    this.msgText.setText('');
    this.msgText.setVisible(true);
    this.promptText.setVisible(false);
  }

  showNextMessage() {
    const next = this.messageQueue.shift();
    this.startMessage(next);
  }

  hideMessage() {
    STATE.showingMessage = false;
    this.textBox.setVisible(false);
    this.msgText.setVisible(false);
    this.promptText.setVisible(false);
  }
}

// ===== COMBAT SCENE (Final Fantasy Style) =====
class CombatScene extends Phaser.Scene {
  constructor() { super('CombatScene'); }

  create(data) {
    STATE.combatActive = true;
    this.enemyHP = 20;
    this.enemyMaxHP = 20;
    this.turnState = 'player'; // player, enemy, animating
    this.selectedAction = 0;
    this.actions = ['Attack', 'Defend', 'Item'];
    this.defending = false;
    this.battleLog = '';

    // Background
    const bg = this.add.graphics();
    // Sky gradient
    for (let y = 0; y < GAME_H * 0.6; y++) {
      const t = y / (GAME_H * 0.6);
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(
        new Phaser.Display.Color(20, 20, 60),
        new Phaser.Display.Color(40, 60, 40), 100, t * 100
      );
      bg.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
      bg.fillRect(0, y, GAME_W, 1);
    }
    // Ground
    bg.fillStyle(0x2d5a1e, 1);
    bg.fillRect(0, GAME_H * 0.6, GAME_W, GAME_H * 0.4);

    // Enemy sprite (scaled up)
    this.enemySprite = this.add.image(80, 80, 'enemy_goblin').setScale(4);

    // Player party display
    const panelBg = this.add.graphics();
    panelBg.fillStyle(C.textBg, 0.9);
    panelBg.fillRect(150, 130, 100, 50);
    panelBg.lineStyle(1, C.uiBorder, 1);
    panelBg.strokeRect(150, 130, 100, 50);

    this.add.text(156, 134, 'Hero', { fontFamily: 'Courier New', fontSize: '8px', color: '#ffffff' });
    this.hpText = this.add.text(156, 146, 'HP: '+STATE.playerHP+'/'+STATE.playerMaxHP, {
      fontFamily: 'Courier New', fontSize: '7px', color: '#44ff44'
    });
    this.mpText = this.add.text(156, 156, 'MP: '+STATE.playerMP+'/'+STATE.playerMaxMP, {
      fontFamily: 'Courier New', fontSize: '7px', color: '#4488ff'
    });

    // Enemy HP
    this.enemyHpText = this.add.text(40, 120, 'Goblin HP: '+this.enemyHP, {
      fontFamily: 'Courier New', fontSize: '7px', color: '#ff4444'
    });

    // Action menu
    const menuBg = this.add.graphics();
    menuBg.fillStyle(C.textBg, 0.9);
    menuBg.fillRect(6, 190, 80, 44);
    menuBg.lineStyle(1, C.uiBorder, 1);
    menuBg.strokeRect(6, 190, 80, 44);

    this.menuTexts = [];
    this.actions.forEach((a, i) => {
      const t = this.add.text(20, 194 + i * 13, a, {
        fontFamily: 'Courier New', fontSize: '8px', color: '#ffffff'
      });
      this.menuTexts.push(t);
    });

    // Cursor
    this.cursor = this.add.text(10, 194, '►', {
      fontFamily: 'Courier New', fontSize: '8px', color: '#ffdd44'
    });

    // Battle log
    const logBg = this.add.graphics();
    logBg.fillStyle(C.textBg, 0.9);
    logBg.fillRect(90, 190, GAME_W-96, 44);
    logBg.lineStyle(1, C.uiBorder, 1);
    logBg.strokeRect(90, 190, GAME_W-96, 44);

    this.logText = this.add.text(96, 194, 'A wild Goblin appeared!', {
      fontFamily: 'Courier New', fontSize: '7px', color: '#ffffff',
      wordWrap: { width: GAME_W - 108 }
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey('SPACE');
    this.enterKey = this.input.keyboard.addKey('ENTER');
    this.actionCooldown = 300;
  }

  update(time, delta) {
    this.actionCooldown -= delta;
    if (this.actionCooldown > 0) return;

    if (this.turnState === 'player') {
      const td = window.touchDir || {};
      // Menu navigation
      if (td.up || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.selectedAction = Math.max(0, this.selectedAction - 1);
        this.cursor.setY(194 + this.selectedAction * 13);
        this.actionCooldown = 150;
      }
      if (td.down || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.selectedAction = Math.min(2, this.selectedAction + 1);
        this.cursor.setY(194 + this.selectedAction * 13);
        this.actionCooldown = 150;
      }

      const act = window.touchActionJust || Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey);
      if (act) {
        window.touchActionJust = false;
        this.actionCooldown = 500;
        this.executePlayerAction();
      }
    }
  }

  executePlayerAction() {
    this.defending = false;
    const action = this.actions[this.selectedAction];

    if (action === 'Attack') {
      const dmg = 5 + Math.floor(Math.random() * 4);
      const bonus = STATE.items.sword ? 3 : 0;
      const total = dmg + bonus;
      this.enemyHP = Math.max(0, this.enemyHP - total);
      this.logText.setText('Hero attacks for ' + total + ' damage!');

      // Flash enemy
      this.tweens.add({ targets: this.enemySprite, alpha: 0.2, duration: 80, yoyo: true, repeat: 2 });

    } else if (action === 'Defend') {
      this.defending = true;
      this.logText.setText('Hero takes a defensive stance!');

    } else if (action === 'Item') {
      if (STATE.playerHP < STATE.playerMaxHP) {
        const heal = 8;
        STATE.playerHP = Math.min(STATE.playerMaxHP, STATE.playerHP + heal);
        this.logText.setText('Hero uses a potion! +' + heal + ' HP');
      } else {
        this.logText.setText('No items to use right now.');
      }
    }

    this.updateDisplays();

    if (this.enemyHP <= 0) {
      this.time.delayedCall(800, () => this.victory());
      return;
    }

    // Enemy turn after delay
    this.turnState = 'animating';
    this.time.delayedCall(1000, () => this.enemyTurn());
  }

  enemyTurn() {
    let dmg = 3 + Math.floor(Math.random() * 5);
    const shieldBonus = STATE.items.shield ? 2 : 0;
    if (this.defending) dmg = Math.max(1, Math.floor(dmg / 2));
    dmg = Math.max(1, dmg - shieldBonus);

    STATE.playerHP = Math.max(0, STATE.playerHP - dmg);
    this.logText.setText('Goblin attacks for ' + dmg + ' damage!');
    this.updateDisplays();

    // Screen shake
    this.cameras.main.shake(150, 0.01);

    if (STATE.playerHP <= 0) {
      this.time.delayedCall(800, () => this.defeat());
      return;
    }

    this.turnState = 'player';
    this.actionCooldown = 300;
  }

  updateDisplays() {
    this.hpText.setText('HP: ' + STATE.playerHP + '/' + STATE.playerMaxHP);
    this.mpText.setText('MP: ' + STATE.playerMP + '/' + STATE.playerMaxMP);
    this.enemyHpText.setText('Goblin HP: ' + this.enemyHP);
    // HP color
    if (STATE.playerHP < STATE.playerMaxHP * 0.3) this.hpText.setColor('#ff4444');
    else if (STATE.playerHP < STATE.playerMaxHP * 0.6) this.hpText.setColor('#ffaa44');
    else this.hpText.setColor('#44ff44');
  }

  victory() {
    STATE.combatActive = false;
    this.logText.setText('Victory! The Goblin is defeated!');
    this.enemySprite.setVisible(false);
    this.time.delayedCall(1500, () => {
      this.scene.stop('CombatScene');
      this.scene.resume('OverworldScene');
    });
  }

  defeat() {
    STATE.combatActive = false;
    STATE.playerHP = STATE.playerMaxHP; // revive
    this.logText.setText('You were defeated... but fate gives you another chance.');
    this.time.delayedCall(2000, () => {
      this.scene.stop('CombatScene');
      this.scene.resume('OverworldScene');
    });
  }
}

// ===== PHASER GAME CONFIG =====
const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    }
  },
  scene: [BootScene, OverworldScene, HouseScene, UIScene, CombatScene],
  backgroundColor: '#0a0a0a',
};

const game = new Phaser.Game(config);
