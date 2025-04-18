import AI from "../src/js/ai";
import Gameboard from "../src/js/gameboard";

describe("AI", () => {
  let ai = new AI();
  let gameboard;

  describe("placeShips", () => {
    test("should place ships on the board", () => {
      expect(() => {
        gameboard = new Gameboard(
          ai.placeShips([
            { length: 5 },
            { length: 4 },
            { length: 3 },
            { length: 3 },
            { length: 2 },
          ]),
        );
      }).not.toThrow();
    });

    test("should use default ships if no ships are provided", () => {
      expect(() => {
        gameboard = new Gameboard(ai.placeShips());
      }).not.toThrow();
    });
  });

  describe("attack", () => {
    test("should generate valid attack coordinates", () => {
      gameboard = new Gameboard(
        ai.placeShips([
          { length: 5 },
          { length: 4 },
          { length: 3 },
          { length: 3 },
          { length: 2 },
        ]),
      );

      expect(() => {
        for (let i = 0; i < 100; i++) {
          let coords = ai.attack();
          expect(coords.x).toBeGreaterThanOrEqual(0);
          expect(coords.x).toBeLessThan(10);
          expect(coords.y).toBeGreaterThanOrEqual(0);
          expect(coords.y).toBeLessThan(10);
          expect(() => {gameboard.receiveAttack(coords.x, coords.y);}).not.toThrow();
        }
      }).not.toThrow();
    });
  });
});
