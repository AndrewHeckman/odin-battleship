import "../css/main.css";
import Game from "./game";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#reset").addEventListener("click", () => {
    location.reload();
  });
  new Game();
});