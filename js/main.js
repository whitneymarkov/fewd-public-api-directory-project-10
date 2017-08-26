//========================================================================================
// Search form
//========================================================================================

// Toggle button visibilty based on input field
function searchButtonVisibility() {
    if($(this).val().length > 0) {
        $('#submit').hide();
        $('#clear').show();
    } else {
        $('#clear').hide();
        $('#submit').show();
    }
}

// prevent submit button from reloading page
$('form').submit(function(e) {
    e.preventDefault();
});

// Hide clear button
$('#clear').hide();

// Toggle button visibilty on focus, keyup, and clear
$('#search').focus(searchButtonVisibility).keyup(searchButtonVisibility);
$('#clear').click(searchButtonVisibility);

//========================================================================================
// AJAX
//========================================================================================

// capitalise first letter of string
function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// capitalise 5th letter of string
function capitaliseStreet(streetString) {
    var transformedStreet = '';
    for(var i = 0; i < streetString.length; i++) {
        if (i === 5) {
            transformedStreet += streetString.charAt(i).toUpperCase();
        } else {
            transformedStreet += streetString.charAt(i).toLowerCase();
        }
    }
    return transformedStreet;
}

// format date of birth
function convertDate(date) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(date);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

// ajax request and posting data
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=gb',
    dataType: 'json',
    success: function (data) {
        // html to be added to the page
        var ajaxHTML = '<ul id="ajaxHTML" class="employeeList">';

        for (var i = 0; i < data.results.length ; i++) {

            // Name variables
            var firstName = capitalise(data.results[i].name.first);
            var lastName = capitalise(data.results[i].name.last);
            var fullName = firstName + ' ' + lastName;

            // Contact variables
            var userName = data.results[i].login.username;
            var email = data.results[i].email;
            var phone = data.results[i].cell;

            //location variables
            var country = capitalise(data.results[i].location.state);
            var street = capitaliseStreet(data.results[i].location.street);
            var postalCode = data.results[i].location.postcode;
            var area = capitalise(data.results[i].location.city);

            //personal variables
            var birthdate = convertDate(data.results[i].dob);
            var img = data.results[i].picture.large;

            ajaxHTML += '<li class="employee">' +
                            '<div class="employeeImage">' +
                            '<img src="' + img + '" alt="Employee Portrait">' +
                            '</div>' +
                            '<div class="employeeInfo">' +
                            '<h3 class="employeeName">' + fullName + '</h3>' +
                            '<span class="username">' + userName + '</span>' +
                            '<span>' + email + '</span>' +
                            '<span>' + area + ', ' + country + '</span>' +
                            '</div>' +
                            '<div class="additionalInformation">' +
                            '<span>' + phone + '</span>' +
                            '<div>' +
                            '<span>' + street + ' ' + '</span>' +
                            '<span>' + postalCode + ', ' + '</span>' +
                            '<span>' + area + ', ' + country + '</span>' +
                            '</div>' +
                            '<span class="birthday" class="employeeBirthday"> Birthday: ' + birthdate + '</span>' +
                            '</div>' +
                            '</li>';
        }
        ajaxHTML += '</ul>';
        // add html inside wrapper
        $('#employees').html(ajaxHTML);

//========================================================================================
// Modal (to initialise only after ajax is complete)
//========================================================================================

        var $overlay = $('<div id="overlay"></div>');
        var $modal = $('<div id="modal"></div>');
        var $navigation = $('<button id="previous" class="navigation">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                            '</button>' +
                            '<button id="next" class="navigation">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
                            '</button>');
        var $employee = $('#ajaxHTML li');

        // clear the modal
        function clearInfo () {
            currentInfo.remove();
        }
        // get current employee information, update modal
        function getCurrentEmployee (currentEmployee) {
            thisEmployee = $(currentEmployee).children();
            currentInfo = thisEmployee.clone();
            $modal.append(currentInfo);
        }

        // clear modal, get next employee information, update modal
        function getNextEmployee () {
            clearInfo();
            nextEmployee = thisEmployee.parent().next();
            getCurrentEmployee(nextEmployee);
        }

        // clear modal, get previous employee information, update modal
        function getPrevEmployee () {
            clearInfo();
            prevEmployee = thisEmployee.parent().prev();
            getCurrentEmployee(prevEmployee);
        }

        // toggle visibility of arrow based on next or previous employee
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

        // Keyboard arrow functionality
        $(document).keydown(function(e) {
            if (e.keyCode == 39 && thisEmployee.parent().next().length > 0) {
                getNextEmployee();
                arrowVisibility();
            }

            if (e.keyCode == 37 && thisEmployee.parent().prev().length > 0) {
                getPrevEmployee();
                arrowVisibility();
            }
        });

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

    } // end success ajax
}); // end ajax
