let themes;
let players = [];
let currentTheme;
let currentPlayerIndex = 0;
let impostorIndex;
let chosenWord;

fetch("themes.json")
  .then((response) => response.json())
  .then((data) => {
    themes = data;
  })
  .catch((error) => console.error("Error loading themes:", error));

function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}

document.getElementById("start-game").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#player-inputs input");
  players = Array.from(inputs)
    .map((input) => input.value.trim())
    .filter((name) => name);

  if (players.length < 2) {
    alert("Please enter at least 2 players.");
    return;
  }

  switchScreen("start-screen", "theme-screen");

  const dice = ["P", "O", "A", "M"];
  const themeKey = dice[Math.floor(Math.random() * dice.length)];
  currentTheme = themes[themeKey];
  document.getElementById("theme-name").textContent = currentTheme.name;
});

document.getElementById("start-round").addEventListener("click", () => {
  const words = currentTheme.words;
  impostorIndex = Math.floor(Math.random() * players.length); // Escolher o impostor
  chosenWord = words[Math.floor(Math.random() * words.length)]; // Palavra para os jogadores

  players = players.map((name, index) => ({
    name,
    isImpostor: index === impostorIndex,
  }));

  currentPlayerIndex = 0;
  switchScreen("theme-screen", "player-screen");
  showPlayer();
});

function showPlayer() {
  const player = players[currentPlayerIndex];
  document.getElementById("current-player").textContent = `Player: ${player.name}`;
  const result = player.isImpostor
    ? "You are the impostor! Try to blend in."
    : `Your word: ${chosenWord}`;
  document.getElementById("player-result").textContent = result;
}

document.getElementById("next-player").addEventListener("click", () => {
  currentPlayerIndex++;
  if (currentPlayerIndex < players.length) {
    showPlayer();
  } else {
    switchScreen("player-screen", "final-screen");
    document.getElementById("final-theme").textContent = `Theme: ${currentTheme.name}`;
  }
});

document.getElementById("restart-game").addEventListener("click", () => {
  switchScreen("final-screen", "start-screen");
});
