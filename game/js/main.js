/* ===== GreenMountainFog - The Journey =====
   SNES 16-bit style JRPG built with Phaser 3
   All graphics generated programmatically - Dragon Quest / DBZ Butouden quality */

const TILE = 16;
const MAP_W = 30, MAP_H = 30;
const GAME_W = 384, GAME_H = 256;
const SPEED = 90;
const CHAR_W = 16, CHAR_H = 24; // Character sprite size (taller than tile)

// SNES Color Palette - richer with multiple shading tones
const C = {
  // Grass
  grass1: 0x40c070, grass2: 0x38a860, grass3: 0x30b058, grassDk: 0x289048,
  // Path
  path1: 0xd4a868, path2: 0xc89858, pathDk: 0xb08040, pathLt: 0xe0bc80,
  // Trees
  trunk1: 0x6b4020, trunk2: 0x583018, trunkLt: 0x7d5030,
  leaf1: 0x208040, leaf2: 0x2a9850, leaf3: 0x18703a, leafLt: 0x40b868,
  // Houses
  wall1: 0xa06030, wall2: 0x8b5028, wallLt: 0xb87040, wallLine: 0x704020,
  roof1: 0xc84030, roof2: 0xa83028, roofLt: 0xe05848, roofLine: 0x882020,
  door1: 0x704020, door2: 0x583010, doorKnob: 0xe0c040,
  window1: 0x50a0e0, window2: 0x3888c8, windowFrame: 0x806030,
  // Water
  water1: 0x3090d0, water2: 0x2878b8, waterLt: 0x58b0e8, waterDk: 0x2068a0,
  // Rock
  rock1: 0x909898, rock2: 0x787878, rockLt: 0xa8b0b0, rockDk: 0x606868,
  // Character - elf hero
  skin1: 0xf0c088, skin2: 0xe0a868, skinLt: 0xf8d8a8,
  tunic1: 0x30a058, tunic2: 0x208848, tunicLt: 0x48c070, tunicDk: 0x187038,
  hair1: 0xd0a040, hair2: 0xb88830, hairLt: 0xe0b850,
  hat1: 0x208848, hat2: 0x187038, hatLt: 0x30a058,
  boot1: 0x704828, boot2: 0x583818,
  belt: 0x906828,
  // Items
  swordBlade: 0xd0d8e0, swordEdge: 0xa0a8b0, swordGuard: 0xe0c040, swordHilt: 0x704020,
  shieldFace: 0x3870b0, shieldRim: 0xe0c040, shieldEmb: 0xf0e060,
  mapPaper: 0xf0e0c0, mapInk: 0x884020,
  // Professor
  profRobe1: 0x6050a8, profRobe2: 0x484090, profRobeLt: 0x7868c0,
  profHair: 0xd0d0d8, profSkin: 0xf0c888,
  // Enemy
  enemy1: 0x609028, enemy2: 0x507820, enemyLt: 0x78a840, enemyDk: 0x406018,
  enemyEye: 0xe02020, enemyBelly: 0xb0a060,
  // UI
  black: 0x000000, white: 0xffffff,
  textBg: 0x101038, textBg2: 0x181850, uiBorder: 0xb0b0c0, uiBorderLt: 0xd8d8e0,
  hpRed: 0xe03030, hpGreen: 0x30c050, mpBlue: 0x3060e0,
  gold: 0xe0c040,
};

function fr(g, x, y, w, h, color, a) {
  g.fillStyle(color, a !== undefined ? a : 1);
  g.fillRect(x, y, w, h);
}

