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

        const listItem = $("<li>").addClass("item-wrapper");
        const trash = $("<i>").addClass("fa fa-trash-o").attr("aria-hidden", "true");
        const trashDiv = $('<div>').addClass('delete-button').append(trash);

        listItem
          .append(
            $("<i>")
              .addClass("fa fa-circle-o")
              .addClass("completed-button")
              .attr("aria-hidden", "true")
          )
          .append(
            $("<span>")
              .addClass("item-text")
              .text(todos[i].item)
          )
          .append(trashDiv)
          .append(
            $("<i>")
              .addClass("fa fa-circle")
              .addClass("edit-button")
              .attr("aria-hidden", "true")
          );

        listItem.prependTo($("ul[data-category=" + categoryId + "]"));
      }
    });
  }

  loadTodos();

  // <i class="fa fa-check-circle-o" aria-hidden="true"></i>

  function createNewTodo(event) {
    var text = $(".todo-post-box").val();
    var categoryId = 1;

    const trash = $("<i>").addClass("fa fa-trash-o").attr("aria-hidden", "true");
    const trashDiv = $('<div>').addClass('delete-button').append(trash);

    const listItem = $("<li>").addClass("item-wrapper");
    listItem
      .append(
        $("<i>")
          .addClass("fa fa-circle-o")
          .addClass("completed-button")
          .attr("aria-hidden", "true")
      )
      .append(
        $("<span>")
          .addClass("item-text")
          .text(text)
      )
      .append(trashDiv)
      .append(
        $("<i>")
          .addClass("fa fa-circle")
          .addClass("edit-button")
          .attr("aria-hidden", "true")
      );

    listItem.prependTo($("ul[data-category=" + categoryId + "]"));

    console.log(text);
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: { text: text }
    })
      .done(function() {
        $(".todo-post-box").val("");
      })
      .fail(function(err) {
        $("ul[data-category=" + categoryId + "]")
          .first()
          .remove();
      });
  }

  $(".todo-button").on("click", createNewTodo);

  $(".todo-post-box").on("keypress", function(event) {
    if (event.which === 13) {
      createNewTodo(event);
    }
  });
});
