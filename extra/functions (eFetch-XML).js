function eraseAll() {
  var answer = confirm("Are you sure you want to clear the local storage?");
  if (answer) {
    localStorage.clear();
  }
  location.reload();
}

function eraseData() {
  //localStorage.clear();
  var answer = confirm("Are you sure you want to clear the pattern matched recorded history?");
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

  var content = '<p>The following is the complete browsing history</p><table style="border:0;"><tr><th> </th><th>ID</th><th>Checked Time</th></tr>';

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
      content = content + '<td>' + m_names[checkedTime.substr(0,2)-1] + checkedTime.substr(2) + '</td></tr>';
    }
  }

  content = content + '</table>';
  document.getElementById('record-table').innerHTML = content;
  document.getElementById('record-table').style.display = "";
  document.getElementById('showALL').style.display = "none";
  document.getElementById('hideALL').style.display = "";
}

function hideALL() {
  document.getElementById('record-table').style.display = "none";
  document.getElementById('showALL').style.display = "";
  document.getElementById('hideALL').style.display = "none";
}

function loadPubmedID(url) {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttpID = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    var xmlhttpID = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttpID.onreadystatechange = function() {
    if (xmlhttpID.readyState == 4 && xmlhttpID.status == 200) {
      var xid = xmlhttpID.responseXML.documentElement.getElementsByTagName("Id");
      try {
        pmid = xid[0].firstChild.nodeValue;
      }
      catch (er) {
        pmid = "NA";
      }
    document.getElementById('get-pmid').innerText = "eSearch PMID: " + pmid;
    document.getElementById('get-pmid').style.display = "";
    document.getElementById('get-pmid').style.background = "#ddd";
    }
  }
  url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&tool=pubmeder&usehistory=y&email=i@cail.cn&retmax=1&term=' + url;
  xmlhttpID.open("GET",url,true);
  xmlhttpID.send(null);
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

//http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&tool=pubmeder&retmode=xml&id=17159977
function loadAbstract(url) {
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var p = xmlhttp.responseXML.documentElement.getElementsByTagName("PubmedArticle");

      var x = p[0].getElementsByTagName("ArticleTitle");
      try { var xx = x[0].firstChild.nodeValue; //extract article title
      } catch (er) { xx = "NA"; }
      x = p[0].getElementsByTagName("ISOAbbreviation");
      try { var ti = x[0].firstChild.nodeValue; //extract journal title
      } catch (er) { ti = "NA"; }
      x = p[0].getElementsByTagName("Volume");
      try { var vol = x[0].firstChild.nodeValue;
      } catch (er) { vol = "NA"; }
      x = p[0].getElementsByTagName("Issue");
      try { var iss = x[0].firstChild.nodeValue;
      } catch (er) { iss = "NA"; }
      x = p[0].getElementsByTagName("Year");
      try { var yr = x[0].firstChild.nodeValue;
      } catch (er) { yr = "NA"; }
      x = p[0].getElementsByTagName("MedlinePgn");
      try { var pgs = x[0].firstChild.nodeValue;
      } catch (er) { pgs = "NA"; }
      x = p[0].getElementsByTagName("AbstractText");
      try { var absText = x[0].firstChild.nodeValue;
      } catch (er) { absText = "NA"; }
      
      var authorList = "";
      try { var ln = p[0].getElementsByTagName("LastName"); //extract author list
      } catch (er) { ln = "NA"; }
      try { var inn = p[0].getElementsByTagName("Initials"); //extract author initials
      } catch (er) { inn = "NA"; }
      for (var j = 0; j < (ln.length - 1); j++) {
        if (ln[j].firstChild.nodeValue != null) {
          if (j != 0) authorList = authorList + ", ";
          authorList = authorList + ln[j].firstChild.nodeValue + " " + inn[j].firstChild.nodeValue.replace(/(\w)(\w)/g,"$1.$2") + ".";
        }
      }  
      authorList = authorList + " and " + ln[j].firstChild.nodeValue + " " + inn[j].firstChild.nodeValue.replace(/(\w)(\w)/g,"$1.$2") + ".";
      
      var format = '<span style="font-size:0.85em;">' + authorList + ' (' + yr + '). <b>' + xx + '</b> ' + ti + ' <i>' + iss + '</i>, ' + pgs + '.</span><span style="font-size:0.8em;">' + absText + '</span>';
      document.getElementById('show-pmid').innerHTML = format;
      document.getElementById('show-pmid').style.display = "";
      document.getElementById('show-pmid').style.background = "#ddd";
    }
  }
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}
