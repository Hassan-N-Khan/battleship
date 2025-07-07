import {Player} from "./player.js";
import {Ship} from "./ship.js";

const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
const p1ship1 = new Ship(2);
// const p1ship2 = new Ship(4);
// const p1ship3 = new Ship(3);
// const p1ship4 = new Ship(3);
// const p1ship5 = new Ship(2);
const shipsToPlace = [
    { ship: p1ship1, x: 0, y: 0, orientation: "horizontal" },
    // { ship: p1ship2, x: 0, y: 1, orientation: "horizontal" },
    // { ship: p1ship3, x: 0, y: 2, orientation: "horizontal" },
    // { ship: p1ship4, x: 0, y: 3, orientation: "horizontal" },
    // { ship: p1ship5, x: 0, y: 4, orientation: "horizontal" },
];

for (const { ship, x, y, orientation } of shipsToPlace) {
    if (player1.canPlaceShip(ship, x, y, orientation)) {
        player1.placeShip(ship, x, y, orientation);
    } else {
        console.log(`Cannot place ship at (${x}, ${y})!`);
    }
}

// player1.receiveAttack(0, 0);
// player1.receiveAttack(9, 0);
// player1.receiveAttack(0, 0);
// player1.receiveAttack(9, 0);
// player1.receiveAttack(1, 0);
// player1.receiveAttack(2, 0);
// player1.receiveAttack(3, 0);
// player1.receiveAttack(4, 0);
// player1.receiveAttack(0, 0);

// player2.placeShip(ship1, 0, 0, "vertical");
// player2.placeShip(ship2, 1, 0, "vertical");
// player2.placeShip(ship3, 2, 0, "vertical");
// player2.placeShip(ship4, 3, 0, "vertical");
// player2.placeShip(ship5, 4, 0, "vertical");
const p2ship1 = new Ship(2);
// const p2ship2 = new Ship(4);
// const p2ship3 = new Ship(3);
// const p2ship4 = new Ship(3);
// const p2ship5 = new Ship(2);
const shipsToPlacePlayer2 = [
    { ship: p2ship1, x: 0, y: 0, orientation: "horizontal" },
    // { ship: p2ship2, x: 0, y: 1, orientation: "horizontal" },
    // { ship: p2ship3, x: 0, y: 2, orientation: "horizontal" },
    // { ship: p2ship4, x: 0, y: 3, orientation: "Horizontal" },
    // { ship: p2ship5, x: 0, y: 4, orientation: "horizontal" },
];

for (const { ship, x, y, orientation } of shipsToPlacePlayer2) {
    if (player2.canPlaceShip(ship, x, y, orientation)) {
        player2.placeShip(ship, x, y, orientation);
    } else {
        console.log(`Cannot place ship at (${x}, ${y})!`);
    }
}


function alternatePlayers(currentPlayer, player1, player2) {
    return currentPlayer === player1
        ? [player2, player1]
        : [player1, player2];
}

function playerOneMove() {

    let x = prompt("Enter x coordinate to attack (0-9):");
    let y = prompt("Enter y coordinate to attack (0-9):");
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
        console.log(`Invalid coordinates. Please enter numbers between 0 and 9.`);
        return true;
    }
    return [x, y];
}

function computerMove() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    console.log(`Computer attacks at (${x}, ${y})`);
    return [x, y];
}

function playGame() {
    let currentPlayer = player1;
    let opponent = player2;

    
    while (true) {
        console.log(`Gameboard of ${currentPlayer.name}:`);
        console.table(currentPlayer.gameboard.getBoard());

        console.log(`Gameboard of ${opponent.name}:`);
        console.table(opponent.gameboard.getBoard());
        if(currentPlayer=== player1) {
            console.log(`${currentPlayer.name}'s turn.`);
            const move = playerOneMove();
            if (!move) {
                console.log("Invalid move. Try again.");
                continue;
            }
            opponent.receiveAttack(...move);
        }else{
            console.log(`${currentPlayer.name}'s turn.`);
            const move = computerMove();
            opponent.receiveAttack(...move);
        }

        if (opponent.allShipsSunk()) {
            console.log(`${currentPlayer.name} wins!`);
            break;
        }
        // Switch players
        [currentPlayer, opponent] = alternatePlayers(currentPlayer, player1, player2);
    }
}

export {playGame};