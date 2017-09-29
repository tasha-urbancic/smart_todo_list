function createTodo(itemObj) {
  const listItem = $("<li>")
    .addClass("item-wrapper")
    .data("id", itemObj.id);

  const trash = $("<i>")
    .addClass("fa fa-trash-o")
    .attr("aria-hidden", "true");
  const trashDiv = $("<div>")
    .addClass("delete-button")
    .append(trash);
  const marker = $("<i>")
    .addClass("fa fa-circle-o")
    .attr("aria-hidden", "true");
  const markerDiv = $("<div>")
    .addClass("marker-button")
    .append(marker);
  const circle = $("<i>")
    .addClass("fa fa-circle")
    .attr("aria-hidden", "true");
  const circleDiv = $("<div>")
    .addClass("circle-button")
    .append(circle);

  listItem
    .append(markerDiv)
    .append(
      $("<span>")
        .addClass("item-text")
        .text(itemObj.text)
    )
    .append(trashDiv)
    .append(circleDiv);

  listItem.prependTo($("ul[data-category=" + itemObj.categoryId + "]"));
}

$(() => {
  function getTodos() {
    return $.ajax({
      method: "GET",
      url: "/todos"
    });
  }

  function loadTodos() {
    return getTodos().done(todos => {
      for (var i = 0; i < todos.length; i++) {
        var categoryId = todos[i].category_id;

        createTodo({
          text: todos[i].item,
          id: todos[i].id,
          categoryId: categoryId
        });
      }
    });
  }

  loadTodos();

  // <i class="fa fa-check-circle-o" aria-hidden="true"></i>

  function createNewTodo(event) {
    var text = $(".todo-post-box").val();

    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: { text: text }
    })
      .done(function(result) {
        $(".todo-post-box").val("");
        createTodo({
          text: text,
          id: result.id[0],
          categoryId: 1
        });
      })
      .fail(function(err) {
        $("ul[data-category=" + categoryId + "]")
          .first()
          .remove();
      });
  }

  // function hideButtons() {
  //   $('document').on('ready', '.fa-trash-o', function() {
  //     $(this).hide();
  //   });

  //   // $(".todo-list").find('.delete-button').find('.fa-trash-o').hide();
  //   // $(".todo-list").children().find('.circle-button').find('.fa-circle').hide();
  // }

  // hideButtons();

  $(".todo-list").on("click", 'li', function(event) {
    $(event.target).siblings('.delete-button').find('.fa-trash-o').toggle();
    $(event.target).siblings('.circle-button').find('.fa-circle').toggle();
  });

  $(".todo-list").on("click", ".fa-trash-o", function(event) {
    const itemId = $(event.target).closest('li').data('id');

    // $(event.target).closest('li').remove();

    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/:todo_id/delete",
      data: { id: itemId }
    }).fail(function(err) {
      $(event.target).closest('li').remove();
    });
  });

  $(".todo-button").on("click", createNewTodo);

  $(".todo-post-box").on("keypress", function(event) {
    if (event.which === 13) {
      createNewTodo(event);
    }
  });
});
