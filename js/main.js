$('form').submit(function(e) {
    e.preventDefault();
});

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

// Hide clear button
$('#clear').hide();

// Toggle button visibilty on focus, keyup, and clear
$('#search').focus(searchButtonVisibility).keyup(searchButtonVisibility);
$('#clear').click(searchButtonVisibility);
