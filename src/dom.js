import "./game.js";
import { createPlayerBoard, shipsToPlace, player1, player2, computerMove, gameInProgress } from "./game.js";


let listenersAttached = false;
//Creating the cells
function createCells(){
    const board = document.getElementById("player-board");
    const oppBoard = document.getElementById("opponent-board");

    for (let i = 0; i < 100; i++) {
        const cell1 = document.createElement("div");
        cell1.classList.add("cell");
        cell1.dataset.x = i % 10;
        cell1.dataset.y = Math.floor(i / 10);
        board.appendChild(cell1);

        const cell2 = document.createElement("div");
        cell2.classList.add("cellOpp");
        cell2.dataset.x = i % 10;
        cell2.dataset.y = Math.floor(i / 10);
        oppBoard.appendChild(cell2);
    }
}

//Change orientation
let orientation = "vertical";
function changeOrientation(){
    const shipOrientation = document.getElementById("ships");


    if (currentShipIndex >= shipsToPlace.length) return;
    shipOrientation.style.gridTemplateRows = `repeat(${shipsToPlace[currentShipIndex].getLength()},33px)`;
    shipOrientation.addEventListener("click", (e) => {
        if (currentShipIndex >= shipsToPlace.length) return;
        orientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
        if(orientation==='horizontal'){
            shipOrientation.style.removeProperty("grid-template-rows");
            shipOrientation.style.gridTemplateColumns = `repeat(${shipsToPlace[currentShipIndex].getLength()},33px)`;
        }else{
            shipOrientation.style.removeProperty("grid-template-columns");
            shipOrientation.style.gridTemplateRows = `repeat(${shipsToPlace[currentShipIndex].getLength()},33px)`;
        }
    });
}

//Highlight the ship onto the board before placing
let currentShipIndex = 0;
function placeShip(){
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("mouseover", (e) => {
            if (currentShipIndex >= shipsToPlace.length) return;
            const x = parseInt(e.target.dataset.x, 10);
            const y = parseInt(e.target.dataset.y, 10);

            for (let i = 0; i < shipsToPlace[currentShipIndex].getLength(); i++) {
                const newX = orientation === "horizontal" ? x + i : x;
                const newY = orientation === "vertical" ? y + i : y;

                const targetCell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
                if (targetCell) {
                targetCell.classList.add("hover-effect");
                }
            }
        });

        cell.addEventListener("mouseout", (e) => {
            if (currentShipIndex >= shipsToPlace.length) return;
            const x = parseInt(e.target.dataset.x, 10);
            const y = parseInt(e.target.dataset.y, 10);

            for (let i = 0; i < shipsToPlace[currentShipIndex].getLength(); i++) {
                const newX = orientation === "horizontal" ? x + i : x;
                const newY = orientation === "vertical" ? y + i : y;
                
                const targetCell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
                if (targetCell) {
                    targetCell.classList.remove("hover-effect");
                }
            }
        });

        cell.addEventListener("click", (e) => {
            const x = parseInt(e.target.dataset.x, 10);
            const y = parseInt(e.target.dataset.y, 10);
            createPlayerBoard(x,y,orientation);
            // Prevent placing more ships than available
            if (currentShipIndex >= shipsToPlace.length) return;

            const length = shipsToPlace[currentShipIndex].getLength();

            // First, check if all cells are valid before placing
            let validPlacement = true;
            for (let i = 0; i < length; i++) {
                const newX = orientation === "horizontal" ? x + i : x;
                const newY = orientation === "vertical" ? y + i : y;

                const targetCell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
                if (!targetCell || targetCell.classList.contains("ship")) {
                    validPlacement = false;
                    break;
                }
            }

            if (!validPlacement) {
                return;
            }

            // If valid, place the ship visually and on the gameboard
            for (let i = 0; i < length; i++) {
                const newX = orientation === "horizontal" ? x + i : x;
                const newY = orientation === "vertical" ? y + i : y;
                const targetCell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
                if (targetCell) {
                    targetCell.classList.add("ship");
                }
            }

            // Advance to next ship
            currentShipIndex++;
            nextShip();
        });

    });
}

