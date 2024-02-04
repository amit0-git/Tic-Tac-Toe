window.onload = function () {
    ///display the before the page load

    var load = document.getElementById("loader");
    var main = document.getElementById("main");

    // Hide loader and show main content after the entire page has loaded
    load.style.display = "none";
    main.style.display = "flex";
    console.log('JavaScript has completely loaded.');
};

//audio files load
var audio1 = new Audio("assets/mixkit-page-back-chime-1108.wav")
var audio2 = new Audio("assets/mixkit-cooking-stopwatch-alert-1792.wav")
var newGame = new Audio("assets/newGame.wav")
var gameDraw = new Audio("assets/gameDraw.wav")
var gameWin = new Audio("assets/win.wav");
var bgMusic = new Audio("assets/background.mp3")



var winArray = []
var movesArray = []

var row = document.getElementsByClassName("row");
Array.from(row).forEach((element) => {
    element.addEventListener("click", () => {


        if (chance == "x") {
            audio2.currentTime = 0;
            audio2.play();
        }
        else {
            audio1.currentTime = 0;
            audio1.play();
        }

    })
})

var chance = "x"
var nthTurn = 0;
var music = 0;

var cross = "url(assets/crossed.png)";
var zero = "url(assets/zero.png)";

//game draw assets
var ops1 = "url(assets/oops.png)";

//speaker on offf
var musicOn = "url(assets/music.png)";
var musicOff = "url(assets/musicOff.png)"

//replay image
var replay = "url(assets/replay.png)"

var musicBox = document.getElementById("speaker");
musicBox.addEventListener("click", changeMusic);

function changeMusic() {
    var music1 = document.getElementById("speaker");
    if (music == 0) {
        bgMusic.currentSrc = 0;

        bgMusic.play();
        bgMusic.loop = true;
        music1.style.backgroundImage = musicOn;
        music = 1;
    }

    else {

        bgMusic.pause();
        music1.style.backgroundImage = musicOff;
        music = 0;
    }
    console.log("Music clicked")

}
function initializeMatrix() {
    //function to initialize the matrix with null
    var matrix = []

    for (var i = 0; i < 3; i++) {
        let row = []
        for (var j = 0; j < 3; j++) {
            row.push(null);
        }
        matrix.push(row);
    }
    return matrix;
}

//function to update game moves
function replayFunction(row, col, chance) {
    console.log("replay fn clicked")
    var num = mapToNumber(row, col);
    var tmp = [num, chance];
    //push in the moves array
    movesArray.push(tmp);
}

function addBgAndAnimate(box) {
    for (var i = 0; i < winArray.length; i++) {
        box[winArray[i]].style.backgroundColor = "yellow";
        box[winArray[i]].classList.add("animate");

    }


}
function addImageWithDelay(index, box) {

    setTimeout(function () {
        if (movesArray[index][1] === "x") {

            box[movesArray[index][0]].style.backgroundImage = zero;
        } else if (movesArray[index][1] === "o") {


            box[movesArray[index][0]].style.backgroundImage = cross;
        }
    }, index * 1000); // 1-second delay for each iteration
}


//function to replpay the game

function playReplay(movesArray) {
    console.log("play replay called")
    console.log(winArray)

    var box = document.getElementsByClassName("box");
    var box = Array.from(box)
    console.log(box)

    //remove the boxex

    for (var i = 0; i < box.length; i++) {
        box[i].classList.remove('animate');
        box[i].style.backgroundImage = "none";

    }

    //start filling the boxes
    //start filling the 

    setTimeout(() => {

        for (var i = 0; i < movesArray.length; i++) {




            addImageWithDelay(i, box);





        }
    }, 1000);

    //add the animatin and bg
    addBgAndAnimate(box);






}

function playReplay1() {

    //support fn for play replay
    playReplay(movesArray);
}




//hide chance wrapper after winning or draw
function hideChance() {

    var chance = document.getElementsByClassName("chanceWrapper");
    chance[0].style.visibility = "hidden";

    // var chance = document.getElementById("chance");
    // var chanceImg = document.getElementById("chanceImg")



    // chance.innerHTML = "";
    // chanceImg.style.backgroundImage = replay;
    // chanceImg.addEventListener("click", playReplay1);

}

//display replay button

