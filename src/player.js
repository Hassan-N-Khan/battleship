import { Gameboard } from './gameboard.js';

export class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard();
    }

    placeShip(ship, x, y, orientation) {
        return this.gameboard.placeShip(ship, x, y, orientation);
    }
    canPlaceShip(ship, x, y, orientation) {
        return this.gameboard.canPlaceShip(ship, x, y, orientation);
    }

    receiveAttack(x, y) {
        return this.gameboard.receiveAttack(x, y);
    }

    allShipsSunk() {
        return this.gameboard.allShipsSunk();
    }
}