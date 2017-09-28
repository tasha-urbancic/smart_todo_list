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

  $('.todo-button').on('click' function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: $('.todo-post-box').text()
    }).done(function() {
    })
  });
  // set up listener on click of button
  // on click do an ajax call to prevent default, and do the post for you

});
