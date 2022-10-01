let score = 0;
let nextMoveDown;
let grid;
let peiceCoords = [[],[],[],[],[]];
let playing = true;
let peices = {
    "L":[[1, 1], [1,2], [1, 3], [2, 3], ["DarkOrange"]],
    "Z":[[1, 1], [2, 1], [2, 2], [2, 3], ["Red"]],
    "S":[[1, 2], [2, 1], [2, 2], [3, 1], ["LimeGreen"]],
    "T":[[1, 1], [2, 1], [2, 2], [3, 1], ["BlueViolet"]],
    "O":[[1, 1], [1, 2], [2, 1], [2, 2], ["Gold"]],
    "I":[[1, 1], [1, 2], [1, 3], [1, 4], ["Aqua"]]
}
function tetris() {
    // Set up the game
    hideButton("startButton");
    createGrid(20, 10);
    const bgDiv = document.createElement("div");
    bgDiv.setAttribute("id", "tetris-bg");
    bgDiv.style.position = "relative";
    document.getElementById("greybox").appendChild(bgDiv);
    addGridToPage("tetris-bg");
    createEventListener();
    // Start the game
    let keys = Object.keys(peices);
    let randomPeice = peices[keys[Math.floor(keys.length * Math.random())]];
    spawnNewPeice(randomPeice);
    nextMoveDown = setTimeout( function() {
        moveDown()
    }, 1000);
}
function createGrid(m, n) {
    grid = new Array(m); // New array 20 long
    for (let i = 0; i < m; i++) {
        grid[i] = new Array(n) // Create rows of grid
        for (let j = 0; j < n; j++) {
            var left = (j*30)+1;
            var top = (i*30)+1;
            grid[i][j] = document.createElement('div');
            grid[i][j].setAttribute("id", "row"+i+"col"+j);
            grid[i][j].setAttribute("class", "block");
            grid[i][j].style.position = "absolute";
            grid[i][j].style.width = "28px";
            grid[i][j].style.height = "28px";
            grid[i][j].style.left = left+"px";
            grid[i][j].style.top = top+"px";
            grid[i][j].style.backgroundColor = "transparent";
        }
    }
}
function hideButton(buttonID) {
    document.getElementById(buttonID).style.display = "none";
    document.getElementById(buttonID).disabled = true;
}
function addGridToPage(parent) {
    grid.forEach(row => {
        row.forEach(column => {
            document.getElementById(parent).appendChild(column);
        })
    });
}
function spawnNewPeice(peice) {
    checkForFullLines();
    let gameOverCheck = false;
    for (let i = 0; i < 4; i++) {
        peiceCoords[i][0] = peice[i][0]+3;
        peiceCoords[i][1] = peice[i][1]-1;
    }
    peiceCoords[4][0] = peice[4][0]
    peiceCoords.slice(0, 4).forEach(coord => {
        if (grid[coord[1]][coord[0]].style.backgroundColor === "transparent") {
            grid[coord[1]][coord[0]].style.backgroundColor = peiceCoords[4][0];
        } else {
            gameOverCheck = true;
        }
    })
    if (gameOverCheck) {
        gameOver();
    } else {
        score += 1;
    }
}
function moveDown() {
    let nextPos = [[], [], [], [], []];
    for (let i = 0; i < 4; i++) {
        nextPos[i][0] = peiceCoords[i][0];
        nextPos[i][1] = peiceCoords[i][1]+1;
    }
    nextPos[4][0] = peiceCoords[4][0];
    let newPeice = false;
    nextPos.slice(0, 4).forEach(coord => {
        if (coord[1] > 19) {
            newPeice = true;
        } else {
            let notIncluded = true;
            let notTransparent = true;
            peiceCoords.slice(0, 4).forEach(oldCoord => {
                if (oldCoord[0] === coord[0] && oldCoord[1] == coord[1]) {
                    notIncluded = false;
                };
                if (grid[coord[1]][coord[0]].style.backgroundColor === "transparent") {
                    notTransparent = false;
                };
            })
            if (notTransparent && notIncluded) {
                newPeice = true;
            };
        }
    })
    if (!newPeice) {
        peiceCoords.slice(0, 4).forEach(coord => {
            if (!nextPos.includes(coord)) {
                grid[coord[1]][coord[0]].style.backgroundColor = "transparent";
            }
        })
        nextPos.slice(0, 4).forEach(coord => {
            if (grid[coord[1]][coord[0]].style.backgroundColor === "transparent") {
                grid[coord[1]][coord[0]].style.backgroundColor = peiceCoords[4][0];
            }
        })
        nextMoveDown = setTimeout( function() {
            moveDown();
        }, 1000);
        for (let i = 0; i < 4; i++) {
            peiceCoords[i][0] = nextPos[i][0];
            peiceCoords[i][1] = nextPos[i][1];
        }
    } else {
        let keys = Object.keys(peices);
        let randomPeice = peices[keys[Math.floor(keys.length * Math.random())]];
        spawnNewPeice(randomPeice);
        if (playing === false) {
            return;
        }
        nextMoveDown = setTimeout( function() {
            moveDown()
        }, 1000);
    }
}
// Add stuff when game ends???
function gameOver() {
    playing = false;
    clearTimeout(nextMoveDown);
    addScore();
    greyOut(document.getElementById("tetris-bg"));
    leaderButton = createViewLeaderboardButton();
    addElementToPage("greybox", leaderButton);
    scoreText = createScoreDiv();
    addElementToPage("greybox", scoreText);
    playButton = createReplayButton();
    addElementToPage("greybox", playButton);
}
function createEventListener() {
    addEventListener("keydown", function (event) {
        // Check if already listened to
        if (event.defaultPrevented || playing === false) {
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                // Move down
                playerMoveDown();
                break;
            case "ArrowLeft":
                // Move left
                playerMoveLeft();
                break;
            case "ArrowRight":
                // Move right
                playerMoveRight();
                break;
            case "ArrowUp":
                // Rotate peice
                rotate();
            default:
                // Key event is irrelevant
                return;
        }

        // Set to make sure not handeled twice
        event.preventDefault();
    }, true);
}
function playerMoveDown() {
    if (playing) {
        clearTimeout(nextMoveDown);
        moveDown();
    }
}
function playerMoveLeft() {
    if (playing) {
        let ableToMove = true;
        peiceCoords.slice(0, 4).forEach(coord => {
            if (coord[0] < 1) {
                ableToMove = false;
            } else {
                let notPartOfSelf = true;
                peiceCoords.slice(0, 4).forEach(check => {
                    if (check[1] === coord[1] && check[0] === coord[0]-1) {
                        notPartOfSelf = false;
                    }
                });
                if (grid[coord[1]][coord[0]-1].style.backgroundColor !== "transparent" && notPartOfSelf) {
                    ableToMove = false;
                };
            }
        });
        if (ableToMove) {
            for (let i = 0; i < 4; i++) {
                peiceCoords[i][0] = peiceCoords[i][0]-1;
            };
            peiceCoords.slice(0, 4).forEach(coord => {
                let replace = true;
                grid[coord[1]][coord[0]].style.backgroundColor = peiceCoords[4][0];
                peiceCoords.slice(0, 4).forEach(currentCoord => {
                    if ((currentCoord[1] === coord[1]) && (currentCoord[0] === coord[0]+1)) {
                        replace = false;
                    }
                });
                if (replace) {
                    grid[coord[1]][coord[0]+1].style.backgroundColor = "transparent";
                }
            });
        }
    }
}
function playerMoveRight() {
    if (playing) {
        let ableToMove = true;
        peiceCoords.slice(0, 4).forEach(coord => {
            if (coord[0] > 8) {
                ableToMove = false;
            } else {
                let notPartOfSelf = true;
                peiceCoords.slice(0, 4).forEach(check => {
                    if (check[1] === coord[1] && check[0] === coord[0]+1) {
                        notPartOfSelf = false;
                    }
                });
                if (grid[coord[1]][coord[0]+1].style.backgroundColor !== "transparent" && notPartOfSelf) {
                    ableToMove = false;
                };
            }
        });
        if (ableToMove) {
            for (let i = 0; i < 4; i++) {
                peiceCoords[i][0] = peiceCoords[i][0]+1;
            };
            peiceCoords.slice(0, 4).forEach(coord => {
                let replace = true;
                grid[coord[1]][coord[0]].style.backgroundColor = peiceCoords[4][0];
                peiceCoords.slice(0, 4).forEach(currentCoord => {
                    if ((currentCoord[1] === coord[1]) && (currentCoord[0] === coord[0]-1)) {
                        replace = false;
                    }
                });
                if (replace) {
                    grid[coord[1]][coord[0]-1].style.backgroundColor = "transparent";
                }
            });
        }
    }
}
function checkForFullLines() {
    rowsToRemove = [];
    rowNum = 0;
    grid.forEach(row => {
        full = true;
        row.forEach(div => {
            if (div.style.backgroundColor === "transparent") {
                full = false;
            }
        });
        if (full) {
            rowsToRemove.push(rowNum);
        }
        rowNum++;
    });
    for (let i = rowsToRemove.length-1; i >= 0; i--) {
        removeRow(rowsToRemove[i]);
    }
}
function removeRow(rowNum) {
    for (let i = rowNum; i > 0; i--) {
        for (let j = 0; j < 10; j++) {
            grid[i][j].style.backgroundColor = grid[i-1][j].style.backgroundColor;
        }
    }
    grid[0].forEach(div => {
        div.style.backgroundColor = "transparent";
    });
}
function addScore() {
    let request = new XMLHttpRequest();
    let url = 'addScore.php';
    let params = 'playerScore='+score;

    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(params);
}
function createViewLeaderboardButton() {
    link = document.createElement('a');
    link.setAttribute("href", "leaderboard.php");
    link.setAttribute("id", "leaderboardButton");
    button = document.createElement('button');
    button.setAttribute("type", "button");
    button.textContent = "View Leaderboard";
    link.appendChild(button);
    return link;
}
function addElementToPage(parent, element) {
    document.getElementById(parent).appendChild(element);
}
function greyOut(div) {
    div.style.backgroundColor = "grey";
    div.style.opacity = "0.5";
}
function rotate() {
    able = true;
    switch (peiceCoords[4][0]) {
        case "DarkOrange":
            newCoords = [[], [], [], [], ["DarkOrange"]];
            if (peiceCoords[0][0] == peiceCoords[3][0]-1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]-3, peiceCoords[3][1]-1];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]-1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]+1, peiceCoords[3][1]-3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]+3, peiceCoords[3][1]+1];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]+1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]-1, peiceCoords[3][1]+3];
            }
            break;
        case "Red":
            newCoords = [[], [], [], [], ["Red"]];
            if (peiceCoords[0][0] == peiceCoords[3][0]-1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]];
                newCoords[3] = [peiceCoords[3][0]-3, peiceCoords[3][1]-1];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]-1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0], peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]+1, peiceCoords[3][1]-3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]];
                newCoords[3] = [peiceCoords[3][0]+3, peiceCoords[3][1]+1];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]+1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0], peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]-1, peiceCoords[3][1]+3];
            }
            break;
        case "LimeGreen":
            newCoords = [[], [], [], [], ["LimeGreen"]];
            if (peiceCoords[0][0] == peiceCoords[3][0]-2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0], peiceCoords[1][1]+2];
                newCoords[2] = [peiceCoords[2][0]-1, peiceCoords[2][1]+1];
                newCoords[3] = [peiceCoords[3][0]-1, peiceCoords[3][1]+3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]-1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-2, peiceCoords[1][1]];
                newCoords[2] = [peiceCoords[2][0]-1, peiceCoords[2][1]-1];
                newCoords[3] = [peiceCoords[3][0]-3, peiceCoords[3][1]-1];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0], peiceCoords[1][1]-2];
                newCoords[2] = [peiceCoords[2][0]+1, peiceCoords[2][1]-1];
                newCoords[3] = [peiceCoords[3][0]+1, peiceCoords[3][1]-3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+1) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+2, peiceCoords[1][1]];
                newCoords[2] = [peiceCoords[2][0]+1, peiceCoords[2][1]+1];
                newCoords[3] = [peiceCoords[3][0]+3, peiceCoords[3][1]+1];
            }
            break;
        case "BlueViolet":
            newCoords = [[], [], [], [], ["BlueViolet"]];
            if (peiceCoords[0][0] == peiceCoords[3][0]-2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]];
                newCoords[3] = [peiceCoords[3][0]-2, peiceCoords[3][1]+2];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]-2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0], peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]-2, peiceCoords[3][1]-2];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]];
                newCoords[3] = [peiceCoords[3][0]+2, peiceCoords[3][1]-2];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]+2) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0], peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]+2, peiceCoords[3][1]+2];
            }
            break;
        case "Aqua":
            newCoords = [[], [], [], [], ["Aqua"]];
            if (peiceCoords[0][1] == peiceCoords[3][1]-4) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]-3, peiceCoords[3][1]-3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]+4) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]-1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]-2];
                newCoords[3] = [peiceCoords[3][0]+3, peiceCoords[3][1]-3];
            } else if (peiceCoords[0][1] == peiceCoords[3][1]+4) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]+1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]+2, peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]+3, peiceCoords[3][1]+3];
            } else if (peiceCoords[0][0] == peiceCoords[3][0]-4) {
                newCoords[0] = peiceCoords[0];
                newCoords[1] = [peiceCoords[1][0]-1, peiceCoords[1][1]+1];
                newCoords[2] = [peiceCoords[2][0]-2, peiceCoords[2][1]+2];
                newCoords[3] = [peiceCoords[3][0]-3, peiceCoords[3][1]+3];
            }
            break;
        default:
            newCoords = [[], [], [], [], []];
            newCoords[0] = peiceCoords[0];
            newCoords[1] = peiceCoords[1];
            newCoords[2] = peiceCoords[2];
            newCoords[3] = peiceCoords[3];
            newCoords[4] = peiceCoords[4];
            break;
    };
    for (let i = 0; i < 4; i++) {
        if (newCoords[i][0] > 9 || newCoords[i][0] < 0 || newCoords[i][1] < 0) {
            return;
        }
        if (grid[newCoords[i][1]][newCoords[i][0]].style.backgroundColor !== "transparent") {
            able = false;
        };
        if (peiceCoords[i][0] === newCoords[i][0] && peiceCoords[i][1] == newCoords[i][1]) {
            able = true;
        };
        if (!able) {
            return;
        };
    };
    peiceCoords.slice(0, 4).forEach(coordinate => {
        grid[coordinate[1]][coordinate[0]].style.backgroundColor = "transparent";
    });
    newCoords.slice(0, 4).forEach(coordinate => {
        grid[coordinate[1]][coordinate[0]].style.backgroundColor = newCoords[4];
    });
    for (let i = 0; i < 4; i++) {
        peiceCoords[i][0] = newCoords[i][0];
        peiceCoords[i][1] = newCoords[i][1];
       }
}
function createScoreDiv() {
    scoreText = document.createElement('h1');
    scoreText.setAttribute("id", "scoreText");
    scoreText.textContent = "Score: "+score;
    return scoreText;
}
function createReplayButton() {
    link = document.createElement('a');
    link.setAttribute("href", "tetris.php");
    link.setAttribute("id", "replayButton");
    button = document.createElement('button');
    button.setAttribute("type", "button");
    button.textContent = "Play Again";
    link.appendChild(button);
    return link;
}
