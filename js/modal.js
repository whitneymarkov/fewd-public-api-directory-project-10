var $overlay = $('<div id="overlay"></div>');
var $modal = $('<div id="modal"></div>');
var $navigation = $('<button id="previous" class="navigation">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                    '</button>' +
                    '<button id="next" class="navigation">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                    '</button>');
var $employee = $('#employees li');

function clearInfo () {
    currentInfo.remove();
}

function getCurrentEmployee (currentEmployee) {
    thisEmployee = $(currentEmployee).children();
    currentInfo = thisEmployee.clone();
    $modal.append(currentInfo);
}

function getNextEmployee () {
    clearInfo();
    nextEmployee = thisEmployee.parent().next();
    getCurrentEmployee(nextEmployee);
}

function getPrevEmployee () {
    clearInfo();
    prevEmployee = thisEmployee.parent().prev();
    getCurrentEmployee(prevEmployee);
}

function arrowVisibility () {
    if (thisEmployee.parent().next().length == 0) {
        $('#next').hide();
    } else {
        $('#next').show();
    }

    if (thisEmployee.parent().prev().length == 0) {
        $('#previous').hide();
    } else {
        $('#previous').show();
    }
}

 // Build overlay, modal, and navigation
$modal.append($navigation);
$overlay.append($modal);
$('body').append($overlay);

// Open modal with employee details when clicked
$employee.click(function() {
    getCurrentEmployee(this);
    $overlay.show();
    arrowVisibility();
});

// Arrow functionality
$navigation.click(function() {
    if ($(this).attr('id') === 'next') {
        getNextEmployee();
    }

    if ($(this).attr('id') === 'previous') {
        getPrevEmployee();
    }
    arrowVisibility();
});

// Swipe functionality
$modal.on('swiperight', function() {
    alert('you swiped right');
})
$modal.on('swipeleft', function() {
    alert('you swiped left');
})


// Close and clear modal when overlay is clicked
$overlay.click(function(e) {
    if (e.target.id === ('overlay')) {
        $overlay.hide();
        clearInfo();
    }
});

// Close and clear modal when esc key is pressed
$(document).keydown(function(e) {
    if (e.keyCode == 27) {
        $overlay.hide();
        clearInfo();
    }
});