function displayReplay() {
    var chance = document.getElementById("chance");
    var chanceImg = document.getElementById("chanceImg")



    chance.innerHTML = "";
    chanceImg.style.backgroundImage = replay;
    chanceImg.addEventListener("click", playReplay1);
}


//disable the game input box after the winning
function disableAfterWin() {

    var row = document.getElementsByClassName("box");

    Array.from(row).forEach((element) => {
        
        element.disabled = true;
    });

}

//initialize the matrix

var game = initializeMatrix();

// x -> 1
// 0 -> 0

function print() {
    console.log(game);
}

function mapToNumber(row, col) {
    //function to map 2d matrix cordinate to 1d array cordinate

    var num = row * 3 + col;
    return num;
}





function checkGameWinner(row, col) {
    console.log("nth turn", nthTurn)




    //check for every move 
    //check only in the current row ,col and diagonal
    var winX = 1
    var winO = 1
    winArray = []

    //check for row 
    for (var i = 0; i < 3; i++) {
        if (game[row][i] != 1) {
            winX = 0;


        }
        if (game[row][i] != 0) {
            winO = 0;

        }

        winArray.push(mapToNumber(row, i));

    }


    //return the winner if the match is found in the row
    //else check for the column

    if (winX == 1) {
        updateWinStatus(1);
        return "1 row"
    }
    if (winO == 1) {
        updateWinStatus(0);
        return "0 row"
    }


    //check for column
    winArray = []
    winX = 1
    winO = 1

    for (var i = 0; i < 3; i++) {
        if (game[i][col] !== 1) {
            winX = 0;


        }
        if (game[i][col] !== 0) {
            winO = 0;

        }
        winArray.push(mapToNumber(i, col));
    }

    //return the winner if the match is found in the column
    //else check for the diagonal

    if (winX === 1) {
        updateWinStatus(1);
        return "1 col"
    }
    if (winO === 1) {
        updateWinStatus(0);
        return "0 col"
    }

    //only check in the diagonals when the input is made on the diagonal section

    //check for left diagonal
    winArray = []
    winX = 1
    winO = 1

    if (row - col == 0) {
        console.log("row - col == 0", row - col == 0)
        for (var i = 0; i < 3; i++) {

            if (game[i][i] != 1) {
                winX = 0
            }
            if (game[i][i] != 0) {
                winO = 0
            }
            winArray.push(mapToNumber(i, i));
        }
        //return the winner if the match is found in the left diagonal
        //else check for the column

        if (winX == 1) {
            updateWinStatus(1);
            return "1 left diag"
        }
        if (winO == 1) {
            updateWinStatus(0);
            return "0 left diag"
        }
    }




    //check for right diagonal
    winArray = []
    winX = 1
    winO = 1

    if (row + col == 2) {

        for (var i = 0; i < 3; i++) {
            if (game[i][2 - i] != 1) {
                winX = 0
            }

            if (game[i][2 - i] != 0) {
                winO = 0
            }
            winArray.push(mapToNumber(i, 2 - i));

        }
        //return the winner if the match is found in the right diagonal
        //else check for the column

        if (winX == 1) {
            updateWinStatus(1);
            return "1 right diag"
        }
        if (winO == 1) {
            updateWinStatus(0);
            return "0 right diag"
        }
    }

    //check for the draw condition
    if (nthTurn == 8) {
        updateWinStatus(2);

        return "Game Draw!!"
    }


    //if the all conditions not match
    console.log("No winner")
    return "No winner yet"
}


var rs = document.getElementById("reset");
rs.addEventListener("click", reset);

function reset() {
    newGame.currentTime = 0;
    newGame.play();

    //funtion to reset the game
    movesArray = []
    winArray = []
    game = initializeMatrix(); //initialize the matrix with null
    nthTurn = 0;
    console.log("Reset button called!")

    window.setTimeout(() => {
        location.reload();
    }, 500)

}


function animateWinPattern(array1) {
    //fn to animate the win pattern
    var box = document.getElementsByClassName("box");
    var boxArray = Array.from(box);


    for (var i = 0; i < array1.length; i++) {
        boxArray[array1[i]].classList.add("animate");

    }



}


