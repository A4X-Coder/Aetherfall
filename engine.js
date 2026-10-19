/**
 * Aetherfall Match-3 Grid Engine
 * Separation of logic from presentation
 */
const SPECIAL_NONE = 0;
const SPECIAL_LINE_H = 1;     // Clears entire horizontal row
const SPECIAL_LINE_V = 2;     // Clears entire vertical column
const SPECIAL_SUPERNOVA = 3;  // Clears all crystals of matching color

class BoardEngine {
  constructor(rows = 8, cols = 8) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.crystalPool = [0, 1, 2, 3, 4, 5];
  }

  init(crystalPool = [0, 1, 2, 3, 4, 5]) {
    this.crystalPool = crystalPool;
    do {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        this.grid[r] = [];
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = {
            type: this.getRandomTypeExcluding(r, c),
            special: SPECIAL_NONE
          };
        }
      }
    } while (!this.hasValidMoves());
  }

  getRandomType() {
    return this.crystalPool[Math.floor(Math.random() * this.crystalPool.length)];
  }

  getRandomTypeExcluding(r, c) {
    const forbidden = new Set();
    // Check horizontal match-3 potential
    if (c >= 2 && this.grid[r][c - 1] && this.grid[r][c - 2]) {
      if (this.grid[r][c - 1].type === this.grid[r][c - 2].type) {
        forbidden.add(this.grid[r][c - 1].type);
      }
    }
    // Check vertical match-3 potential
    if (r >= 2 && this.grid[r - 1][c] && this.grid[r - 2][c]) {
      if (this.grid[r - 1][c].type === this.grid[r - 2][c].type) {
        forbidden.add(this.grid[r - 1][c].type);
      }
    }

    const available = this.crystalPool.filter(t => !forbidden.has(t));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return this.getRandomType();
  }

  getCell(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return null;
    return this.grid[r][c];
  }

  areAdjacent(r1, c1, r2, c2) {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }

  swap(r1, c1, r2, c2) {
    const temp = this.grid[r1][c1];
    this.grid[r1][c1] = this.grid[r2][c2];
    this.grid[r2][c2] = temp;
  }

  findMatches() {
    const matchedCoords = new Set();
    const matchGroups = [];

    // Horizontal check
    for (let r = 0; r < this.rows; r++) {
      let matchLen = 1;
      for (let c = 0; c < this.cols; c++) {
        const current = this.grid[r][c];
        const next = c < this.cols - 1 ? this.grid[r][c + 1] : null;

        if (current && next && current.type === next.type && current.type !== -1) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const group = [];
            for (let i = 0; i < matchLen; i++) {
              const cr = r;
              const cc = c - i;
              matchedCoords.add(`${cr},${cc}`);
              group.push({ r: cr, c: cc, type: this.grid[cr][cc].type, special: this.grid[cr][cc].special });
            }
            matchGroups.push({ orientation: 'h', length: matchLen, cells: group });
          }
          matchLen = 1;
        }
      }
    }

    // Vertical check
    for (let c = 0; c < this.cols; c++) {
      let matchLen = 1;
      for (let r = 0; r < this.rows; r++) {
        const current = this.grid[r][c];
        const next = r < this.rows - 1 ? this.grid[r + 1][c] : null;

        if (current && next && current.type === next.type && current.type !== -1) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const group = [];
            for (let i = 0; i < matchLen; i++) {
              const cr = r - i;
              const cc = c;
              matchedCoords.add(`${cr},${cc}`);
              group.push({ r: cr, c: cc, type: this.grid[cr][cc].type, special: this.grid[cr][cc].special });
            }
            matchGroups.push({ orientation: 'v', length: matchLen, cells: group });
          }
          matchLen = 1;
        }
      }
    }

    const uniqueList = [];
    matchedCoords.forEach(str => {
      const [r, c] = str.split(',').map(Number);
      uniqueList.push({ r, c, type: this.grid[r][c].type, special: this.grid[r][c].special });
    });

    return { matches: uniqueList, groups: matchGroups };
  }

  // Simulates potential swap to check legality
  checkSwapValid(r1, c1, r2, c2) {
    if (!this.areAdjacent(r1, c1, r2, c2)) return false;

    // Supernova combo interaction: swapping with any crystal triggers activation
    const c1Special = this.grid[r1][c1]?.special;
    const c2Special = this.grid[r2][c2]?.special;
    if (c1Special === SPECIAL_SUPERNOVA || c2Special === SPECIAL_SUPERNOVA) {
      return true;
    }

    this.swap(r1, c1, r2, c2);
    const { matches } = this.findMatches();
    this.swap(r1, c1, r2, c2); // Swap back

    return matches.length > 0;
  }

  // Check if at least 1 legal move exists on the whole board
  hasValidMoves() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Right swap
        if (c < this.cols - 1 && this.checkSwapValid(r, c, r, c + 1)) return true;
        // Down swap
        if (r < this.rows - 1 && this.checkSwapValid(r, c, r + 1, c)) return true;
      }
    }
    return false;
  }

  // Reshuffle board preserving crystal pool without clearing player moves
  reshuffle() {
    let flat = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        flat.push(this.grid[r][c]);
      }
    }

    let attempts = 0;
    do {
      for (let i = flat.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flat[i], flat[j]] = [flat[j], flat[i]];
      }

      let idx = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = flat[idx++];
        }
      }

      const { matches } = this.findMatches();
      // Ensure no instant auto-matches on reshuffle and at least one valid move
      if (matches.length === 0 && this.hasValidMoves()) {
        return;
      }
      attempts++;
    } while (attempts < 80);

    // If tough distribution, re-init with deterministic clean configuration
    this.init(this.crystalPool);
  }

  // Collapses columns downward, calculating drop distances
  applyGravity() {
    const drops = []; // { rOld, cOld, rNew, cNew, cell }
    const refills = []; // { rNew, c, cell, dropFromRow }

    for (let c = 0; c < this.cols; c++) {
      let emptyCount = 0;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r][c] === null) {
          emptyCount++;
        } else if (emptyCount > 0) {
          const targetR = r + emptyCount;
          drops.push({
            fromR: r,
            fromC: c,
            toR: targetR,
            toC: c,
            cell: this.grid[r][c]
          });
          this.grid[targetR][c] = this.grid[r][c];
          this.grid[r][c] = null;
        }
      }

      // Refill empty tops
      for (let i = 0; i < emptyCount; i++) {
        const targetR = emptyCount - 1 - i;
        const newCell = {
          type: this.getRandomType(),
          special: SPECIAL_NONE
        };
        this.grid[targetR][c] = newCell;
        refills.push({
          toR: targetR,
          toC: c,
          cell: newCell,
          startR: -(i + 1)
        });
      }
    }

    return { drops, refills };
  }
}

window.BoardEngine = BoardEngine;
window.SPECIAL_NONE = SPECIAL_NONE;
window.SPECIAL_LINE_H = SPECIAL_LINE_H;
window.SPECIAL_LINE_V = SPECIAL_LINE_V;
window.SPECIAL_SUPERNOVA = SPECIAL_SUPERNOVA;