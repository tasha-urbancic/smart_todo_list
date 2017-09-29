function createTodo(itemObj) {
  const listItem = $("<li>").addClass("item-wrapper");

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
    .addClass("delete-button")
    .append(marker);
  const circle = $("<i>")
    .addClass("fa fa-circle")
    .attr("aria-hidden", "true");
  const circleDiv = $("<div>")
    .addClass("delete-button")
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
          categoryId: categoryId
        });
      }
    });
  }

  loadTodos();

  // <i class="fa fa-check-circle-o" aria-hidden="true"></i>

  function createNewTodo(event) {
    var text = $(".todo-post-box").val();
    var categoryId = 1;

    createTodo({
      text: text,
      categoryId: categoryId
    });

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

  $(".todo-list").on("click",".delete-button", function() {
      console.log('yes');

      event.preventDefault();
      $.ajax({
        method: "POST",
        url: "/:todo_id/delete",
        data: { text: text }
      })
  });

  $(".todo-button").on("click", createNewTodo);

  $(".todo-post-box").on("keypress", function(event) {
    if (event.which === 13) {
      createNewTodo(event);
    }
  });
});
