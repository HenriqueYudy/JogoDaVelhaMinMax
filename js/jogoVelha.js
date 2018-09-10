

/*
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
*/

// Fecha o modal quando clicar no esc
document.onkeypress = function (evt) {
    evt = evt || window.event;
    var modal = document.getElementsByClassName("modal")[0];
    if (evt.keyCode === 27) {
        modal.style.display = "none";
    }
};

// fecha o modal quando clicar fora do modal
window.onclick = function (evt) {
    var modal = document.getElementsByClassName("modal")[0];
    if (evt.target === modal) {
        modal.style.display = "none";
    }
};

//==================================
// Funções de facilitação
//==================================
function sumArray(array) {
    var sum = 0,
        i = 0;
    for (i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function isInArray(element, array) {
    if (array.indexOf(element) > -1) {
        return true;
    }
    return false;
}

function shuffleArray(array) {
    var counter = array.length,
        temp,
        index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// variaveis de configuração do jogo GLOBAL
var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    player = x,
    sextaFeira = o,
    whoseTurn = x,
    gameOver = false,
    score = {
        ties: 0,
        player: 0,
        sextaFeira: 0
    },
    xText = "<span class=\"x\">&times;</class>",
    oText = "<span class=\"o\">o</class>",
    playerText = xText,
    sextaFeiraText = oText,
    difficulty = 1,
    myGrid = null;

//==================================
// Objeto da GRID
//==================================

// Constructor da GRID
//=================
function Grid() {
    this.cells = new Array(9);
}

// Grid methods
//=============

// Busca no array uma celula vazia para realizar os seguintes processos
Grid.prototype.getFreeCellIndices = function () {
    var i = 0,
        resultArray = [];
    for (i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 0) {
            resultArray.push(i);
        }
    }
    // console.log("resultArray: " + resultArray.toString());
    // debugger;
    return resultArray;
};

// Pega o valores da linha 
Grid.prototype.getRowValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Argumento errado para o valores da linha !");
        return undefined;
    }
    var i = index * 3;
    return this.cells.slice(i, i + 3);
};

// Pega o indice da linha
Grid.prototype.getRowIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Argumento errado para o indice da linha !");
        return undefined;
    }
    var row = [];
    index = index * 3;
    row.push(index);
    row.push(index + 1);
    row.push(index + 2);
    return row;
};

// Pega o valor da coluna
Grid.prototype.getColumnValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Argumento errado para o valor da coluna !");
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(this.cells[i]);
    }
    return column;
};

// Pega o indice da coluna
Grid.prototype.getColumnIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Argumento errado para o indice da coluna !");
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(i);
    }
    return column;
};

// Pega os valores das diagonais
// arg 0: de cima para esquerda
// arg 1: de cima para direita
Grid.prototype.getDiagValues = function (arg) {
    var cells = [];
    if (arg !== 1 && arg !== 0) {
        console.error("Argumento errado para o valor da diagonal !");
        return undefined;
    } else if (arg === 0) {
        cells.push(this.cells[0]);
        cells.push(this.cells[4]);
        cells.push(this.cells[8]);
    } else {
        cells.push(this.cells[2]);
        cells.push(this.cells[4]);
        cells.push(this.cells[6]);
    }
    return cells;
};

// Pega o indices das diagonais
// arg 0: de cima para esquerda
// arg 1: de cima para direita
Grid.prototype.getDiagIndices = function (arg) {
    if (arg !== 1 && arg !== 0) {
        console.error("Argumento errado para o indice da diagonal!");
        return undefined;
    } else if (arg === 0) {
        return [0, 4, 8];
    } else {
        return [2, 4, 6];
    }
};

// Pega os dois primeiro valores sequenciais da linha
Grid.prototype.getFirstWithTwoInARow = function (agent) {
    if (agent !== sextaFeira && agent !== player) {
        console.error("Função só aceita valores vindo da sexta-feira ou do jogador");
        return undefined;
    }
    var sum = agent * 2,
        freeCells = shuffleArray(this.getFreeCellIndices());
    for (var i = 0; i < freeCells.length; i++) {
        for (var j = 0; j < 3; j++) {
            var rowV = this.getRowValues(j);
            var rowI = this.getRowIndices(j);
            var colV = this.getColumnValues(j);
            var colI = this.getColumnIndices(j);
            if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
                return freeCells[i];
            } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
                return freeCells[i];
            }
        }
        for (j = 0; j < 2; j++) {
            var diagV = this.getDiagValues(j);
            var diagI = this.getDiagIndices(j);
            if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
                return freeCells[i];
            }
        }
    }
    return false;
};

