import Gameboard from "../src/js/gameboard";

describe("Gameboard", () => {
  let gameboard;
  let placements = [
    { x: 0, y: 0, ship: 0 },
    { x: 1, y: 0, ship: 0 },
    { x: 2, y: 0, ship: 0 },
    { x: 3, y: 0, ship: 0 },
    { x: 4, y: 0, ship: 0 },
    { x: 0, y: 1, ship: 1 },
    { x: 1, y: 1, ship: 1 },
    { x: 2, y: 1, ship: 1 },
    { x: 3, y: 1, ship: 1 },
    { x: 0, y: 2, ship: 2 },
    { x: 1, y: 2, ship: 2 },
    { x: 2, y: 2, ship: 2 },
    { x: 0, y: 3, ship: 3 },
    { x: 1, y: 3, ship: 3 },
    { x: 2, y: 3, ship: 3 },
    { x: 0, y: 4, ship: 4 },
    { x: 1, y: 4, ship: 4 },
  ];

  beforeEach(() => {
    gameboard = new Gameboard([
      { x: 0, y: 0, isVertical: false, size: 5 },
      { x: 0, y: 1, isVertical: false, size: 4 },
      { x: 0, y: 2, isVertical: false, size: 3 },
      { x: 0, y: 3, isVertical: false, size: 3 },
      { x: 0, y: 4, isVertical: false, size: 2 },
    ]);
  });

  describe("constructor", () => {
    test("should create a 10x10 board", () => {
      expect(gameboard.board).toHaveLength(10);
      gameboard.board.forEach((row) => {
        expect(row).toHaveLength(10);
      });
    });

    test("should initialize the board with false hit status", () => {
      gameboard.board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.hit).toBe(false);
        });
      });
    });

    test("should initialize the board with correct ship placements", () => {
      expect(checkPlacements(gameboard.board, placements)).toBe(true);
    });

    // invalid placements should throw errors
    test("should throw an error when ship placements are invalid", () => {
      expect(() => {
        new Gameboard([{ x: 0, y: 6, isVertical: true, size: 5 }]);
      }).toThrow("Ship cannot be placed outside the board");
      expect(() => {
        new Gameboard([{ x: 0, y: 11, isVertical: true, size: 5 }]);
      }).toThrow("Ship cannot be placed outside the board");
      expect(() => {
        new Gameboard([{ x: 6, y: 0, isVertical: false, size: 5 }]);
      }).toThrow("Ship cannot be placed outside the board");
      expect(() => {
        new Gameboard([{ x: 11, y: 0, isVertical: false, size: 5 }]);
      }).toThrow("Ship cannot be placed outside the board");
      expect(() => {
        new Gameboard([
          { x: 0, y: 0, isVertical: true, size: 5 },
          { x: 0, y: 0, isVertical: true, size: 4 },
        ]);
      }).toThrow("Ship cannot be placed on top of another ship");
      expect(() => {
        new Gameboard([
          { x: 0, y: 0, isVertical: false, size: 5 },
          { x: 0, y: 0, isVertical: false, size: 4 },
        ]);
      }).toThrow("Ship cannot be placed on top of another ship");
    });
    // invalid ship types should throw errors
  });

  describe("receiveAttack", () => {
    test("should mark a cell as hit when a ship is hit", () => {
      const result = gameboard.receiveAttack(0, 0);
      expect(checkAttacks(gameboard.board, [{ x: 0, y: 0 }])).toBe(true);
      expect(result).toBe("hit");
    });

    test("should mark a cell as hit when a miss occurs", () => {
      const result = gameboard.receiveAttack(5, 5);
      expect(checkAttacks(gameboard.board, [{ x: 5, y: 5 }])).toBe(true);
      expect(result).toBe("miss");
    });

    test("should throw an error when the attack is out of bounds", () => {
      expect(() => gameboard.receiveAttack(-1, 0)).toThrow(
        "Attack is out of bounds",
      );
      expect(() => gameboard.receiveAttack(0, -1)).toThrow(
        "Attack is out of bounds",
      );
      expect(() => gameboard.receiveAttack(10, 0)).toThrow(
        "Attack is out of bounds",
      );
      expect(() => gameboard.receiveAttack(0, 10)).toThrow(
        "Attack is out of bounds",
      );
      expect(checkAttacks(gameboard.board, [])).toBe(true);
    });

    test("should throw an error when the attack has already been taken", () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(5, 5);

      expect(
        checkAttacks(gameboard.board, [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
        ]),
      ).toBe(true);
      expect(() => gameboard.receiveAttack(0, 0)).toThrow(
        "Attack already taken",
      );
      expect(() => gameboard.receiveAttack(5, 5)).toThrow(
        "Attack already taken",
      );
      expect(
        checkAttacks(gameboard.board, [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
        ]),
      ).toBe(true);
    });
  });

  describe("allShipsSunk", () => {
    test("should return true if all ships are sunk", () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(1, 0);
      gameboard.receiveAttack(2, 0);
      gameboard.receiveAttack(3, 0);
      gameboard.receiveAttack(4, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 1);
      gameboard.receiveAttack(2, 1);
      gameboard.receiveAttack(3, 1);
      gameboard.receiveAttack(0, 2);
      gameboard.receiveAttack(1, 2);
      gameboard.receiveAttack(2, 2);
      gameboard.receiveAttack(0, 3);
      gameboard.receiveAttack(1, 3);
      gameboard.receiveAttack(2, 3);
      gameboard.receiveAttack(0, 4);
      gameboard.receiveAttack(1, 4);

      expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("should return false if not all ships are sunk", () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(1, 0);
      gameboard.receiveAttack(2, 0);
      gameboard.receiveAttack(3, 0);
      gameboard.receiveAttack(4, 0);

      expect(gameboard.allShipsSunk()).toBe(false);
    });
  });
});

/**
 * Helper function to check if ship placements are valid. Checks each square of the board against an array of which squares should be occupied by which ship.
 * Placements are valid if every square is occupied by the correct ship or is empty.
 * @param {Array<Array<{ship: number|null, hit: boolean}>>} board Board representation
 * @param {Array<{x: number, y: number, ship: number|null}>} placements Array of ship placements
 * @returns {boolean} True if all placements are valid, false otherwise
 */
function checkPlacements(board, placements) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = board[y][x];
      const placement = placements.find((p) => p.x === x && p.y === y);
      if (
        (placement && cell.ship !== placement.ship) ||
        (!placement && cell.ship !== null)
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Helper function to check if all attacks are valid. Checks each square of the board against an array of attacks.
 * Attacks are valid if every square that should be hit is marked as hit, and no others are.
 * @param {Array<Array<{ship: number|null, hit: boolean}>>} board Board representation
 * @param {Array<{x: number, y: number}>} attacks Array of attack coordinates
 * @returns {boolean} True if all attacks are valid, false otherwise
 */
function checkAttacks(board, attacks) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = board[y][x];
      const attack = attacks.find((a) => a.x === x && a.y === y);
      if ((attack && !cell.hit) || (!attack && cell.hit)) {
        return false;
      }
    }
  }
  return true;
}
