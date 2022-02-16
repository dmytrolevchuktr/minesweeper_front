$('#registerFormContainer').hide();
$('#hall-of-fame').hide();
$('#btn-get-list').hide();

function generateField(numCol, numRow) {

    let numberCell = numCol * numRow;
    let arrRandom = [];
    let randomValue = 0;

    for (let i = 0; i < numberMine; i++) {

        randomValue = Math.floor(Math.random() * numberCell);

        while (arrRandom.indexOf(randomValue) > -1) {
            randomValue = Math.floor(Math.random() * numberCell);
        }
        arrRandom[i] = randomValue;

    }

    let arrField = [];

    for (let i = 0; i < numRow; i++) {
        arrField[i] = [];
        for (let j = 0; j < numCol; j++) {
            arrField[i][j] = 0;

        }
    }

    for (let i = 0; i < arrRandom.length; i++) {

        let row = arrRandom[i] % numRow;
        let col = (arrRandom[i] - row) / numRow;
        arrField[row][col] = 'm';
    };

    let countMine = 0;
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < numCol; j++) {
            if (arrField[i][j] !== 'm') {
                for (let p = i - 1; p <= i + 1; p++) {
                    for (let r = j - 1; r <= j + 1; r++) {
                        if (p >= 0 && p < numRow && r >= 0 && r < numCol) {
                            if (arrField[p][r] === 'm') {
                                countMine++;
                            }
                        }
                    }
                }
                arrField[i][j] = countMine;
                countMine = 0;
            }


        }
    }

    return arrField;


}


function openEmptyCells(getField, arrCheckedField, i, j) {


    for (let p = i - 1; p <= i + 1; p++) {
        for (let r = j - 1; r <= j + 1; r++) {


            if (p >= 0 && p < numberRows && r >= 0 && r < numberColumns) {

                if (arrCheckedField[p][r] == 1) {

                    arrCheckedField[p][r] = 0;
                    $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').removeClass("cellDiv");
                    $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').addClass("cellDiv-open" + getField[p][r]);

                    if (getField[p][r] === 0) {
                        openEmptyCells(getField, arrCheckedField, p, r);
                    }

                }


            }
        }
    }


}


function showAllMine(getField) {

    for (let i = 0; i < numberRows; i++) {

        for (let j = 0; j < numberColumns; j++) {

            if (getField[i][j] == 'm') {
                $('.rowDiv:eq(' + i + ') div:eq(' + j + ')').addClass("cellDiv-mine");
            }

        }

    }

}

function countAroundMine(arrCheckedField, i, j) {
    let counter = 0;

    for (let p = i - 1; p <= i + 1; p++) {
        for (let r = j - 1; r <= j + 1; r++) {


            if (p >= 0 && p < numberRows && r >= 0 && r < numberColumns) {

                if (arrCheckedField[p][r] == 2) {
                    counter++;

                }


            }
        }
    }

    return counter;

}


function openNearField(i, j) {

    for (let p = i - 1; p <= i + 1; p++) {
        for (let r = j - 1; r <= j + 1; r++) {


            if (p >= 0 && p < numberRows && r >= 0 && r < numberColumns) {

                if (arrCheckedField[p][r] == 1) {
                    arrCheckedField[p][r] = 0;
                    $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').removeClass("cellDiv");
                    // $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').addClass("cellDiv-open");
                    // $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').append(`<span>${getField[p][r]}</span>`);
                    $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').addClass("cellDiv-open" + getField[p][r]);


                    if (getField[p][r] === 0) {
                        openEmptyCells(getField, arrCheckedField, p, r);
                    }

                    if (getField[p][r] === 'm') {
                        $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').removeClass("cellDiv");
                        $('.rowDiv:eq(' + p + ') div:eq(' + r + ')').addClass("cellDiv-mine");
                        showAllMine(getField);
                        gameIsOver = true;
                    }


                }


            }
        }
    }

    if (isWin()) {
        alert('You are a winner! Congrats!');
        finishTime = new Date();
        let result = finishTime - startTime;
        updateResult(result);
        gameIsOver = true;
    }


}


