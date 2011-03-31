function eraseAll() {
  var answer = confirm("Are you sure that you want to clear the local storage?");
  if (answer) {
    localStorage.clear();
  }
  location.reload();
}

function eraseData() {
  //localStorage.clear();
  var answer = confirm("Are you sure that you want to clear new/un-uploaded records?");
  if (answer) {
    for (var i = 1; i < localStorage.length; i++) {
      var TimePattern = /10000000\d{14}/;
      var tempKey = localStorage.key(i);
      if (TimePattern.test(localStorage.getItem(tempKey))) {
      localStorage.removeItem(tempKey);
      }
    }
  }
  location.reload();
}

function showALL() {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;

  var content = '<p>The following is the recent browsing records</p><table style="border:0;"><tr><th> </th><th>ID</th><th>Checked Time</th></tr>';

  var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  var TimePattern = /10000000\d{14}/;
  for (var i = 0; i < localStorage.length; i++) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      checkedTime = checkedTime.substr(8).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$2 $3, $1 at $4:$5");
      content = content + '<tr><td style="color:#ccc">' + i + '</td>';
      if (dotCheck.test(tempKey)) {
        content = content + '<td>doi:<a href="http://dx.doi.org/' + tempKey + '" target=_blank>' + tempKey + '</a></td>';
      } else if (pmcCheck.test(tempKey)) {
        content = content + '<td>pmcid:<a href="http://www.ncbi.nlm.nih.gov/pmc/' + tempKey + '" target=_blank>' + tempKey + '</a></td>';
      } else {
        content = content + '<td>pmid:<a href="http://www.ncbi.nlm.nih.gov/pubmed/' + tempKey + '" target=_blank>' + tempKey + '</a></td>';
      }
      content = content + '<td><a style="background:#ddd" onclick="EntrezAJAX(\'' + tempKey + '\')">' + m_names[checkedTime.substr(0,2)-1] + checkedTime.substr(2) + '<a></td></tr>';
    }
  }

  content = content + '</table>';
  $("#record-table").html(content);
  $("#record-table").removeClass("Off");
  $("#showALL").addClass("Off");
  $("#hideALL").removeClass("Off");
}

function hideALL() {
  $("#record-table").addClass("Off");
  $("#result").addClass("Off");
  $("#showALL").removeClass("Off");
  $("#hideALL").addClass("Off");
}

function loadOptions() {
  var abstractOp = localStorage["abstractOp"];

  // valid abstractOp are No and Yes, default No
  if (abstractOp == undefined || (abstractOp != "No" && abstractOp != "Yes")) {
    abstractOp = "No";
  }

  var select = document.getElementById("abstract");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
      if (child.value == abstractOp) {
      child.selected = "true";
      break;
    }
  }
}

function saveOptions() {
  var select = document.getElementById("abstract");
  var choice = select.children[select.selectedIndex].value;
  localStorage["abstractOp"] = choice;
}

function eraseOptions() {
  localStorage.removeItem("abstractOp");
  location.reload();
}

function EntrezAJAX(search_term) {
  $(document).ready(function() {
    args = {'apikey' : 'ab25c21c079653919d9b53213ac8cc6e',
            'db' : 'pubmed',
            'retmax' : '10',
            'term' : search_term};
    $.getJSON('http://entrezajax2.appspot.com/esearch+esummary?callback=?', args, function(data){
      $('#result').html('');
      $.each(data.result, function(i, item){
        var author_list = '';
        for(var j = 0; j < item.AuthorList.length; j ++) {     
          if ( j == 0 ) {
            author_list = '<b>' + item.AuthorList[j] + '</b>';
          }
          else if ( j == (item.AuthorList.length - 1) ) {
            author_list += ', <b>' + item.AuthorList[j] + '</b>';
          }
          else {
            author_list += ', ' + item.AuthorList[j];
          } 
        }
        var html = '<p style="font-size:0.85em;"><a target="blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + item.ArticleIds.pubmed + '">' + item.Title + '</a> ' + author_list + '</b><br/><i>' + item.FullJournalName + '</i> ; ' + item.SO + '</p><button onclick="eFetch(' + item.ArticleIds.pubmed + ')"> more </button><br/>';
        $("<div/>").html(html).appendTo('#result');
      });
    });
  });
  $("#result").removeClass("Off");
  $("#found").addClass("Off");
}

function eFetch(pmid) {
  $(document).ready(function() {
    $.getJSON('http://pipes.yahoo.com/pipes/pipe.run?_id=e813f339484b562f66c1623df371c59c&_render=json&pmid=123456', function(data){
      $('#result').html('');
      $.each(data.value.items, function(i, item){
        var html = '<div>' + item.Language + '</div>';
        $("<div/>").html(html).appendTo('#result');
      });
    });
  });
}