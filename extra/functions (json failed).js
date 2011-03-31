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

  var content = '<p>The following is the recent browsing records</p><table style="border:0;"><tr><th> </th><th>ID</th><th class="grey">Checked Time</th></tr>';

  var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  var TimePattern = /10000000\d{14}/;
  for (var i = (localStorage.length - 1); i >= 0 ; i--) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      checkedTime = checkedTime.substr(8).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$2 $3, $1 at $4:$5");
      content += '<tr><td class="grey">' + i + '</td>';
      if (dotCheck.test(tempKey)) {
        content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://dx.doi.org/' + tempKey + '" target=_blank>doi:</a>' + tempKey + '</td>';
      } else if (pmcCheck.test(tempKey)) {
        content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://www.ncbi.nlm.nih.gov/pmc/articles/' + tempKey + '/?tool=pubmeder" target=_blank>pmcid:</a>' + tempKey + '</td>';
      } else {
        content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://www.ncbi.nlm.nih.gov/pubmed/' + tempKey + '/?tool=pubmeder" target=_blank>pmid:</a>' + tempKey + '</td>';
      }
      content += '<td class="grey" onclick="eSS(\'' + tempKey + '\')">' + m_names[checkedTime.substr(0,2)-1] + checkedTime.substr(2) + '</td></tr>';
    }
  }

  content += '</table>';
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