// ===== TEXTURE GENERATION - SNES 16-bit Quality =====
function genTextures(scene) {

  // -- Grass tiles (detailed with multiple shades) --
  for (let v = 0; v < 2; v++) {
    const g = scene.make.graphics({add:false});
    const base = v === 0 ? C.grass1 : C.grass2;
    fr(g, 0, 0, TILE, TILE, base);
    // Dithered shading pattern
    for (let py = 0; py < TILE; py++) {
      for (let px = 0; px < TILE; px++) {
        const r = Math.random();
        if (r < 0.08) fr(g, px, py, 1, 1, C.grassDk);
        else if (r < 0.15) fr(g, px, py, 1, 1, v === 0 ? C.grass3 : C.grass1);
        else if (r < 0.18) fr(g, px, py, 1, 1, C.leafLt); // tiny flower
      }
    }
    // Grass tufts
    if (v === 0) {
      fr(g, 3, 10, 1, 3, C.leaf1); fr(g, 4, 9, 1, 2, C.leaf2);
      fr(g, 11, 5, 1, 3, C.leaf1); fr(g, 12, 4, 1, 2, C.leaf2);
    }
    g.generateTexture('grass'+v, TILE, TILE);
    g.destroy();
  }

  // -- Path tile (detailed cobblestone) --
  let g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.path1);
  // Stone pattern
  fr(g, 1, 1, 6, 5, C.pathLt); fr(g, 8, 1, 7, 5, C.path2);
  fr(g, 0, 7, 5, 5, C.path2); fr(g, 6, 7, 6, 6, C.pathLt);
  fr(g, 13, 8, 3, 5, C.path2);
  // Gaps between stones
  fr(g, 0, 6, TILE, 1, C.pathDk); fr(g, 7, 0, 1, 6, C.pathDk);
  fr(g, 5, 7, 1, 6, C.pathDk); fr(g, 12, 7, 1, 6, C.pathDk);
  // Scattered detail
  for (let i = 0; i < 4; i++) {
    fr(g, Math.floor(Math.random()*14)+1, Math.floor(Math.random()*14)+1, 1, 1, C.pathDk);
  }
  g.generateTexture('path', TILE, TILE);
  g.destroy();

  // -- Tree (rich SNES style with layered canopy) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  // Trunk with bark texture
  fr(g, 6, 9, 4, 7, C.trunk1);
  fr(g, 7, 10, 1, 5, C.trunkLt); // bark highlight
  fr(g, 9, 11, 1, 3, C.trunk2); // bark shadow
  // Canopy - layered circles for depth
  fr(g, 1, 1, 14, 10, C.leaf1);
  fr(g, 2, 0, 12, 4, C.leaf2);
  fr(g, 0, 3, 16, 5, C.leaf1);
  // Highlights
  fr(g, 3, 2, 5, 3, C.leaf2); fr(g, 4, 1, 3, 2, C.leafLt);
  fr(g, 9, 3, 4, 3, C.leafLt);
  // Shadow on bottom
  fr(g, 2, 8, 12, 2, C.leaf3);
  // Detail pixels
  fr(g, 5, 4, 1, 1, C.leafLt); fr(g, 11, 2, 1, 1, C.leafLt);
  fr(g, 2, 6, 1, 1, C.leaf3); fr(g, 13, 5, 1, 1, C.leaf3);
  g.generateTexture('tree', TILE, TILE);
  g.destroy();

  // -- Special tree (map item - golden shimmer in canopy) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  fr(g, 6, 9, 4, 7, C.trunk1);
  fr(g, 7, 10, 1, 5, C.trunkLt);
  fr(g, 1, 1, 14, 10, 0x2a8848);
  fr(g, 2, 0, 12, 4, 0x329850);
  fr(g, 0, 3, 16, 5, 0x2a8848);
  fr(g, 3, 2, 5, 3, 0x329850); fr(g, 4, 1, 3, 2, 0x48b868);
  fr(g, 9, 3, 4, 3, 0x48b868);
  fr(g, 2, 8, 12, 2, 0x207838);
  // Golden sparkles
  fr(g, 5, 3, 2, 2, C.gold); fr(g, 10, 5, 2, 1, C.gold);
  fr(g, 3, 6, 1, 1, 0xf0e060);
  g.generateTexture('treeSpecial', TILE, TILE);
  g.destroy();

  // -- Rock (detailed with highlights and shadows) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  // Rock body
  fr(g, 2, 5, 12, 9, C.rock1);
  fr(g, 3, 4, 10, 3, C.rock1);
  // Top highlight
  fr(g, 4, 4, 7, 2, C.rockLt);
  fr(g, 3, 6, 4, 3, C.rockLt);
  // Shadow side
  fr(g, 9, 8, 4, 5, C.rockDk);
  fr(g, 11, 6, 2, 3, C.rockDk);
  // Cracks
  fr(g, 6, 7, 1, 4, C.rockDk); fr(g, 7, 9, 2, 1, C.rockDk);
  // Ground shadow
  fr(g, 2, 13, 12, 1, C.grassDk);
  g.generateTexture('rock', TILE, TILE);
  g.destroy();

  // -- Special rock (shield - blue tint with sparkle) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.grass1);
  fr(g, 2, 5, 12, 9, 0x7888a0);
  fr(g, 3, 4, 10, 3, 0x7888a0);
  fr(g, 4, 4, 7, 2, 0x98a8c0);
  fr(g, 3, 6, 4, 3, 0x98a8c0);
  fr(g, 9, 8, 4, 5, 0x607080);
  fr(g, 6, 7, 1, 4, 0x607080);
  // Blue sparkle
  fr(g, 7, 5, 2, 2, 0x80c0f0); fr(g, 4, 8, 1, 1, 0x80c0f0);
  fr(g, 2, 13, 12, 1, C.grassDk);
  g.generateTexture('rockSpecial', TILE, TILE);
  g.destroy();

  // -- Water (animated look with waves) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.water1);
  // Wave pattern
  for (let wy = 0; wy < TILE; wy += 4) {
    for (let wx = 0; wx < TILE; wx += 2) {
      if ((wx + wy) % 4 === 0) fr(g, wx, wy, 2, 1, C.waterLt);
      else fr(g, wx, wy+2, 2, 1, C.waterDk);
    }
  }
  fr(g, 2, 3, 5, 1, C.waterLt); fr(g, 9, 9, 4, 1, C.waterLt);
  g.generateTexture('water', TILE, TILE);
  g.destroy();

  // -- House wall (brick pattern with mortar lines) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall1);
  // Brick rows
  for (let by = 0; by < TILE; by += 4) {
    const offset = (by % 8 === 0) ? 0 : 4;
    for (let bx = offset; bx < TILE; bx += 8) {
      fr(g, bx, by, 7, 3, C.wallLt);
      fr(g, bx, by, 7, 1, C.wall1); // top shade
      fr(g, bx+6, by, 1, 3, C.wall2); // right shadow
    }
    fr(g, 0, by+3, TILE, 1, C.wallLine); // mortar
  }
  g.generateTexture('houseWall', TILE, TILE);
  g.destroy();

  // -- House roof (layered shingles) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.roof1);
  // Shingle rows
  for (let ry = 0; ry < TILE; ry += 3) {
    const off = (ry % 6 === 0) ? 0 : 3;
    for (let rx = off; rx < TILE; rx += 6) {
      fr(g, rx, ry, 5, 2, C.roofLt);
      fr(g, rx, ry+2, 5, 1, C.roof2);
    }
  }
  // Shadow at bottom
  fr(g, 0, TILE-2, TILE, 2, C.roof2);
  // Highlight at top
  fr(g, 0, 0, TILE, 1, C.roofLt);
  g.generateTexture('houseRoof', TILE, TILE);
  g.destroy();

  // -- Door (detailed with panels and knob) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall1);
  // Door frame
  fr(g, 2, 1, 12, 15, C.door1);
  fr(g, 3, 2, 10, 13, C.door2);
  // Panels
  fr(g, 4, 3, 4, 5, C.door1); fr(g, 9, 3, 4, 5, C.door1);
  fr(g, 4, 9, 4, 5, C.door1); fr(g, 9, 9, 4, 5, C.door1);
  // Panel highlights
  fr(g, 4, 3, 4, 1, 0x886038); fr(g, 9, 3, 4, 1, 0x886038);
  // Knob
  fr(g, 11, 9, 2, 2, C.doorKnob);
  fr(g, 11, 9, 1, 1, 0xf0d860);
  g.generateTexture('door', TILE, TILE);
  g.destroy();

  // -- Window (cross-paned with curtain hint) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, C.wall1);
  fr(g, 2, 2, 12, 12, C.windowFrame);
  fr(g, 3, 3, 10, 10, C.window1);
  fr(g, 4, 4, 8, 8, C.window2);
  // Light reflection
  fr(g, 4, 4, 3, 3, 0x80c8f0);
  // Cross bars
  fr(g, 7, 3, 2, 10, C.windowFrame);
  fr(g, 3, 7, 10, 2, C.windowFrame);
  g.generateTexture('window', TILE, TILE);
  g.destroy();

  // -- Interior floor (wooden planks) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x9a7848);
  // Plank lines
  for (let px = 0; px < TILE; px += 4) {
    fr(g, px, 0, 1, TILE, 0x886838);
    fr(g, px+1, 0, 2, TILE, 0xa88858);
    fr(g, px+3, 0, 1, TILE, 0x887040);
  }
  // Knots
  fr(g, 5, 6, 2, 2, 0x786030); fr(g, 12, 11, 2, 2, 0x786030);
  g.generateTexture('floor', TILE, TILE);
  g.destroy();

  // -- Interior wall (plaster with wainscoting) --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x8898a0); // plaster
  fr(g, 0, 10, TILE, 6, 0x706040); // wainscoting
  fr(g, 0, 9, TILE, 1, 0x886848); // chair rail
  // Plaster texture
  for (let i = 0; i < 6; i++) {
    fr(g, Math.floor(Math.random()*14)+1, Math.floor(Math.random()*8)+1, 1, 1, 0x7888a0);
  }
  g.generateTexture('intWall', TILE, TILE);
  g.destroy();

  // ===== CHARACTER SPRITES (16x24 - SNES quality) =====
  // -- Player: Elf hero with tunic, hat, boots --
  const drawPlayer = (g, dir, walk) => {
    const W = CHAR_W, H = CHAR_H;
    // Shadow on ground
    fr(g, 3, H-2, 10, 2, 0x000000, 0.2);

    if (dir === 'down') {
      // Hat
      fr(g, 4, 0, 8, 3, C.hat1); fr(g, 3, 2, 10, 3, C.hat1);
      fr(g, 5, 0, 6, 2, C.hatLt); fr(g, 4, 3, 2, 1, C.hat2); // brim shadow
      // Face
      fr(g, 4, 5, 8, 5, C.skin1);
      fr(g, 5, 5, 6, 4, C.skinLt); // face highlight
      // Eyes (expressive - larger)
      fr(g, 5, 6, 2, 2, C.black); fr(g, 6, 6, 1, 1, 0x2050a0); // left eye
      fr(g, 9, 6, 2, 2, C.black); fr(g, 10, 6, 1, 1, 0x2050a0); // right eye
      fr(g, 6, 7, 1, 1, C.white); fr(g, 10, 7, 1, 1, C.white); // eye shine
      // Mouth
      fr(g, 7, 9, 2, 1, 0xe09868);
      // Ears
      fr(g, 3, 6, 1, 2, C.skin2); fr(g, 12, 6, 1, 2, C.skin2);
      // Hair peeking
      fr(g, 3, 4, 2, 2, C.hair1); fr(g, 11, 4, 2, 2, C.hair1);
      // Tunic body
      fr(g, 3, 10, 10, 7, C.tunic1);
      fr(g, 4, 10, 8, 6, C.tunicLt); // highlight
      fr(g, 3, 10, 1, 7, C.tunicDk); // left shadow
      fr(g, 12, 10, 1, 7, C.tunicDk); // right shadow
      // Belt
      fr(g, 3, 14, 10, 1, C.belt);
      fr(g, 7, 13, 2, 2, C.gold); // buckle
      // Arms
      fr(g, 1, 11, 2, 5, C.tunic1); fr(g, 13, 11, 2, 5, C.tunic1);
      fr(g, 1, 16, 2, 1, C.skin1); fr(g, 13, 16, 2, 1, C.skin1); // hands
      // Boots
      if (walk) {
        fr(g, 3, 17, 4, 4, C.boot1); fr(g, 4, 17, 2, 3, C.boot2);
        fr(g, 9, 17, 4, 5, C.boot1); fr(g, 10, 17, 2, 4, C.boot2);
        fr(g, 9, 21, 4, 1, C.boot2);
      } else {
        fr(g, 4, 17, 4, 5, C.boot1); fr(g, 5, 17, 2, 4, C.boot2);
        fr(g, 8, 17, 4, 5, C.boot1); fr(g, 9, 17, 2, 4, C.boot2);
        fr(g, 4, 21, 4, 1, C.boot2); fr(g, 8, 21, 4, 1, C.boot2);
      }
    } else if (dir === 'up') {
      // Hat (from behind)
      fr(g, 4, 0, 8, 3, C.hat1); fr(g, 3, 2, 10, 5, C.hat1);
      fr(g, 5, 0, 6, 2, C.hatLt);
      fr(g, 4, 6, 8, 2, C.hat2); // back of hat
      // Hair visible at sides
      fr(g, 3, 5, 2, 3, C.hair1); fr(g, 11, 5, 2, 3, C.hair1);
      fr(g, 5, 7, 6, 2, C.hair1); // nape
      // Tunic back
      fr(g, 3, 9, 10, 8, C.tunic1);
      fr(g, 4, 9, 8, 7, C.tunic2);
      fr(g, 3, 14, 10, 1, C.belt);
      // Arms
      fr(g, 1, 10, 2, 5, C.tunic1); fr(g, 13, 10, 2, 5, C.tunic1);
      // Boots
      if (walk) {
        fr(g, 3, 17, 4, 5, C.boot1); fr(g, 9, 17, 4, 4, C.boot1);
      } else {
        fr(g, 4, 17, 4, 5, C.boot1); fr(g, 8, 17, 4, 5, C.boot1);
      }
    } else if (dir === 'left') {
      // Hat side view
      fr(g, 3, 0, 8, 3, C.hat1); fr(g, 2, 2, 9, 4, C.hat1);
      fr(g, 4, 0, 5, 2, C.hatLt);
      // Face side
      fr(g, 4, 5, 6, 5, C.skin1); fr(g, 5, 5, 4, 4, C.skinLt);
      // Eye
      fr(g, 4, 6, 2, 2, C.black); fr(g, 4, 7, 1, 1, C.white);
      fr(g, 5, 6, 1, 1, 0x2050a0);
      // Ear (pointed elf ear!)
      fr(g, 10, 5, 2, 1, C.skin2); fr(g, 11, 6, 1, 2, C.skin2);
      // Hair
      fr(g, 8, 5, 3, 4, C.hair1); fr(g, 10, 4, 2, 2, C.hair2);
      // Tunic
      fr(g, 3, 10, 9, 7, C.tunic1); fr(g, 4, 10, 7, 6, C.tunicLt);
      fr(g, 3, 14, 9, 1, C.belt); fr(g, 6, 13, 2, 2, C.gold);
      // Arm
      fr(g, 2, 11, 2, 5, C.tunic1); fr(g, 2, 16, 2, 1, C.skin1);
      // Boots
      if (walk) {
        fr(g, 3, 17, 4, 5, C.boot1); fr(g, 7, 17, 3, 4, C.boot1);
      } else {
        fr(g, 4, 17, 4, 5, C.boot1); fr(g, 7, 17, 3, 5, C.boot1);
      }
    } else { // right - mirror of left
      fr(g, 5, 0, 8, 3, C.hat1); fr(g, 5, 2, 9, 4, C.hat1);
      fr(g, 7, 0, 5, 2, C.hatLt);
      fr(g, 6, 5, 6, 5, C.skin1); fr(g, 7, 5, 4, 4, C.skinLt);
      fr(g, 10, 6, 2, 2, C.black); fr(g, 11, 7, 1, 1, C.white);
      fr(g, 10, 6, 1, 1, 0x2050a0);
      fr(g, 4, 5, 2, 1, C.skin2); fr(g, 4, 6, 1, 2, C.skin2);
      fr(g, 5, 5, 3, 4, C.hair1); fr(g, 4, 4, 2, 2, C.hair2);
      fr(g, 4, 10, 9, 7, C.tunic1); fr(g, 5, 10, 7, 6, C.tunicLt);
      fr(g, 4, 14, 9, 1, C.belt); fr(g, 8, 13, 2, 2, C.gold);
      fr(g, 12, 11, 2, 5, C.tunic1); fr(g, 12, 16, 2, 1, C.skin1);
      if (walk) {
        fr(g, 6, 17, 3, 4, C.boot1); fr(g, 9, 17, 4, 5, C.boot1);
      } else {
        fr(g, 6, 17, 3, 5, C.boot1); fr(g, 8, 17, 4, 5, C.boot1);
      }
    }
  };

  ['down','up','left','right'].forEach(dir => {
    [false, true].forEach(walk => {
      g = scene.make.graphics({add:false});
      drawPlayer(g, dir, walk);
      g.generateTexture('player_'+dir+(walk?'_walk':''), CHAR_W, CHAR_H);
      g.destroy();
    });
  });

  // -- Item sprites (16x16 with SNES detail) --
  // Sword
  g = scene.make.graphics({add:false});
  fr(g, 7, 0, 2, 2, 0xf0f0f8); // tip
  fr(g, 7, 2, 2, 7, C.swordBlade);
  fr(g, 6, 2, 1, 6, C.swordEdge); fr(g, 9, 2, 1, 6, C.swordEdge);
  fr(g, 8, 1, 1, 7, 0xe0e8f0); // shine line
  fr(g, 4, 9, 8, 2, C.swordGuard);
  fr(g, 5, 9, 6, 1, 0xf0d860); // guard highlight
  fr(g, 7, 11, 2, 4, C.swordHilt);
  fr(g, 6, 15, 4, 1, C.swordHilt); // pommel
  g.generateTexture('item_sword', TILE, TILE);
  g.destroy();

  // Shield
  g = scene.make.graphics({add:false});
  fr(g, 3, 1, 10, 14, C.shieldFace);
  fr(g, 4, 2, 8, 12, 0x4888c8);
  fr(g, 2, 3, 1, 10, C.shieldRim); fr(g, 13, 3, 1, 10, C.shieldRim);
  fr(g, 3, 1, 10, 1, C.shieldRim); fr(g, 3, 14, 10, 1, C.shieldRim);
  // Emblem
  fr(g, 6, 4, 4, 8, C.shieldEmb);
  fr(g, 5, 6, 6, 4, C.shieldEmb);
  fr(g, 7, 5, 2, 6, C.gold);
  fr(g, 6, 7, 4, 2, C.gold);
  // Highlight
  fr(g, 4, 2, 3, 2, 0x68a8e0);
  g.generateTexture('item_shield', TILE, TILE);
  g.destroy();

  // Map
  g = scene.make.graphics({add:false});
  fr(g, 1, 2, 14, 12, C.mapPaper);
  fr(g, 2, 3, 12, 10, 0xe8d8b0);
  // Rolled edges
  fr(g, 1, 2, 2, 12, 0xd8c8a0); fr(g, 13, 2, 2, 12, 0xd8c8a0);
  // Map drawing
  fr(g, 4, 5, 4, 1, C.mapInk); fr(g, 7, 5, 1, 3, C.mapInk);
  fr(g, 7, 7, 3, 1, C.mapInk); fr(g, 9, 7, 1, 3, C.mapInk);
  fr(g, 4, 10, 2, 2, 0xc83030); // X mark
  fr(g, 10, 4, 2, 2, 0x208840); // tree symbol
  g.generateTexture('item_map', TILE, TILE);
  g.destroy();

  // -- Professor NPC (16x24, robed scholar) --
  g = scene.make.graphics({add:false});
  fr(g, 3, CHAR_H-2, 10, 2, 0x000000, 0.2); // shadow
  // Head/hair
  fr(g, 4, 0, 8, 4, C.profHair);
  fr(g, 5, 0, 6, 2, 0xe0e0e8); // highlight
  // Face
  fr(g, 5, 4, 6, 4, C.profSkin);
  fr(g, 6, 4, 4, 3, 0xf8d8a0);
  // Eyes
  fr(g, 6, 5, 1, 2, C.black); fr(g, 9, 5, 1, 2, C.black);
  fr(g, 6, 5, 1, 1, 0x304080);
  // Glasses
  fr(g, 5, 5, 3, 2, 0x000000, 0.3); fr(g, 8, 5, 3, 2, 0x000000, 0.3);
  // Beard
  fr(g, 5, 7, 6, 2, 0xc0c0c8);
  // Robe
  fr(g, 3, 8, 10, 10, C.profRobe1);
  fr(g, 4, 8, 8, 9, C.profRobeLt);
  fr(g, 3, 8, 1, 10, C.profRobe2); fr(g, 12, 8, 1, 10, C.profRobe2);
  // Robe detail - sash
  fr(g, 7, 8, 2, 9, 0x8070c0);
  // Sleeves
  fr(g, 1, 9, 2, 6, C.profRobe1); fr(g, 13, 9, 2, 6, C.profRobe1);
  fr(g, 1, 15, 2, 1, C.profSkin); fr(g, 13, 15, 2, 1, C.profSkin);
  // Feet
  fr(g, 4, 18, 4, 4, 0x403020); fr(g, 8, 18, 4, 4, 0x403020);
  g.generateTexture('professor', CHAR_W, CHAR_H);
  g.destroy();

  // -- Enemy: Forest Goblin (large combat sprite 48x48) --
  g = scene.make.graphics({add:false});
  const EW = 48, EH = 48;
  // Body
  fr(g, 14, 16, 20, 22, C.enemy1);
  fr(g, 16, 18, 16, 18, C.enemyLt); // body highlight
  fr(g, 14, 34, 20, 4, C.enemy2); // lower body shadow
  // Belly
  fr(g, 17, 24, 14, 10, C.enemyBelly);
  fr(g, 19, 26, 10, 6, 0xc0b070);
  // Head
  fr(g, 12, 4, 24, 16, C.enemy1);
  fr(g, 14, 5, 20, 13, C.enemyLt);
  fr(g, 16, 2, 16, 4, C.enemy1); // top of head
  // Eyes (menacing)
  fr(g, 16, 8, 6, 5, C.white);
  fr(g, 26, 8, 6, 5, C.white);
  fr(g, 18, 9, 3, 3, C.enemyEye); fr(g, 28, 9, 3, 3, C.enemyEye);
  fr(g, 19, 10, 1, 1, C.black); fr(g, 29, 10, 1, 1, C.black); // pupils
  // Brow
  fr(g, 15, 7, 8, 2, C.enemyDk); fr(g, 25, 7, 8, 2, C.enemyDk);
  // Mouth with fangs
  fr(g, 17, 15, 14, 3, 0x401008);
  fr(g, 19, 14, 3, 2, C.white); fr(g, 26, 14, 3, 2, C.white); // fangs
  // Ears (pointed)
  fr(g, 8, 6, 4, 6, C.enemy1); fr(g, 36, 6, 4, 6, C.enemy1);
  // Arms (muscular)
  fr(g, 4, 18, 10, 16, C.enemy1); fr(g, 6, 20, 6, 12, C.enemyLt);
  fr(g, 34, 18, 10, 16, C.enemy1); fr(g, 36, 20, 6, 12, C.enemyLt);
  // Claws
  fr(g, 4, 34, 3, 4, C.enemyDk); fr(g, 7, 34, 3, 4, C.enemyDk);
  fr(g, 38, 34, 3, 4, C.enemyDk); fr(g, 41, 34, 3, 4, C.enemyDk);
  // Legs
  fr(g, 16, 38, 6, 10, C.enemy1); fr(g, 26, 38, 6, 10, C.enemy1);
  fr(g, 17, 39, 4, 8, C.enemyLt); fr(g, 27, 39, 4, 8, C.enemyLt);
  // Feet
  fr(g, 14, 44, 10, 4, C.enemyDk); fr(g, 24, 44, 10, 4, C.enemyDk);
  g.generateTexture('enemy_goblin', EW, EH);
  g.destroy();

  // -- Player combat sprite (larger, 32x48) --
  g = scene.make.graphics({add:false});
  const PW = 32, PH = 48;
  // Shadow
  fr(g, 6, PH-3, 20, 3, 0x000000, 0.2);
  // Boots
  fr(g, 8, 38, 7, 8, C.boot1); fr(g, 17, 38, 7, 8, C.boot1);
  fr(g, 9, 39, 5, 6, C.boot2); fr(g, 18, 39, 5, 6, C.boot2);
  fr(g, 8, 44, 8, 2, C.boot2); fr(g, 17, 44, 8, 2, C.boot2);
  // Legs
  fr(g, 9, 32, 6, 7, C.tunic1); fr(g, 17, 32, 6, 7, C.tunic1);
  // Tunic body
  fr(g, 6, 16, 20, 18, C.tunic1);
  fr(g, 8, 17, 16, 16, C.tunicLt);
  fr(g, 6, 16, 2, 18, C.tunicDk); fr(g, 24, 16, 2, 18, C.tunicDk);
  // Belt
  fr(g, 6, 28, 20, 2, C.belt);
  fr(g, 14, 27, 4, 3, C.gold); // buckle
  // Arms
  fr(g, 2, 18, 4, 12, C.tunic1); fr(g, 26, 18, 4, 12, C.tunic1);
  fr(g, 3, 19, 2, 10, C.tunicLt); fr(g, 27, 19, 2, 10, C.tunicLt);
  // Hands
  fr(g, 2, 30, 4, 3, C.skin1); fr(g, 26, 30, 4, 3, C.skin1);
  // Head
  fr(g, 8, 0, 16, 6, C.hat1);
  fr(g, 7, 4, 18, 6, C.hat1);
  fr(g, 10, 0, 12, 4, C.hatLt);
  // Face
  fr(g, 8, 8, 16, 9, C.skin1);
  fr(g, 10, 8, 12, 7, C.skinLt);
  // Eyes
  fr(g, 10, 10, 4, 3, C.black); fr(g, 18, 10, 4, 3, C.black);
  fr(g, 11, 10, 2, 2, 0x2050a0); fr(g, 19, 10, 2, 2, 0x2050a0);
  fr(g, 12, 11, 1, 1, C.white); fr(g, 20, 11, 1, 1, C.white);
  // Mouth
  fr(g, 13, 14, 6, 1, 0xd89868);
  // Hair
  fr(g, 6, 6, 3, 6, C.hair1); fr(g, 23, 6, 3, 6, C.hair1);
  // Ears (pointed)
  fr(g, 5, 9, 3, 3, C.skin2); fr(g, 24, 9, 3, 3, C.skin2);
  fr(g, 4, 9, 1, 2, C.skin2); fr(g, 27, 9, 1, 2, C.skin2);
  g.generateTexture('player_combat', PW, PH);
  g.destroy();

  // -- Chest --
  g = scene.make.graphics({add:false});
  fr(g, 1, 4, 14, 10, 0x8b6914);
  fr(g, 2, 5, 12, 8, 0xa88828);
  fr(g, 1, 8, 14, 2, 0x6b5010); // band
  fr(g, 6, 6, 4, 3, C.gold); // lock
  fr(g, 7, 7, 2, 1, 0xf0e060);
  // Highlight
  fr(g, 2, 5, 5, 2, 0xb89838);
  g.generateTexture('chest', TILE, TILE);
  g.destroy();

  // -- Exit mat --
  g = scene.make.graphics({add:false});
  fr(g, 0, 0, TILE, TILE, 0x9a7848);
  fr(g, 2, 5, 12, 7, 0xc06830);
  fr(g, 3, 6, 10, 5, 0xd88848);
  fr(g, 5, 8, 6, 1, 0xf0c868);
  g.generateTexture('exitMat', TILE, TILE);
  g.destroy();

  // -- Sparkle --
  g = scene.make.graphics({add:false});
  fr(g, 7, 0, 2, 5, 0xfffff0); fr(g, 0, 7, 5, 2, 0xfffff0);
  fr(g, 11, 7, 5, 2, 0xfffff0); fr(g, 7, 11, 2, 5, 0xfffff0);
  fr(g, 6, 6, 4, 4, 0xffffff);
  fr(g, 3, 3, 2, 2, 0xfffff0, 0.6); fr(g, 11, 3, 2, 2, 0xfffff0, 0.6);
  fr(g, 3, 11, 2, 2, 0xfffff0, 0.6); fr(g, 11, 11, 2, 2, 0xfffff0, 0.6);
  g.generateTexture('sparkle', TILE, TILE);
  g.destroy();
}

