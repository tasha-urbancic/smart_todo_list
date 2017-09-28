$(() => {
  $.ajax({
    method: "GET",
    url: "/todos"
  }).done(todos => {
    for (var i = 0; i < todos.length; i++) {
      var categoryId = todos[i].category_id;
      console.log(req.session.user_id);

      $("<li>")
        .text(todos[i].item)
        .appendTo($("ul[data-category=" + categoryId + "]"));
    }
  });
});
