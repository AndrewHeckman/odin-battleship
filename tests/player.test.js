import Player from "../src/js/player";

describe("Player", () => {
  let player;

  beforeEach(() => {
    player = new Player("Player 1", [
      { x: 0, y: 0, isVertical: false, length: 5 },
      { x: 0, y: 1, isVertical: false, length: 4 },
      { x: 0, y: 2, isVertical: false, length: 3 },
      { x: 0, y: 3, isVertical: false, length: 3 },
      { x: 0, y: 4, isVertical: false, length: 2 },
    ]);
  });

  describe("constructor", () => {
    test("should create a player with a name", () => {
      expect(player.name).toBe("Player 1");
    });
  });

  describe("receiveAttack", () => {
    test("should return true when attack hits a ship", () => {
      expect(player.receiveAttack(0, 0)).toBe(true);
    });

    test("should return false when attack misses", () => {
      expect(player.receiveAttack(5, 5)).toBe(false);
    });
  });

  describe("allShipsSunk", () => {
    test("should return false when not all ships are sunk", () => {
      expect(player.allShipsSunk()).toBe(false);
    });

    test("should return true when all ships are sunk", () => {
      player.receiveAttack(0, 0);
      player.receiveAttack(1, 0);
      player.receiveAttack(2, 0);
      player.receiveAttack(3, 0);
      player.receiveAttack(4, 0);
      player.receiveAttack(0, 1);
      player.receiveAttack(1, 1);
      player.receiveAttack(2, 1);
      player.receiveAttack(3, 1);
      player.receiveAttack(0, 2);
      player.receiveAttack(1, 2);
      player.receiveAttack(2, 2);
      player.receiveAttack(0, 3);
      player.receiveAttack(1, 3);
      player.receiveAttack(2, 3);
      player.receiveAttack(0, 4);
      player.receiveAttack(1, 4);
      
      expect(player.allShipsSunk()).toBe(true);
    });
  });
});
