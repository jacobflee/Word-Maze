import { startGame } from "./game.js"
import { setAppHeight } from './helper.js'


const API_URL = window.location.host;

const domElements = {
    mainMenuContainer: document.getElementById("mainMenuContainer"),
    gameContainer: document.getElementById("gameContainer"),
    usernameForm: document.getElementById("usernameForm"),
    usernameInput: document.querySelector("#usernameForm input"),
    gameModeButtons: document.querySelectorAll(".gameModeButton"),
    backButtons: document.querySelectorAll(".backButton"),
    gameTimer: document.getElementById('gameTimer'),
    pageContainers: document.querySelectorAll(".pageContainer"),
    resultsContainer: document.getElementById('resultsContainer')
}


function init() {
    // sets app height first so css variables can render
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    changePage(domElements.mainMenuContainer);

    // check if username exists in local storage
    if (localStorage.getItem("username")) domElements.usernameInput.value = localStorage.getItem("username");

    // js workaround for dynamically sized username text input
    domElements.usernameInput.style.width = `${Math.max(domElements.usernameInput.value.length, 15)}ch`;

    // on submit of username
    domElements.usernameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        document.activeElement.blur();
        localStorage.setItem("username", domElements.usernameInput.value);
    });

    // set back buttons to return to main menu
    domElements.backButtons.forEach((backButton) => backButton.onclick = () => changePage(domElements.mainMenuContainer));

    // handle game mode selection
    domElements.gameModeButtons.forEach((gameModeButton) => {
        gameModeButton.onclick = () => {
            const gameMode = gameModeButton.querySelector(".gameModeText").textContent;
            gameModeSelection(gameMode);
        };
    })
}


async function gameModeSelection(gameMode) {
    if (gameMode === "Timed") {
        domElements.backButtons.forEach((backButton) => backButton.style.display = 'none');
        domElements.gameTimer.style.display = '';
        const gameData = await getGameboard();
        startGame(true, gameData);
        changePage(domElements.gameContainer);
    } else if (gameMode === "Free Play") {
        domElements.backButtons.forEach((backButton) => backButton.style.display = '');
        domElements.gameTimer.style.display = 'none';
        const gameData = await getGameboard();
        startGame(false, gameData);
        changePage(domElements.gameContainer);
    } else if (gameMode === "VS Random") {
        // implement multiplayer vs random
    } else if (gameMode === "VS Friend") {
        // implement multiplayer vs friend
    } else throw Error("Invalid game mode");
}


function changePage(page) {
    domElements.pageContainers.forEach((pageContainer) => pageContainer.style.display = 'none');
    page.style.display = '';
}


async function getGameboard() {
    try {
        const url = '/get_gameboard';
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw Error(data.message);
        return data;
    } catch (error) {
        console.error(error);
    }
}

init()
gameModeSelection("Timed");


// // 2. Set a user as online
// async function setUserOnline(username) {
//     try {
//         const url = `${API_URL}/user_online`;
//         const params = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username }),
//         };
//         const response = await fetch(url, params);
//         const data = await response.json();
//         if (!response.ok) throw Error(data.message);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }

// // 3. Set a user as offline
// async function setUserOffline(username) {
//     try {
//         const url = `${API_URL}/user_offline`
//         const params = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username }),
//         };
//         const response = await fetch(url, params);
//         const data = await response.json();
//         if (!response.ok) throw Error(data.message);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }

// // 4. Get online users
// async function getOnlineUsers() {
//     try {
//         const url = `${API_URL}/get_online_users`;
//         const response = await fetch(url);
//         const data = await response.json();
//         if (!response.ok) throw Error(data.message);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }

// // 5. Initiate a multiplayer match
// async function initiateMatch(username1, username2) {
//     try {
//         const url = `${API_URL}/initiate_match`;
//         const params = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username1, username2 }),
//         };
//         const response = await fetch(url, params);
//         const data = await response.json();
//         if (!response.ok) throw Error(data.message);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }

// const gameboard = await getGameboard();
// console.log(gameboard);

// const aliceStatus = await setUserOnline('Alice');
// console.log(aliceStatus);

// const bobStatus = await setUserOnline('Bob');
// console.log(bobStatus);

// const onlineUsers = await getOnlineUsers();
// console.log(onlineUsers);

// const aliceRequestsBob = await initiateMatch('Alice', 'Bob');
// console.log(aliceRequestsBob);

// const bobRequestsAlice = await initiateMatch('Bob', 'Alice');
// console.log(bobRequestsAlice);