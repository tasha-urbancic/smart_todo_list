$(() => {

  $.ajax({
    method: "GET",
    url: "/todos"
  }).done((todos) => {
    console.log(todos);

  });


});

// $("<div>").text(todos.item).appendTo($("body"));