Grid.prototype.reset = function () {
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i] = 0;
    }
    return true;
};

//==================================
// Funções principais
//==================================

// Executa quando a pagina é carregada
function inicializar() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player;
    for (var i = 0; i <= myGrid.cells.length - 1; i++) {
        myGrid.cells[i] = 0;
    }

    setTimeout(showOptions, 500);

}

// Pergunta para o jogador com qual simbolo ele deseja jogar
function assignRoles() {
    askUser("Do you want to go first?");
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

// Configura o jogador como jogador do simbolo X
function makePlayerX() {
    player = x;
    sextaFeira = o;
    whoseTurn = player;
    playerText = xText;
    sextaFeiraText = oText;
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}


// Configura o jogador como jogador do simbolo O
function makePlayerO() {
    player = o;
    sextaFeira = x;
    whoseTurn = sextaFeira;
    playerText = oText;
    sextaFeiraText = xText;
    setTimeout(makesextaFeiraMove, 400);
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

// Executa quando o jogador clica nas celulas da Grid
function cellClicked(id) {
    var idName = id.toString();
    var cell = parseInt(idName[idName.length - 1]);
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerText;

    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = player;

    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = sextaFeira;
        makesextaFeiraMove();
    }
    return true;
}

// Reinicia o jogo
function restartGame(pergunta) {
    if (moves > 0) {
        var response = confirm("Deseja realmente reiniciar o jogo ?");
        if (response === false) {
            return;
        }
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;
    myGrid.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    if (pergunta === true) {
        setTimeout(showOptions, 200);
    } else if (whoseTurn == sextaFeira) {
        setTimeout(makesextaFeiraMove, 800);
    }
}

//Inteligencia Artificial da Sexta-Feira
function makesextaFeiraMove() {
    if (gameOver) {
        return false;
    }
    var cell = -1,
        myArr = [],
        esquina = [0, 2, 6, 8];
    if (moves >= 3) {
        cell = myGrid.getFirstWithTwoInARow(sextaFeira);
        if (cell === false) {
            cell = myGrid.getFirstWithTwoInARow(player);
        }
        if (cell === false) {
            if (myGrid.cells[4] === 0 && difficulty == 1) {
                cell = 4;
            } else {
                myArr = myGrid.getFreeCellIndices();
                cell = myArr[intRandom(0, myArr.length - 1)];
            }
        }
        // Evita o problema do catch-22 do algoritmo
        if (moves == 3 && myGrid.cells[4] == sextaFeira && player == x && difficulty == 1) {
            if (myGrid.cells[7] == player && (myGrid.cells[0] == player || myGrid.cells[2] == player)) {
                myArr = [6, 8];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[5] == player && (myGrid.cells[0] == player || myGrid.cells[6] == player)) {
                myArr = [2, 8];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[3] == player && (myGrid.cells[2] == player || myGrid.cells[8] == player)) {
                myArr = [0, 6];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[1] == player && (myGrid.cells[6] == player || myGrid.cells[8] == player)) {
                myArr = [0, 2];
                cell = myArr[intRandom(0, 1)];
            }
        }
        else if (moves == 3 && myGrid.cells[4] == player && player == x && difficulty == 1) {
            if (myGrid.cells[2] == player && myGrid.cells[6] == sextaFeira) {
                cell = 8;
            }
            else if (myGrid.cells[0] == player && myGrid.cells[8] == sextaFeira) {
                cell = 6;
            }
            else if (myGrid.cells[8] == player && myGrid.cells[0] == sextaFeira) {
                cell = 2;
            }
            else if (myGrid.cells[6] == player && myGrid.cells[2] == sextaFeira) {
                cell = 0;
            }
        }
    } else if (moves === 1 && myGrid.cells[4] == player && difficulty == 1) {
        cell = esquina[intRandom(0, 3)];
    } else if (moves === 2 && myGrid.cells[4] == player && sextaFeira == x && difficulty == 1) {
        if (myGrid.cells[0] == sextaFeira) {
            cell = 8;
        }
        else if (myGrid.cells[2] == sextaFeira) {
            cell = 6;
        }
        else if (myGrid.cells[6] == sextaFeira) {
            cell = 2;
        }
        else if (myGrid.cells[8] == sextaFeira) {
            cell = 0;
        }
    } else if (moves === 0 && intRandom(1, 10) < 8) {

        cell = esquina[intRandom(0, 3)];
    } else {

        if (myGrid.cells[4] === 0 && difficulty == 1) {
            cell = 4;
        } else {
            myArr = myGrid.getFreeCellIndices();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }
    var id = "cell" + cell.toString();

    document.getElementById(id).innerHTML = sextaFeiraText;
    document.getElementById(id).style.cursor = "default";

    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    myGrid.cells[cell] = sextaFeira;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}

// Verifica sé a um ganhador
function checkWin() {
    winner = 0;

    // rows
    for (var i = 0; i <= 2; i++) {
        var row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
            if (row[0] == sextaFeira) {
                score.sextaFeira++;
                winner = sextaFeira;
                // console.log("sextaFeira ganhou");
            } else {
                score.player++;
                winner = player;
                // console.log("player ganhou");
            }
            //muda a cor da linha/coluna/diagonal ganhadora
            var tmpAr = myGrid.getRowIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // colunas
    for (i = 0; i <= 2; i++) {
        var col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == sextaFeira) {
                score.sextaFeira++;
                winner = sextaFeira;
                // console.log("sextaFeira ganhou");
            } else {
                score.player++;
                winner = player;
                // console.log("player ganhou");
            }
            //muda a cor da linha/coluna/diagonal ganhadora
            var tmpAr = myGrid.getColumnIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // Diagonal
    for (i = 0; i <= 1; i++) {
        var diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == sextaFeira) {
                score.sextaFeira++;
                winner = sextaFeira;
                // console.log("sextaFeira ganhou");
            } else {
                score.player++;
                winner = player;
                // console.log("player ganhou");
            }
            //muda a cor da linha/coluna/diagonal ganhadora
            var tmpAr = myGrid.getDiagIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // Se não houver ganhador então é velha
    var myArr = myGrid.getFreeCellIndices();
    if (myArr.length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }

    return winner;
}

// anuncia o ganhador
function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    setTimeout(closeModal, 1400, "winAnnounce");
}

// pergunta ao jogador 
function askUser(text) {
    document.getElementById("questionText").innerHTML = text;
    document.getElementById("userFeedback").style.display = "block";
}

//Pega os valores do radio button de dificuldade
function showOptions() {
    if (player == o) {
        document.getElementById("rx").checked = false;
        document.getElementById("ro").checked = true;
    }
    else if (player == x) {
        document.getElementById("rx").checked = true;
        document.getElementById("ro").checked = false;
    }
    if (difficulty === 0) {
        document.getElementById("r0").checked = true;
        document.getElementById("r1").checked = false;
    }
    else {
        document.getElementById("r0").checked = false;
        document.getElementById("r1").checked = true;
    }
    document.getElementById("optionsDlg").style.display = "block";
}

// Pega os valores setados no modal de opção
function getOptions() {
    var diffs = document.getElementsByName('difficulty');
    for (var i = 0; i < diffs.length; i++) {
        if (diffs[i].checked) {
            difficulty = parseInt(diffs[i].value);
            break;
            // debugger;
        }
    }
    if (document.getElementById('rx').checked === true) {
        player = x;
        sextaFeira = o;
        whoseTurn = player;
        playerText = xText;
        sextaFeiraText = oText;
    }
    else {
        player = o;
        sextaFeira = x;
        whoseTurn = sextaFeira;
        playerText = oText;
        sextaFeiraText = xText;
        setTimeout(makesextaFeiraMove, 400);
    }
    document.getElementById("optionsDlg").style.display = "none";
}

// Fecha modal
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// final de jogo 
function endGame(who) {
    if (who == player) {
        announceWinner("Parabens você ganhou. A sexta-feira te deve um capuccino !");
    } else if (who == sextaFeira) {
        announceWinner("sextaFeira ganhou!. A sexta-feira quer aprimoração !");
    } else {
        announceWinner("Deu velha !!");
    }
    gameOver = true;
    whoseTurn = 0;
    moves = 0;
    winner = 0;
    document.getElementById("sextaFeira_score").innerHTML = score.sextaFeira;
    document.getElementById("tie_score").innerHTML = score.ties;
    document.getElementById("player_score").innerHTML = score.player;
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
    setTimeout(restartGame, 800);
}