function isWin () {

    let counter = 0;

    for (let i = 0; i < numberRows; i++) {
        for (let j = 0; j < numberColumns; j++) {
            if (arrCheckedField[i][j] == 2 || arrCheckedField[i][j] == 1) {
                counter++;
            }

        }

    }

    if (counter == numberMine) {
        for (let i = 0; i < numberRows; i++) {
            for (let j = 0; j < numberColumns; j++) {
                if (getField[i][j] == 'm') {
                    // $('.rowDiv:eq(' + i + ') div:eq(' + j + ')').removeClass("cellDiv");
                    $('.rowDiv:eq(' + i + ') div:eq(' + j + ')').addClass("cellDiv-marked");
                }

            }

        }

        return true;
    }
    else { return false;}

}

function updateResult(result) {
    console.log('result', result)
    fetch("http://localhost:4000/api/users/updateResult", {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(
        {
            playerID: playerID,
            result,
        })}
    )
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))

}

function play() {

    startTime = new Date();

    $("#battleField").empty();
    markedMines = 0;

    // numberColumns = Number(prompt("Please enter number of columns", ""));
    // numberRows = Number(prompt("Please enter number of rows", ""));
    // level = Number(prompt("Please enter level: 1 - easy, 2 - medium, 3 - difficult", ""));
    numberColumns = 30;
    numberRows = 16;
    level = 1;
    // numberMine = Math.floor(numberColumns * numberRows * (0.05 + 0.05 * level));
    numberMine = 5;
    getField = generateField(numberColumns, numberRows);

    arrCheckedField = []; // check status. 0 - opened, 1 - closed, 2 - marked

    for (let i = 0; i < numberRows; i++) {
        arrCheckedField[i] = [];
        for (let j = 0; j < numberColumns; j++) {
            arrCheckedField[i][j] = 1;

        }
    }

     gameOnPlay = false;
     gameIsOver = false;

    let restartBtn = $('<input>');
    restartBtn.attr('id', 'restartBtn');
    restartBtn.attr('type', 'button');
    restartBtn.attr('value', 'Restart the game');
    restartBtn.attr('class', 'btnNotActive');


    let checkedMineDiv = $('<p></p>');
    // checkedMineDiv.innerHTML = `You have checked ${markedMines} form ${numberMine} mines`;
    checkedMineDiv.text(`You have checked ${markedMines} from ${numberMine} mines`);


    let fieldDiv = $('<div></div>');


    fieldDiv.attr('id', 'mainField');


    for (let i = 0; i < numberRows; i++) {
        let fieldRow = $('<div></div>');
        fieldRow.attr('class', 'rowDiv');

        for (let j = 0; j < numberColumns; j++) {
            let fieldCell = $('<div></div>');
            fieldCell.attr('class', 'cellDiv');
            //fieldCell.attr('oncontextmenu', 'return: false;');
            fieldRow.append(fieldCell);

        }
        fieldDiv.append(fieldRow);

    }


    $('#battleField').append(restartBtn);
    $('#battleField').append(checkedMineDiv);
    $('#battleField').append(fieldDiv);


    let tmpEvent = $('#mainField');


    $('#restartBtn').click(function () {
        if (gameOnPlay) {

            let confirmRestart = confirm("Do you want to restart the game?");
            if (confirmRestart) {
                play();
                gameOnPlay = false;
            }

        }
    });


    $(tmpEvent).find('.rowDiv').each(function (i) {

        $(tmpEvent).find('.rowDiv .cellDiv').each(function (j) {

            $(tmpEvent).find('.rowDiv:eq(' + i + ') .cellDiv:eq(' + j + ')').contextmenu(function() {return false;});

            $(tmpEvent).find('.rowDiv:eq(' + i + ') .cellDiv:eq(' + j + ')').dblclick(function () {
                if (arrCheckedField[i][j] == 0) {

                    let countMine = countAroundMine(arrCheckedField, i, j);
                    if (getField[i][j] == countMine) {

                        openNearField(i, j);

                    }



                }


            });


            $(tmpEvent).find('.rowDiv:eq(' + i + ') .cellDiv:eq(' + j + ')').mousedown(function (e) {


                switch (e.which) {
                    case 1:
                        gameOnPlay = true;
                        $('#restartBtn').removeClass('btnNotActive');
                        $('#restartBtn').addClass('btnActive');

                        if (arrCheckedField[i][j] == 1 && !gameIsOver) {
                            arrCheckedField[i][j] = 0;

                            if (getField[i][j] != 'm') {
                                $(this).removeClass("cellDiv");
                                $(this).addClass("cellDiv-open" + getField[i][j]);
                                if (isWin()) {
                                    alert('You are a winner! Congrats!');
                                    finishTime = new Date();
                                    let result = finishTime - startTime;
                                    updateResult(result);
                                    gameIsOver = true;
                                }
                                
                            }
                            else {
                                $(this).removeClass("cellDiv");
                                $(this).addClass("cellDiv-firstMine");
                                showAllMine(getField);
                                gameIsOver = true;

                            }
                            if (getField[i][j] == 0) {

                                openEmptyCells(getField, arrCheckedField, i, j);
                                if (isWin()) {
                                    alert('You are a winner! Congrats!');
                                    finishTime = new Date();
                                    let result = finishTime - startTime;
                                    updateResult(result);
                                    gameIsOver = true;
                                }

                            }

                        }
                        break;
                    case 2:
                        break;
                    case 3:
                        gameOnPlay = true;
                        $('#restartBtn').removeClass('btnNotActive');
                        $('#restartBtn').addClass('btnActive');

                        if (arrCheckedField[i][j] == 1  && !gameIsOver ) {
                            $(this).addClass("cellDiv-marked");
                            arrCheckedField[i][j] = 2;
                            markedMines++;
                            checkedMineDiv.text(`You have checked ${markedMines} from ${numberMine} mines`);
                            if (isWin()) {
                                alert('You are a winner! Congrats!');
                                finishTime = new Date();
                                let result = finishTime - startTime;
                                updateResult(result);
                                gameIsOver = true;
                            }
                        }
                        else if (arrCheckedField[i][j] == 2  && !gameIsOver) {
                            $(this).removeClass("cellDiv-marked");
                            arrCheckedField[i][j] = 1;
                            markedMines--;
                            checkedMineDiv.text(`You have checked ${markedMines} from ${numberMine} mines`);
                        }

                        break;
                    default:
                        break;
                }


            })


        })


    });


}


