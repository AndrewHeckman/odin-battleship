import Ship from "./ship";

export default class Gameboard {
  /**
   * 2D array representing the game board.
   * Each cell is an object with the following properties:
   * - ship: The ship occupying the cell (or null if no ship).
   * - hit: A boolean indicating whether the cell has been hit.
   * @type {Array<Array<{ship: number|null, hit: boolean}>>}
   */
  #board = Array.from({ length: 10 }, () =>
    Array(10).fill({ ship: null, hit: false }),
  );
  /**
   * Array of ships on the board.
   * @type {Array<Ship>}
   */
  #ships = [];

  /**
   * @param {Array<{
   * x: number,
   * y: number,
   * isVertical: boolean,
   * size: number
   * }>} placements Array of ship placements.
   */
  constructor(placements) {
    // Initialize the board with ship placements
    placements.forEach(({ x, y, isVertical, size }) => {
      const ship = new Ship(size);
      this.#ships.push(ship);
      this.#placeShip(x, y, isVertical, this.#ships.length - 1);
    });
  }

  /**
   * Place a ship on the board.
   * @param {number} x The x-coordinate of the ship's starting position.
   * @param {number} y The y-coordinate of the ship's starting position.
   * @param {boolean} isVertical Whether the ship is placed vertically or horizontally.
   * @param {number} shipIndex The index of the ship in the #ships array.
   * @throws {Error} If the ship cannot be placed at the specified coordinates.
   */
  #placeShip(x, y, isVertical, shipIndex) {
    const size = this.#ships[shipIndex].size;

    if (isVertical) {
      if (y + size > 10) {
        throw new Error("Ship cannot be placed outside the board");
      }
      for (let i = 0; i < size; i++) {
        if (this.#board[y + i][x].ship !== null) {
          throw new Error("Ship cannot be placed on top of another ship");
        }
        this.#board[y + i][x] = { ship: shipIndex, hit: false };
      }
    } else {
      if (x + size > 10) {
        throw new Error("Ship cannot be placed outside the board");
      }
      for (let i = 0; i < size; i++) {
        if (this.#board[y][x + i].ship !== null) {
          throw new Error("Ship cannot be placed on top of another ship");
        }
        this.#board[y][x + i] = { ship: shipIndex, hit: false };
      }
    }
  }

  /**
   * Receive an attack at the specified coordinates.
   * @param {number} x The x-coordinate of the attack.
   * @param {number} y The y-coordinate of the attack.
   * @returns {String} "hit", "miss", or the sunk ship's index.
   * @throws {Error} If the attack is out of bounds or has already been taken.
   */
  receiveAttack(x, y) {
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      throw new Error("Attack is out of bounds");
    }

    const cell = this.#board[y][x];
    if (cell.hit) {
      throw new Error("Attack already taken");
    }

    this.#board[y][x] = { ship: cell.ship, hit: true };

    if (cell.ship !== null) {
      let ship = this.#ships[cell.ship];
      ship.hit();
      if (ship.isSunk()) {
        return cell.ship.toString();
      } else {
        return "hit";
      }
    } else {
      return "miss";
    }
  }

  /**
   * Check if all ships have been sunk.
   * @returns {boolean} True if all ships are sunk, false otherwise.
   */
  allShipsSunk() {
    return this.#ships.every((ship) => ship.isSunk());
  }

  /**
   * @returns {Array<Array<{ship: number|null, hit: boolean}>>}
   */
  get board() {
    return this.#board;
  }
}
