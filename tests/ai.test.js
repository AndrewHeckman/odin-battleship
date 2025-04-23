import AI from "../src/js/ai";
import Gameboard from "../src/js/gameboard";

describe("AI", () => {
  let ai;
  let gameboard;
  const ships = [
    { id: 0, size: 5 },
    { id: 1, size: 4 },
    { id: 2, size: 3 },
    { id: 3, size: 3 },
    { id: 4, size: 2 },
  ];

  beforeEach(() => {
    ai = new AI(ships);
    gameboard = new Gameboard(ai.placeShips());
  });

  describe("placeShips", () => {
    test("should place ships on the board", () => {
      expect(() => {
        gameboard = new Gameboard(
          ai.placeShips(),
        );
      }).not.toThrow();
    });

    test("should use default ships if no ships are provided", () => {
      expect(() => {
        ai = new AI();
        gameboard = new Gameboard(ai.placeShips());
      }).not.toThrow();
    });
  });

  describe("dumb attack", () => {
    test("should generate valid attack coordinates", () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          let coords = ai.dumbAttack();
          expect(coords.x).toBeGreaterThanOrEqual(0);
          expect(coords.x).toBeLessThan(10);
          expect(coords.y).toBeGreaterThanOrEqual(0);
          expect(coords.y).toBeLessThan(10);
          expect(() => {
            let result = gameboard.receiveAttack(coords.x, coords.y);
            ai.update(result);
          }).not.toThrow();
        }
      }).not.toThrow();
    });
  });

  describe("smart attack", () => {
    test("should generate valid attack coordinates", () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          let coords = ai.smartAttack();

          expect(coords.x).toBeGreaterThanOrEqual(0);
          expect(coords.x).toBeLessThan(10);
          expect(coords.y).toBeGreaterThanOrEqual(0);
          expect(coords.y).toBeLessThan(10);
          expect(() => {
            let result = gameboard.receiveAttack(coords.x, coords.y);
            ai.update(result);
          }).not.toThrow();

          if (gameboard.allShipsSunk()) {
            break;
          }
        }
      }).not.toThrow();
    });
  });
});
