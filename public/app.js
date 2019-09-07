// Take inputs from user and construct a custom cover letter
// -name of company
// - back end front end?
// maybe a drop down to select bullet points or something
// categorize dropdowns to be back/front end specific
$("#searchBar").on("keyup", function() {
  var value = $(this)
    .val()
    .toLowerCase();
  $("#results *").filter(function() {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(value) > -1
    );
  });
});

$(document).on("click", "#make-new", function() {
  console.log($("#backend").is(":checked"))
  //get the text for the bullet point and then figure out if it's a back end skill (for categorization)
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      point: $("#title").val(),
      backend: $("#backend").is(":checked"),
      created: Date.now()
    }
  })
    // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
      // Add the title and delete button to the #results section
     location.reload()
    })
});

$(document).on("click", ".btn-danger", function() {
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),
    success: function(response) {
      selected.remove();
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html(
        '<button id="make-new" class="btn btn-block btn-info">Submit</button>'
      );
    }
  });
});

$(document).on("click", ".dataTitle", function() {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      console.log(data);
      $(".modal-title").html(data.title);
      $(".modal-body").html(data.note);
      $(".modal-footer").html(
        "<button type='button' class='btn btn-success' id='editForm' data-dismiss='modal' data-id=" +
          selected.attr("data-id") +
          " >Edit Entry</button>"
      );
    }
  });
});
$(document).on("click", "#editForm", function() {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      console.log(data);
      $("#note").val(data.note);
      $("#title").val(data.title);
      $("#action-button").html(
        "<button id='updater' class='btn btn-success btn-block' data-id=" +
          selected.attr("data-id") +
          ">Edit</button>"
      );
    }
  });
});

$(document).on("click", "#updater", function() {
  var selected = $(this);
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    success: function(data) {
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html(
        "<button id='make-new' class='btn btn-block btn-info'>Submit</button>"
      );
      getResults();
    }
  });
});
