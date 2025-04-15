import Gameboard from "./gameboard";

export default class Player {
  #name;
  #gameboard;

  constructor(name, placements) {
    this.#name = name;
    this.#gameboard = new Gameboard(placements);
  }

  receiveAttack(x, y) {
    return this.#gameboard.receiveAttack(x, y);
  }

  /**
   * Check if all ships on the player's gameboard are sunk.
   * @returns {boolean} True if all ships are sunk, false otherwise.
   */
  allShipsSunk() {
    return this.#gameboard.allShipsSunk();
  }

  get name() {
    return this.#name;
  }
}
