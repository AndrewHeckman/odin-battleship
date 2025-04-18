export default class AI {
  #board = Array.from({ length: 10 }, () =>
    Array(10).fill({hit: false}),
  );

  constructor() {}

  /**
   * Generate random placements for ships on the board.
   * @param {Array<{length: number}>} ships Ship lengths to place on the board.
   * @returns {Array<{
   * x: number,
   * y: number,
   * isVertical: boolean,
   * length: number
   * }>} Array of ship placements.
   */
  placeShips(ships) {
    if (!ships || ships.length === 0) {
      ships = [
        { length: 5 },
        { length: 4 },
        { length: 3 },
        { length: 3 },
        { length: 2 },
      ];
    }

    // AI logic to place ships on the board
    // This is a placeholder implementation
    const placements = [];
    const board = Array.from({ length: 10 }, () =>
      Array(10).fill(true),
    );

    ships.forEach((ship) => {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let isVertical = Math.random() < 0.5;

      // Ensure the ship fits within the board and does not overlap with other ships
      while (!this.#checkPlacement(board, { x, y, isVertical, length: ship.length })) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        isVertical = Math.random() < 0.5;
      }

      placements.push({ x, y, isVertical, length: ship.length });
      for (let i = 0; i < ship.length; i++) {
        if (isVertical) {
          board[y + i][x] = false;
        } else {
          board[y][x + i] = false;
        }
      }
    });

    return placements;
  }

  /**
   * Generate attack coordinates for the AI to attack the opponent's board.
   * @returns {{x: number, y: number}} Coordinates for the attack.
   */
  attack() {
    // AI logic to attack the opponent's board
    // This is a placeholder implementation
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    // Ensure the attack coordinates are not already taken
    while (this.#board[y][x].hit) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }

    this.#board[y][x] = { hit: true };

    return { x, y };
  }

  #checkPlacement(board, placement) {
    const { x, y, isVertical, length } = placement;

    if (isVertical) {
      if (y + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (!board[y + i][x]) return false;
      }
    } else {
      if (x + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (!board[y][x + i]) return false;
      }
    }

    return true;
  }
}
