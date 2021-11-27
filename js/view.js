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


function hideNegs(posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var cell = gBoard[i][j];
            if (!cell.isShown) continue;
            if (cell.isMarked || cell.isMine) continue;
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            if (!elCell.classList.contains('opened')) continue
            renderCell({ i, j }, EMPTY);
            toggleCls({ i, j }, 'opened', false)
            toggleCls({ i, j }, 'number', false);
            if (!cell.minesAroundCount) {
                hideNegs(i, j, false)
            }
            cell.isShown = false;
        }
    }
}


function revealNegs(posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var cell = gBoard[i][j];
            if (cell.isShown) continue;
            if (cell.isMarked || cell.isMine) continue;
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);

            if (elCell.classList.contains('number')) continue;
            elCell.classList.add('opened');
            if (cell.minesAroundCount) elCell.classList.add('number', `n${cell.minesAroundCount}`)
            elCell.innerText = (gBoard[i][j].minesAroundCount) ? gBoard[i][j].minesAroundCount : '';
            cell.isShown = true;
            if (!cell.minesAroundCount) {
                revealNegs(i, j, true)
            }
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


function toggleCls(location, clsName, isAdd) {
    var el = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`);
    if (isAdd) {
        el.classList.add(clsName);
    } else {
        el.classList.remove(clsName);
    }
}