function updateWinStatus(player) {


    // console.log("Win array", winArray)
    // console.log("moves", movesArray)

    //disable the game box for further moves after the game win or draw

    disableAfterWin();




    var wrapper = document.getElementById("winWrapper");
    var win = document.getElementById("win");
    wrapper.style.display = "flex";
    var winImg = document.getElementById("winImg");



    if (player == 1) {
        //display the replay button 

        displayReplay();
        //update the win pattern by changing the background color
        animateWinPattern(winArray);
        gameWin.currentSrc = 0;
        gameWin.play();
        win.innerHTML = "Congratulations!!";

        // var afterSpan = document.createElement("span");
        // afterSpan.textContent = "wins";
        // afterSpan.style.fontSize = "40px";
        // afterSpan.style.marginLeft = "50px";


        winImg.style.backgroundImage = cross;
        // winImg.appendChild(afterSpan);



    }

    if (player == 0) {
        //display the replay button
        displayReplay();

        animateWinPattern(winArray);
        gameWin.currentSrc = 0;
        gameWin.play();
        win.innerHTML = "Congratulations!!";
        winImg.style.backgroundImage = zero;



    }
    if (player == 2) {
        //hide the chance wrapper after win or draw
        hideChance();
        var sp = document.getElementById("sp");
        gameDraw.currentSrc = 0;
        gameDraw.play();
        sp.innerHTML = ""
        win.innerHTML = "Ooops!! Game Draw";
        winImg.style.backgroundImage = ops1;
        winImg.classList.add("shake");
    }
}



function updateChanceImg() {
    let box1 = document.getElementById("chanceImg");

    box1.style.backgroundRepeat = "no-repeat";
    // box1.style.backgroundSize = "40px 40px";
    box1.style.backgroundPosition = "center";
    box1.style.marginLeft = "10px";

    if (chance == "x") {
        box1.style.backgroundImage = cross;
    }

    else {
        box1.style.backgroundImage = zero;
    }
}






function b1_box() {

    let box = document.getElementById("b1");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";

    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[0][0] = 1;

        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][0] = 0;
        chance = "x";
    }
    box.disabled = true;

    updateChanceImg();

    replayFunction(0, 0, chance);

    console.log(checkGameWinner(0, 0));

    //update turn variable
    nthTurn++;


}

function b2_box() {

    let box = document.getElementById("b2");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[0][1] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][1] = 0;
        chance = "x";
    }
    box.disabled = true;
    updateChanceImg();
    replayFunction(0, 1, chance);
    console.log(checkGameWinner(0, 1));

    //update turn variable
    nthTurn++;

}


function b3_box() {
    let box = document.getElementById("b3");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[0][2] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][2] = 0;
        chance = "x";
    }
    box.disabled = true;
    updateChanceImg();
    replayFunction(0, 2, chance);
    console.log(checkGameWinner(0, 2));

    //update turn variable
    nthTurn++;

}

function b4_box() {
    let box = document.getElementById("b4");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][0] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][0] = 0;
        chance = "x";
    }

    box.disabled = true;
    updateChanceImg();
    replayFunction(1, 0, chance);
    console.log(checkGameWinner(1, 0));


    //update turn variable
    nthTurn++;

}

function b5_box() {
    let box = document.getElementById("b5");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][1] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][1] = 0;
        chance = "x";
    }

    box.disabled = true;
    updateChanceImg();
    replayFunction(1, 1, chance);
    console.log(checkGameWinner(1, 1));

    //update turn variable
    nthTurn++;

}

function b6_box() {
    let box = document.getElementById("b6");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][2] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][2] = 0;
        chance = "x";
    }

    box.disabled = true;
    updateChanceImg();
    replayFunction(1, 2, chance);
    console.log(checkGameWinner(1, 2));

    //update turn variable
    nthTurn++;

}

function b7_box() {
    let box = document.getElementById("b7");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][0] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][0] = 0;
        chance = "x";
    }

    box.disabled = true;
    updateChanceImg();
    replayFunction(2, 0, chance);
    console.log(checkGameWinner(2, 0));

    //update turn variable
    nthTurn++;

}

function b8_box() {
    let box = document.getElementById("b8");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][1] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][1] = 0;
        chance = "x";
    }

    box.disabled = true;
    updateChanceImg();
    replayFunction(2, 1, chance);
    checkGameWinner(2, 1);


    //update turn variable
    nthTurn++;
}

function b9_box() {
    let box = document.getElementById("b9");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][2] = 1;
        chance = "o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][2] = 0;
        chance = "x";
    }
    box.disabled = true;
    updateChanceImg();
    replayFunction(2, 2, chance);
    checkGameWinner(2, 2);

    //update turn variable
    nthTurn++;
}
