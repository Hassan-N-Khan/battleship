import {Player} from "./player.js";
import {Ship} from "./ship.js";

const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
const shipsToPlace = [
  new Ship(5), // Carrier
  new Ship(4), // Battleship
  new Ship(3), // Cruiser
  new Ship(3), // Submarine
  new Ship(2), // Destroyer
];
let currentShipIndex = 0;




console.log("Player 1's Gameboard:");
console.table(player1.gameboard.getBoard());

function createComputerBoard(){
    const p2ship1 = new Ship(5);
    const p2ship2 = new Ship(4);
    const p2ship3 = new Ship(3);
    const p2ship4 = new Ship(3);
    const p2ship5 = new Ship(2);
    let direction = "horizontal";
    const shipsToPlacePlayer2 = [
        { ship: p2ship1},
        { ship: p2ship2},
        { ship: p2ship3},
        { ship: p2ship4},
        { ship: p2ship5},
    ];

    for (let i = 0; i < shipsToPlacePlayer2.length; i++) {
        const orientation = direction = Math.random() < 0.5 ? "horizontal" : "vertical" 
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const { ship } = shipsToPlacePlayer2[i];
        if (player2.canPlaceShip(ship, x, y, orientation)) {
            console.log(`Successful placed Player 2 ${orientation} ship number ${i}, size of ${ship.getLength()}  at (${x}, ${y})!`)
            player2.placeShip(ship, x, y, orientation);
        } else {
            console.log(`Cannot place Player 2 ${orientation} ship ${i}, size of ${ship.getLength()} at (${x}, ${y})! Trying Again!`);
            i--;
        }
    }

    console.log("Player 2's Gameboard:");
    console.table(player2.gameboard.getBoard());
}

function alternatePlayers(currentPlayer, player1, player2) {
    return currentPlayer === player1
        ? [player2, player1]
        : [player1, player2];
}

function playerOneMove(coords) {
    const coordinates = coords.trim();
    console.log(`Player 1's turn. Enter coordinates to attack (format: x,y): ${coordinates}`);
    if (!coordinates) {
        console.log("No coordinates entered. Please enter coordinates in the format 'x,y'.");
        return null;
    }
    const [x, y] = coordinates.split(",").map(coord => coord.trim());
    if (typeof x !== "string" || typeof y !== "string" || x.trim() === "" || y.trim() === "") {
        console.log("Invalid input format. Please enter coordinates in the format 'x,y'.");
        return true;
    }

    const parsedX = parseInt(x, 10);
    const parsedY = parseInt(y, 10);
    if (isNaN(parsedX) || isNaN(parsedY) || parsedX < 0 || parsedX > 9 || parsedY < 0 || parsedY > 9) {
        console.log(`Invalid coordinates. Please enter numbers between 0 and 9.`);
        return true;
    }else if(player1.gameboard.getBoard()[parsedY][parsedX] === true || player1.gameboard.getBoard()[parsedY][parsedX] === false){
        console.log(`Already attacked this position (${parsedX}, ${parsedY})!`);
        return true;
    }
    return [parsedX, parsedY];
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
    createComputerBoard();
    document.getElementById("place-ship").addEventListener("click", (e) => {
        e.preventDefault();

        if (currentShipIndex >= shipsToPlace.length) {
            console.log("All ships placed!");
            return;
        }

        const coordinates = document.getElementById("player-one-coordinate").value.trim();

        if (!coordinates.includes(",")) {
            console.log("Invalid input. Use format x,y");
            return;
        }

        const [xStr, yStr] = coordinates.split(",").map(str => str.trim());
        const x = parseInt(xStr, 10);
        const y = parseInt(yStr, 10);

        const orientation = document.getElementById("orientation").value;

        if (
            isNaN(x) || isNaN(y) ||
            x < 0 || x > 9 || y < 0 || y > 9 ||
            (orientation !== "horizontal" && orientation !== "vertical")
        ) {
            console.log("Invalid input values.");
            return;
        }

        const ship = shipsToPlace[currentShipIndex];
        if (player1.canPlaceShip(ship, x, y, orientation)) {
            player1.placeShip(ship, x, y, orientation);
            console.log(`Placed ship ${currentShipIndex + 1} at (${x}, ${y}) ${orientation}`);
            currentShipIndex++;
        } else {
            console.log(`Cannot place ship at (${x}, ${y}) — try again.`);
        }

        if (currentShipIndex === shipsToPlace.length) {
            console.log("✅ All ships placed!");
            // Optionally disable the form or start the game
        }
        console.log(`Player 1 Gameboard after ${currentShipIndex} submission.`)
        console.table(player1.gameboard.getBoard());
    });

    document.getElementById("place-bomb").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        console.log(`Current player: ${currentPlayer.name}`);
        if (currentPlayer !== player1) return;

        const input = document.getElementById("ship-coordinate").value;
        const move = playerOneMove(input);
        if (!Array.isArray(move)) {
            console.log("Invalid move. Try again.");
            return;
        }

        opponent.receiveAttack(...move);
        console.log(`${opponent.name}'s Gameboard after attack:`);
        console.table(opponent.gameboard.getBoard());

        if (opponent.allShipsSunk()) {
            console.log(`${currentPlayer.name} wins!`);
            return;
        }

        [currentPlayer, opponent] = alternatePlayers(currentPlayer, player1, player2);

        // Now let computer play
        setTimeout(() => {
            const move = computerMove();
            opponent.receiveAttack(...move);
            console.log(`${opponent.name}'s Gameboard after attack`);
            console.table(opponent.gameboard.getBoard());

            if (opponent.allShipsSunk()) {
            console.log(`${currentPlayer.name} wins!`);
            return;
            }

            [currentPlayer, opponent] = alternatePlayers(currentPlayer, player1, player2);
        }, 1000); // wait a bit for visual pacing
    });   
}

export {playGame};