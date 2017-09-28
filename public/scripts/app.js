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

        $("<li>")
          .text(todos[i].item)
          .appendTo($("ul[data-category=" + categoryId + "]"));
      }
    });
  }

  loadTodos();

  $(".todo-button").on("click", function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: $(".todo-post-box").text()
    }).done(function(item) {
      console.log(item);
      // const categoryId = 1;
      // $("<li>")
      // .text(item)
      // .appendTo($("ul[data-category=" + categoryId + "]"));
    });
  });

});
