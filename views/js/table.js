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

    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    // var id = $(this).children.attr("id");
    let section = $(this).attr("secIndexNum");
    let entree = $(this).attr("entree") - 1;

    //generate objID if C of CRUD
    // document.forms[0].id.value = generateObjId(8);

    //getters for updation form
    document.forms[1].entree.value = entree;
    document.forms[1].id.value = $(this).children("TD")[1].innerHTML;
    document.forms[1].title.value = $(this).children("TD")[2].innerHTML;
    document.forms[1].author.value = $(this).children("TD")[3].innerHTML;
    document.forms[1].price.value = $(this).children("TD")[4].innerHTML;

    console.log("section index: " + section);
    console.log("entree index: " + entree);

    delete_row(section, entree);

  })
};

function delete_row(sec, ent) {
  $("#delete").click(function () {
    $.ajax(
      {
        url: "/post/delete",
        type: "POST",
        data:
        {
          section: sec,
          entree: ent
        },
        cache: false,
        success: setTimeout(draw_table, 1000)
      })
  })
};

$(document).ready(function () {
  draw_table();
});

// function generateObjId(len) {
//   var maxlen = 8,
//     min = Math.pow(16, Math.min(len, maxlen) - 1)
//   max = Math.pow(16, Math.min(len, maxlen)) - 1,
//     n = Math.floor(Math.random() * (max - min + 1)) + min,
//     r = n.toString(16);
//   while (r.length < len) {
//     r = r + randHex(len - maxlen);
//   }
//   return r;
// }

function changeSection(value) {
  if (value == 'Fiction') {
    console.log(value);
    $('#sectionFiction').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 0;
    document.forms[1].sec_n.value = 0;
    $('#sectionSF').hide();
    $('#sectionIT').hide();
    // location.reload();
  }

  if (value == 'SF') {
    console.log(value);
    $('#sectionSF').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 1;
    document.forms[1].sec_n.value = 1;
    $('#sectionFiction').hide();
    $('#sectionIT').hide();
    // location.reload();
  }

  if (value == 'IT') {
    console.log(value);
    $('#sectionIT').show();
    $(".selected").removeClass("selected");
    document.forms[0].sec_n.value = 2;
    document.forms[1].sec_n.value = 2;
    $('#sectionFiction').hide();
    $('#sectionSF').hide();
    // location.reload();
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
