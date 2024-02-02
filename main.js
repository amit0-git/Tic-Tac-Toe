var audio1=new Audio("assets/mixkit-confirmation-tone-2867.wav")
var audio2=new Audio("assets/mixkit-cooking-stopwatch-alert-1792.wav")


var winArray=[]

var row=document.getElementsByClassName("row");
Array.from(row).forEach((element)=>{
    element.addEventListener("click",()=>{


        if (chance=="x"){
            audio2.currentTime = 0;
            audio2.play();
        }
        else{
            audio1.currentTime = 0;
            audio1.play();
        }
        
        // if (audio1.paused) {
    
        //     // If paused, play the audio
        //     audio1.play();
            
        // } else {
        //     // If playing, pause the audio
        //     audio1.pause();
        //     audio1.currentTime = 0; // Reset the audio to the beginning
            
        // }
    })
})

var chance = "x"
var nthTurn = 0;

var cross = "url(assets/crossed.png)";
var zero = "url(assets/zero.png)";

//game draw assets
var ops1 = "url(assets/oops.png)";

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
//hide chance wrapper after winning or draw
function hideChance(){
    console.log("Hide Chance called!!")
    var chance=document.getElementsByClassName("chanceWrapper");
    chance[0].style.visibility="hidden";
}


//disable the game input box after the winning
function disableAfterWin() {

    var row = document.getElementsByClassName("box");

    Array.from(row).forEach((element) => {
        console.log("asas", element);
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

function mapToNumber(row,col){
    //function to map 2d matrix cordinate to 1d array cordinate

    var num=row*3+col;
    return num;
}





function checkGameWinner(row, col) {
    console.log("nth turn", nthTurn)




    //check for every move 
    //check only in the current row ,col and diagonal
    var winX = 1
    var winO = 1
    winArray=[]

    //check for row 
    for (var i = 0; i < 3; i++) {
        if (game[row][i] != 1) {
            winX = 0;


        }
        if (game[row][i] != 0) {
            winO = 0;

        }

        winArray.push(mapToNumber(row,i));

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
    winArray=[]
    winX = 1
    winO = 1

    for (var i = 0; i < 3; i++) {
        if (game[i][col] !== 1) {
            winX = 0;


        }
        if (game[i][col] !== 0) {
            winO = 0;

        }
        winArray.push(mapToNumber(i,col));
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
    winArray=[]
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
            winArray.push(mapToNumber(i,i));
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
    winArray=[]
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
            winArray.push(mapToNumber(i,2-i));

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

    //funtion to reset the game
    game = initializeMatrix(); //initialize the matrix with null
    nthTurn = 0;
    console.log("Reset button called!")
    location.reload();
}


function updateWinPattern(array1){

    var box=document.getElementsByClassName("box");
    var boxArray=Array.from(box);


    for (var i=0;i<array1.length;i++){
        boxArray[array1[i]].classList.add("animate");
       console.log(boxArray[array1[i]])
    }

    

}


function updateWinStatus(player) {
    updateWinPattern(winArray);
    console.log("Win array",winArray)
    
    //disable the game box for further moves after the game win or draw
    disableAfterWin();


    //hide the chance wrapper after win or draw
    hideChance();

    var wrapper = document.getElementById("winWrapper");
    var win = document.getElementById("win");
    wrapper.style.display = "flex";
    var winImg = document.getElementById("winImg");

    winImg.style.backgroundSize = "40px 40px";
    winImg.style.backgroundPosition = "center";
    winImg.style.backgroundRepeat = "no-repeat";
    winImg.style.marginLeft = "10px";
    winImg.style.height = "50px";
    winImg.style.width = "50px";

    if (player == 1) {
        win.innerHTML = "Congratulations!!";
        var afterSpan = document.createElement("span");
        afterSpan.textContent = "wins";
        afterSpan.style.fontSize = "40px";
        afterSpan.style.marginLeft = "50px";


        winImg.style.backgroundImage = cross;
        winImg.appendChild(afterSpan);



    }

    if (player == 0) {
        win.innerHTML = "Congratulations!!";
        winImg.style.backgroundImage = zero;

        var afterSpan = document.createElement("span");
        afterSpan.textContent = "wins";
        afterSpan.style.fontSize = "40px";
        afterSpan.style.marginLeft = "50px";

        winImg.appendChild(afterSpan);

    }
    if (player == 2) {
        win.innerHTML = "Ooops!! Game Draw";
        winImg.style.backgroundImage = ops1;
    }
}



function updateChanceImg() {
    let box1 = document.getElementById("chanceImg");

    box1.style.backgroundRepeat = "no-repeat";
    box1.style.backgroundSize = "40px 40px";
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

    checkGameWinner(2, 2);

    //update turn variable
    nthTurn++;
}
