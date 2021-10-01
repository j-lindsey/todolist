let updateList = function () {
    $('.todos').html('');
    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=157',
        dataType: 'json',
        success: function (response, textStatus) {
            response.tasks.forEach(function (item) {
                $('.todos').append('<div class="item" id='+item.id+'><button class="done"></button><p>' + item.content + '</p></div>');
            })

        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

}

let addToDo = function () {
    let todo = $('.newtodo input').val();
    $('.newtodo input').val() = "";
    $.ajax({
        type: 'POST',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=157',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            task: {
                content: todo
            }
        }),
        success: function (response, textStatus) {
            console.log(response);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
    updateList();
}

let completeToDo = function (ele) {
    let id = $(ele).parent().attr('id');
    if (ele.next().hasClass('completed')) {
        $(ele).html('');
        $(ele).next().removeClass('completed');
        $.ajax({
            type: 'PUT',
            url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/'+id+'/mark_active?api_key=157',
            dataType: 'json',
            success: function (response, textStatus) {
              console.log(response);
            },
            error: function (request, textStatus, errorMessage) {
              console.log(errorMessage);
            }
          });
    } else {
        $(ele).next().addClass('completed');
        $(ele).html('&#10003'); 
        $.ajax({
            type: 'PUT',
            url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/'+id+'/mark_complete?api_key=157',
            dataType: 'json',
            success: function (response, textStatus) {
              console.log(response);
            },
            error: function (request, textStatus, errorMessage) {
              console.log(errorMessage);
            }
          });
           
    }
}



$(document).ready(function () {
    updateList();

    $('.newtodo button').on('click', function () {
        addToDo();
    });

    $(document).on('click', '.done', function () {
        let button = $(this)
        completeToDo(button);
    })

});