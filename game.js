/**
 * Aetherfall Main Controller & Swipe System
 */
class AetherGame {
  constructor() {
    this.boardCanvas = document.getElementById('board-canvas');
    this.engine = new BoardEngine(8, 8);
    this.renderer = new AetherRenderer(this.boardCanvas);

    this.currentLevelIndex = 0;
    this.score = 0;
    this.movesRemaining = 0;
    this.objective = null;
    this.isResolving = false;
    this.isPaused = false;

    // Pointer gesture tracking
    this.pointerDown = false;
    this.dragStartCell = null;
    this.dragStartPos = { x: 0, y: 0 };
    this.dragCurrentPos = { x: 0, y: 0 };
    this.activePointerId = null;
    this.swipeHandled = false;

    // Animations queue
    this.animatingSwaps = [];
    this.animatingDrops = [];
    this.animatingDisappears = [];

    // Storage for progress
    this.savedProgress = JSON.parse(localStorage.getItem('aether_progress') || '{}');
    if (!this.savedProgress.unlockedLevel) {
      this.savedProgress.unlockedLevel = 1;
      this.savedProgress.stars = {};
      this.savedProgress.highScores = {};
      this.saveProgress();
    }

    this.bindEvents();
    this.initBackgroundStars();
    this.showScreen('screen-title');
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  saveProgress() {
    localStorage.setItem('aether_progress', JSON.stringify(this.savedProgress));
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();

    // UI Buttons
    document.getElementById('btn-play-title').addEventListener('click', () => {
      window.aetherAudio.init();
      this.openLevelSelect();
    });

    document.getElementById('btn-back-levels').addEventListener('click', () => {
      this.showScreen('screen-title');
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
      this.openPauseModal();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.closeModals();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      this.closeModals();
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
      this.closeModals();
      this.openLevelSelect();
    });

    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.closeModals();
      if (this.currentLevelIndex + 1 < window.AETHER_LEVELS.length) {
        this.startLevel(this.currentLevelIndex + 1);
      } else {
        this.openLevelSelect();
      }
    });

    document.getElementById('btn-retry-fail').addEventListener('click', () => {
      this.closeModals();
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('btn-levels-fail').addEventListener('click', () => {
      this.closeModals();
      this.openLevelSelect();
    });

    // Audio Sliders
    const sliderMaster = document.getElementById('slider-master');
    const sliderSfx = document.getElementById('slider-sfx');
    const sliderMusic = document.getElementById('slider-music');

    sliderMaster.value = window.aetherAudio.masterVolume;
    sliderSfx.value = window.aetherAudio.sfxVolume;
    sliderMusic.value = window.aetherAudio.musicVolume;

    sliderMaster.addEventListener('input', (e) => window.aetherAudio.setMaster(parseFloat(e.target.value)));
    sliderSfx.addEventListener('input', (e) => window.aetherAudio.setSfx(parseFloat(e.target.value)));
    sliderMusic.addEventListener('input', (e) => window.aetherAudio.setMusic(parseFloat(e.target.value)));

    // NATURAL SWIPE GESTURES VIA POINTER EVENTS
    const canvas = this.boardCanvas;
    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
  }

  handleResize() {
    const container = document.querySelector('.board-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height, window.innerHeight * 0.58));
    this.renderer.resize(size > 100 ? size : 320);
  }

  // Coordinate Conversion
  getGridCellFromPointer(clientX, clientY) {
    const rect = this.boardCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || x >= rect.width || y < 0 || y >= rect.height) return null;

    const col = Math.floor((x / rect.width) * 8);
    const row = Math.floor((y / rect.height) * 8);
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      return { r: row, c: col };
    }
    return null;
  }

  // Pointer Down: Start Swipe Tracking
  onPointerDown(e) {
    if (this.isResolving || this.isPaused) return;
    window.aetherAudio.init();

    const cell = this.getGridCellFromPointer(e.clientX, e.clientY);
    if (!cell) return;

    this.pointerDown = true;
    this.activePointerId = e.pointerId;
    this.boardCanvas.setPointerCapture?.(e.pointerId);

    this.dragStartCell = cell;
    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.dragCurrentPos = { x: e.clientX, y: e.clientY };
    this.swipeHandled = false;

    window.aetherAudio.playSelect();
    if (navigator.vibrate) navigator.vibrate(12);
  }

