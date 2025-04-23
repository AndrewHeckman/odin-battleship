import Player from "./player";
import AI from "./ai";

export default class Game {
  #fleet = [
    { id: 0, name: "Carrier", size: 5 },
    { id: 1, name: "Battleship", size: 4 },
    { id: 2, name: "Destroyer", size: 3 },
    { id: 3, name: "Submarine", size: 3 },
    { id: 4, name: "Patrol Boat", size: 2 },
  ];
  #ai = new AI(this.#fleet);
  #player;
  #computer = new Player("Computer", this.#ai.placeShips());
  #attackedCell;
  #playerBoard;
  #playerCells = [];
  #computerBoard;
  #computerCells = [];
  #shipsDiv;
  #shipElements = [];
  #shipPlacements = new Array(this.#fleet.length).fill(null);
  #selectedShip;
  #selectedShipPlacement;
  #placeButton;
  #rotateButton;
  #clearButton;
  #randomButton;
  #startButton;
  #attackButton;
  #playerCellListeners = new Map();
  #computerCellListeners = new Map();

  // constructor sets event listeners
  constructor() {
    this.#playerBoard = document.querySelector("#player-board");
    this.#computerBoard = document.querySelector("#computer-board");
    this.#shipsDiv = document.querySelector("#ships");
    this.#placeButton = document.querySelector("#place");
    this.#rotateButton = document.querySelector("#rotate");
    this.#clearButton = document.querySelector("#clear");
    this.#randomButton = document.querySelector("#random");
    this.#startButton = document.querySelector("#start");
    this.#attackButton = document.querySelector("#attack");

    this.#placeButton.addEventListener("click", this.#onPlaceClick.bind(this));
    this.#rotateButton.addEventListener(
      "click",
      this.#onRotateClick.bind(this),
    );
    this.#clearButton.addEventListener("click", this.#onClearClick.bind(this));
    this.#randomButton.addEventListener(
      "click",
      this.#onRandomClick.bind(this),
    );
    this.#startButton.addEventListener("click", this.#onStartClick.bind(this));
    this.#attackButton.addEventListener(
      "click",
      this.#onAttackClick.bind(this),
    );
    document.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        // if ship is selected, place it
        // if cell is attacked, attack it
        if (this.#selectedShipPlacement) {
          this.#onPlaceClick();
        } else if (this.#attackedCell) {
          this.#onAttackClick();
        }
      } else if (event.key === "Escape") {
        // if ship is selected, clear it
        // if cell is attacked, clear it
        if (this.#selectedShip) {
          this.#onClearClick();
        } else if (this.#attackedCell) {
          this.#computerCells[
            this.#attackedCell.y * 10 + this.#attackedCell.x
          ].classList.remove("selected");
          this.#attackedCell = null;
          this.#attackButton.disabled = true;
        }
      }
    });

    this.#placeButton.disabled = true;
    this.#rotateButton.disabled = true;
    this.#startButton.disabled = true;
    this.#attackButton.disabled = true;

    // generate player and computer boards
    for (let i = 0; i < 100; i++) {
      const playerCell = document.createElement("div");
      playerCell.id = `player-cell-${i.toString().padStart(2, "0")}`;
      playerCell.classList.add("cell");
      playerCell.classList.add("player-cell");
      playerCell.dataset.cell = i;
      this.#playerBoard.appendChild(playerCell);
      this.#playerCells.push(playerCell);

      const computerCell = document.createElement("div");
      computerCell.id = `computer-cell-${i.toString().padStart(2, "0")}`;
      computerCell.classList.add("cell");
      computerCell.classList.add("computer-cell");
      computerCell.dataset.cell = i;
      this.#computerBoard.appendChild(computerCell);
      this.#computerCells.push(computerCell);
    }

    // generate ships div
    this.#fleet.forEach((ship) => {
      const shipElement = document.createElement("div");
      shipElement.id = `ship-${ship.id}`;
      shipElement.classList.add("ship");
      shipElement.dataset.ship = ship.id;
      shipElement.innerText = ship.name;
      shipElement.style.width = `calc(${ship.size} * var(--cell-size))`;
      this.#shipsDiv.appendChild(shipElement);
      this.#shipElements.push(shipElement);
      shipElement.addEventListener("click", this.#onShipClick.bind(this));
    });
  }

  #onShipClick(event) {
    // if another ship is selected, unselect it, remove ship placement, and show ship element
    if (this.#selectedShip) {
      this.#shipElements[this.#selectedShip].classList.remove("selected");

      if (this.#selectedShipPlacement) {
        this.#clearShipPlacing();
        this.#selectedShipPlacement = null;
      }
    }

    // select the clicked ship
    this.#selectedShip = event.target.dataset.ship;
    event.target.classList.add("selected");

    // enable cell click event by adding event listener to each cell
    this.#playerCells.forEach((cell) => {
      if (!cell.classList.contains("ship-placed")) {
        const listener = this.#onCellPlaceClick.bind(this);
        this.#playerCellListeners.set(cell, listener);
        cell.addEventListener("click", listener);
      }
    });
  }

  #onCellPlaceClick(event) {
    const cell = event.target.dataset.cell;
    const x = cell % 10;
    const y = Math.floor(cell / 10);
    const size = this.#fleet[this.#selectedShip].size;
    const isVertical = this.#selectedShipPlacement
      ? this.#selectedShipPlacement.isVertical
      : false;

    if ((isVertical && y + size > 10) || (!isVertical && x + size > 10)) {
      return;
    }

    if (this.#selectedShipPlacement) {
      this.#clearShipPlacing();
    }

    this.#selectedShipPlacement = {
      x,
      y,
      isVertical,
      size,
    };

    this.#highlightShipPlacing();

    this.#placeButton.disabled = false;
    this.#rotateButton.disabled = false;
  }

  #onRotateClick() {
    this.#clearShipPlacing();

    this.#selectedShipPlacement.isVertical =
      !this.#selectedShipPlacement.isVertical;

    this.#highlightShipPlacing();
  }

  #onPlaceClick() {
    // add placement to array
    this.#shipPlacements[this.#selectedShip] = this.#selectedShipPlacement;

    // remove ship div
    this.#shipElements[this.#selectedShip].classList.remove("selected");
    this.#shipElements[this.#selectedShip].classList.add("hide");

    // disable place and rotate buttons
    this.#placeButton.disabled = true;
    this.#rotateButton.disabled = true;

    // remove event listeners from cells and change occupied cells color
    this.#playerCells.forEach((cell) => {
      if (cell.classList.contains("ship-placing")) {
        cell.classList.remove("ship-placing");
        cell.classList.add("ship-placed");
      }
      const listener = this.#playerCellListeners.get(cell);
      if (listener) {
        cell.removeEventListener("click", listener);
        this.#playerCellListeners.delete(cell);
      }
    });

    // if last ship, remove placement buttons and enable and show start button
    if (this.#shipPlacements.every((placement) => placement !== null)) {
      this.#shipsDiv.classList.add("hide");
      this.#startButton.disabled = false;
      this.#startButton.classList.remove("hide");
      this.#placeButton.classList.add("hide");
      this.#rotateButton.classList.add("hide");
    }

    this.#selectedShipPlacement = null;
    this.#selectedShip = null;
  }

  #onClearClick() {
    // clear ship placements
    // remove ship placements from cells
    this.#shipPlacements.forEach((placement) => {
      if (placement) {
        const x = placement.x;
        const y = placement.y;
        for (let i = 0; i < placement.size; i++) {
          if (placement.isVertical) {
            this.#playerCells[(y + i) * 10 + x].classList.remove("ship-placed");
          } else {
            this.#playerCells[y * 10 + x + i].classList.remove("ship-placed");
          }
        }
      }
    });
    this.#shipPlacements.fill(null);

    // if ship is selected, remove ship placement and unselect ship
    if (this.#selectedShip) {
      this.#selectedShip = null;
      if (this.#selectedShipPlacement) {
        this.#clearShipPlacing();
        this.#selectedShipPlacement = null;
      }
    }

    // unhide ship elements
    this.#shipElements.forEach((shipElement) => {
      shipElement.classList.remove("hide", "selected");
    });
    this.#shipsDiv.classList.remove("hide");

    // change buttons
    this.#placeButton.classList.remove("hide");
    this.#rotateButton.classList.remove("hide");
    this.#startButton.classList.add("hide");
    this.#placeButton.disabled = true;
    this.#rotateButton.disabled = true;
    this.#startButton.disabled = true;

    // remove event listeners from cells
    this.#playerCells.forEach((cell) => {
      const listener = this.#playerCellListeners.get(cell);
      if (listener) {
        cell.removeEventListener("click", listener);
        this.#playerCellListeners.delete(cell);
      }
    });
  }

  #onRandomClick() {
    // clear board
    this.#onClearClick();

    // generate random placements
    this.#shipPlacements = this.#ai.placeShips();

    // place ships on board
    this.#shipPlacements.forEach((placement, index) => {
      this.#selectedShipPlacement = placement;
      this.#selectedShip = index;
      this.#highlightShipPlacing();
      this.#onPlaceClick();
    });
  }

  #onStartClick() {
    // create player from placements
    this.#player = new Player("Player", this.#shipPlacements);
    // hide and disable buttons
    this.#startButton.classList.add("hide");
    this.#clearButton.classList.add("hide");
    this.#randomButton.classList.add("hide");
    this.#startButton.disabled = true;
    this.#clearButton.disabled = true;
    this.#randomButton.disabled = true;
    // render boards and ships and attack button
    this.#computerBoard.classList.remove("hide");
    this.#attackButton.classList.remove("hide");

    // add attack event listener to computer cells
    this.#computerCells.forEach((cell) => {
      const listener = this.#onCellAttackClick.bind(this);
      this.#computerCellListeners.set(cell, listener);
      cell.addEventListener("click", listener);
    });
  }

  #onCellAttackClick(event) {
    // get cell id from event
    const cell = event.target.dataset.cell;
    const x = cell % 10;
    const y = Math.floor(cell / 10);
    // if cell is not clicked, mark it as clicked and set the variable
    if (!this.#attackedCell) {
      this.#attackedCell = { x, y };
      event.target.classList.add("selected");
    } else if (this.#attackedCell.x === x && this.#attackedCell.y === y) {
      // else if this cell is already clicked, clear cell and variable
      event.target.classList.remove("selected");
      this.#attackedCell = null;
      this.#attackButton.disabled = true;
      return;
    } else {
      // else if another cell is already clicked, clear the other cell and set the new variable
      this.#computerCells[
        this.#attackedCell.y * 10 + this.#attackedCell.x
      ].classList.remove("selected");
      this.#attackedCell = { x, y };
      event.target.classList.add("selected");
    }

    // enable attack button
    this.#attackButton.disabled = false;
  }

  #onAttackClick() {
    // remove event listener from cell
    const cell =
      this.#computerCells[this.#attackedCell.y * 10 + this.#attackedCell.x];
    const listener = this.#computerCellListeners.get(cell);
    if (listener) {
      cell.removeEventListener("click", listener);
      this.#computerCellListeners.delete(cell);
    }

    // disable attack button
    this.#attackButton.disabled = true;

    // check if shot hits or misses and update the board
    cell.classList.remove("selected");
    const result = this.#computer.receiveAttack(
      this.#attackedCell.x,
      this.#attackedCell.y,
    );
    if (result === "miss") {
      cell.classList.add("miss");
    } else if (result === "hit") {
      cell.classList.add("hit");
    } else {
      cell.classList.add("hit");
      alert(`You sunk my ${this.#fleet[parseInt(result)].name}!`);
    }

    this.#attackedCell = null;

    // check if game is over
    if (this.#computer.allShipsSunk()) {
      // show winner
      alert("You win!");
      return;
    }

    // if game is not over, call AI to attack
    // const attack = this.#ai.dumbAttack();
    const attack = this.#ai.smartAttack();

    // check if shot hits or misses and update the board
    const computerResult = this.#player.receiveAttack(attack.x, attack.y);
    const playerCell = this.#playerCells[attack.y * 10 + attack.x];
    if (computerResult == "miss") {
      playerCell.classList.add("miss");
    } else {
      playerCell.classList.remove("ship-placed");
      playerCell.classList.add("hit");
    }

    this.#ai.update(computerResult);

    // check if game is over
    if (this.#player.allShipsSunk()) {
      // show winner
      alert("Computer wins!");
      return;
    }
  }

  #clearShipPlacing() {
    const x = this.#selectedShipPlacement.x;
    const y = this.#selectedShipPlacement.y;
    for (let i = 0; i < this.#selectedShipPlacement.size; i++) {
      if (this.#selectedShipPlacement.isVertical) {
        this.#playerCells[(y + i) * 10 + x].classList.remove("ship-placing");
      } else {
        this.#playerCells[y * 10 + x + i].classList.remove("ship-placing");
      }
    }
  }

  #highlightShipPlacing() {
    const x = this.#selectedShipPlacement.x;
    const y = this.#selectedShipPlacement.y;
    for (let i = 0; i < this.#selectedShipPlacement.size; i++) {
      if (this.#selectedShipPlacement.isVertical) {
        this.#playerCells[(y + i) * 10 + x].classList.add("ship-placing");
      } else {
        this.#playerCells[y * 10 + x + i].classList.add("ship-placing");
      }
    }
  }
}
