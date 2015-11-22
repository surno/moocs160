var xml = new XMLHttpRequest();
var currentPage = 0;
var jsonData = null;
$(document).ready(function () {

  //sidebar toggle
  $('.sidebar-btn').click(function(){
    $('#wrapper').toggleClass('toggled');
  });

  //
  //sending of search data get request
  //
  $('#search-btn').click(function(){
    //console.log("---------get allCourseData-----------");
    //where do i send the correct get?!?!?!?
    var searchValue = $('#searchBarTextBox').val();
    //console.log("/search/"+searchValue);
    xml.open("GET", "/search/" + searchValue, true);
    xml.send();
  });

  //
  //watching enter key
  //
  $("#searchBarTextBox").keyup(function(event){
    if(event.keyCode == 13){
      $("#search-btn").click();
    }
  });

  //
  //response data from database
  //
  xml.onreadystatechange = function() {
    if (xml.readyState == 4) {
      jsonData = jQuery.parseJSON(xml.responseText);
      //  console.log(xml.responseText);
      addToCourseTable(jsonData);
    }
  };

  var isTableEmpty = true;
  var table;
  //
  //parsing data from db to table rows
  //
  function addToCourseTable(page){
    //clears the table for the second search
    var rowVals = [];
    if(!isTableEmpty){
      table.clear();
    }
    // $('#coursetable_body').empty();
    //currentPage = page;
    //var currentPageData = jsonData.slice(page * 10, (page + 1) * 10);
    jQuery.each(page, function(i, val) {
      if(isTableEmpty){
        $("#coursetable_body").append(
          "<tr id=\"searchResRow\">"+
          "<td><img class=\"img-circle\" src=\""+val.course_image + "\" width=\"100px\" height=\"100px\"></td>" +
          "<td id=\"c_title\">"+val.title +"</td>" +
          "<td id=\"c_shortdesc\" ><div id=\"table_entries\">" + val.short_desc + "</div></td>" +
          "<td style=\"word-break: break-all;\">"+val.category +"</td>" +
          "<td>"+val.start_date.substring(0,10) +"</td>" +
          "<td>"+val.course_length +"</td>" +
          "<td>"+val.site +"</td></tr>");
        }else{
          //required fix for changing the table  (datatable plugin quirk)
          rowVals = [
            "<img class=\"img-circle\" src=\""+val.course_image+"\" width=\"100px\" height=\"100px\">",
            "<td id=\"c_title\">"+val.title +"</td>",
            "<td id=\"c_shortdesc\" ><div id=\"table_entries\">" + val.short_desc + "</div></td>",
            "<td>"+val.category +"</td>",
            "<td>"+val.start_date.substring(0,10) +"</td>",
            "<td>"+val.course_length +"</td>" ,
            "<td>"+val.site +"</td>"
          ];
          table.row.add(rowVals);
        }
      });

      // removes old search content from table if needed
      if(isTableEmpty){
        addDataTable();
        isTableEmpty = false;
      }
      table.draw();
    }

    //
    // Creates Sortable Data Table after data
    // is inserted
    //
    function addDataTable(){
      //ensures the datatable plugin is initialized only once
      table = $('#coursetable').DataTable({
        "bProcessing": true,
        "bDeferRender": true
      });
    }

  });