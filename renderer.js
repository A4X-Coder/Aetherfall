/**
 * Procedural Crystal Art & Particle VFX Renderer
 * 60 FPS mobile-optimized canvas rendering without external textures
 */

const PALETTES = [
  { main: '#38bdf8', light: '#bae6fd', dark: '#0369a1', glow: 'rgba(56, 189, 248, 0.45)', name: 'Sapphire' },
  { main: '#fbbf24', light: '#fef08a', dark: '#b45309', glow: 'rgba(251, 191, 36, 0.45)', name: 'Citrine' },
  { main: '#c084fc', light: '#f3e8ff', dark: '#7e22ce', glow: 'rgba(192, 132, 252, 0.45)', name: 'Amethyst' },
  { main: '#34d399', light: '#a7f3d0', dark: '#047857', glow: 'rgba(52, 211, 153, 0.45)', name: 'Emerald' },
  { main: '#f43f5e', light: '#fecdd3', dark: '#9f1239', glow: 'rgba(244, 63, 94, 0.45)', name: 'Ruby' },
  { main: '#f8fafc', light: '#ffffff', dark: '#94a3b8', glow: 'rgba(248, 250, 252, 0.55)', name: 'Pearl' }
];

class AetherRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.beams = [];
    this.boardShake = 0;
  }

  resize(pixelSize) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.canvas.width = pixelSize * dpr;
    this.canvas.height = pixelSize * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.displaySize = pixelSize;
    this.cellSize = pixelSize / 8;
  }

  triggerShake(magnitude = 6) {
    this.boardShake = magnitude;
  }

  // Procedural facet rendering for distinct crystal silhouettes
  drawCrystal(x, y, size, type, special = SPECIAL_NONE, alpha = 1, scale = 1) {
    if (type < 0 || type >= PALETTES.length) return;
    const pal = PALETTES[type];
    const ctx = this.ctx;
    const r = (size * 0.42) * scale;

    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Glow aura
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = pal.glow;
    ctx.fill();

    // Specific geometric shapes based on crystal type
    switch (type) {
      case 0: // Sapphire: Octahedral Rhombus
        this._drawRhombus(ctx, r, pal);
        break;
      case 1: // Citrine: Hexagonal Solar Star
        this._drawHexagon(ctx, r, pal);
        break;
      case 2: // Amethyst: Teardrop Kite
        this._drawKite(ctx, r, pal);
        break;
      case 3: // Emerald: Beveled Octagon / Prism
        this._drawOctagon(ctx, r, pal);
        break;
      case 4: // Ruby: Radiant Heart/Diamond
        this._drawShield(ctx, r, pal);
        break;
      case 5: // Pearl: Spherical Luminous Dodecahedron
        this._drawOrb(ctx, r, pal);
        break;
    }

    // Special Crystal Auras
    if (special === SPECIAL_LINE_H || special === SPECIAL_LINE_V) {
      this._drawLaserIndicator(ctx, r, special === SPECIAL_LINE_H);
    } else if (special === SPECIAL_SUPERNOVA) {
      this._drawSupernovaCrown(ctx, r);
    }

    ctx.restore();
  }

  _drawRhombus(ctx, r, pal) {
    // Upper Light Facet
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.85, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = pal.light;
    ctx.fill();

    // Left Facet
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(-r * 0.85, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Bottom Dark Facets
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(0, 0);
    ctx.fillStyle = pal.dark;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.85, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(0, 0);
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Glint
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.35, r * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }

  _drawHexagon(ctx, r, pal) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = Math.cos(angle) * r;
      const hy = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Inner Concentric Star
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = Math.cos(angle) * (r * 0.55);
      const hy = Math.sin(angle) * (r * 0.55);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fillStyle = pal.light;
    ctx.fill();
  }

  _drawKite(ctx, r, pal) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.05);
    ctx.lineTo(r * 0.75, -r * 0.1);
    ctx.lineTo(0, r * 0.95);
    ctx.lineTo(-r * 0.75, -r * 0.1);
    ctx.closePath();
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Facet Split
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.05);
    ctx.lineTo(0, r * 0.95);
    ctx.lineTo(-r * 0.75, -r * 0.1);
    ctx.closePath();
    ctx.fillStyle = pal.light;
    ctx.fill();
  }

  _drawOctagon(ctx, r, pal) {
    const cut = 0.45;
    ctx.beginPath();
    ctx.moveTo(-r * cut, -r);
    ctx.lineTo(r * cut, -r);
    ctx.lineTo(r, -r * cut);
    ctx.lineTo(r, r * cut);
    ctx.lineTo(r * cut, r);
    ctx.lineTo(-r * cut, r);
    ctx.lineTo(-r, r * cut);
    ctx.lineTo(-r, -r * cut);
    ctx.closePath();
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Bevel rim
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = pal.light;
    ctx.stroke();
  }

  _drawShield(ctx, r, pal) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(r * 0.85, -r * 0.5);
    ctx.lineTo(r * 0.7, r * 0.3);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.7, r * 0.3);
    ctx.lineTo(-r * 0.85, -r * 0.5);
    ctx.closePath();
    ctx.fillStyle = pal.main;
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(r * 0.85, -r * 0.5);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = pal.light;
    ctx.fill();
  }

  _drawOrb(ctx, r, pal) {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, pal.light);
    grad.addColorStop(0.8, pal.main);
    grad.addColorStop(1, pal.dark);

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  _drawLaserIndicator(ctx, r, isHorizontal) {
    ctx.save();
    ctx.rotate(isHorizontal ? 0 : Math.PI / 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r * 1.3, 0);
    ctx.lineTo(r * 1.3, 0);
    ctx.stroke();

    // End Arrows
    ctx.fillStyle = '#ffffff';
    [-r * 1.3, r * 1.3].forEach((pos) => {
      ctx.beginPath();
      ctx.arc(pos, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  _drawSupernovaCrown(ctx, r) {
    const now = Date.now() * 0.004;
    ctx.save();
    ctx.rotate(now);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
    ctx.stroke();

    // Pulsing core sparks
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + now;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * r * 1.25, Math.sin(ang) * r * 1.25, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Particle explosion when crystals shatter
  spawnShatterParticles(cx, cy, type, count = 14) {
    const pal = PALETTES[type] || PALETTES[0];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 4.5;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 2.5 + Math.random() * 3.5,
        color: Math.random() > 0.4 ? pal.main : pal.light,
        alpha: 1,
        decay: 0.024 + Math.random() * 0.02
      });
    }
  }

  // Laser beam visual across grid
  spawnLaserBeam(fromX, fromY, toX, toY, color = '#38bdf8') {
    this.beams.push({
      x1: fromX,
      y1: fromY,
      x2: toX,
      y2: toY,
      color,
      alpha: 1,
      width: 12
    });
  }

  updateAndRenderVFX(dt) {
    const ctx = this.ctx;

    // Shake dampening
    if (this.boardShake > 0) {
      this.boardShake *= 0.88;
      if (this.boardShake < 0.2) this.boardShake = 0;
    }

    // Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.alpha -= dt * 3.2;
      b.width *= 0.86;
      if (b.alpha <= 0) {
        this.beams.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.width;
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // subtle gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

window.AetherRenderer = AetherRenderer;
window.PALETTES = PALETTES;