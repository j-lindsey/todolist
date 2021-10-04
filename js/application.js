let type = 'activeItems';


let updateToggle = function (item) {
    let toggle = ['activeItems', 'allItems', 'completedItems'];
    $(item).addClass('active');
    console.log(item);
    const index = toggle.indexOf(type);
    if (index > -1) {
        toggle.splice(index, 1);
    }
    toggle.forEach(function(ele){
        let element = $('.'+ele);
        console.log(element);
        $(element).removeClass('active');
    })
}

let createToDo = function (item) {
    if (item.completed === false) {
        $('.todos').append('<div class="item" id=' + item.id + '><button class="done"></button><p>' + item.content + '</p><button class="remove">&#10006</button></div>');
    } else {
        $('.todos').append('<div class="item completedDiv" id=' + item.id + '><button class="done">&#10003</button><p class="completed">' + item.content + '</p><button class="remove">&#10006</button></div>');
    }
}


let updateList = function (type) {
    $('.todos').html('');
    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=157',
        dataType: 'json',
        success: function (response, textStatus) {
            response.tasks.forEach(function (item) {
                if (type === 'activeItems') {
                    if (item.completed === false) {
                        createToDo(item);
                    }
                } else if (type === 'allItems') {
                    createToDo(item);
                } else if (type === 'completedItems') {
                    if (item.completed === true) {
                        createToDo(item);
                    }
                }
            })

        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

}

let addToDo = function () {
    let todo = $('.newtodo input').val();
    console.log(todo);
    $('.newtodo input').val('');
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
    updateList(type);
}

let completeToDo = function (ele) {
    let id = $(ele).parent().attr('id');
    if (ele.next().hasClass('completed')) {
        $(ele).html('');
        $(ele).parent().removeClass('completedDiv');
        $(ele).next().removeClass('completed');
        $.ajax({
            type: 'PUT',
            url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=157',
            dataType: 'json',
            success: function (response, textStatus) {
                console.log(response);
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }
        });
    } else {
        $(ele).parent().addClass('completedDiv');
        $(ele).next().addClass('completed');
        $(ele).html('&#10003');
        $.ajax({
            type: 'PUT',
            url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=157',
            dataType: 'json',
            success: function (response, textStatus) {
                console.log(response);
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }
        });
    }
};

let removeToDo = function (ele) {
    let id = $(ele).parent().attr('id');
    $.ajax({
        type: 'DELETE',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=157',
        success: function (response, textStatus) {
            console.log(response);
            $(ele).parent().remove();
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
};



$(document).ready(function () {
    updateList(type);

    $('.newtodo button').on('click', function () {
        addToDo();
    });

    $('.newtodo input').on('keypress', function (e) {
        if (e.which == 13) {
            addToDo();
        }
    });

    $(document).on('click', '.done', function () {
        let button = $(this);
        completeToDo(button);
    });

    $(document).on('click', '.remove', function () {
        let button = $(this);
        removeToDo(button);
    });

    $('.toggle div').on('click', function () {
        if ($(this).hasClass('allItems')) {
            type = 'allItems';
            updateToggle($(this));
            updateList(type);
        } else if ($(this).hasClass('activeItems')) {
            type = 'activeItems';
            updateToggle($(this));
            updateList(type);
        } else if ($(this).hasClass('completedItems')) {
            type = 'completedItems';
            updateToggle($(this));
            updateList(type);
        }
    })

});