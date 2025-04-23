export default class Ship {
  #size;
  #hits = 0;
  #sunk = false;

  constructor(size) {
    this.#size = size;
  }

  /**
   * Increment the hit count of the ship.
   */
  hit() {
    if (this.isSunk()) {
      throw new Error("Ship is already sunk");
    }

    this.#hits++;
  }
  
  /**
   * Check if the ship is sunk.
   * A ship is considered sunk if the number of hits is equal to or greater than its size.
   * @returns {boolean} True if the ship is sunk, false otherwise.
   */
  isSunk() {
    if (this.#hits >= this.#size) {
      this.#sunk = true;
    }

    return this.#sunk;
  }

  /**
   * @type {number}
   * @readonly
   */
  get size() {
    return this.#size;
  }
}