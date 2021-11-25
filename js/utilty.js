'use strict'

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.rows; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.cols; j++) {
            var cell = buildCell();
            cell.pos = { i, j }
            board[i][j] = cell;
        }
    }
    return board;
}


function buildCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function playSound(file) {
    var audio = new Audio(file)
    audio.play()
}

function drawNum(nums) {
    var idx = getRandomInt(0, nums.length)
    var num = nums[idx]
    nums.splice(idx, 1)
    return num
}





function checkSizeUI() {
    if (gLevel.rows < 11) {
        var elTable = document.querySelector('table')
        elTable.style.width = '300px'
        elTable.style.height = '270px';
    }
    // elTable.style.width = '300px'
    // elTable.style.height = '250px';
}


function getPos(i, j) {
    return {
        i,
        j
    }
}



function setLevel(num) {
    gLevel.rows = num;
    gLevel.cols = num;
    switch (num) {
        case 12:
            gLevel.mines = 30;
            break;
        case 8:
            gLevel.mines = 12;
            break;
        case 4:
            gLevel.mines = 2;
            break;
    }
    checkSizeUI()
    init();
}


function setEmoji(isHappy) {
    var elImg = document.querySelector('.emoji');
    elImg.src = (isHappy) ? `img/win.png` : `img/lose.png`;
}



function isShown() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShown) return false;
        }
    }
    return true;
}

function updateSafeClick(num) {
    var elSafeSpan = document.querySelector('.safe-click');
    elSafeSpan.innerText = (num > 0) ? num : 0;
}

function updateBestTime(bTime) {
    var elBestTime = document.querySelector('.highS .best-time');
    elBestTime.innerHTML = `Your Best Time : <br> ${bTime}`
}


function displayStopWatch2() {
    var startTime = Date.now();
    var elStopWatch = document.querySelector('.stop-watch span');

    stopWatchInId = setInterval(() => {
        var sec = (Date.now() - startTime);
        gGame.secPassed = sec / 1000;
        elStopWatch.innerText = (sec / 1000).toFixed(2)
    }, 99)
}
