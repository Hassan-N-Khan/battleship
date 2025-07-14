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
let gameInProgress = false;

function createPlayerBoard(xCoord,yCoord,orientation){
    if (currentShipIndex >= shipsToPlace.length) {
        return;
    }
    const x = parseInt(xCoord, 10);
    const y = parseInt(yCoord, 10);

    if (
        isNaN(x) || isNaN(y) ||
        x < 0 || x > 9 || y < 0 || y > 9 ||
        (orientation !== "horizontal" && orientation !== "vertical")
    ) {
        return;
    }

    const ship = shipsToPlace[currentShipIndex];
    if (player1.canPlaceShip(ship, x, y, orientation)) {
        player1.placeShip(ship, x, y, orientation);
        currentShipIndex++;
    } else {
        return;
    }

    if (currentShipIndex === shipsToPlace.length) {
    }
    return true;
}

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
            player2.placeShip(ship, x, y, orientation);
        } else {
            i--;
        }
    }
}

function alternatePlayers(currentPlayer, player1, player2) {
    return currentPlayer === player1
        ? [player2, player1]
        : [player1, player2];
}

function playerOneMove(x, y) {
    const parsedX = parseInt(x, 10);
    const parsedY = parseInt(y, 10);

    if (isNaN(parsedX) || isNaN(parsedY) || parsedX < 0 || parsedX > 9 || parsedY < 0 || parsedY > 9) {
        return false; // failed
    }

    const cell = player2.gameboard.getBoard()[parsedY][parsedX];
    if (cell === true || cell === false) {
        return false; // failed
    }

    player2.receiveAttack(parsedX, parsedY);
    return true; // success
}

function computerMove() {
    let x, y, wasHit;

    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    } while (
        player1.gameboard.isAlreadyAttacked(x, y)
    );

    wasHit = player1.receiveAttack(x, y); // returns true/false

    return { x, y, wasHit };
}

function playGame() {
    let currentPlayer = player1;
    let opponent = player2;
    createComputerBoard();

    document.querySelectorAll(".cellOpp").forEach(cell => {
        cell.addEventListener("click", (event) => {
            if (!gameInProgress) return; // 💥 ignore clicks if game is not active
            if (currentPlayer !== player1) return; // prevent player clicking during computer's turn

            const x = parseInt(event.currentTarget.dataset.x, 10);
            const y = parseInt(event.currentTarget.dataset.y, 10);

            const moveSuccessful = playerOneMove(x, y);

            if (!moveSuccessful) {
                return; // Don't switch turns if invalid
            }


            if (player2.allShipsSunk()) {
                gameInProgress = false;
                return;
            }

            // Switch turns
            [currentPlayer, opponent] = alternatePlayers(currentPlayer, player1, player2);

            // Now let computer play
            setTimeout(() => {
                if (!gameInProgress) return; // 💥 ignore clicks if game is not active
                const { x: compX, y: compY, wasHit } = computerMove()
                player1.receiveAttack(compX, compY);


                if (player1.allShipsSunk()) {
                    gameInProgress = false;
                    return;
                }

                [currentPlayer, opponent] = alternatePlayers(currentPlayer, player1, player2);
            }, 1000);
        });
    });
}

const startButton = document.querySelector("#start-game");
startButton.addEventListener("click", (e)=>{
    if(currentShipIndex < shipsToPlace.length){
        return;
    }
    if(gameInProgress===false){
        gameInProgress = true; 
        playGame();
    }else{
    }
});

const resartButton = document.querySelector("#reset-game");
resartButton.addEventListener("click", (e)=>{
    gameInProgress = false; // 💥 stop game logic
    player1.gameboard.reset();
    player2.gameboard.reset();
    currentShipIndex = 0;
});

export {playGame, shipsToPlace, createPlayerBoard, player2, player1, computerMove, gameInProgress};