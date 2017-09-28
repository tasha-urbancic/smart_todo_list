$(() => {
  $.ajax({
    method: "GET",
    url: "/todos"
  }).done(todos => {
    for (var i = 0; i < todos.length; i++) {
      var categoryId = todos[i].category_id;
  
      $("<li>")
        .text(todos[i].item)
        .appendTo($("ul[data-category=" + categoryId + "]"));
    }
  });

  // set up listener on click of button
  // on click do an ajax call to prevent default, and do the post for you

});