// ===== MAP GENERATION =====
function makeMap() {
  const m = [];
  for (let y = 0; y < MAP_H; y++) {
    m[y] = [];
    for (let x = 0; x < MAP_W; x++) m[y][x] = 0;
  }
  // Tree border
  for (let x = 0; x < MAP_W; x++) { m[0][x]=2; m[1][x]=2; m[MAP_H-1][x]=2; m[MAP_H-2][x]=2; }
  for (let y = 0; y < MAP_H; y++) { m[y][0]=2; m[y][1]=2; m[y][MAP_W-1]=2; m[y][MAP_W-2]=2; }

  // Winding main road
  const roadY = [];
  let ry = 15;
  for (let x = 2; x < MAP_W-2; x++) {
    roadY[x] = ry;
    m[ry][x] = 1; m[ry-1][x] = 1;
    if (Math.random() < 0.35) ry += (Math.random() < 0.5 ? 1 : -1);
    ry = Math.max(8, Math.min(MAP_H-8, ry));
  }
  // Winding vertical road
  let rx = 15;
  for (let y = 3; y < MAP_H-3; y++) {
    m[y][rx] = 1; m[y][rx+1] = 1;
    if (Math.random() < 0.35) rx += (Math.random() < 0.5 ? 1 : -1);
    rx = Math.max(6, Math.min(MAP_W-6, rx));
  }

  function pathTo(sx, sy, ex, ey) {
    let cx = sx, cy = sy;
    while (cx !== ex || cy !== ey) {
      m[cy][cx] = 1;
      if (Math.random() < 0.6) cx += (ex > cx ? 1 : ex < cx ? -1 : 0);
      else cy += (ey > cy ? 1 : ey < cy ? -1 : 0);
      cx = Math.max(2, Math.min(MAP_W-3, cx));
      cy = Math.max(2, Math.min(MAP_H-3, cy));
    }
    m[ey][ex] = 1;
  }

  // House 1 (sword chest)
  const h1x=6, h1y=6;
  pathTo(8, roadY[8]||14, h1x+1, h1y+3);
  m[h1y][h1x]=10; m[h1y][h1x+1]=10; m[h1y][h1x+2]=10; m[h1y][h1x+3]=10;
  m[h1y+1][h1x]=11; m[h1y+1][h1x+1]=13; m[h1y+1][h1x+2]=13; m[h1y+1][h1x+3]=11;
  m[h1y+2][h1x]=11; m[h1y+2][h1x+1]=11; m[h1y+2][h1x+2]=12; m[h1y+2][h1x+3]=11;

  // House 2
  const h2x=21, h2y=20;
  pathTo(20, roadY[20]||15, h2x+1, h2y+3);
  m[h2y][h2x]=10; m[h2y][h2x+1]=10; m[h2y][h2x+2]=10; m[h2y][h2x+3]=10;
  m[h2y+1][h2x]=11; m[h2y+1][h2x+1]=13; m[h2y+1][h2x+2]=13; m[h2y+1][h2x+3]=11;
  m[h2y+2][h2x]=11; m[h2y+2][h2x+1]=12; m[h2y+2][h2x+2]=11; m[h2y+2][h2x+3]=11;

  // Special rock (shield)
  m[10][22] = 21; pathTo(18, roadY[18]||14, 22, 11);
  // Special tree (map)
  m[22][8] = 20; pathTo(10, roadY[10]||14, 8, 21);
  // Professor
  m[13][16] = 30;
  // Pond
  for (let py=17; py<=19; py++) for (let px=23; px<=26; px++) if(m[py][px]===0) m[py][px]=4;

  // Scatter trees and rocks
  for (let y=3; y<MAP_H-3; y++) for (let x=3; x<MAP_W-3; x++) {
    if (m[y][x] === 0) {
      const r = Math.random();
      if (r < 0.18) m[y][x] = 2;
      else if (r < 0.22) m[y][x] = 3;
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
  showingMessage: false,
  combatActive: false,
  playerHP: 50, playerMaxHP: 50,
  playerMP: 15, playerMaxMP: 15,
};

// ===== BOOT SCENE (SNES Title Screen) =====
class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() {
    genTextures(this);
    const cx = GAME_W/2, cy = GAME_H/2;

    // Rich gradient sky
    const bg = this.add.graphics();
    for (let y = 0; y < GAME_H; y++) {
      const t = y / GAME_H;
      const r = Math.floor(8 + t * 20);
      const gg = Math.floor(12 + t * 40);
      const b = Math.floor(40 + t * 50);
      bg.fillStyle((r << 16) | (gg << 8) | b, 1);
      bg.fillRect(0, y, GAME_W, 1);
    }

    // Distant mountains (3 layers for parallax feel)
    const mtn = this.add.graphics();
    // Far mountains
    mtn.fillStyle(0x182838, 1);
    for (let x = 0; x < GAME_W; x++) {
      const h = Math.sin(x*0.015)*40 + Math.sin(x*0.04)*20 + Math.cos(x*0.025)*15;
      mtn.fillRect(x, 120 - h, 1, h + 136);
    }
    // Mid mountains
    mtn.fillStyle(0x1a3820, 1);
    for (let x = 0; x < GAME_W; x++) {
      const h = Math.sin(x*0.025+0.5)*30 + Math.sin(x*0.06+1)*18 + Math.cos(x*0.035)*12;
      mtn.fillRect(x, 145 - h, 1, h + 111);
    }
    // Near forest
    mtn.fillStyle(0x122a10, 1);
    for (let x = 0; x < GAME_W; x += 6) {
      const h = 25 + Math.sin(x*0.08)*12 + Math.random()*10;
      for (let ty = 0; ty < h; ty++) {
        const w = Math.floor((ty/h)*5)+1;
        mtn.fillRect(x+3-w, 185-h+ty, w*2, 1);
      }
    }
    // Ground
    mtn.fillStyle(0x122a10, 1);
    mtn.fillRect(0, 185, GAME_W, 71);

    // Stars with twinkle
    for (let i = 0; i < 50; i++) {
      const sx = Math.random()*GAME_W, sy = Math.random()*110;
      const star = this.add.graphics();
      star.fillStyle(0xffffff, 0.6 + Math.random()*0.4);
      const sz = Math.random() < 0.2 ? 2 : 1;
      star.fillRect(sx, sy, sz, sz);
      if (sz === 2) { star.fillRect(sx-1, sy, 1, sz, 0xffffff); star.fillRect(sx+2, sy, 1, sz); }
      this.tweens.add({ targets: star, alpha: 0.2, duration: 800+Math.random()*1200, yoyo:true, repeat:-1, delay: Math.random()*1000 });
    }

    // Moon with glow
    const moon = this.add.graphics();
    moon.fillStyle(0x304060, 0.15);
    moon.fillCircle(300, 40, 22); // glow
    moon.fillStyle(0xffeeaa, 1);
    moon.fillCircle(300, 40, 14);
    moon.fillStyle(0xfff8cc, 1);
    moon.fillCircle(298, 38, 11);
    moon.fillStyle(0x0a1430, 1);
    moon.fillCircle(306, 36, 12); // crescent shadow

    // Title with shadow effect
    this.add.text(cx, 40, 'GREENMOUNTAINFOG', {
      fontFamily: 'Courier New', fontSize: '18px', color: '#000000',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0.5);
    this.add.text(cx, 39, 'GREENMOUNTAINFOG', {
      fontFamily: 'Courier New', fontSize: '18px', color: '#f0c840',
      stroke: '#805020', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(cx, 64, '~ The Journey ~', {
      fontFamily: 'Courier New', fontSize: '22px', color: '#000000',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0.4);
    this.add.text(cx, 63, '~ The Journey ~', {
      fontFamily: 'Courier New', fontSize: '22px', color: '#ffffff',
      stroke: '#304080', strokeThickness: 3
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(cx, 88, 'A 16-Bit Adventure', {
      fontFamily: 'Courier New', fontSize: '9px', color: '#90a8c0'
    }).setOrigin(0.5);

    // Blinking start text
    const start = this.add.text(cx, 200, '- PRESS START -', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
    this.tweens.add({ targets: start, alpha: 0, duration: 600, yoyo:true, repeat:-1 });

    // Copyright-ish
    this.add.text(cx, 225, '© 2026 GreenMountainFog', {
      fontFamily: 'Courier New', fontSize: '7px', color: '#506070'
    }).setOrigin(0.5);

    const go = () => this.scene.start('OverworldScene');
    this.input.keyboard.on('keydown-ENTER', go);
    this.input.keyboard.on('keydown-SPACE', go);
    this.input.on('pointerdown', go);
  }
}

// ===== OVERWORLD SCENE =====
class OverworldScene extends Phaser.Scene {
  constructor() { super('OverworldScene'); }
  create() {
    this.mapData = makeMap();
    this.colliders = [];

    // Render tile layers
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = this.mapData[y][x];
        const px = x*TILE, py = y*TILE;
        let tex = 'grass'+((x+y)%2);
        if (t===1) tex='path'; else if (t===2) tex='tree'; else if (t===3) tex='rock';
        else if (t===4) tex='water'; else if (t===10) tex='houseRoof';
        else if (t===11) tex='houseWall'; else if (t===12) tex='door';
        else if (t===13) tex='window'; else if (t===20) tex='treeSpecial';
        else if (t===21) tex='rockSpecial';
        if (t === 30) tex = 'path'; // professor stands on path
        this.add.image(px+TILE/2, py+TILE/2, tex);

        if ([2,3,4,10,11,13,20,21].includes(t)) {
          const b = this.physics.add.staticImage(px+TILE/2, py+TILE/2, tex).setVisible(false);
          b.body.setSize(TILE, TILE);
          b.tileType = t; b.tileX = x; b.tileY = y;
          this.colliders.push(b);
        }
      }
    }

    // Professor NPC
    for (let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) {
      if (this.mapData[y][x]===30) {
        this.professor = this.physics.add.sprite(x*TILE+TILE/2, y*TILE+CHAR_H/2-4, 'professor');
        this.professor.setImmovable(true);
        this.professor.body.setSize(14, 14);
        this.professor.body.setOffset(1, 10);
        this.professor.setDepth(5);
      }
    }

    // Sparkle effects
    this.sparkles = {};
    for (let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) {
      if (this.mapData[y][x]===20 && !STATE.items.map) {
        this.sparkles.map = this.add.sprite(x*TILE+TILE/2, y*TILE+TILE/2, 'sparkle').setAlpha(0.8).setDepth(8);
        this.tweens.add({targets:this.sparkles.map, alpha:0.2, scaleX:0.6, scaleY:0.6, duration:500, yoyo:true, repeat:-1});
      }
      if (this.mapData[y][x]===21 && !STATE.items.shield) {
        this.sparkles.shield = this.add.sprite(x*TILE+TILE/2, y*TILE+TILE/2, 'sparkle').setAlpha(0.8).setDepth(8);
        this.tweens.add({targets:this.sparkles.shield, alpha:0.2, scaleX:0.6, scaleY:0.6, duration:500, yoyo:true, repeat:-1});
      }
    }

    // Find spawn on path near center
    let spawnX=15, spawnY=15;
    for (let r=0;r<5;r++) for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++) {
      const tx=15+dx, ty=15+dy;
      if (tx>=0&&tx<MAP_W&&ty>=0&&ty<MAP_H&&this.mapData[ty][tx]===1) { spawnX=tx; spawnY=ty; r=99; break; }
      if (r===99) break;
    }

    this.player = this.physics.add.sprite(spawnX*TILE+TILE/2, spawnY*TILE+CHAR_H/2-4, 'player_down');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(12, 12);
    this.player.body.setOffset(2, 12);
    this.player.setDepth(10);
    this.facing = 'down';
    this.walkFrame = 0;
    this.walkTimer = 0;

    // Collisions
    const cg = this.physics.add.staticGroup();
    this.colliders.forEach(c => cg.add(c));
    this.physics.add.collider(this.player, cg);
    if (this.professor) this.physics.add.collider(this.player, this.professor);

    // Track door positions for walk-in entry
    this.doorTiles = [];
    for (let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) {
      if (this.mapData[y][x]===12) {
        this.doorTiles.push({x:x, y:y, houseNum: (x<=15)?1:2});
      }
    }
    this.enteringHouse = false;

    // Camera - zoomed in close (SNES feel)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setBounds(0, 0, MAP_W*TILE, MAP_H*TILE);
    this.physics.world.setBounds(0, 0, MAP_W*TILE, MAP_H*TILE);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.scene.launch('UIScene');
    this.ui = this.scene.get('UIScene');
    this.actionCooldown = 0;

    if (!STATE.questStarted) {
      this.time.delayedCall(500, () => {
        this.ui.showMessage('Welcome to Evergreen Village! Explore and find the 3 hidden items: a Sword, a Shield, and a Map.');
      });
    }
  }

  update(time, delta) {
    if (STATE.showingMessage || STATE.combatActive) { this.player.setVelocity(0,0); return; }
    let vx=0, vy=0;
    const td = window.touchDir || {};
    if (td.up||this.cursors.up.isDown) { vy=-SPEED; this.facing='up'; }
    else if (td.down||this.cursors.down.isDown) { vy=SPEED; this.facing='down'; }
    if (td.left||this.cursors.left.isDown) { vx=-SPEED; this.facing='left'; }
    else if (td.right||this.cursors.right.isDown) { vx=SPEED; this.facing='right'; }
    this.player.setVelocity(vx, vy);

    if (vx!==0||vy!==0) {
      this.walkTimer += delta;
      if (this.walkTimer > 180) { this.walkTimer=0; this.walkFrame=1-this.walkFrame; }
      this.player.setTexture('player_'+this.facing+(this.walkFrame?'_walk':''));
    } else {
      this.player.setTexture('player_'+this.facing);
      this.walkTimer=0; this.walkFrame=0;
    }

    // Check if player walked into a door
    if (!this.enteringHouse && (vx!==0||vy!==0)) {
      const ptx = Math.floor(this.player.x / TILE);
      const pty = Math.floor((this.player.y + 4) / TILE); // offset down since body is at bottom
      for (const dt of this.doorTiles) {
        // Check if player is on the door tile or one tile below facing up
        if ((ptx===dt.x && pty===dt.y) ||
            (ptx===dt.x && pty===dt.y+1 && this.facing==='up')) {
          this.enteringHouse = true;
          this.enterHouse(dt.houseNum);
          return;
        }
      }
    }

    this.actionCooldown -= delta;
    const act = window.touchActionJust || Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey);
    if (act && this.actionCooldown <= 0) {
      window.touchActionJust = false;
      this.actionCooldown = 300;
      this.handleAction();
    }
  }

  handleAction() {
    const px=this.player.x, py=this.player.y;
    let cx=px, cy=py;
    if (this.facing==='up') cy-=TILE;
    else if (this.facing==='down') cy+=TILE;
    else if (this.facing==='left') cx-=TILE;
    else cx+=TILE;
    const tileX=Math.floor(cx/TILE), tileY=Math.floor(cy/TILE);
    if (tileX<0||tileX>=MAP_W||tileY<0||tileY>=MAP_H) return;
    const tile = this.mapData[tileY][tileX];

    if (tile===12) { this.enterHouse(tileX<=15?1:2); return; }
    if (tile===20 && !STATE.items.map) {
      STATE.items.map=true; STATE.itemCount++;
      this.ui.showMessage('You found the MAP hidden in the tree! It shows a path through the Dark Woods...');
      if(this.sparkles.map) this.sparkles.map.destroy();
      this.mapData[tileY][tileX]=2; this.checkAllItems(); return;
    }
    if (tile===21 && !STATE.items.shield) {
      STATE.items.shield=true; STATE.itemCount++;
      this.ui.showMessage('You found the SHIELD under the rock! Ancient runes glow along its rim.');
      if(this.sparkles.shield) this.sparkles.shield.destroy();
      this.mapData[tileY][tileX]=3; this.checkAllItems(); return;
    }
    if (tile===30 || (this.professor && Phaser.Math.Distance.Between(px,py,this.professor.x,this.professor.y)<TILE*2)) {
      this.talkToProfessor(); return;
    }
    if (tile===2) this.ui.showMessage('A sturdy tree. Nothing unusual here.');
    else if (tile===3) this.ui.showMessage('A plain rock. Nothing underneath.');
  }

  enterHouse(n) { STATE.inHouse=true; STATE.currentHouse=n; this.scene.start('HouseScene',{houseNum:n}); }

  talkToProfessor() {
    if (STATE.itemCount<3) {
      this.ui.showMessage('Professor Elm: "Hello, adventurer! Our village hides three ancient relics. Find them all and return to me!"');
    } else if (!STATE.questStarted) {
      STATE.questStarted=true;
      this.ui.showMessageSequence([
        'Professor Elm: "Incredible! You found all three relics!"',
        '"I must ask a great favor of you..."',
        '"My daughter, Elara, left for Maplehollow village a week ago."',
        '"She went to help an old family friend who sent an urgent letter."',
        '"The letter spoke of a troublemaker terrorizing their village."',
        '"To reach Maplehollow she must pass through the Dark Woods..."',
        '"I fear those woods hold dangers she didn\'t expect."',
        '"Will you follow the eastern path and find her? Take these relics - you\'ll need them!"',
      ]);
    } else {
      this.ui.showMessage('Professor Elm: "Please hurry through the Dark Woods to Maplehollow! Elara needs help!"');
    }
  }

  checkAllItems() {
    if (STATE.itemCount===3) {
      this.time.delayedCall(2000, () => {
        this.ui.showMessage('You have all 3 relics! The Professor is signaling to you from the village center!');
      });
    }
  }
}

// ===== HOUSE INTERIOR SCENE =====
class HouseScene extends Phaser.Scene {
  constructor() { super('HouseScene'); }
  create(data) {
    this.houseNum = data.houseNum||1;
    const W=8, H=7; // room size in tiles
    // Center the room in the game world
    const roomPxW = W*TILE, roomPxH = H*TILE;
    const ox = Math.floor((GAME_W - roomPxW)/2);
    const oy = Math.floor((GAME_H - roomPxH)/2);

    // Dark background behind the room
    const darkBg = this.add.graphics();
    darkBg.fillStyle(0x080810, 1);
    darkBg.fillRect(0, 0, GAME_W, GAME_H);

    // Draw interior tiles
    for (let y=0;y<H;y++) for(let x=0;x<W;x++) {
      const px=ox+x*TILE, py=oy+y*TILE;
      this.add.image(px+TILE/2, py+TILE/2, y===0?'intWall':'floor');
    }

    // Walls as collision (top row + left/right invisible barriers + bottom except exit)
    const walls = this.physics.add.staticGroup();
    // Top wall
    for(let x=0;x<W;x++) {
      walls.add(this.physics.add.staticImage(ox+x*TILE+TILE/2, oy+TILE/2,'intWall').setVisible(false));
    }
    // Left and right walls
    for(let y=0;y<H;y++) {
      walls.add(this.physics.add.staticImage(ox-TILE/2, oy+y*TILE+TILE/2,'intWall').setVisible(false));
      walls.add(this.physics.add.staticImage(ox+roomPxW+TILE/2, oy+y*TILE+TILE/2,'intWall').setVisible(false));
    }
    // Bottom wall except exit column
    const exitCol = 3;
    for(let x=0;x<W;x++) {
      if (x !== exitCol) {
        walls.add(this.physics.add.staticImage(ox+x*TILE+TILE/2, oy+roomPxH+TILE/2,'intWall').setVisible(false));
      }
    }

    // Exit mat at bottom center
    const exitX=ox+exitCol*TILE+TILE/2, exitY=oy+(H-1)*TILE+TILE/2;
    this.add.image(exitX, exitY, 'exitMat');
    this.exitZone = this.add.zone(exitX, exitY+TILE/2, TILE, 8);
    this.physics.add.existing(this.exitZone, true);

    // Chest in house 1
    if (this.houseNum===1 && !STATE.items.sword) {
      this.chest = this.physics.add.sprite(ox+2*TILE+TILE/2, oy+TILE+TILE/2, 'chest');
      this.chest.setImmovable(true);
    }
    // Table in house 2
    if (this.houseNum===2) {
      const tbl=this.add.graphics();
      fr(tbl, ox+4*TILE, oy+2*TILE, TILE*2, TILE, 0x6b4226);
      fr(tbl, ox+4*TILE+2, oy+2*TILE+2, TILE*2-4, TILE-4, 0x8b5a36);
      walls.add(this.physics.add.staticImage(ox+5*TILE, oy+2*TILE+TILE/2,'intWall').setVisible(false));
    }

    // Player spawns near exit, facing up
    this.player = this.physics.add.sprite(exitX, exitY-TILE, 'player_up');
    this.player.body.setSize(12,12); this.player.body.setOffset(2,12);
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.facing='up'; this.walkFrame=0; this.walkTimer=0;

    this.physics.add.collider(this.player, walls);
    if(this.chest) this.physics.add.collider(this.player, this.chest);
    this.physics.add.overlap(this.player, this.exitZone, ()=>{
      if(this.facing==='down') { STATE.inHouse=false; this.scene.start('OverworldScene'); }
    });

    // Constrain physics world to the room area
    this.physics.world.setBounds(ox, oy, roomPxW, roomPxH);

    // Camera: NO zoom for interior — show the whole room nicely centered
    this.cameras.main.setZoom(1);
    // Center camera on room
    this.cameras.main.centerOn(ox + roomPxW/2, oy + roomPxH/2);

    this.cursors=this.input.keyboard.createCursorKeys();
    this.spaceKey=this.input.keyboard.addKey('SPACE');
    this.enterKey=this.input.keyboard.addKey('ENTER');
    this.actionCooldown=0;
    this.scene.launch('UIScene');
    this.ui=this.scene.get('UIScene');

    this.time.delayedCall(300, ()=>{
      if(this.houseNum===1&&!STATE.items.sword) this.ui.showMessage('A dusty cabin. A wooden chest sits in the corner...');
      else if(this.houseNum===2) this.ui.showMessage('A cozy cottage. Warm light fills the room.');
      else this.ui.showMessage('You entered the cabin.');
    });
  }

  update(time,delta) {
    if(STATE.showingMessage){this.player.setVelocity(0,0);return;}
    let vx=0,vy=0;
    const td=window.touchDir||{};
    if(td.up||this.cursors.up.isDown){vy=-SPEED;this.facing='up';}
    else if(td.down||this.cursors.down.isDown){vy=SPEED;this.facing='down';}
    if(td.left||this.cursors.left.isDown){vx=-SPEED;this.facing='left';}
    else if(td.right||this.cursors.right.isDown){vx=SPEED;this.facing='right';}
    this.player.setVelocity(vx,vy);
    if(vx!==0||vy!==0){
      this.walkTimer+=delta;
      if(this.walkTimer>180){this.walkTimer=0;this.walkFrame=1-this.walkFrame;}
      this.player.setTexture('player_'+this.facing+(this.walkFrame?'_walk':''));
    } else this.player.setTexture('player_'+this.facing);

    this.actionCooldown-=delta;
    const act=window.touchActionJust||Phaser.Input.Keyboard.JustDown(this.spaceKey)||Phaser.Input.Keyboard.JustDown(this.enterKey);
    if(act&&this.actionCooldown<=0){
      window.touchActionJust=false; this.actionCooldown=300;
      if(this.chest&&Phaser.Math.Distance.Between(this.player.x,this.player.y,this.chest.x,this.chest.y)<TILE*1.5){
        STATE.items.sword=true; STATE.itemCount++;
        this.chest.destroy(); this.chest=null;
        this.ui.showMessage('You found the SWORD! Its blade shines with a faint blue light.');
        if(STATE.itemCount===3) this.time.delayedCall(2000,()=>this.ui.showMessage('All 3 relics found! Go talk to the Professor!'));
      }
    }
  }
}

// ===== UI SCENE (SNES-style overlay) =====
class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }
  create() {
    this.textBox = this.add.graphics().setVisible(false).setScrollFactor(0).setDepth(100);
    this.msgText = this.add.text(16, GAME_H-58, '', {
      fontFamily:'Courier New', fontSize:'9px', color:'#e8e8f0',
      wordWrap:{width:GAME_W-32}, lineSpacing:3
    }).setScrollFactor(0).setDepth(101).setVisible(false);

    this.promptText = this.add.text(GAME_W-14, GAME_H-10, '▼', {
      fontFamily:'Courier New', fontSize:'9px', color:'#f0c840'
    }).setOrigin(1,1).setScrollFactor(0).setDepth(101).setVisible(false);
    this.tweens.add({targets:this.promptText, alpha:0.3, duration:350, yoyo:true, repeat:-1});

    // Inventory with item icons
    this.invContainer = this.add.container(0,0).setScrollFactor(0).setDepth(90);
    this.invBg = this.add.graphics().setScrollFactor(0);
    this.invText = this.add.text(6, 4, '', {
      fontFamily:'Courier New', fontSize:'8px', color:'#f0d848',
      stroke:'#000000', strokeThickness:2
    }).setScrollFactor(0).setDepth(90);

    this.messageQueue=[]; this.currentMessage='';
    this.displayedChars=0; this.charTimer=0; this.messageComplete=false;
  }

  update(time,delta) {
    const inv=[];
    if(STATE.items.sword) inv.push('⚔ Sword');
    if(STATE.items.shield) inv.push('🛡 Shield');
    if(STATE.items.map) inv.push('🗺 Map');
    this.invText.setText(inv.length>0?inv.join('  '):'');

    if(STATE.showingMessage&&!this.messageComplete){
      this.charTimer+=delta;
      if(this.charTimer>25){
        this.charTimer=0; this.displayedChars++;
        this.msgText.setText(this.currentMessage.substring(0,this.displayedChars));
        if(this.displayedChars>=this.currentMessage.length){
          this.messageComplete=true; this.promptText.setVisible(true);
        }
      }
    }
    if(STATE.showingMessage&&this.messageComplete){
      const act=window.touchActionJust||
        Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE'))||
        Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ENTER'));
      if(act){
        window.touchActionJust=false;
        if(this.messageQueue.length>0) this.showNextMessage();
        else this.hideMessage();
      }
    }
  }

  showMessage(t){this.messageQueue=[];this.startMessage(t);}
  showMessageSequence(m){this.messageQueue=m.slice(1);this.startMessage(m[0]);}

  startMessage(text) {
    STATE.showingMessage=true;
    this.currentMessage=text; this.displayedChars=0;
    this.charTimer=0; this.messageComplete=false;

    // SNES-style double-border text box
    this.textBox.clear();
    const bx=6, by=GAME_H-66, bw=GAME_W-12, bh=60;
    // Outer border (bright)
    this.textBox.lineStyle(2, C.uiBorderLt, 1);
    this.textBox.strokeRect(bx, by, bw, bh);
    // Fill
    this.textBox.fillStyle(C.textBg, 0.94);
    this.textBox.fillRect(bx+1, by+1, bw-2, bh-2);
    // Inner border (darker)
    this.textBox.lineStyle(1, C.uiBorder, 0.5);
    this.textBox.strokeRect(bx+3, by+3, bw-6, bh-6);
    // Corner accents
    const cx2 = [bx+2, bx+bw-4, bx+2, bx+bw-4];
    const cy2 = [by+2, by+2, by+bh-4, by+bh-4];
    for(let i=0;i<4;i++){
      this.textBox.fillStyle(C.uiBorderLt,0.6);
      this.textBox.fillRect(cx2[i],cy2[i],2,2);
    }

    this.textBox.setVisible(true);
    this.msgText.setText('').setPosition(16, GAME_H-58);
    this.msgText.setVisible(true);
    this.promptText.setVisible(false);
  }

  showNextMessage(){this.startMessage(this.messageQueue.shift());}
  hideMessage(){STATE.showingMessage=false;this.textBox.setVisible(false);this.msgText.setVisible(false);this.promptText.setVisible(false);}
}

// ===== COMBAT SCENE (SNES DBZ/FF Style) =====
class CombatScene extends Phaser.Scene {
  constructor() { super('CombatScene'); }
  create(data) {
    STATE.combatActive=true;
    this.enemyHP=30; this.enemyMaxHP=30;
    this.turnState='player'; this.selectedAction=0;
    this.actions=['Attack','Defend','Item'];
    this.defending=false;

    // === Detailed battle background ===
    const bg=this.add.graphics();
    // Sky gradient (vivid blue like SNES)
    for(let y=0;y<100;y++){
      const t=y/100;
      const r=Math.floor(40+t*30), gg=Math.floor(100+t*60), b=Math.floor(220-t*40);
      bg.fillStyle((r<<16)|(gg<<8)|b,1);
      bg.fillRect(0,y,GAME_W,1);
    }
    // Clouds
    bg.fillStyle(0xffffff, 0.5);
    bg.fillRect(20,15,40,8); bg.fillRect(25,12,30,6); bg.fillRect(30,10,20,4);
    bg.fillRect(200,25,50,10); bg.fillRect(210,20,35,8); bg.fillRect(215,18,25,5);
    bg.fillRect(320,30,35,7); bg.fillRect(325,27,25,5);
    bg.fillStyle(0xffffff, 0.3);
    bg.fillRect(100,35,30,6); bg.fillRect(280,20,25,5);

    // Background building (like DBZ Tenkaichi stage)
    bg.fillStyle(0xb08050, 1);
    bg.fillRect(80, 45, 220, 65); // main building wall
    bg.fillStyle(0xc89868, 1);
    bg.fillRect(85, 50, 210, 55); // wall face
    // Roof
    bg.fillStyle(0xc05030, 1);
    bg.fillRect(70, 35, 240, 15);
    bg.fillStyle(0xd86848, 1);
    bg.fillRect(75, 37, 230, 8);
    // Roof ridge
    bg.fillStyle(0xa04028, 1);
    bg.fillRect(70, 35, 240, 3);
    // Windows
    for(let wx=100; wx<280; wx+=40){
      bg.fillStyle(0x504030,1);
      bg.fillRect(wx, 55, 20, 25);
      bg.fillStyle(0x3888c0,1);
      bg.fillRect(wx+2, 57, 16, 21);
      bg.fillStyle(0x504030,1);
      bg.fillRect(wx+8, 55, 4, 25); // vertical bar
      bg.fillRect(wx, 66, 20, 3); // horizontal bar
    }
    // Pillars
    bg.fillStyle(0x907050,1);
    bg.fillRect(90,50,8,55); bg.fillRect(280,50,8,55);
    bg.fillStyle(0xa88868,1);
    bg.fillRect(92,52,4,51); bg.fillRect(282,52,4,51);

    // Bushes in front of building
    bg.fillStyle(0x308040,1);
    bg.fillRect(75,105,230,8);
    bg.fillStyle(0x40a058,1);
    for(let bx=80;bx<300;bx+=12){
      bg.fillRect(bx,102,10,6);
      bg.fillRect(bx+2,100,6,4);
    }

    // Ground - tiled floor (like tournament arena)
    bg.fillStyle(0xc0a880,1);
    bg.fillRect(0,110,GAME_W,146);
    // Tile pattern
    for(let gy=110;gy<GAME_H;gy+=12){
      for(let gx=0;gx<GAME_W;gx+=16){
        const off=(Math.floor((gy-110)/12)%2)*8;
        bg.fillStyle(gy%24<12?0xb89870:0xc8b088,1);
        bg.fillRect(gx+off,gy,15,11);
        bg.fillStyle(0xa08860,0.5);
        bg.fillRect(gx+off,gy,15,1);
        bg.fillRect(gx+off,gy,1,11);
      }
    }

    // === Life bars at top (DBZ style) ===
    const barUI = this.add.graphics();
    // Player bar (left)
    barUI.fillStyle(0x000000,0.7);
    barUI.fillRect(4,4,170,28);
    barUI.lineStyle(1,0xc0c0c0,1);
    barUI.strokeRect(4,4,170,28);
    // Player name
    this.add.text(10, 6, 'HERO', {fontFamily:'Courier New',fontSize:'8px',color:'#f0f0f0',stroke:'#000',strokeThickness:1});
    // HP bar background
    barUI.fillStyle(0x301010,1);
    barUI.fillRect(10,16,120,6);
    barUI.fillStyle(0x201030,1);
    barUI.fillRect(10,24,120,4);
    // HP label
    this.add.text(134,14,'HP',{fontFamily:'Courier New',fontSize:'7px',color:'#e04040'});
    this.add.text(134,22,'MP',{fontFamily:'Courier New',fontSize:'7px',color:'#4060e0'});

    // HP bar fill
    this.hpBar = this.add.graphics();
    // MP bar fill
    this.mpBar = this.add.graphics();

    // Enemy bar (right)
    barUI.fillStyle(0x000000,0.7);
    barUI.fillRect(GAME_W-174,4,170,28);
    barUI.lineStyle(1,0xc0c0c0,1);
    barUI.strokeRect(GAME_W-174,4,170,28);
    this.add.text(GAME_W-168, 6, 'GOBLIN', {fontFamily:'Courier New',fontSize:'8px',color:'#f0f0f0',stroke:'#000',strokeThickness:1});
    barUI.fillStyle(0x301010,1);
    barUI.fillRect(GAME_W-164,16,120,6);
    this.add.text(GAME_W-40,14,'HP',{fontFamily:'Courier New',fontSize:'7px',color:'#e04040'});
    this.enemyBar = this.add.graphics();

    this.updateBars();

    // Enemy sprite (large, centered-left)
    this.enemySprite = this.add.image(100, 155, 'enemy_goblin').setScale(2.5);
    this.enemySprite.setDepth(5);

    // Player combat sprite (right side, facing left)
    this.playerSprite = this.add.image(GAME_W-100, 165, 'player_combat').setScale(2.2).setFlipX(true);
    this.playerSprite.setDepth(5);

    // === Action menu (SNES style bordered box) ===
    const menuG = this.add.graphics();
    menuG.fillStyle(C.textBg, 0.92);
    menuG.fillRect(6, 190, 90, 58);
    menuG.lineStyle(2, C.uiBorderLt, 1);
    menuG.strokeRect(6, 190, 90, 58);
    menuG.lineStyle(1, C.uiBorder, 0.4);
    menuG.strokeRect(9, 193, 84, 52);

    this.menuTexts=[];
    this.actions.forEach((a,i)=>{
      this.menuTexts.push(this.add.text(26, 198+i*16, a, {
        fontFamily:'Courier New',fontSize:'10px',color:'#e8e8f0'
      }));
    });
    this.cursor = this.add.text(14, 198, '▶', {fontFamily:'Courier New',fontSize:'10px',color:'#f0c840'});

    // === Battle log box ===
    const logG = this.add.graphics();
    logG.fillStyle(C.textBg, 0.92);
    logG.fillRect(100, 190, GAME_W-106, 58);
    logG.lineStyle(2, C.uiBorderLt, 1);
    logG.strokeRect(100, 190, GAME_W-106, 58);
    logG.lineStyle(1, C.uiBorder, 0.4);
    logG.strokeRect(103, 193, GAME_W-112, 52);

    this.logText = this.add.text(110, 200, 'A fearsome Goblin blocks the path!', {
      fontFamily:'Courier New',fontSize:'9px',color:'#e8e8f0',
      wordWrap:{width:GAME_W-130}
    });

    // Input
    this.cursors=this.input.keyboard.createCursorKeys();
    this.spaceKey=this.input.keyboard.addKey('SPACE');
    this.enterKey=this.input.keyboard.addKey('ENTER');
    this.actionCooldown=400;
  }

  updateBars() {
    // Player HP
    this.hpBar.clear();
    const hpPct = STATE.playerHP/STATE.playerMaxHP;
    const hpCol = hpPct>0.5 ? C.hpGreen : hpPct>0.25 ? 0xe0a030 : C.hpRed;
    this.hpBar.fillStyle(hpCol,1);
    this.hpBar.fillRect(10,16, Math.floor(120*hpPct), 6);
    // Shine effect on bar
    this.hpBar.fillStyle(0xffffff,0.3);
    this.hpBar.fillRect(10,16, Math.floor(120*hpPct), 2);

    // Player MP
    this.mpBar.clear();
    this.mpBar.fillStyle(C.mpBlue,1);
    this.mpBar.fillRect(10,24, Math.floor(120*(STATE.playerMP/STATE.playerMaxMP)), 4);

    // Enemy HP
    this.enemyBar.clear();
    const ePct = this.enemyHP/this.enemyMaxHP;
    this.enemyBar.fillStyle(ePct>0.5?C.hpGreen:ePct>0.25?0xe0a030:C.hpRed, 1);
    this.enemyBar.fillRect(GAME_W-164,16, Math.floor(120*ePct), 6);
    this.enemyBar.fillStyle(0xffffff,0.3);
    this.enemyBar.fillRect(GAME_W-164,16, Math.floor(120*ePct), 2);
  }

  update(time,delta) {
    this.actionCooldown-=delta;
    if(this.actionCooldown>0) return;
    if(this.turnState==='player'){
      const td=window.touchDir||{};
      if(td.up||Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        this.selectedAction=Math.max(0,this.selectedAction-1);
        this.cursor.setY(198+this.selectedAction*16); this.actionCooldown=150;
      }
      if(td.down||Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        this.selectedAction=Math.min(2,this.selectedAction+1);
        this.cursor.setY(198+this.selectedAction*16); this.actionCooldown=150;
      }
      const act=window.touchActionJust||Phaser.Input.Keyboard.JustDown(this.spaceKey)||Phaser.Input.Keyboard.JustDown(this.enterKey);
      if(act){window.touchActionJust=false; this.actionCooldown=600; this.doPlayerAction();}
    }
  }

  doPlayerAction() {
    this.defending=false;
    const a=this.actions[this.selectedAction];
    if(a==='Attack'){
      const dmg=6+Math.floor(Math.random()*5)+(STATE.items.sword?4:0);
      this.enemyHP=Math.max(0,this.enemyHP-dmg);
      this.logText.setText('Hero slashes for '+dmg+' damage!');
      // Attack animation - player lunges
      this.tweens.add({targets:this.playerSprite, x:this.playerSprite.x-30, duration:100, yoyo:true});
      this.tweens.add({targets:this.enemySprite, alpha:0.2, duration:60, yoyo:true, repeat:3, delay:100});
      // Hit flash
      this.cameras.main.flash(100, 255,255,255, false, null, null);
    } else if(a==='Defend'){
      this.defending=true;
      this.logText.setText('Hero braces for impact!');
      this.tweens.add({targets:this.playerSprite, scaleX:2.0, scaleY:2.4, duration:200, yoyo:true});
    } else {
      if(STATE.playerHP<STATE.playerMaxHP){
        const h=12; STATE.playerHP=Math.min(STATE.playerMaxHP,STATE.playerHP+h);
        this.logText.setText('Hero drinks a potion! +'+h+' HP!');
        // Healing sparkle
        this.tweens.add({targets:this.playerSprite, tint:0x80ff80, duration:300, yoyo:true,
          onComplete:()=>this.playerSprite.clearTint()});
      } else this.logText.setText('No items needed right now.');
    }
    this.updateBars();
    if(this.enemyHP<=0){this.time.delayedCall(800,()=>this.victory());return;}
    this.turnState='animating';
    this.time.delayedCall(1200,()=>this.enemyTurn());
  }

  enemyTurn() {
    let dmg=4+Math.floor(Math.random()*6);
    if(STATE.items.shield) dmg=Math.max(1,dmg-3);
    if(this.defending) dmg=Math.max(1,Math.floor(dmg/2));
    STATE.playerHP=Math.max(0,STATE.playerHP-dmg);
    this.logText.setText('Goblin strikes for '+dmg+' damage!');
    // Enemy attack animation
    this.tweens.add({targets:this.enemySprite, x:this.enemySprite.x+35, duration:120, yoyo:true});
    this.tweens.add({targets:this.playerSprite, alpha:0.3, duration:60, yoyo:true, repeat:3, delay:120});
    this.cameras.main.shake(200, 0.015);
    this.updateBars();
    if(STATE.playerHP<=0){this.time.delayedCall(800,()=>this.defeat());return;}
    this.turnState='player'; this.actionCooldown=400;
  }

  victory() {
    STATE.combatActive=false;
    this.logText.setText('Victory! The Goblin is vanquished!');
    // Death animation
    this.tweens.add({targets:this.enemySprite, alpha:0, scaleX:0.5, scaleY:0.5, y:this.enemySprite.y+20,
      duration:800, ease:'Power2'});
    this.time.delayedCall(2000,()=>{this.scene.stop();this.scene.resume('OverworldScene');});
  }

  defeat() {
    STATE.combatActive=false; STATE.playerHP=STATE.playerMaxHP;
    this.logText.setText('Defeated... but fate grants another chance.');
    this.tweens.add({targets:this.playerSprite, alpha:0, duration:600});
    this.time.delayedCall(2500,()=>{this.scene.stop();this.scene.resume('OverworldScene');});
  }
}

// ===== PHASER CONFIG =====
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
    arcade: { gravity:{y:0}, debug:false }
  },
  scene: [BootScene, OverworldScene, HouseScene, UIScene, CombatScene],
  backgroundColor: '#080810',
};

const game = new Phaser.Game(config);
