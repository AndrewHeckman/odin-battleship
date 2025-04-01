export default class Ship {
  #length;
  #hits = 0;
  #sunk = false;

  constructor(length) {
    this.#length = length;
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
   * A ship is considered sunk if the number of hits is equal to or greater than its length.
   * @returns {boolean} True if the ship is sunk, false otherwise.
   */
  isSunk() {
    if (this.#hits >= this.#length) {
      this.#sunk = true;
    }

    return this.#sunk;
  }

  /**
   * @type {number}
   * @readonly
   */
  get length() {
    return this.#length;
  }
}