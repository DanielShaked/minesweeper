'use strict'

function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += `<tr>`;
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = '';
            var setDataI = `data-i = ${i}`;
            var setDataJ = `data-j = ${j}`;

            strHtml += `<td ${setDataI} ${setDataJ}  oncontextmenu="cellMarked(this,event,${i},${j})" onclick="cellClicked(this,${i},${j})">
            ${cell}
            </td>`
        }
        strHtml += `</tr>`
    }
    var elBoard = document.querySelector('.main-board');
    elBoard.innerHTML = strHtml;
}


function renderCell(location, value) {
    var elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`)
    elCell.innerText = value;
}


function renderLives() {
    var str = '';
    var elInfoDiv = document.querySelector('.info-area .lives');
    for (var live of gLives) {
        str += live;
    }
    elInfoDiv.innerText = (gLives.length) ? str : '';
}

function renderHints() {
    var str = '';
    var elSpanHints = document.querySelector('.info-area .hints');
    for (var hint of gHints) {
        str += hint;
    }
    elSpanHints.innerText = (gHints.length) ? str : '';
}


function revealMines() {
    var elMines = document.querySelectorAll('.mine');

    for (var i = 0; i < elMines.length; i++) {
        var elMine = elMines[i];
        elMine.innerText = MINE
        elMine.style.backgroundColor = 'red';
    }
}

function revealNegs(posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            // if (j === posJ && i === posI) continue;
            var cell = gBoard[i][j];
            if (cell.isMarked) continue;
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            elCell.classList.add('opened');
            elCell.innerText = (gBoard[i][j].minesAroundCount) ? gBoard[i][j].minesAroundCount : '';
            cell.isShown = true;
        }
    }
}


function showNegsHinted(posI, posJ, isShow) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            var location = getPos(i, j);

            var cell = gBoard[i][j];
            if (cell.isMarked) continue;

            if (cell.isMine) {
                var value = (isShow) ? MINE : '';
                renderCell(location, value);
            } else {
                var countNegs = (cell.minesAroundCount) ? cell.minesAroundCount : '';
                var value = (isShow) ? countNegs : '';
                elCell.innerText = value;
            }
            if (isShow) {
                elCell.classList.add('hinted')
            } else {
                elCell.classList.remove('hinted')

            }
        }
    }
}