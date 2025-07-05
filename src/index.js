import "./styles.css";
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";
import { Ship } from "./ship.js";


const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
const ship1 = new Ship(5);
const ship2 = new Ship(4);
const ship3 = new Ship(3);
const ship4 = new Ship(3);
const ship5 = new Ship(2);
const shipsToPlace = [
    { ship: ship1, x: 0, y: 0, orientation: "horizontal" },
    { ship: ship2, x: 0, y: 7, orientation: "horizontal" },
    { ship: ship3, x: 1, y: 2, orientation: "horizontal" },
    { ship: ship4, x: 2, y: 3, orientation: "vertical" },
    { ship: ship5, x: 0, y: 4, orientation: "horizontal" },
];

for (const { ship, x, y, orientation } of shipsToPlace) {
    if (player1.canPlaceShip(ship, x, y, orientation)) {
        player1.placeShip(ship, x, y, orientation);
    } else {
        console.log(`Cannot place ship at (${x}, ${y})!`);
    }
}

player1.receiveAttack(0, 0);
player1.receiveAttack(9, 0);
player1.receiveAttack(0, 0);
player1.receiveAttack(9, 0);
player1.receiveAttack(1, 0);
player1.receiveAttack(2, 0);
player1.receiveAttack(3, 0);
player1.receiveAttack(4, 0);
// player1.receiveAttack(0, 0);

// player2.placeShip(ship1, 0, 0, "vertical");
// player2.placeShip(ship2, 1, 0, "vertical");
// player2.placeShip(ship3, 2, 0, "vertical");
// player2.placeShip(ship4, 3, 0, "vertical");
// player2.placeShip(ship5, 4, 0, "vertical");
console.log(player1.gameboard.board);
console.log(player2.gameboard.board);