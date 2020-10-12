// This changes everything
"use strict";

//To get store personal data 
let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));

// When document is ready (When page is ready from DOM)
$(document).ready(function () {
    $('#pageTitle').html('Game Page');
    // When we are loading first time of the page, we need some basic info about player, 
    // i am caching some testing Data, we can reset the data later
    if (!playerBasicInfoData) {
        let playerDataObject = {
            name: 'Bhanu Chella',
            nooftruckers: '4',
            intialfund: '1000'
        };
        // Put the object into storage
        localStorage.setItem('playerBasicInfo', JSON.stringify(playerDataObject));
        //To get store personal data 
        var playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    } else {
        //To get store personal data 
        var playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    }
    // To handle currency symbol with min and max values of bet forms, this can reuseable 
    (function ($) {
        $.fn.currencyInput = function () {
            this.each(function () {
                let wrapper = $("<div class='currency-input' />");
                $(this).wrap(wrapper);
                $(this).before("<span class='currency-symbol'>$</span>");
                $(this).change(function () {
                    let min = parseFloat($(this).attr("min"));
                    let max = parseFloat($(this).attr("max"));
                    let value = this.valueAsNumber;
                    if (value < min)
                        value = min;
                    else if (value > max)
                        value = max;
                    $(this).val(value.toFixed(2));
                });
            });
        };
    })(jQuery);
    //  To Update the player basic info
    if(playerBasicInfoData) {
        $('.userName').html(playerBasicInfoData.name);
        $('.userIntitalFunds').html(`$`+playerBasicInfoData.intialfund);
    }
    $('input.currency').currencyInput();
    $('#startRace').prop('disabled', true);
    $('#gameSetupID').hide();
    $('#betBtn').on('click', function() {
        $('#startRace').prop('disabled', false);
    })
    // To resetting the player details
    $('#resetBtnID').on('click', function () {
        $('#pageTitle').html('Game Page');
        //To get store personal bet data 
        let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
        $('#madTruckerDiv').hide();
        $('#gameSetupID').show();
        $('#playerName').val(playerBasicInfoData.name);
        $('#noofTruckers').val(playerBasicInfoData.nooftruckers);
        $('#intialFunds').val(playerBasicInfoData.intialfund);
    })
    // Appending No of truckers based of player setup
    if(playerBasicInfoData) {
        for (let i = 0; i < playerBasicInfoData.nooftruckers; ++i) {
            $('.fieldContainer').append('<div class="form-group"><label for="trucker' + i + '" class="col-form-label">Trucker' + i + '</label><div class="currency-input"><span class="currency-symbol">$</span><input type="number" class="form-control currency" id="trucker' + i + '" min="1.00" max=' + playerBasicInfoData.intialfund + ' value="0" required="true"> </div></div>');
        }
        setMadTruckersBasedOnUserSetup();
    }
    $('.alert').hide();
});

// To start truck race game 
function myTruckRace() {
    //To get store personal data 
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    // Checking conditionally
    if ($('#startRace').html().includes('Start')) {
        addClassForTruckANimation(playerBasicInfoData.nooftruckers); 
    } else {
        removeClassForTruckANimation(playerBasicInfoData.nooftruckers);
    }
    $('#startRace').prop('disabled', true);
    let winTruck = localStorage.getItem('winTruck');
    // To pass callback when animation end
    $(`#truck${winTruck}`).on("animationend", myTruckAnimationEndFunction);
}

//  Callaback for animation end
function myTruckAnimationEndFunction() {
    // Get the personal into storage
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    //To get store personal bet data 
    let playersBetInfoData = JSON.parse(localStorage.getItem('playersBetInfo'));
    let winTruck = localStorage.getItem('winTruck');
    let sum = 0;
    $.map(playersBetInfoData, function (key) {
        sum += parseInt(key.trucker);
    });
    if(playersBetInfoData[winTruck].trucker > 0) {
        // When player won the game
        $('.alert').show();
        $('.alert').html("Congratulations! You won"+` $${playersBetInfoData[winTruck].trucker * 2}`);
        playerBasicInfoData['intialfund'] = parseInt(playerBasicInfoData.intialfund) + parseInt(playersBetInfoData[winTruck].trucker * 2);
        localStorage.setItem('playerBasicInfo', JSON.stringify(playerBasicInfoData));
        $('.userIntitalFunds').html(`$` + playerBasicInfoData.intialfund);
    } else {
        // When player lost the game
        $('.alert').show();
        $('.alert').html("Oops! You lost"+` $${sum}`);
        playerBasicInfoData['intialfund'] = parseInt(playerBasicInfoData.intialfund) - parseInt(sum);
        localStorage.setItem('playerBasicInfo', JSON.stringify(playerBasicInfoData));
        $('.userIntitalFunds').html(`$` + playerBasicInfoData.intialfund);
    }
    if(parseInt(playerBasicInfoData.intialfund) > 0) {
        $('#placeBet').prop('disabled', false);
    } else {
        $('#placeBet').prop('disabled', true);
    }
    //Clearing all bet data once animation ends 
    localStorage.removeItem('playersBetInfo');
    $('.container').empty();
    setMadTruckersBasedOnUserSetup();
}

