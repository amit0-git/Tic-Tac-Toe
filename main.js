

function initializeMatrix(){
    //function to initialize the matrix with null
    var matrix=[]
    
    for (var i=0;i<3;i++){
        let row=[]
        for (var j=0;j<3;j++){
            row.push(null);
        }
        matrix.push(row);

        

    }

    return matrix;
    

}
//initialize the matrix

var game=initializeMatrix();

// x -> 1
// 0 -> 0

function print() {
    console.log(game);
}


function checkGameWinner(row,col){
    //check for every move 
    //check only in the current row ,col and diagonal
    var winX=1
    var winO=1

    //check for row 
    for (var i=0;i<3;i++){
        if (game[row][i]!=1){
            winX=0;

        }
        if (game[row][i]!=0){
            winO=0;
        }

    }



}



var cross = "url(crossed.png)";
var zero = "url(zero.png)";

var chance = "x"


function updateChanceImg(){
    let box1=document.getElementById("chanceImg");

    box1.style.backgroundRepeat = "no-repeat";
    box1.style.backgroundSize = "40px 40px";
    box1.style.backgroundPosition = "center";
    box1.style.marginLeft="10px";

    if (chance=="x"){
        box1.style.backgroundImage = cross;
    }

    else{
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
        game[0][0]=1;
        
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][0]=0;
        chance="x";
    }
    box.disabled=true;

    updateChanceImg();

}

function b2_box(){
    
    let box = document.getElementById("b2");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[0][1]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][1]=0;
        chance="x";
    }
    box.disabled=true;
    updateChanceImg();
}


function b3_box(){
    let box = document.getElementById("b3");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[0][2]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[0][2]=0;
        chance="x";
    }
    box.disabled=true;
    updateChanceImg();
}

function b4_box(){
    let box = document.getElementById("b4");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][0]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][0]=0;
        chance="x";
    }

    box.disabled=true;
    updateChanceImg();
}

function b5_box(){
    let box = document.getElementById("b5");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][1]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][1]=0;
        chance="x";
    }

    box.disabled=true;
    updateChanceImg();
}

function b6_box(){
    let box = document.getElementById("b6");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[1][2]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[1][2]=0;
        chance="x";
    }

    box.disabled=true;
    updateChanceImg();
}

function b7_box(){
    let box = document.getElementById("b7");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][0]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][0]=0;
        chance="x";
    }

    box.disabled=true;
    updateChanceImg();
}

function b8_box(){
    let box = document.getElementById("b8");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][1]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][1]=0;
        chance="x";
    }

    box.disabled=true;
    updateChanceImg();
}

function b9_box(){
    let box = document.getElementById("b9");
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundSize = "60px 60px";
    box.style.backgroundPosition = "center";
    if (chance == "x") {

        box.style.backgroundImage = cross;
        game[2][2]=1;
        chance="o";

    }

    else {
        box.style.backgroundImage = zero;
        game[2][2]=0;
        chance="x";
    }
    box.disabled=true;
    updateChanceImg();
}
