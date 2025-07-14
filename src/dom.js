import "./game.js";
import { createPlayerBoard, shipsToPlace } from "./game.js";

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
        console.log(`Orientation is: ${orientation}`);
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
                console.log("Invalid placement. Try again.");
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

createCells();
changeOrientation();
placeShip();
nextShip();