// To start the game
function startGame() {
    localStorage.removeItem('playerBasicInfo');
    localStorage.removeItem('playersBetInfo')
    let playerDataObject = {
        name: $('#playerName').val(),
        nooftruckers: $('#noofTruckers').val(),
        intialfund: $('#intialFunds').val()
    };

    // Put the object into storage
    localStorage.setItem('playerBasicInfo', JSON.stringify(playerDataObject));
    $('#madTruckerDiv').show();
    $('#gameSetupID').hide();
    //To get store personal data 
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    $('.userName').html(playerBasicInfoData.name);
    $('.userIntitalFunds').html(`$${playerBasicInfoData.intialfund}`);
    $('.container').empty();
    setMadTruckersBasedOnUserSetup();
    $('.alert').hide();
    $('#placeBet').prop('disabled', false);
}

function placeBet() {
    //To get store personal bet data 
    let playersBetInfoData = JSON.parse(localStorage.getItem('playersBetInfo'));
    //To get store personal data 
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    if (playersBetInfoData) {
        for (let j = 0; j < playersBetInfoData.length; ++j) {
            let idofTrucker = `#trucker${j}`;
            $(idofTrucker).val(playersBetInfoData[j].trucker);
        }
    } else {
    // Appending No of truckers based of player setup
    if (playerBasicInfoData) {
        $(".fieldContainer").empty();
        for (let i = 0; i < playerBasicInfoData.nooftruckers; ++i) {
            let theColorIs = retrunColorNames(i);
            $('.fieldContainer').append('<div class="form-group"><label for="trucker' + i + '" class="col-form-label">Trucker' + +i+ '('+theColorIs+')' + '</label><div class="currency-input"><span class="currency-symbol">$</span><input type="number" class="form-control currency" id="trucker' + i + '" min="1.00" max=' + playerBasicInfoData.intialfund + ' value="0" required="true"> </div></div>');
        }
    }
    }
    $('.bet-alert').hide();
    $('#betBtn').prop('disabled', false);
    $('#betCancel').prop('disabled', false);
}

// Setting the bet data
function postingBetData() {
    //To get store personal data 
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    let truckerData = [];
    for (let i = 0; i < playerBasicInfoData.nooftruckers; ++i) {
        let idofTrucker = `#trucker${i}`;
        let value = $(idofTrucker).val();
        truckerData.push({trucker: value});
    }
    $('.alert').hide();
    $('.bet-alert').show();
    // Put the array into storage
    localStorage.setItem('playersBetInfo', JSON.stringify(truckerData));
    let sum = 0;
    $.map(truckerData, function (key) {
        sum += parseInt(key.trucker);
    });
    // Chceking or validating the total bet amount should not be greater than to player intital fund 
    if (sum <= playerBasicInfoData.intialfund) {
        $('.bet-alert').html('Your Bet Changes Got Saved!!');
        $('.bet-alert').css("color", "green");
        $('#betBtn').prop('disabled', true);
        $('#betCancel').prop('disabled', true);
        // Timer for auto close the bet data modal
        setTimeout(function () {
            $(function () {
                $('#placeBetModal').modal('toggle');
            });
        }, 3000);
        for (let i = 0; i < truckerData.length; ++i) {
            let idofTrucker = `#truck${i} > .truckInfoBetClass`;
            if (truckerData[i].trucker != 0) {
                $(idofTrucker).html(`$${truckerData[i].trucker}`);
            }
        }
    } else {
        $('.bet-alert').html('Your bet amount is more than your intial fund!!');
        $('.bet-alert').css("color", "red");
    }
    removeClassForTruckANimation();
}

// Player data setup
function setMadTruckersBasedOnUserSetup() {
    //To get store personal data 
    let playerBasicInfoData = JSON.parse(localStorage.getItem('playerBasicInfo'));
    for (let i = 0; i < playerBasicInfoData.nooftruckers; ++i) {
        $('.container').append('<div class="track"><div id="div'+i+'" class="verticalLine"><i id="truck'+i+'" class="fa fa-truck" aria-hidden="true"><text class="truckInfoBetClass"></text></i><span class="startGameBar"></span></div></div>');
    }
}

// Start animation once race started
function addClassForTruckANimation(dataLength) {
    $('i').addClass('animated');
    for (let i = 0; i < dataLength; ++i) {
        let truckId = `#truck${i}`;
        $(truckId).addClass("active");
    }
    // Chceking random car and get that car to win the race (bais based random value)
    const random = Math.floor(Math.random() * dataLength);
    let animateTruckID = `#truck${random}`;
    // Put the winTruck value into storage
    localStorage.setItem('winTruck', JSON.stringify(random));
    $(animateTruckID).css({'animation-timing-function': 'ease'});
}

// Stop animation once race completed
function removeClassForTruckANimation(dataLength) {
    $('#startRace').html('Start Race');
    $('i').removeClass('animated');
    for (let i = 0; i < dataLength; ++i) {
        let truckId = `#truck${i}`;
        $(truckId).removeClass("active");
    }
}

// Return color name based on truck index 
function retrunColorNames(colorIndex) {
    switch (colorIndex) {
        case 0:
            return 'Green';
        case 1:
            return 'Red';
        case 2:
            return 'Yellow';
        case 3:
            return 'Blue';
        case 4:
            return 'Orange';
        case 5:
            return 'Navy'
        default:
            break;
    }
}