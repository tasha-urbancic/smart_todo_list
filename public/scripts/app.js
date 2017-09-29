function createCategoryCircles(catId) {

  var keyNum = $("ul[data-category=" + catId + "]").data('key');

  const circle1 = $("<i>")
    .addClass("cat-color-0")
    .attr("aria-hidden", "true");
  const circle2 = $("<i>")
    .addClass("cat-color-1")
    .attr("aria-hidden", "true");
  const circle3 = $("<i>")
    .addClass("cat-color-2")
    .attr("aria-hidden", "true");
  const circle4 = $("<i>")
    .addClass("cat-color-3")
    .attr("aria-hidden", "true");

  if (keyNum === 0) {
    circle1.addClass("fa fa-circle").addClass("current-category");
    circle2.addClass("fa fa-circle-o").addClass("alternate-category");
    circle3.addClass("fa fa-circle-o").addClass("alternate-category");
    circle4.addClass("fa fa-circle-o").addClass("alternate-category");
  }

  if (keyNum === 1) {
    circle1.addClass("fa fa-circle-o").addClass("alternate-category");
    circle2.addClass("fa fa-circle").addClass("current-category");
    circle3.addClass("fa fa-circle-o").addClass("alternate-category");
    circle4.addClass("fa fa-circle-o").addClass("alternate-category");
  }

  if (keyNum === 2) {
    circle1.addClass("fa fa-circle-o").addClass("alternate-category");
    circle2.addClass("fa fa-circle-o").addClass("alternate-category");
    circle3.addClass("fa fa-circle").addClass("current-category");
    circle4.addClass("fa fa-circle-o").addClass("alternate-category");
  }

  if (keyNum === 3) {
    circle1.addClass("fa fa-circle-o").addClass("alternate-category");
    circle2.addClass("fa fa-circle-o").addClass("alternate-category");
    circle3.addClass("fa fa-circle-o").addClass("alternate-category");
    circle4.addClass("fa fa-circle").addClass("current-category");
  }

  const categoryDiv = $("<div>")
    .addClass("category-button")
    .append(circle1)
    .append(circle2)
    .append(circle3)
    .append(circle4)
    .css("display", "none");

  return categoryDiv;
}

function createTodo(itemObj) {
  const listItem = $("<li>")
    .addClass("item-wrapper")
    .data("id", itemObj.id);

  const trash = $("<i>")
    .addClass("fa fa-trash-o")
    .attr("aria-hidden", "true");
  const trashDiv = $("<div>")
    .addClass("delete-button")
    .append(trash)
    .css("display", "none");
  const marker = $("<i>")
    .addClass("fa fa-circle-o")
    .attr("aria-hidden", "true");
  const markerDiv = $("<div>")
    .addClass("marker-button")
    .append(marker);

  var categoryDiv = createCategoryCircles(itemObj.categoryId);

  listItem
    .append(markerDiv)
    .append(
      $("<span>")
        .addClass("item-text")
        .attr("contentEditable", "true")
        .text(itemObj.text)
    )
    .append(trashDiv)
    .append(categoryDiv);

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
          id: todos[i].id,
          categoryId: categoryId
        });
      }
    });
  }

  loadTodos();

  // <i class="fa fa-check-circle-o" aria-hidden="true"></i>

  function createNewTodo(event) {
    var text = $(".todo-post-box").val();

    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: { text: text }
    })
      .done(function(result) {
        $(".todo-post-box").val("");
        createTodo({
          text: text,
          id: result.id[0],
          categoryId: 1
        });
      })
      .fail(function(err) {
        $("ul[data-category=" + categoryId + "]")
          .first()
          .remove();
      });
  }

  function updateTodo(text, itemId) {
    // let text = $(".todo-post-box").val();
    // const itemId = $(event.target).closest('li').data('id');
    console.log(text);
    console.log(itemId);
  }

  $("body")
    .on("focus", "[contenteditable]", function() {
      var $this = $(this);
      $this.data("before", $this.html());
      //console.log($this);
      return $this;
    })
    .on("blur keyup paste input", "[contenteditable]", function() {
      var $this = $(this);
      if ($this.data("before") !== $this.html()) {
        $this.data("before", $this.html());
        $this.trigger("change");
      }
      //console.log($this);
      return $this;
    })
    .on("keydown", function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        let text = $this;
        //console.log(text);
        const itemId = $(event.target)
          .closest("li")
          .data("id");
        updateTodo(text, itemId);
      }
    });

  // .on('blur keyup paste input', '[contenteditable]', function() {
  //   var $this = $(this);
  //   if ($this.data('before') !== $this.html()) {
  //       $this.data('before', $this.html());
  //       $this.trigger('change');
  //   }
  //   return $this;
  // });

  // $(".item-wrapper").on("keypress", function(event) {
  //   console.log('go');
  //   $(this).on('keydown', function(e) {
  //     console.log('no');
  //     if (e.keyCode == 13) {
  //       console.log('yes');
  //       e.preventDefault();
  //     }
  //   })
  // });

  //   $(this).on('keydown', function(event) {
  //     if (event.which === 13) {
  //       event.preventDefault();
  //       updateTodo(event);
  //     }
  //   })
  // });

  $(".todo-list").on("click", "li", function(event) {
    $(event.target)
      .siblings(".delete-button")
      .show();
    $(event.target)
      .siblings(".category-button")
      .show();
    $();
  });

  $(".todo-list").on("click", ".circle-button", function(event) {
    let $this = $(event.target)
      .parent()
      .parert(); //('.category-button');//.toggle();
    console.log($this); //const itemId = $(event.target).closest('li').data('id');
  });

  $(".todo-list").on("click", ".fa-trash-o", function(event) {
    const itemId = $(event.target)
      .closest("li")
      .data("id");
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/:todo_id/delete",
      data: { id: itemId },
      success: function(res) {
        console.log(res);
      }
    })
      .done(function(result) {
        $(event.target)
          .closest("li")
          .remove();
      })
      .fail(function(err) {
        console.log(err);
      });
  });

  $(".todo-button").on("click", createNewTodo);

  $(".todo-post-box").on("keypress", function(event) {
    console.log("run");
    if (event.which === 13) {
      createNewTodo(event);
    }
  });
});
