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
    
    var text = $(".todo-post-box").val();
    var categoryId = 1;
    $("<li>")
      .text(text)
      .prependTo($("ul[data-category=" + categoryId + "]"));

    console.log(text);
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: {text: text}
    }).done(function() {
      // success function
    }).fail( function (err) {
      $("ul[data-category=" + categoryId + "]").first().remove();
    });
  });

});