let numberColumns = 0;
let numberRows = 0;
let level = 0;
let numberMine = 0;

let markedMines = 0;

let gameOnPlay = false;
let gameIsOver = false;

let getField = [];

let arrCheckedField = [];

let startTime = 0;
let finishTime = 0;

let playerID = '';

// play();
// function fetchtest() {
//     console.log('run fetch')
//     fetch("http://localhost:4000/api/users/getUsers")
//         .then(res => res.json())
//         .then(res => console.log('res from API', res))
//         .catch(err => console.log('error from api', err))
// }

// fetchtest();
$('#btn-register').click(function () {
    const login = $('#registerForm-login').val();
    const password = $('#registerForm-password').val();
    if (login && password) {
        fetch("http://localhost:4000/api/users/register", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(
                {
                    login,
                    password,
                }
            )
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                $('#registerResult').text("Registration has been successful");
                $('#loginFormContainer').show();
                $('#registerFormContainer').hide();
            }
        })
        .catch(err => console.log(err))
    }
})

$('#btn-register-form').click(function() {
    $('#loginFormContainer').hide();
    $('#registerFormContainer').show();
});

$('#btn-login').click(function () {
    const login = $('#loginForm-login').val();
    const password = $('#loginForm-password').val();
    if (login && password) {
        fetch("http://localhost:4000/api/users/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(
                {
                    login,
                    password,
                }
            )
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                $('#loginFormContainer').hide();
                $('#registerFormContainer').hide();
                $('#btn-get-list').show();
                $('#loginResult').text(`You are logged in as ${res.userLogin}`);
                playerID = res.userID;
                play();
            }
        })
        .catch(err => console.log(err))
    }
})



$('#btn-get-list').click(function () {

    $('#resultList').empty();
    fetch("http://localhost:4000/api/users/getUsers")
        .then(res => res.json())
        .then(res => {
            console.log('res from API', res.data);
            if (res && res.data) {
                filteredData = res.data.filter(item => !!item.bestScore);
                filteredData = filteredData.sort((a,b) => a.bestScore - b.bestScore);
                filteredData.forEach((item, index) => {
                    $('#resultList').append(`<tr><td>${index + 1}</td><td>${item.login}</td><td>${item.bestScore}</td></tr>`);

                });
                $('#hall-of-fame').show();
            }

        })
        .catch(err => console.log('error from api', err))
})

