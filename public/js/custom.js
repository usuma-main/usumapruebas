$('[lang="en"]').hide();

$('#switch-lang').click(function() {
    $('[lang="en"]').toggle();
    $('[lang="es"]').toggle();
});