function hideMore() {
  $(".moreAbout").addClass("Off");
  $(".AbsButton").removeClass("Off");
  $(".eSum").removeClass("Off");
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


function eFetch(pmid) {
  $(".loadIcon").removeClass("Off");
  $(".eSum").addClass("Off");
  $("#"+pmid).removeClass("Off");
  $(document).ready(function() {
    args = {'apikey' : 'ab25c21c079653919d9b53213ac8cc6e',
            'db' : 'pubmed',
            'id' : pmid};
    $.getJSON('http://entrezajax2.appspot.com/efetch?callback=?', args, function(d){
      $(".AbsButton").addClass("Off");
      $(".loadIcon").addClass("Off");
      $.each(d.result, function(i, l){

        if (l.MedlineCitation.Article.Abstract) {
          var abstract = '<p onClick="hideMore()" class="moreAbout"><b><u>Abstract</u>: </b>' + l.MedlineCitation.Article.Abstract.AbstractText + '</p>';
          $("<div/>").html(abstract).appendTo("#result");
        }

        if (l.MedlineCitation.CommentsCorrectionsList) {
          var ref_list = '<p onClick="hideMore()" class="moreAbout"><b><u>References</u>: </b>';
          for(var j = 0; j < l.MedlineCitation.CommentsCorrectionsList.length; j ++) {     
            if ( j == 0 ) {
              ref_list += '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + l.MedlineCitation.CommentsCorrectionsList[j].PMID + '/?tool=pubmeder">' + l.MedlineCitation.CommentsCorrectionsList[j].RefSource.replace(/([a-zA-Z]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            }
            else {
              ref_list += '; <a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + l.MedlineCitation.CommentsCorrectionsList[j].PMID + '/?tool=pubmeder">' + l.MedlineCitation.CommentsCorrectionsList[j].RefSource.replace(/([a-zA-Z()]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            }
          }
          ref_list += '</p>';
          $("<div/>").html(ref_list).appendTo("#result");
        }

        if (l.MedlineCitation.Article.GrantList) {
          var grant_list = '<p onClick="hideMore()" class="moreAbout"><b><u>Fund By</u>: </b>';
          for(var j = 0; j < l.MedlineCitation.Article.GrantList.length; j ++) {     
            if ( j == 0 ) {
              grant_list += l.MedlineCitation.Article.GrantList[j].Agency + ': ' + l.MedlineCitation.Article.GrantList[j].GrantID;
            }
            else {
              grant_list += '; ' + l.MedlineCitation.Article.GrantList[j].Agency + ': ' + l.MedlineCitation.Article.GrantList[j].GrantID;
            }
          }
          grant_list += '</p>';
          $("<div/>").html(grant_list).appendTo("#result");
        }

        if (l.MedlineCitation.ChemicalList) {
          var keyChem = '<p onClick="hideMore()" class="moreAbout"><b><u>Chemical</u>: </b>';
          for(var j = 0; j < l.MedlineCitation.ChemicalList.length; j ++) {     
            if ( j == 0 ) {
              keyChem += l.MedlineCitation.ChemicalList[j].NameOfSubstance;
            }
            else {
              keyChem += '; ' + l.MedlineCitation.ChemicalList[j].NameOfSubstance;
            }
          }
          keyChem += '</p>';
          $("<div/>").html(keyChem).appendTo("#result");
        }

        if (l.MedlineCitation.MeshHeadingList) {
          var keyHead = '<p onClick="hideMore()" class="moreAbout"><b><u>Heading</u>: </b>';
          for(var j = 0; j < l.MedlineCitation.MeshHeadingList.length; j ++) {     
            if ( j == 0 ) {
              keyHead += l.MedlineCitation.MeshHeadingList[j].DescriptorName;
            }
            else {
              keyHead += '; ' + l.MedlineCitation.MeshHeadingList[j].DescriptorName;
            }
          }
          keyHead += '</p>';
          $("<div/>").html(keyHead).appendTo("#result");
        }

      });
    });
  });
}


function eSummary(term) {
  var webenvCheck = /[a-zA-Z]/;
  if (webenvCheck.test(term)) {
    var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&query_key=1&webenv=' + term;
  } else {
    var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&id=' + term;
  }
  $("#result").html('loading <img class="loadIcon" src="loading.gif" alt="..." />'); // loading
  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: url,
      dataType: "xml",
      success: function(xml) {
        $("#result").html(''); // turn off loading
        $(xml).find('DocSum').each(function(){
          var a = $(this).find('Item[Name="Author"]');
          var author_list = '';
          a.each(function(j){
            if (j == 0) {
              author_list = '<b>' + $(this).text().replace(/ (\w)(\w)/g," $1.$2") + '.</b>';
            } else if (j == (a.length-1)) {
              author_list += ', <b>' + $(this).text().replace(/ (\w)(\w)/g," $1.$2") + '.</b>';
            } else {
              author_list += ', ' + $(this).text().replace(/ (\w)(\w)/g," $1.$2") + '.';
            }
          });

          var pmc = $(this).find('Item[Name="pmc"]').text();
          var doi = $(this).find('Item[Name="doi"]').text();
          var pubmed = $(this).find('Id').text();
          var Title = $(this).find('Item[Name="Title"]').text();
          if (pmc) {
            var titleLink = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pmc/articles/' + pmc + '/?tool=pubmeder">' + Title + '</a> ';
          } else if (doi) {
            var titleLink = '<a target="_blank" href="http://dx.doi.org/' + doi + '">' + Title + '</a> ';
          } else {
            var titleLink = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + pubmed + '/?tool=pubmeder">' + Title + '</a> ';
          }
          
          var PubDate = $(this).find('Item[Name="PubDate"]').text();
          var Source = $(this).find('Item[Name="Source"]').text();
          var Volume = $(this).find('Item[Name="Volume"]').text();
          var Pages = $(this).find('Item[Name="Pages"]').text();
          
          var eSummary = '<p class="eSum" id="' + pubmed + '">' + author_list + ' (' + PubDate + '). ' + titleLink + Source + '.  <i>' + Volume + '</i>, ' + Pages + '<br/><button class="AbsButton" onclick="eFetch(' + pubmed + ')"> More about </button><a id="pmid" target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + pubmed + '/?tool=pubmeder">PMID:' + pubmed + '</a> <img class="loadIcon Off" src="loading.gif" alt="..." /></p>';
          $("<div/>").html(eSummary).appendTo("#result");
        });
        $("#result").removeClass("Off");
        $("#found").addClass("Off");
      }
    });
  });
}


function eSS(search_term) {
  var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&tool=pubmeder&usehistory=y&email=i@cail.cn&term=' + search_term;
  $("#result").html('loading <img class="loadIcon" src="loading.gif" alt="..." />'); // loading
  $("#result").removeClass("Off");
  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: url,
      dataType: "xml",
      success: function(xml) {
        var WebEnv = $(xml).find('WebEnv').text();
        eSummary(WebEnv);
      }
    });
  });
}


function searchinPopup() {
  $("#ess").focus(function() {
    if( this.value == this.defaultValue ) {
      this.value = "";
    }
  }).blur(function() {
    if( !this.value.length ) {
      this.value = this.defaultValue;
    }
  });
}


function clearPopup() {
  $("#result").html('loading <img class="loadIcon" src="loading.gif" alt="..." />');
  $("#ess").val("Search PubMed");
  $("#result").addClass("Off");
  $("#found").removeClass("Off");

  var currID = localStorage.getItem("current");
    if (currID == undefined) {
      currID = "18775315";
    }
  var abstractOp = localStorage["abstractOp"];
    if (abstractOp == "Yes") {
      $("#result").removeClass("Off");
        eSS(currID);
    } else {
      $("#found").removeClass("Off");
    }
}