//Displaying the next ship for the user to place
function nextShip(){
    const shipContainer = document.getElementById("ships");
    shipContainer.innerHTML = "";

    if (currentShipIndex >= shipsToPlace.length) {
        shipContainer.style.gridTemplateColumns = "";
        shipContainer.style.gridTemplateRows = "";
        const yourShipsTitle = document.querySelector(".ships-container h2");
        yourShipsTitle.innerHTML = ``;
        return;
    }

    const length = shipsToPlace[currentShipIndex].getLength();
    for (let i = 0; i < length; i++) {
        const shipCells = document.createElement("div");
        shipCells.classList.add("shipCells");
        shipContainer.appendChild(shipCells);
    }

    // Set grid layout based on current orientation
    if (orientation === "horizontal") {
        shipContainer.style.gridTemplateRows = "";
        shipContainer.style.gridTemplateColumns = `repeat(${length}, 33px)`;
    } else {
        shipContainer.style.gridTemplateColumns = "";
        shipContainer.style.gridTemplateRows = `repeat(${length}, 33px)`;
    }
}

document.querySelector("#reset-game").addEventListener("click", () => {
    // 1. Reset key game state
    listenersAttached = false;
    currentShipIndex = 0;
    orientation = "vertical";  // Reset orientation

    // 2. Clear the boards completely
    document.getElementById("player-board").innerHTML = "";
    document.getElementById("opponent-board").innerHTML = "";

    // 3. Reset "Your Ships" title
    const yourShipsTitle = document.querySelector(".ships-container h2");
    yourShipsTitle.innerHTML = "Your Ships";

    // 4. Clear ship preview container
    const shipContainer = document.getElementById("ships");
    shipContainer.innerHTML = "";
    shipContainer.style.gridTemplateColumns = "";
    shipContainer.style.gridTemplateRows = "";

    // 5. Re-create cells and rebind everything
    createCells();        // 💥 Create new .cell elements
    placeShip();          // 💥 Reattach hover + click listeners
    nextShip();           // 💥 Show first ship preview

});


function playerAttack() {
  document.querySelector("#start-game").addEventListener("click", (e) => {
    if (currentShipIndex >= shipsToPlace.length && !listenersAttached) {
      listenersAttached = true;

      document.querySelectorAll(".cellOpp").forEach(cell => {
        cell.addEventListener("mouseover", (e) => {
          if (!gameInProgress) return;
          e.target.classList.add("hover-effect");
        });

        cell.addEventListener("mouseout", (e) => {
          e.target.classList.remove("hover-effect");
        });

        cell.addEventListener("click", (e) => {
          if (!gameInProgress) return;

          const x = parseInt(e.target.dataset.x, 10);
          const y = parseInt(e.target.dataset.y, 10);

          e.target.classList.remove("hover-effect");

          const wasHit = player2.gameboard.getBoard()[y][x];

          if (wasHit) {
            e.target.classList.add("hit");
          } else {
            e.target.classList.add("miss");
          }

          setTimeout(() => {
            if (player2.allShipsSunk()) {
                gameInProgress = false;
                removeHoverEffects();
                alert("Player 1 wins!");
            } else {
                // Computer's turn
                setTimeout(() => {
                showComputerAttackOnBoard();
                if (player1.allShipsSunk()) {
                    gameInProgress = false;
                    removeHoverEffects();
                }
                }, 1000);
            }
            }, 10); // even 10ms is enough
        });
      });
    }
  });
}


function showComputerAttackOnBoard() {
    if (!gameInProgress) return;

    const { x, y, wasHit } = computerMove();
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);

    if (!cell) return;

    if (wasHit) {
        cell.classList.add("hit");
    } else {
        cell.classList.add("miss");
    }
}

function removeHoverEffects() {
  document.querySelectorAll(".cellOpp.hover-effect").forEach(cell => {
    cell.classList.remove("hover-effect");
  });
}




createCells();
changeOrientation();
placeShip();
nextShip();
playerAttack();