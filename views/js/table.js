function draw_table() {
  $("#results").empty();
  $.getJSONuncached = function (url) {
    return $.ajax(
      {
        url: url,
        type: 'GET',
        cache: false,
        success: function (html) {
          $("#results").append(html);
          select_row();
        }
      });
  };
  $.getJSONuncached("/get/html")
};

function select_row() {

  $("#menuTable tbody tr[entree]").click(function () {

    let section, entree;

    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    //$(this).addClass("selected").siblings().removeClass("selected");

    section = $(this).attr("secIndexNum");
    entree = $(this).attr("entree") - 1;
    console.log("section index: " + section);
    console.log("entree index: " + entree);
    console.log(".selected: " + $(".selected").closest('tr').text());

    document.forms[1].entree.value = entree;
    document.forms[1].id.value = $(this).children("TD")[1].innerHTML;
    document.forms[1].title.value = $(this).children("TD")[2].innerHTML;
    document.forms[1].author.value = $(this).children("TD")[3].innerHTML;
    document.forms[1].price.value = $(this).children("TD")[4].innerHTML;

    if ($("#CRUD_option").val() == 0 && section != null && entree != null) {
      $(".selected").removeClass("selected");
      section = undefined;
      entree = undefined;
    }
    if ($("#CRUD_option").val() == 1 && section != null && entree != null) {
      section = undefined;
      entree = undefined;
    }
    if ($("#CRUD_option").val() == 2) {
      delete_row(section, entree);
    }
  })
};


function delete_row(sec, ent) {

  $("#del-sec").val(sec);
  $("#del-ent").val(ent);

  $("#delete").click(function (e) {
    e.stopImmediatePropagation();
    // e.preventDefault();

    // const isConfirmed = confirm("Are you sure you'd like to delete the selected row?")
    // if (isConfirmed == true) {
    if ( ($("#del-sec").val().length === 0 && $("#del-ent").val().length === 0) 
    || $("#del-sec").val().length === 0 || $("#del-ent").val().length === 0) {
      alert("Nothing selected.\nTo delete a book, please click the required row first.")
    }else {
      $.ajax(
        {
          url: "/post/delete",
          type: "POST",
          data:
          {
            section: $("#del-sec").val(),
            entree: $("#del-ent").val()
          },
          cache: false,
          success: setTimeout(draw_table, 1000),
        })

    $(".selected").removeClass("selected");
    $("#del-sec").val($("#del-sec").placeholder);
    $("#del-ent").val($("#del-ent").placeholder);
    //e.preventDefault();
    }
    //  else {
    // $(".selected").removeClass("selected");
    // }
  })

};

$(document).ready(function () {
  draw_table();
});

function change_CRUD_option(value) {

  if (value == 0) {
    $(".selected").removeClass("selected");
    $('#formCreation').show();
    $('#formUpdate').hide();
    $('#delete').hide();
    $('#formCalcBill').hide();
    $('#menuTable input[type=checkbox]').attr('disabled', 'true');

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }
  if (value == 1) {
    $(".selected").removeClass("selected");
    $('#formCreation').hide();
    $('#formUpdate').show();
    $('#delete').hide();
    $('#del-text-muted').hide();
    $('#formCalcBill').hide();
    $('#menuTable input[type=checkbox]').attr('disabled', 'true');

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }
  if (value == 2) {

    $('#formCreation').hide();
    $('#formUpdate').hide();
    $('#delete').show();
    $(".selected").removeClass("selected");
    $('#del-text-muted').show();
    $('#formCalcBill').hide();
    $('#menuTable input[type=checkbox]').attr('disabled', 'true');

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }
  if (value == 3) {
    $(".selected").removeClass("selected");
    $('#formCreation').hide();
    $('#formUpdate').hide();
    $('#delete').hide();
    $('#del-text-muted').hide();
    $('#formCalcBill').show();
    $('#calc-text-muted').show();
    $('#menuTable input[type=checkbox]').removeAttr("disabled");

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }

}

function changeSection(value) {

  if (value == 'Fiction') {
    console.log(value);
    $('#sectionFiction').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 0;
    document.forms[1].sec_n.value = 0;
    $('#sectionSF').hide();
    $('#sectionIT').hide();
    $("#del-sec").val($("#del-sec").placeholder);
    $("#del-ent").val($("#del-ent").placeholder);

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;

  }

  if (value == 'SF') {
    console.log(value);
    $('#sectionSF').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 1;
    document.forms[1].sec_n.value = 1;
    $('#sectionFiction').hide();
    $('#sectionIT').hide();
    $("#del-sec").val($("#del-sec").placeholder);
    $("#del-ent").val($("#del-ent").placeholder);

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }

  if (value == 'IT') {
    console.log(value);
    $('#sectionIT').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 2;
    document.forms[1].sec_n.value = 2;
    $('#sectionFiction').hide();
    $('#sectionSF').hide();
    $("#del-sec").val($("#del-sec").placeholder);
    $("#del-ent").val($("#del-ent").placeholder);

    document.forms[0].id.value = null;
    document.forms[0].title.value = null;
    document.forms[0].author.value = null;
    document.forms[0].price.value = null;

    document.forms[1].entree.value = null;
    document.forms[1].id.value = null;
    document.forms[1].title.value = null;
    document.forms[1].author.value = null;
    document.forms[1].price.value = null;
  }
};

function loadMore(sectionSelected) {

  console.log("[sectionSelected]");
  console.log(sectionSelected);
  // console.log("loadSetSize: " + loadSetSize);

  let x = sectionSelected.children;
  let currAndNextLoadSet = [];
  let txt = "";
  let i, j, currLoadSetNum = 0, temp_i;

  for (i = 0; i < x.length; i++) {
    for (j = 0; j < x[i].attributes.length; j++) {
      if (x[i].attributes[j].name == 'style' && x[i].attributes[j].value == 'display: table-row;') {
        currLoadSetNum = x[i].attributes[j + 1].value;
        currAndNextLoadSet.push(i);

      }
      else {
        if (x[i].attributes[j].name == 'prevloadset' && x[i].attributes[j].value == currLoadSetNum) {
          currAndNextLoadSet.push(i);
          // currLoadSetNum = 0;
        }
      }
    }
  }
  console.log("currAndNextLoadSetIndex: " + currAndNextLoadSet);

  for (temp_i = 0; temp_i < currAndNextLoadSet.length; temp_i++) {
    //txt = txt + x[temp_i] + "\n";
    $(x[temp_i]).css('display', 'table-row');

    //hide "Load More" btn
    if (currAndNextLoadSet.length == x.length - 1) {
      // $('#loadMore').hide();
      $(x[x.length - 1]).css('display', 'none');
    }
  }
  //console.log("txt : " + txt );
}
