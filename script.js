const startScreen = document.getElementById("start-screen");
const missionScreen = document.getElementById("mission-screen");
const gambitScreen = document.getElementById("gambit-screen");
const proposalScreen = document.getElementById("proposal-screen");
const endingScreen = document.getElementById("ending-screen");

const startButton = document.getElementById("start-button");
const dialogueNext = document.getElementById("dialogue-next");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const restartButton = document.getElementById("restart-button");

const rogue = document.getElementById("rogue");
const gambit = document.getElementById("gambit");
const map = document.getElementById("map");

const scoreElement = document.getElementById("score");
const missionStatus = document.getElementById("mission-status");
const gameMessage = document.getElementById("game-message");
const dialogueText = document.getElementById("dialogue-text");

let score = 0;
let missionComplete = false;
let gameStarted = false;

const speed = 4;

let roguePosition = {
    x: 35,
    y: 35
};

const keys = {};

const dialogueLines = [
    "Well, well... look who finally found me.",
    "I was starting to wonder if you'd ever make it.",
    "You know, chère... I didn't exactly make this easy for you.",
    "But there's something I've been meaning to ask you.",
    "Something I think deserves more than a card trick."
];

let dialogueIndex = 0;

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(function(section) {
        section.classList.remove("active");
    });

    screen.classList.add("active");
}

function resetGame() {
    score = 0;
    missionComplete = false;
    gameStarted = true;

    scoreElement.textContent = "000000";
    missionStatus.textContent = "FIND GAMBIT";
    gameMessage.textContent = "FIND GAMBIT. HE IS SOMEWHERE IN THE CITY...";

    roguePosition.x = 35;
    roguePosition.y = 35;

    rogue.style.left = roguePosition.x + "px";
    rogue.style.bottom = roguePosition.y + "px";

    document.querySelectorAll(".collectible").forEach(function(item) {
        item.dataset.collected = "false";
        item.style.display = "block";
    });
}

startButton.addEventListener("click", function() {
    startScreen.style.display = "none";
    missionScreen.style.display = "flex";

    resetGame();
});

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function moveRogue() {
    if (!gameStarted) {
        requestAnimationFrame(moveRogue);
        return;
    }

    let moved = false;

    if (keys["arrowleft"] || keys["a"]) {
        roguePosition.x -= speed;
        moved = true;
    }

    if (keys["arrowright"] || keys["d"]) {
        roguePosition.x += speed;
        moved = true;
    }

    if (keys["arrowup"] || keys["w"]) {
        roguePosition.y += speed;
        moved = true;
    }

    if (keys["arrowdown"] || keys["s"]) {
        roguePosition.y -= speed;
        moved = true;
    }

    const maxX = map.clientWidth - rogue.offsetWidth;
    const maxY = map.clientHeight - rogue.offsetHeight;

    roguePosition.x = Math.max(0, Math.min(roguePosition.x, maxX));
    roguePosition.y = Math.max(0, Math.min(roguePosition.y, maxY));

    rogue.style.left = roguePosition.x + "px";
    rogue.style.bottom = roguePosition.y + "px";

    if (moved) {
        checkCollectibles();
        checkGambit();
    }

    requestAnimationFrame(moveRogue);
}

function checkCollectibles() {
    const rogueRect = rogue.getBoundingClientRect();

    document.querySelectorAll(".collectible").forEach(function(item) {
        if (item.dataset.collected === "true") {
            return;
        }

        const itemRect = item.getBoundingClientRect();

        const distanceX = Math.abs(
            rogueRect.left - itemRect.left
        );

        const distanceY = Math.abs(
            rogueRect.top - itemRect.top
        );

        if (distanceX < 35 && distanceY < 35) {
            item.dataset.collected = "true";
            item.style.display = "none";

            if (item.classList.contains("heart")) {
                score += 100;
                gameMessage.textContent = "HEART COLLECTED. +100";
            } else {
                score += 250;
                gameMessage.textContent = "CARD COLLECTED. +250";
            }

            scoreElement.textContent = String(score).padStart(6, "0");
        }
    });
}

function checkGambit() {
    if (missionComplete) {
        return;
    }

    const rogueRect = rogue.getBoundingClientRect();
    const gambitRect = gambit.getBoundingClientRect();

    const distanceX = Math.abs(
        rogueRect.left - gambitRect.left
    );

    const distanceY = Math.abs(
        rogueRect.top - gambitRect.top
    );

    if (distanceX < 55 && distanceY < 55) {
        completeMission();
    }
}

function completeMission() {
    missionComplete = true;

    score += 1000;

    scoreElement.textContent = String(score).padStart(6, "0");

    missionStatus.textContent = "MISSION COMPLETE";
    gameMessage.textContent = "GAMBIT FOUND. OBJECTIVE COMPLETE.";

    setTimeout(function() {
        startGambitScene();
    }, 1500);
}

function startGambitScene() {
    showScreen(gambitScreen);

    dialogueIndex = 0;

    dialogueText.textContent = dialogueLines[dialogueIndex];
}

dialogueNext.addEventListener("click", function() {
    dialogueIndex++;

    if (dialogueIndex < dialogueLines.length) {
        dialogueText.textContent = dialogueLines[dialogueIndex];
    } else {
        showScreen(proposalScreen);
    }
});

yesButton.addEventListener("click", function() {
    document.getElementById("ending-icon").textContent = "♥";

    document.getElementById("ending-title").textContent =
        "MISSION COMPLETE";

    document.getElementById("ending-text").textContent =
        "YOU CHOSE GAMBIT. HE KNEW YOU WOULD.";

    showScreen(endingScreen);
});

noButton.addEventListener("click", function() {
    document.getElementById("ending-icon").textContent = "♦";

    document.getElementById("ending-title").textContent =
        "MISSION... FAILED?";

    document.getElementById("ending-text").textContent =
        "GAMBIT MAY TRY TO WIN YOUR HEART AGAIN.";

    showScreen(endingScreen);
});

restartButton.addEventListener("click", function() {
    gameStarted = false;
    showScreen(startScreen);
});

moveRogue();
