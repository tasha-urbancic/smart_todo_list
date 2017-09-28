$(() => {

  $.ajax({
    method: "GET",
    url: "/todos"
  }).done((todos) => {
    for(item of todos) {
      $("<div>").text(todos.item).appendTo($("body"));
    }
  });

});