  // Pointer Move: Detect Swipe Vector with distance threshold
  onPointerMove(e) {
    if (!this.pointerDown || this.swipeHandled || e.pointerId !== this.activePointerId) return;

    this.dragCurrentPos = { x: e.clientX, y: e.clientY };
    const dx = this.dragCurrentPos.x - this.dragStartPos.x;
    const dy = this.dragCurrentPos.y - this.dragStartPos.y;
    const dist = Math.hypot(dx, dy);

    // Intentional swipe threshold: 22px
    if (dist >= 22) {
      let targetR = this.dragStartCell.r;
      let targetC = this.dragStartCell.c;

      if (Math.abs(dx) > Math.abs(dy)) {
        targetC += dx > 0 ? 1 : -1;
      } else {
        targetR += dy > 0 ? 1 : -1;
      }

      if (targetR >= 0 && targetR < 8 && targetC >= 0 && targetC < 8) {
        this.swipeHandled = true;
        this.executePlayerSwap(this.dragStartCell.r, this.dragStartCell.c, targetR, targetC);
      }
    }
  }

  // Pointer Up: Release Gesture
  onPointerUp(e) {
    if (e.pointerId !== this.activePointerId) return;
    this.pointerDown = false;
    this.dragStartCell = null;
    this.activePointerId = null;
    try {
      this.boardCanvas.releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  }

  // Execute Swap & Validation
  async executePlayerSwap(r1, c1, r2, c2) {
    if (this.isResolving) return;
    this.isResolving = true;

    const cellA = this.engine.getCell(r1, c1);
    const cellB = this.engine.getCell(r2, c2);
    if (!cellA || !cellB) {
      this.isResolving = false;
      return;
    }

    window.aetherAudio.playSwap();
    if (navigator.vibrate) navigator.vibrate(18);

    // Check legality
    const isValid = this.engine.checkSwapValid(r1, c1, r2, c2);

    // Forward swap animation
    await this.animateSwap(r1, c1, r2, c2, 140);
    this.engine.swap(r1, c1, r2, c2);

    if (!isValid) {
      // Revert invalid move smoothly
      window.aetherAudio.playInvalid();
      if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
      await this.animateSwap(r1, c1, r2, c2, 140);
      this.engine.swap(r1, c1, r2, c2);
      this.isResolving = false;
      return;
    }

    // Valid swap: deduct move and begin cascade resolution
    this.movesRemaining--;
    this.updateHUD();

    // Check special combo activation (e.g. Supernova swap)
    await this.resolveBoardCascades();

    // Check win/loss state
    this.checkGameEnd();
    this.isResolving = false;
  }

  // Board Cascade Loop (Matches -> Shatter -> Gravity -> Refill -> Repeat)
  async resolveBoardCascades() {
    let combo = 1;
    while (true) {
      const matchData = this.engine.findMatches();
      if (matchData.matches.length === 0) break;

      window.aetherAudio.playMatch(combo, matchData.matches.length);
      this.renderer.triggerShake(Math.min(8, 2 + combo * 1.5));

      // Calculate score & handle special creations
      const points = matchData.matches.length * 50 * combo;
      this.score += points;

      // Track objectives
      matchData.matches.forEach(m => {
        this.recordObjectiveMatch(m.type);
      });

      // Special Crystal Synthesis for 4-in-a-row and 5-in-a-row
      const createdSpecials = new Map();
      matchData.groups.forEach(g => {
        if (g.length === 4) {
          const chosen = g.cells[1];
          const spec = g.orientation === 'h' ? SPECIAL_LINE_H : SPECIAL_LINE_V;
          createdSpecials.set(`${chosen.r},${chosen.c}`, { type: chosen.type, special: spec });
          window.aetherAudio.playSpecial();
        } else if (g.length >= 5) {
          const chosen = g.cells[2];
          createdSpecials.set(`${chosen.r},${chosen.c}`, { type: chosen.type, special: SPECIAL_SUPERNOVA });
          window.aetherAudio.playSpecial();
        }
      });

      // Check special activation triggers within the matched cells
      const cellsToClear = new Set();
      matchData.matches.forEach(m => cellsToClear.add(`${m.r},${m.c}`));

      matchData.matches.forEach(m => {
        if (m.special === SPECIAL_LINE_H) {
          for (let c = 0; c < 8; c++) cellsToClear.add(`${m.r},${c}`);
          this.renderer.spawnLaserBeam(0, (m.r + 0.5) * this.renderer.cellSize, this.renderer.displaySize, (m.r + 0.5) * this.renderer.cellSize);
        } else if (m.special === SPECIAL_LINE_V) {
          for (let r = 0; r < 8; r++) cellsToClear.add(`${r},${m.c}`);
          this.renderer.spawnLaserBeam((m.c + 0.5) * this.renderer.cellSize, 0, (m.c + 0.5) * this.renderer.cellSize, this.renderer.displaySize);
        } else if (m.special === SPECIAL_SUPERNOVA) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (this.engine.grid[r][c]?.type === m.type) {
                cellsToClear.add(`${r},${c}`);
              }
            }
          }
        }
      });

