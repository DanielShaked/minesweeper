'use strict';

//Globals variable//
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
var gBoard;
var gFirstPos;
var gLives;
var gHints;
var gSafeClicks;

//Globals obj//
var gLevel = { rows: 8, cols: 8, mines: 12 }
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secPassed: 0, FlagInUse: 0, isHinted: false, isFirstClicked: false }

//Intervals//
var stopWatchInId;

localStorage.setItem('bestTime', 0);

function init() {
    document.querySelector('.emoji').src = "img/start.png"
    if (stopWatchInId) clearInterval(stopWatchInId);
    playSound('sounds/start.mp3')
    gBoard = buildBoard()
    renderBoard();
    gGame = { isOn: true, shownCount: 0, markedCount: 0, secPassed: 0, FlagInUse: 0, isHinted: false, isFirstClicked: false }
    gFirstPos = { i: null, j: null }
    gSafeClicks = 3;
    gHints = ['💡', '💡', '💡'];
    gLives = ['\u2764', '\u2764', '\u2764'];
    renderLives();
    renderHints();
    updateSafeClick(gSafeClicks);

}


function cellMarked(elCell, e, posI, posJ) {
    e.preventDefault();

    var cell = gBoard[posI][posJ];
    var location = getPos(posI, posJ)

    if (!cell.isMarked && gGame.FlagInUse < gLevel.mines) {
        playSound('sounds/flag.mp3')
        cell.isMarked = true;
        cell.isShown = true;
        elCell.innerText = FLAG
        elCell.classList.add('marked');
        gGame.FlagInUse++
        if (gGame.FlagInUse >= 0.9 * gLevel.mines) checkVictory();
    }
    else if (cell.isMarked) {
        playSound('sounds/unflag.mp3')
        cell.isMarked = false;
        cell.isShown = false;
        elCell.innerText = EMPTY
        elCell.classList.remove('marked');
        renderCell(location, EMPTY)
        gGame.FlagInUse--
    }
}


function cellClicked(elCell, posI, posJ) {
    if (!gGame.isOn) return;
    // if (!gStopWatchInterval) displayStopWatch();
    if (!gGame.isFirstClicked) {
        gFirstPos = { i: posI, j: posJ };
        setRandomMines();
        setMinesNegsCount();
        displayStopWatch2();
    }
    gGame.isFirstClicked = true;

    var cell = gBoard[posI][posJ];
    var location = getPos(posI, posJ)

    if (cell.isMarked || cell.isShown) return;

    if (gGame.isHinted) {
        gHints.pop();
        showNegsHinted(posI, posJ, true);
        renderHints();
        setTimeout(() => {
            toggleIshHinted(false)
            showNegsHinted(posI, posJ, false);
        }, 600);
        return;
    }

    if (cell.isMine && !gGame.isHinted) {
        if (gLives.length > 1) {
            playSound('sounds/wrong.mp3')
            gLives.pop()
            renderLives();
            return;
        } else {
            gLives.length = 0;
            clearInterval(stopWatchInId);
            renderLives();
            revealMines();
            renderCell(location, MINE);
            playSound('sounds/lose.mp3');
            setEmoji(false);
            return;
        }
    }


    playSound('sounds/click.mp3');

    if (cell.minesAroundCount) {
        elCell.classList.add('opened')
        elCell.innerText = cell.minesAroundCount;
        cell.isShown = true;

    } else {
        elCell.classList.add('opened')
        revealNegs(posI, posJ);

    }

    cell.isShown = true;
    if (gGame.FlagInUse >= 0.9 * gLevel.mines) checkVictory();

}


function countNegsOfCell(posI, posJ) {
    var countNegs = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[i][j].isMine) {
                countNegs++;
            }
        }
    }
    return countNegs;
}


function setRandomMines() {
    var vaildPoses = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (i !== gFirstPos.i && j !== gFirstPos.j) vaildPoses.push({ i, j });
        }
    }
    for (var i = 0; i < gLevel.mines; i++) {
        var pos = drawNum(vaildPoses);
        //update Model
        gBoard[pos.i][pos.j].isMine = true;
        //update dom
        document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`).classList.add('mine');
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var negsAmount = countNegsOfCell(i, j); // DONE: build Function check negs for each one
            gBoard[i][j].minesAroundCount = negsAmount;
        }
    }
}




function checkVictory() {
    if (gGame.FlagInUse === gLevel.mines && isShown()) {
        clearInterval(stopWatchInId);
        playSound('sounds/win.mp3')
        setEmoji(true)
        var bestTime = +localStorage.getItem('bestTime');
        if (bestTime > gGame.secPassed || bestTime === 0) {
            localStorage.setItem('bestTime', gGame.secPassed);
            updateBestTime(gGame.secPassed);
        }
    }
}



function toggleIshHinted(isHinted) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gGame.isHinted = isHinted;
        }
    }
}



function safeClick() {
    if (!gSafeClicks) return;
    gSafeClicks--
    updateSafeClick(gSafeClicks)
    var location = getSafeCell();
    console.log('location:', location);
    var elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`);
    elCell.classList.add('safe');
    var cell = gBoard[location.i][location.j];
    setTimeout(() => {
        console.log('elCell:', elCell);

        elCell.classList.remove('safe');
        elCell.innerText = (cell.minesAroundCount) ? cell.minesAroundCount : '';
    }, 2000);
}

function getSafeCell() {
    var safeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                safeCells.push({ i, j });
            }
        }
    }
    return safeCells[getRandomInt(0, safeCells.length)]
}