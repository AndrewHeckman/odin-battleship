import Ship from '../src/js/ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('should create a ship with the given length', () => {
    // eslint-disable-next-line jest/prefer-to-have-length
    expect(ship.length).toBe(3);
  });

  test('should not allow hitting a sunk ship', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(() => ship.hit()).toThrow('Ship is already sunk');
  });

  test('should sink the ship when it has been hit enough times', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});