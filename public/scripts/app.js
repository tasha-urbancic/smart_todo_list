
// function creates the category circles
function createCategoryCircles(catId) {
  var keyNum = $("ul[data-category=" + catId + "]").data("key");

  const circle1 = $("<i>")
    .addClass("cat-color-0")
    .data("key", 0)
    .attr("aria-hidden", "true");
  const circle2 = $("<i>")
    .addClass("cat-color-1")
    .data("key", 1)
    .attr("aria-hidden", "true");
  const circle3 = $("<i>")
    .addClass("cat-color-2")
    .data("key", 2)
    .attr("aria-hidden", "true");
  const circle4 = $("<i>")
    .addClass("cat-color-3")
    .data("key", 3)
    .attr("aria-hidden", "true");
  const circle5 = $("<i>")
    .addClass("cat-color-4")
    .data("key", 4)
    .attr("aria-hidden", "true");

  if (keyNum === 0) {
    circle1.addClass("fa fa-circle fa-lg").addClass("current-category");
    circle2.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle3.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle4.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle5.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
  }

  if (keyNum === 1) {
    circle1.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle2.addClass("fa fa-circle fa-lg").addClass("current-category");
    circle3.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle4.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle5.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
  }

  if (keyNum === 2) {
    circle1.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle2.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle3.addClass("fa fa-circle fa-lg").addClass("current-category");
    circle4.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle5.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
  }

  if (keyNum === 3) {
    circle1.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle2.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle3.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle4.addClass("fa fa-circle fa-lg").addClass("current-category");
    circle5.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
  }

  if (keyNum === 4) {
    circle1.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle2.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle3.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle4.addClass("fa fa-circle-o fa-lg").addClass("alternate-category");
    circle5.addClass("fa fa-circle fa-lg").addClass("current-category");
  }

  const categoryDiv = $("<div>")
    .addClass("category-button")
    .append(circle1)
    .append(circle2)
    .append(circle3)
    .append(circle4)
    .append(circle5)
    .css("display", "inline-block");

  return categoryDiv;
}

// function creates a single todo list item, 
// and appends to the appropriate list
function createTodo(itemObj) {
  const listItem = $("<li>")
    .addClass("item-wrapper")
    .data("id", itemObj.id);

  const trash = $("<i>")
    .addClass("fa fa-trash-o fa-lg")
    .attr("aria-hidden", "true");
  const trashDiv = $("<div>")
    .addClass("delete-button")
    .append(trash)
    .css("display", "inline-block");
  const marker = $("<i>")
    .addClass("fa fa-circle-thin ")
    .attr("aria-hidden", "true");
  const markerDiv = $("<div>")
    .addClass("marker-button")
    .append(marker);

  var categoryDiv = createCategoryCircles(itemObj.categoryId);

  const actionDiv = $("<div>")
    .addClass("action-button")
    .append(trashDiv)
    .append(categoryDiv)
    .css("display", "none");

  listItem
    .append(markerDiv)
    .append(
      $("<span>")
        .addClass("item-text")
        .addClass('auto-wrap')
        .attr("contentEditable", "true")
        .text(itemObj.text)
    )
    .append(actionDiv);

  listItem.prependTo($("ul[data-category=" + itemObj.categoryId + "]"));
}

// delete a single todo list item
function deleteTodo(event) {
    const itemId = $(event.target)
      .closest("li")
      .data("id");
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/user/:id/delete/:todo_id",
      data: { id: itemId },
    })
      .done(function(result) {
        $(event.target)
          .closest("li")
          .remove();
      })
      .fail(function(err) {
        console.log(err);
      });
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

  // when page is loaded, load the todos
  loadTodos();

  function createNewTodo(event) {
    var text = $(".todo-post-box").val();

    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/todos",
      data: { text: text }
    }).done(function(result) {
      $(".todo-post-box").val("");
      createTodo({
        text: text,
        id: result.id,
        categoryId: result.category_id
      });
    });
  }

  function updateTodo(text, itemId, $elem) {
    let data = { id: itemId, item: text };
    $.ajax({
      method: "POST",
      url: "/user/:id/update-text/:todo_id",
      data: { data: data }
    })
      .done(function(result) {
        $elem.parent("li").remove();
        createTodo({
          text: result[0].item,
          id: result[0].id,
          categoryId: result[0].category_id
        });
      })
      .fail(function(err) {
        console.log(err);
      });
  }

  $("body").on("keypress", "[contenteditable]", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let text = $(event.target).text();
      if (text.length === 0) {
        deleteTodo(event);
        return;
      } else {
      const itemId = $(event.target)
        .closest("li")
        .data("id");
      updateTodo(text, itemId, $(event.target));
      }
    }
  });

  function updateTodoCategory(newCategoryId, itemId, $elem) {
    let data = { id: itemId, category_id: newCategoryId };

    $.ajax({
      method: "POST",
      url: "/user/:id/update-category/:todo_id",
      data: { data: data },
      success: function() {
        $elem.remove();
        createTodo({
          text: $elem.find("span").text(),
          id: itemId,
          categoryId: newCategoryId
        });
      }
    }).fail(function(err) {
      console.log(err);
    });
  }

  // listener: clicking category buttons
  $(".todo-list").on("click", ".category-button", function(event) {
    event.preventDefault();

    const itemId = $(event.target)
      .closest("li")
      .data("id");

    const listKey = $(event.target)
      .closest("ul")
      .data("key");
    const clickedKey = $(event.target).data("key");

    if (clickedKey !== listKey) {
      var newCategoryId = $(".category-button .cat-color-0.fa-circle-o")
        .closest(".mx-auto")
        .find("ul[data-key=" + clickedKey + "]")
        .data("category");

      var $elem = $(event.target).closest("li");

      updateTodoCategory(newCategoryId, itemId, $elem);
    }
  });

  // listener: clicking list items, show action buttons
  $(".todo-list").on("click", "li", function(event) {
    $(event.target)
      .siblings(".action-button")
      .show()
      .css("display", "inline");
    $(document).mouseup(function(e) {
      var container = $(event.target).siblings(".action-button");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
  });

  // listener: clicking trash button
  $(".todo-list").on("click", ".fa-trash-o", deleteTodo);

  // listener: clicking submit button on form
  $(".todo-button").on("click", createNewTodo);

  // listener: on enter, submit and create todo
  $(".todo-post-box").on("keypress", function(event) {
    if (event.which === 13) {
      createNewTodo(event);
    }
  });

  // listener: on the phone, on enter create new todo
  $(".todo-post-box").submit(function(event) {
    createNewTodo(event);
  });

  // on click of minus sign, toggle list closed
  $(".header-toggle")
    .find("i")
    .on("click", function(event) {
      $(event.target)
        .parent()
        .parent()
        .siblings(".toggle-list")
        .toggle("hide");
    });
});