function simple_efetch(pmid) {
  $(document).ready(function() {
    args = {'apikey' : 'ab25c21c079653919d9b53213ac8cc6e',
            'db' : 'pubmed',
            'id' : pmid};
    $.getJSON('http://entrezajax2.appspot.com/efetch?callback=?', args, function(d){
      $.each(d.result[0], function(i, l){
        var abstract = l.MedlineCitation.Article.Abstract.AbstractText.replace(/"/g, '\\"');
        if (!abstract) abstract = 'NA';
        var title = l.MedlineCitation.Article.ArticleTitle.replace(/"/g, '\\"');
        if (!title) title = 'NA';
        var journal = l.MedlineCitation.Article.Journal.ISOAbbreviation;
        if (!journal) journal = 'NA';
        var volume = l.MedlineCitation.Article.Journal.JournalIssue.Volume;
        if (!volume) volume = 'NA';
        var issue = l.MedlineCitation.Article.Journal.JournalIssue.Issue;
        if (!issue) volume = 'NA';
        var year = l.MedlineCitation.Article.Journal.JournalIssue.PubDate.Year;
        if (!year) year = 'NA';
        var page = l.MedlineCitation.Article.Pagination.MedlinePgn;
        if (!page) page = 'NA';
        var authors = 'NA';
        if (l.MedlineCitation.Article.AuthorList) {
          for(var j = 0; j < l.MedlineCitation.Article.AuthorList.length; j ++) {     
            if ( j == 0 ) {
              authors = l.MedlineCitation.Article.AuthorList[j].LastName + ' ' + l.MedlineCitation.Article.AuthorList[j].Initials;
            } else {
              authors += ', ' + l.MedlineCitation.Article.AuthorList[j].LastName + ' ' + l.MedlineCitation.Article.AuthorList[j].Initials;
            }
          }
        }
        var pmid_json = '{"pmid":"' + pmid + '","authors":"' + authors + '","year":"' + year + '","title":"' + title + '","journal":"' + journal + '","volume":"' + volume + '","issue":"' + issue + '","page":"' + page + '","abstract":"' + abstract + '"},';
        pmid_json.replace(/'/g, "\\'");
        // return pmid_json
        $("<span/>").html(pmid_json).appendTo("#json");
      });
    });
  });
}


function simple_esf(term) {
  $(document).ready(function() {
    args = {'apikey' : 'ab25c21c079653919d9b53213ac8cc6e',
            'db' : 'pubmed',
            'retmax' : '2',
            'term' : term};
    $.getJSON('http://entrezajax2.appspot.com/esearch+efetch?callback=?', args, function(d){
      if (d.result[1].MedlineCitation.Article.ArticleTitle) {
        alert('this id has none or multiple hits'); 
      } else {
        alert('got in esf');
      }
    });
  });
}


function allJSON() {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;
  var TimePattern = /10000000\d{14}/;
  var html = '<span id="json"><b>below is the json, delete last comma and add ]} to the end to complete it</b><br/><br/>{"pubmeder":[</span>';
  $("body").html(html);
  var pmidlist = '';
  for (var i = (localStorage.length - 1); i >= 0 ; i--) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      if (dotCheck.test(tempKey) || pmcCheck.test(tempKey)) {
        simple_esf(tempKey);
      } else {
        if (pmidlist) {
          pmidlist += ',' + tempKey;
        } else {
          pmidlist = tempKey;
        }
      }
    }
  }
  simple_efetch(pmidlist);
}


function getAllPMID() {
  var a = $("#pmidlist").text();
  alert(a);
}


function PMIDarray() {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;
  var TimePattern = /10000000\d{14}/;
  var html = '<span id="pmidlist" onclick="getAllPMID()"></span>';
  $("body").html(html);
  for (var i = (localStorage.length - 1); i >= 0 ; i--) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      if (dotCheck.test(tempKey) || pmcCheck.test(tempKey)) {
        var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&term=' + tempKey
        $(document).ready(function(){
          $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function(xml) {
              var pmid = $(xml).find('Id');
              if (pmid.length == 1) {
                $("<span/>").html(pmid.text() + ',').appendTo("#pmidlist");
              } else {
                // need return error more than 1
                alert('this id has none or multiple hits');
              }
            }
          });
        });
      } else {
        $("<span/>").html(tempKey + ',').appendTo("#pmidlist");
      }
    }
  }
}


