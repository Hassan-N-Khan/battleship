import { Ship } from './ship.js';

export class Gameboard{
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.ships = [];
    }
    getBoard() {
        return this.board;
    }
    placeShip(ship, x, y, orientation) {
        if (this.canPlaceShip(ship, x, y, orientation)) {
            for (let i = 0; i < ship.length; i++) {
                if (orientation === 'horizontal') {
                    this.board[y][x + i] = ship;
                } else {
                    this.board[y + i][x] = ship;
                }
            }
            this.ships.push(ship);
            return true;
        }
        return false;
    }

    canPlaceShip(ship, x, y, orientation) {
        for (let i = 0; i < ship.length; i++) {
            const newX = orientation === 'horizontal' ? x + i : x;
            const newY = orientation === 'horizontal' ? y : y + i;

            if (newX < 0 || newY < 0 || newX >= 10 || newY >= 10 || this.board[newY][newX]) {
                return false;
            }
        }
        return true;
    }

    receiveAttack(x, y) {
        const target = this.board[y][x];
        if (this.board[y][x] instanceof Ship) {
            const target = this.board[y][x];
            console.log(`Hit at (${x}, ${y})!`);
            target.hit();
            console.log(`This ship has been hit ${target.getHits()} / ${target.getLength()} times.`);
            if (target.isSunk()) {
                console.log(`Ship sunk at (${x}, ${y})!`);
            }
            this.board[y][x] = true;
            return true;
        }else if (this.board[y][x] === null) {
            console.log(`Missed at this position (${x}, ${y})!`);
            this.board[y][x] = false; // Mark the spot as missed
            return false; // Already hit or missed
        }else if (this.board[y][x] === true || this.board[y][x] === false) {
            console.log(`Already attacked this position (${x}, ${y})!`);
            return false; // Already hit or missed
        }
        return false; // Default case, should not happen
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    reset() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.ships = [];
    }
}