      // Shatter Particles & Clear from engine
      cellsToClear.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const cell = this.engine.getCell(r, c);
        if (cell) {
          const px = (c + 0.5) * this.renderer.cellSize;
          const py = (r + 0.5) * this.renderer.cellSize;
          this.renderer.spawnShatterParticles(px, py, cell.type, 14);
        }
        this.engine.grid[r][c] = null;
      });

      // Place newly synthesized special crystals
      createdSpecials.forEach((val, key) => {
        const [r, c] = key.split(',').map(Number);
        this.engine.grid[r][c] = val;
      });

      this.updateHUD();
      await this.sleep(170);

      // Gravity & Refill
      const { drops, refills } = this.engine.applyGravity();
      await this.animateDropsAndRefills(drops, refills, 190);

      window.aetherAudio.playLand();
      combo++;
    }

    // Check if board has no moves remaining: reshuffle if stuck
    if (!this.engine.hasValidMoves()) {
      this.engine.reshuffle();
    }
  }

  recordObjectiveMatch(type) {
    if (!this.objective) return;
    if (this.objective.type === 'collect' && this.objective.crystal === type) {
      this.objective.current = Math.min(this.objective.target, this.objective.current + 1);
    } else if (this.objective.type === 'collect_dual') {
      if (this.objective.c1 === type) this.objective.cur1 = Math.min(this.objective.t1, this.objective.cur1 + 1);
      if (this.objective.c2 === type) this.objective.cur2 = Math.min(this.objective.t2, this.objective.cur2 + 1);
    }
  }

  isObjectiveMet() {
    if (!this.objective) return false;
    if (this.objective.type === 'score') {
      return this.score >= this.objective.target;
    } else if (this.objective.type === 'collect') {
      return this.objective.current >= this.objective.target;
    } else if (this.objective.type === 'collect_dual') {
      return this.objective.cur1 >= this.objective.t1 && this.objective.cur2 >= this.objective.t2;
    }
    return false;
  }

  checkGameEnd() {
    const won = this.isObjectiveMet();
    if (won) {
      this.handleLevelVictory();
    } else if (this.movesRemaining <= 0) {
      this.handleLevelFailure();
    }
  }

  handleLevelVictory() {
    this.isPaused = true;
    window.aetherAudio.playWin();

    const lvlConfig = window.AETHER_LEVELS[this.currentLevelIndex];
    let starsEarned = 1;
    if (this.score >= lvlConfig.stars[2]) starsEarned = 3;
    else if (this.score >= lvlConfig.stars[1]) starsEarned = 2;

    // Update saved progress
    const prevStars = this.savedProgress.stars[lvlConfig.level] || 0;
    this.savedProgress.stars[lvlConfig.level] = Math.max(prevStars, starsEarned);
    const prevHigh = this.savedProgress.highScores[lvlConfig.level] || 0;
    this.savedProgress.highScores[lvlConfig.level] = Math.max(prevHigh, this.score);

    if (this.currentLevelIndex + 2 > this.savedProgress.unlockedLevel) {
      this.savedProgress.unlockedLevel = this.currentLevelIndex + 2;
    }
    this.saveProgress();

    // Show modal
    document.getElementById('modal-victory-title').innerText = `Level ${lvlConfig.level} Harmonized`;
    document.getElementById('modal-victory-stars').innerHTML = '★'.repeat(starsEarned) + '☆'.repeat(3 - starsEarned);
    document.getElementById('modal-victory-score').innerText = this.score.toLocaleString();
    this.openModal('modal-victory');
  }

  handleLevelFailure() {
    this.isPaused = true;
    window.aetherAudio.playLose();
    const lvlConfig = window.AETHER_LEVELS[this.currentLevelIndex];
    document.getElementById('modal-fail-title').innerText = `Level ${lvlConfig.level} Unresolved`;
    document.getElementById('modal-fail-score').innerText = this.score.toLocaleString();
    this.openModal('modal-failure');
  }

  // Animation Helpers
  animateSwap(r1, c1, r2, c2, duration = 140) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const cellA = { ...this.engine.grid[r1][c1] };
      const cellB = { ...this.engine.grid[r2][c2] };

      const anim = {
        r1, c1, r2, c2, cellA, cellB,
        duration,
        startTime,
        resolve
      };
      this.animatingSwaps.push(anim);
    });
  }

  animateDropsAndRefills(drops, refills, duration = 190) {
    if (drops.length === 0 && refills.length === 0) return Promise.resolve();

    return new Promise(resolve => {
      const startTime = performance.now();
      this.animatingDrops.push({
        drops,
        refills,
        duration,
        startTime,
        resolve
      });
    });
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Level Progression & Lifecycle
  startLevel(index) {
    this.currentLevelIndex = index;
    const config = window.AETHER_LEVELS[index];

    this.score = 0;
    this.movesRemaining = config.moves;
    this.objective = JSON.parse(JSON.stringify(config.objective));
    this.isResolving = false;
    this.isPaused = false;

    this.engine.init(config.crystalPool);
    this.updateHUD();
    this.showScreen('screen-game');
  }

  openLevelSelect() {
    const gridEl = document.getElementById('level-grid');
    gridEl.innerHTML = '';

    window.AETHER_LEVELS.forEach((lvl, idx) => {
      const node = document.createElement('div');
      const isUnlocked = lvl.level <= this.savedProgress.unlockedLevel;
      const stars = this.savedProgress.stars[lvl.level] || 0;

      node.className = `level-node ${isUnlocked ? 'unlocked' : 'locked'}`;
      node.innerHTML = `
        <div>${lvl.level}</div>
        <div class="stars-row">${isUnlocked && stars > 0 ? '★'.repeat(stars) : '•'}</div>
      `;

      if (isUnlocked) {
        node.addEventListener('click', () => {
          window.aetherAudio.init();
          window.aetherAudio.playSelect();
          this.startLevel(idx);
        });
      }

      gridEl.appendChild(node);
    });

    this.showScreen('screen-levels');
  }

  updateHUD() {
    document.getElementById('hud-score').innerText = this.score.toLocaleString();
    document.getElementById('hud-moves').innerText = this.movesRemaining;

    // Objective text
    let objText = '';
    if (this.objective.type === 'score') {
      objText = `${this.score} / ${this.objective.target}`;
    } else if (this.objective.type === 'collect') {
      objText = `${this.objective.current} / ${this.objective.target}`;
    } else if (this.objective.type === 'collect_dual') {
      objText = `${this.objective.cur1}/${this.objective.t1} • ${this.objective.cur2}/${this.objective.t2}`;
    }
    document.getElementById('hud-objective-text').innerText = objText;

    // Star progress bar
    const lvlConfig = window.AETHER_LEVELS[this.currentLevelIndex];
    const maxScore = lvlConfig.stars[2];
    const pct = Math.min(100, (this.score / maxScore) * 100);
    document.getElementById('hud-star-fill').style.width = `${pct}%`;
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    this.closeModals();
  }

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  openPauseModal() {
    this.isPaused = true;
    window.aetherAudio.playSelect();
    this.openModal('modal-pause');
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    this.isPaused = false;
  }

  // Background Cosmic Starfield
  initBackgroundStars() {
    const bg = document.getElementById('bg-canvas');
    if (!bg) return;
    const bctx = bg.getContext('2d');

    const resizeBg = () => {
      bg.width = window.innerWidth;
      bg.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeBg);
    resizeBg();

    const stars = Array.from({ length: 65 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.7,
      pulseSpeed: 0.01 + Math.random() * 0.03
    }));

    const renderBg = () => {
      bctx.clearRect(0, 0, bg.width, bg.height);
      stars.forEach(s => {
        s.alpha += Math.sin(Date.now() * s.pulseSpeed) * 0.005;
        bctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(0.85, s.alpha))})`;
        bctx.beginPath();
        bctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bctx.fill();
      });
      requestAnimationFrame(renderBg);
    };
    renderBg();
  }

  // 60 FPS Render Loop
  loop(timestamp) {
    requestAnimationFrame(this.loop);

    const ctx = this.renderer.ctx;
    const size = this.renderer.displaySize;
    const cSize = this.renderer.cellSize;

    ctx.clearRect(0, 0, size, size);

    // Apply board shake
    ctx.save();
    if (this.renderer.boardShake > 0) {
      const ox = (Math.random() - 0.5) * this.renderer.boardShake;
      const oy = (Math.random() - 0.5) * this.renderer.boardShake;
      ctx.translate(ox, oy);
    }

    // Board cell backing slots
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cx = c * cSize;
        const cy = r * cSize;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx + 2, cy + 2, cSize - 4, cSize - 4, 10) : ctx.rect(cx + 2, cy + 2, cSize - 4, cSize - 4);
        ctx.fill();
      }
    }

    // Identify cells undergoing swap animations to avoid duplicate static rendering
    const animatedSwapKeys = new Set();
    const now = performance.now();

    for (let i = this.animatingSwaps.length - 1; i >= 0; i--) {
      const anim = this.animatingSwaps[i];
      const elapsed = now - anim.startTime;
      const progress = Math.min(1, elapsed / anim.duration);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      animatedSwapKeys.add(`${anim.r1},${anim.c1}`);
      animatedSwapKeys.add(`${anim.r2},${anim.c2}`);

      // Interpolate positions
      const xA = (anim.c1 + (anim.c2 - anim.c1) * ease) * cSize;
      const yA = (anim.r1 + (anim.r2 - anim.r1) * ease) * cSize;
      const xB = (anim.c2 + (anim.c1 - anim.c2) * ease) * cSize;
      const yB = (anim.r2 + (anim.r1 - anim.r2) * ease) * cSize;

      this.renderer.drawCrystal(xA, yA, cSize, anim.cellA.type, anim.cellA.special);
      this.renderer.drawCrystal(xB, yB, cSize, anim.cellB.type, anim.cellB.special);

      if (progress >= 1) {
        anim.resolve();
        this.animatingSwaps.splice(i, 1);
      }
    }

    // Handle Drop Animations
    const animatedDropKeys = new Set();
    for (let i = this.animatingDrops.length - 1; i >= 0; i--) {
      const dropAnim = this.animatingDrops[i];
      const elapsed = now - dropAnim.startTime;
      const progress = Math.min(1, elapsed / dropAnim.duration);
      const ease = progress * progress; // Quadratic fall acceleration

      dropAnim.drops.forEach(d => {
        animatedDropKeys.add(`${d.toR},${d.toC}`);
        const currentY = (d.fromR + (d.toR - d.fromR) * ease) * cSize;
        const currentX = d.toC * cSize;
        this.renderer.drawCrystal(currentX, currentY, cSize, d.cell.type, d.cell.special);
      });

      dropAnim.refills.forEach(rf => {
        animatedDropKeys.add(`${rf.toR},${rf.toC}`);
        const currentY = (rf.startR + (rf.toR - rf.startR) * ease) * cSize;
        const currentX = rf.toC * cSize;
        this.renderer.drawCrystal(currentX, currentY, cSize, rf.cell.type, rf.cell.special);
      });

      if (progress >= 1) {
        dropAnim.resolve();
        this.animatingDrops.splice(i, 1);
      }
    }

    // Render regular static crystals
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const key = `${r},${c}`;
        if (animatedSwapKeys.has(key) || animatedDropKeys.has(key)) continue;

        const cell = this.engine.getCell(r, c);
        if (!cell) continue;

        let drawX = c * cSize;
        let drawY = r * cSize;
        let scale = 1;

        // Subtle preview offset while dragging
        if (this.pointerDown && this.dragStartCell && this.dragStartCell.r === r && this.dragStartCell.c === c && !this.swipeHandled) {
          const dx = (this.dragCurrentPos.x - this.dragStartPos.x) * 0.22;
          const dy = (this.dragCurrentPos.y - this.dragStartPos.y) * 0.22;
          drawX += dx;
          drawY += dy;
          scale = 1.12;
        }

        this.renderer.drawCrystal(drawX, drawY, cSize, cell.type, cell.special, 1, scale);
      }
    }

    // Render Beams and Shatter Particles
    this.renderer.updateAndRenderVFX(0.016);

    ctx.restore();
  }
}

// Instantiate on DOM readiness
window.addEventListener('DOMContentLoaded', () => {
  window.aetherfall = new AetherGame();

  // Register service worker if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});