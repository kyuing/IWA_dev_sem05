function draw_updates_table() {
  $("#results").empty();
  $.getJSONuncached = function (url) {
    return $.ajax(
      {
        url: url,
        type: 'GET',
        cache: false,
        success: function (updates) {
          $("#results").append(updates);
          select_row();
        }
      });
  };
  $.getJSONuncached("/get/updates")
};

function select_row() {

  $("#menuTable tbody tr[entree]").click(function () {

    let section, entree;

    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    section = $(this).attr("secIndexNum");
    entree = $(this).attr("entree") - 1;
    console.log("section index: " + section);
    console.log("entree index: " + entree);
    console.log(".selected: " + $(".selected").closest('tr').text());
  })
};


$(document).ready(function () {
  draw_updates_table();
});

function changeSection(value) {

  if (value == 'Fiction') {
    console.log(value);
    $('#sectionFiction').show();
    $(".selected").removeClass("selected");
    $('#sectionSF').hide();
    $('#sectionIT').hide();
  }

  if (value == 'SF') {
    console.log(value);
    $('#sectionSF').show();
    $(".selected").removeClass("selected");
    $('#sectionFiction').hide();
    $('#sectionIT').hide();
  }

  if (value == 'IT') {
    console.log(value);
    $('#sectionIT').show();
    $(".selected").removeClass("selected");
    $('#sectionFiction').hide();
    $('#sectionSF').hide();
  }
};

function loadMore(sectionSelected) {

  console.log("[sectionSelected]");
  console.log(sectionSelected);

  let x = sectionSelected.children;
  //let xLengthMinusOne = x.length - 1;
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
        }
      }
    }
  }
  console.log("currAndNextLoadSetIndex: " + currAndNextLoadSet);
  //console.log("x.length - 1: " + xLengthMinusOne);
  //console.log("currAndNextLoadSet.length: " + currAndNextLoadSet.length);

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
