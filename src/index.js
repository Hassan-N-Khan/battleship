import "./styles.css";
import "./game.js";
import { playGame } from "./game.js";


const board = document.getElementById("player-board");
const oppBoard = document.getElementById("opponent-board");

for (let i = 0; i < 100; i++) {
  const cell1 = document.createElement("div");
  cell1.classList.add("cell");
  cell1.dataset.x = i % 10;
  cell1.dataset.y = Math.floor(i / 10);
  board.appendChild(cell1);

  const cell2 = document.createElement("div");
  cell2.classList.add("cell");
  cell2.dataset.x = i % 10;
  cell2.dataset.y = Math.floor(i / 10);
  oppBoard.appendChild(cell2);
}

playGame();