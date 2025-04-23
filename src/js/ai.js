export default class AI {
  #board = Array.from({ length: 10 }, () => Array(10).fill({ hit: null }));
  #pdf = Array.from({ length: 10 }, () => Array(10).fill(0));
  #ships;
  #lastAttack = null;
  #targetMode = false;
  #targetedSquares = [];
  #sunkSquares = 0;
  #maxSize;

  /**
   * Make a new AI instance based on a set of ships.
   * @param {Array<{id: number, length: number}>} ships Ship lengths to place on the board.
   */
  constructor(ships) {
    if (!ships || ships.length === 0) {
      ships = [
        { id: 0, size: 5 },
        { id: 1, size: 4 },
        { id: 2, size: 3 },
        { id: 3, size: 3 },
        { id: 4, size: 2 },
      ];
    }
    this.#ships = [...ships];

    this.#maxSize = Math.max(...ships.map((ship) => ship.size));

    this.#initializePdf();
  }

  /**
   * Generate random placements for ships on the board.
   * @returns {Array<{
   * x: number,
   * y: number,
   * isVertical: boolean,
   * size: number
   * }>} Array of ship placements.
   */
  placeShips() {
    // AI logic to place ships on the board
    // This is a placeholder implementation
    const placements = [];
    const placementBoard = Array.from({ length: 10 }, () => Array(10).fill(true));

    this.#ships.forEach((ship) => {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let isVertical = Math.random() < 0.5;

      // Ensure the ship fits within the board and does not overlap with other ships
      while (
        !this.#checkPlacement(placementBoard, { x, y, isVertical, size: ship.size })
      ) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        isVertical = Math.random() < 0.5;
      }

      placements.push({ x, y, isVertical, size: ship.size });
      for (let i = 0; i < ship.size; i++) {
        if (isVertical) {
          placementBoard[y + i][x] = false;
        } else {
          placementBoard[y][x + i] = false;
        }
      }
    });

    return placements;
  }

  /**
   * Generate attack coordinates for the AI to attack the opponent's board.
   * @returns {{x: number, y: number}} Coordinates for the attack.
   */
  dumbAttack() {
    // AI logic to attack the opponent's board
    // This is a placeholder implementation
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    // Ensure the attack coordinates are not already taken
    while (this.#board[y][x].hit != null) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }

    this.#lastAttack = { x, y };

    return { x, y };
  }

  smartAttack() {
    // find the highest probability location
    let maxProb = -1;
    let maxCoords = null;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.#pdf[i][j] > maxProb && this.#board[i][j].hit === null) {
          maxProb = this.#pdf[i][j];
          maxCoords = { x: j, y: i };
        }
      }
    }

    // if no valid coordinates found, use dumb attack
    if (maxCoords === null) {
      maxCoords = this.dumbAttack();
    }

    this.#lastAttack = maxCoords;
    return maxCoords;
  }

  /**
   * Updates the ai board with the result of the attack.
   * @param {Boolean} hit True if the attack hit a ship, false if it missed.
   * @param {Number} sunk Size of the sunk ship, or null if no ship was sunk.
   */
  update(result) {
    const { x, y } = this.#lastAttack;

    if (result === "miss") {
      this.#board[y][x] = { hit: false };
    } else if (result === "hit") {
      this.#board[y][x] = { hit: true };
      this.#targetMode = true;
      this.#targetedSquares.push({ ...this.#lastAttack });
    } else {
      this.#board[y][x] = { hit: true };
      this.#targetedSquares.push({ ...this.#lastAttack });
      const shipId = parseInt(result);
      const sunkShip = this.#ships.find((ship) => ship.id === shipId);

      if (sunkShip) {
        this.#sunkSquares += sunkShip.size;
        this.#ships = this.#ships.filter((ship) => ship.id !== shipId);

        if (this.#targetedSquares.length <= this.#sunkSquares) {
          this.#targetMode = false;
          this.#targetedSquares = [];
          this.#sunkSquares = 0;
        }
      }

      if (this.#ships.length > 0) {
        this.#maxSize = Math.max(...this.#ships.map((ship) => ship.size));
      } else {
        this.#maxSize = 0;
        return;
      }
    }

    this.#pdf = Array.from({ length: 10 }, () => Array(10).fill(0));
    this.#calculatePdf();

    if (this.#targetMode && this.#maxSize > 0) {
      this.#calculateTargeting();
    }
  }

  #initializePdf() {
    this.#ships.forEach((ship) => {
      for (let i = 0; i < 100; i++) {
        const x = i % 10;
        const y = Math.floor(i / 10);

        if (ship.size + x <= 10) {
          for (let j = 0; j < ship.size; j++) {
            this.#pdf[y][x + j]++;
          }
        }

        if (ship.size + y <= 10) {
          for (let j = 0; j < ship.size; j++) {
            this.#pdf[y + j][x]++;
          }
        }
      }
    });
  }

  #calculatePdf() {
    this.#ships.forEach((ship) => {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x <= 10 - ship.size; x++) {
          let valid = true;

          for (let i = 0; i < ship.size; i++) {
            if (this.#board[y][x + i].hit !== null) {
              valid = false;
              break;
            }
          }
          if (valid) {
            for (let i = 0; i < ship.size; i++) {
              this.#pdf[y][x + i]++;
            }
          }
        }
      }

      for (let x = 0; x < 10; x++) {
        for (let y = 0; y <= 10 - ship.size; y++) {
          let valid = true;

          for (let i = 0; i < ship.size; i++) {
            if (this.#board[y + i][x].hit !== null) {
              valid = false;
              break;
            }
          }
          if (valid) {
            for (let i = 0; i < ship.size; i++) {
              this.#pdf[y + i][x]++;
            }
          }
        }
      }
    });
  }

  #calculateTargeting() {
    // check all squares in the same row and column within max ship size of a hit square
    this.#targetedSquares.forEach((square) => {
      const {x, y} = square;

      // Check right
      for (let i = 1; i < this.#maxSize && x + i < 10; i++) {
        if (this.#board[y][x + i].hit === null) {
          this.#pdf[y][x + i] += 50;
        } else if (this.#board[y][x + i].hit === false) {
          break; // Stop at misses
        }
      }
      
      // Check left
      for (let i = 1; i < this.#maxSize && x - i >= 0; i++) {
        if (this.#board[y][x - i].hit === null) {
          this.#pdf[y][x - i] += 50;
        } else if (this.#board[y][x - i].hit === false) {
          break; // Stop at misses
        }
      }
      
      // Check down
      for (let i = 1; i < this.#maxSize && y + i < 10; i++) {
        if (this.#board[y + i][x].hit === null) {
          this.#pdf[y + i][x] += 50;
        } else if (this.#board[y + i][x].hit === false) {
          break; // Stop at misses
        }
      }
      
      // Check up
      for (let i = 1; i < this.#maxSize && y - i >= 0; i++) {
        if (this.#board[y - i][x].hit === null) {
          this.#pdf[y - i][x] += 50;
        } else if (this.#board[y - i][x].hit === false) {
          break; // Stop at misses
        }
      }
    });
  }

  #checkPlacement(placementBoard, placement) {
    const { x, y, isVertical, size } = placement;

    if (isVertical) {
      if (y + size > 10) return false;
      for (let i = 0; i < size; i++) {
        if (!placementBoard[y + i][x]) return false;
      }
    } else {
      if (x + size > 10) return false;
      for (let i = 0; i < size; i++) {
        if (!placementBoard[y][x + i]) return false;
      }
    }

    return true;
  }
}
