function eSearch(search_term) {
  var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&term=' + search_term;
  $(document).ready(function(){
    $.ajax({
      // async: false,
      type: "GET",
      url: url,
      dataType: "xml",
      success: function(xml) {
        var pmid = $(xml).find('Id');
        if (pmid.length == 1) {
          // $("<p/>").html('pmid: '+pmid.text()).appendTo("#found");
          var d = new Date();
          var curr_year = d.getFullYear();
          var curr_month = d.getMonth();
          curr_month += 1;
          var curr_date = d.getDate();
          var curr_hour = d.getHours();
          var curr_min = d.getMinutes();
          var curr_sec = d.getSeconds();
          if (curr_month < 10) { curr_month = "0" + curr_month; }
          if (curr_date < 10) { curr_date = "0" + curr_date; }
          if (curr_hour < 10) { curr_hour = "0" + curr_hour; }
          if (curr_min < 10) { curr_min = "0" + curr_min; }
          if (curr_sec < 10) { curr_sec = "0" + curr_sec; }
          var curr_Time = "10000000" + curr_year + curr_month + curr_date + curr_hour + curr_min + curr_sec;
          localStorage.setItem(pmid.text(), curr_Time);
          localStorage.removeItem(search_term);
        } //else {
          // alert('debug: this ID has none or multiple hits in the database');
        //}
      }
    });
  });
}


function eraseAll() {
  var answer = confirm("Are you sure that you want to clear the local storage?");
  if (answer) {
    localStorage.clear();
  }
  location.reload();
}


function eraseNewData() {
  // localStorage.clear();
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


function showALL(onlyTen) {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;
  if (!onlyTen) { onlyTen = ''; }
  var TimePattern = /10000000\d{14}/;
  if (onlyTen == 'old') {
    onlyTen = '';
    TimePattern = /00000000\d{14}/;
  }
  var content = '<p>Here is the ' + onlyTen + ' records</p><table style="border:0;padding-left:32px"><tr><th> </th><th>ID</th><th class="grey">View on</th></tr>';

  var m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var countTen = 0;
  var myArray = [];
  var checkedTime = '';
  var tempKey = '';
  for (var i = 0; i < localStorage.length; i++) {
    tempKey = localStorage.key(i);
    checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      var combined = checkedTime + '__' + tempKey;
      myArray.push(combined);
    }
  }
  myArray.sort();
  myArray.reverse();
  for (var k = 0; k < myArray.length; k++) {
    var a = myArray[k].split("__");
    checkedTime = a[0];
    tempKey = a[1];
    // checkedTime = checkedTime.substr(8).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$2 $3, $1 at $4:$5");
    checkedTime = checkedTime.substr(8).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$2 $3, $1");
    countTen += 1;
    content += '<tr><td class="grey">' + k + '</td>';
    if (dotCheck.test(tempKey)) {
      content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://dx.doi.org/' + tempKey + '" target="_blank">doi:</a>' + tempKey + '</td>';
      eSearch(tempKey);
    } else if (pmcCheck.test(tempKey)) {
      content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://www.ncbi.nlm.nih.gov/pmc/articles/' + tempKey + '/?tool=pubmeder" target="_blank">pmcid:</a>' + tempKey + '</td>';
      eSearch(tempKey);
    } else {
      content += '<td class="item" onclick="eSS(\'' + tempKey + '\')"><a href="http://www.ncbi.nlm.nih.gov/pubmed/' + tempKey + '/?tool=pubmeder" target="_blank">pmid:</a>' + tempKey + '</td>';
    }
    content += '<td class="grey" onclick="eSS(\'' + tempKey + '\')">' + m_names[checkedTime.substr(0,2)-1] + checkedTime.substr(2) + '</td></tr>';
    if (onlyTen && countTen == onlyTen) { break; }
  }

  content += '</table>';
  if (onlyTen) {
    // chrome.tabs.create({url:chrome.extension.getURL("/options.html")})
    var optionURL = chrome.extension.getURL("/options.html");
    content += '<p>More records at <a href='+optionURL+' target="_blank">option page</a></p>';
  }
  $("#record-table").html(content);
  $("#record-table").removeClass("Off");
  $("#showALL").addClass("Off");
  $("#showOld").addClass("Off");
  $("#hideALL").removeClass("Off");
}


function showOld() {
  showALL("old");
}


function hideALL() {
  $("#record-table").addClass("Off");
  $("#result").addClass("Off");
  $("#showALL").removeClass("Off");
  $("#showOld").removeClass("Off");
  $("#hideALL").addClass("Off");
}


function hideMore() {
  $(".moreAbout").addClass("Off");
  $(".AbsButton").removeClass("Off");
  $(".eSum").removeClass("Off");
}


function loadOptions() {
  // valid abstractOp are No and Yes, default No
  var abstractOp = localStorage.getItem("abstractOp");
  if (abstractOp === undefined || (abstractOp != "No" && abstractOp != "Yes")) {
    abstractOp = "No";
  }
  $("#abstract").val(abstractOp);
  // valid syncOp are No and Yes, default Yes
  var syncOp = localStorage.getItem("syncOp");
  if (syncOp === undefined || (syncOp != "No" && syncOp != "Yes")) {
    syncOp = "Yes";
  }
  $("#syncAuto").val(syncOp);
  // valid rev_proxy are No and Yes, default No
  var rev_proxy = localStorage.getItem("rev_proxy");
  if (rev_proxy === undefined || (rev_proxy != "No" && rev_proxy != "Yes")) {
    rev_proxy = "No";
  }
  $("#rev_proxy").val(rev_proxy);
  //
  var sendInterval = localStorage.getItem("sendInterval");
  sendInterval = parseInt(sendInterval,10);
  if (sendInterval === undefined || sendInterval == "NaN") {
    sendInterval = 12;
  }
  $("#sendInterval").val(sendInterval);
}


function saveOptions() {
  localStorage.setItem("abstractOp", $("#abstract").val());
  localStorage.setItem("syncOp", $("#syncAuto").val());
  localStorage.setItem("rev_proxy", $("#rev_proxy").val());
  localStorage.setItem("sendInterval", $("#sendInterval").val());
  var userEmail = $("#email").val();
  var userApi = $("#apikey").val();
  var filter = /^[^@]+@[^@]+.[a-z]{2,}$/i;
  if (filter.test(userEmail)) {
    localStorage.setItem("emailOp", userEmail);
  } else {
    alert("Please provide a valid email address");
    $("#email").focus();
  }
  if (userApi.length == 32) {
    var checkurl = 'http://1.pl4.me/input?pmid=999999999&apikey='+userApi+'&email='+userEmail;
    $.ajax({
      async: false,
      type: "GET",
      url: checkurl,
      dataType: "text",
      success: function(txt) {
        if (txt == 'correct') {
          localStorage.setItem("apikeyOp", userApi);
        } else {
          alert("Please provide a valid apikey. Get it by visiting http://1.pl4.me/registration");
        }
      }
    });
  } else {
    alert("Please provide a valid apikey. Get it by visiting http://1.pl4.me/registration");
  }
  location.reload();
}


function eraseOptions() {
  localStorage.removeItem("abstractOp");
  localStorage.removeItem("emailOp");
  localStorage.removeItem("apikeyOp");
  localStorage.removeItem("syncOp");
  localStorage.setItem("sendInterval", '12');
  location.reload();
}


function eFetch(pmid) {
  $(".loadIcon").removeClass("Off");
  $(".eSum").addClass("Off");
  $("#"+pmid).removeClass("Off");
  $(document).ready(function() {
    var args = {'apikey' : 'ab25c21c079653919d9b53213ac8cc6e',
                    'db' : 'pubmed',
                    'id' : pmid},
      url = 'http://entrezajax2.appspot.com/efetch?callback=?',
      rev_proxy = localStorage.getItem("rev_proxy");
    if (rev_proxy && rev_proxy === "Yes") {
      url = 'http://4.pl4.me/efetch?callback=?';
    }
    $.getJSON(url, args, function(d){
      $(".AbsButton").addClass("Off");
      $(".loadIcon").addClass("Off");
      $.each(d.result, function(i, l){

        if (l.MedlineCitation.Article.Abstract) {
          var abstract = '<p onClick="hideMore()" class="moreAbout"><b><u>Abstract</u>: </b>' + l.MedlineCitation.Article.Abstract.AbstractText + '</p>';
          $("<div/>").html(abstract).appendTo("#result");
        }

        if (l.MedlineCitation.CommentsCorrectionsList) {
          var ref_list = '<p onClick="hideMore()" class="moreAbout"><b><u>References</u>: </b>';
          for(var j = 0; j < l.MedlineCitation.CommentsCorrectionsList.length; j++) {     
            if ( j === 0 ) {
              ref_list += '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + l.MedlineCitation.CommentsCorrectionsList[j].PMID + '/?tool=pubmeder">' + l.MedlineCitation.CommentsCorrectionsList[j].RefSource.replace(/([a-zA-Z]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            }
            else {
              ref_list += '; <a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + l.MedlineCitation.CommentsCorrectionsList[j].PMID + '/?tool=pubmeder">' + l.MedlineCitation.CommentsCorrectionsList[j].RefSource.replace(/([a-zA-Z()]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            }
          }
          ref_list += '</p>';
          $("<div/>").html(ref_list).appendTo("#result");
        }

        if (l.MedlineCitation.Article.DataBankList) {
          var lsc = l.MedlineCitation.Article.DataBankList.length;
          var ls = l.MedlineCitation.Article.DataBankList[lsc-1];
          while (ls.DataBankName != "PDB" && lsc > 0) {
              lsc -= 1;
              ls = l.MedlineCitation.Article.DataBankList[lsc-1];
          }
          if ( lsc > 0 ) {
            var DataBank_list = '<p onClick="hideMore()" class="moreAbout"><b><u>PDB Files</u>: </b>';
            for(var jm = 0; jm < ls.AccessionNumberList.length; jm++) {     
              if ( jm === 0 ) {
                DataBank_list += '<a target="_blank" href="http://jolecule.appspot.com/pdb/' + ls.AccessionNumberList[jm] + '">' + ls.AccessionNumberList[jm] + '</a> ';
              }
              else {
                DataBank_list += '; <a target="_blank" href="http://jolecule.appspot.com/pdb/' + ls.AccessionNumberList[jm] + '">' + ls.AccessionNumberList[jm] + '</a> ';
              }
            }
            DataBank_list += '</p>';
            $("<div/>").html(DataBank_list).appendTo("#result");
          }
        }

        if (l.MedlineCitation.Article.GrantList) {
          var grant_list = '<p onClick="hideMore()" class="moreAbout"><b><u>Fund By</u>: </b>';
          for(var jj = 0; jj < l.MedlineCitation.Article.GrantList.length; jj++) {     
            if ( jj === 0 ) {
              grant_list += l.MedlineCitation.Article.GrantList[jj].Agency + ': ' + l.MedlineCitation.Article.GrantList[jj].GrantID;
            }
            else {
              grant_list += '; ' + l.MedlineCitation.Article.GrantList[jj].Agency + ': ' + l.MedlineCitation.Article.GrantList[jj].GrantID;
            }
          }
          grant_list += '</p>';
          $("<div/>").html(grant_list).appendTo("#result");
        }

        if (l.MedlineCitation.ChemicalList) {
          var keyChem = '<p onClick="hideMore()" class="moreAbout"><b><u>Chemical</u>: </b>';
          for(var jk = 0; jk < l.MedlineCitation.ChemicalList.length; jk++) {     
            if ( jk === 0 ) {
              keyChem += l.MedlineCitation.ChemicalList[jk].NameOfSubstance;
            }
            else {
              keyChem += '; ' + l.MedlineCitation.ChemicalList[jk].NameOfSubstance;
            }
          }
          keyChem += '</p>';
          $("<div/>").html(keyChem).appendTo("#result");
        }

        if (l.MedlineCitation.MeshHeadingList) {
          var keyHead = '<p onClick="hideMore()" class="moreAbout"><b><u>Heading</u>: </b>';
          for(var jl = 0; jl < l.MedlineCitation.MeshHeadingList.length; jl++) {     
            if ( jl === 0 ) {
              keyHead += l.MedlineCitation.MeshHeadingList[jl].DescriptorName;
            }
            else {
              keyHead += '; ' + l.MedlineCitation.MeshHeadingList[jl].DescriptorName;
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
  var urll = '';
  if (webenvCheck.test(term)) {
    urll = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&retmax=12&query_key=1&webenv=' + term;
  } else {
    urll = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&id=' + term;
  }
  $("#result").html('loading <img class="loadIcon" src="loading.gif" alt="..." />'); // loading
  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: urll,
      dataType: "xml",
      success: function(xml) {
        $("#result").html(''); // turn off loading
        $(xml).find('DocSum').each(function(){
          var a = $(this).find('Item[Name="Author"]');
          var author_list = '';
          a.each(function(j){
            if (j === 0) {
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
          var titleLin = '';
          if (pmc) {
            titleLin = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pmc/articles/' + pmc + '/?tool=pubmeder">' + Title + '</a> ';
          } else if (doi) {
            titleLin = '<a target="_blank" href="http://dx.doi.org/' + doi + '">' + Title + '</a> ';
          } else {
            titleLin = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + pubmed + '/?tool=pubmeder">' + Title + '</a> ';
          }
          
          var PubDate = $(this).find('Item[Name="PubDate"]').text();
          var Source = $(this).find('Item[Name="Source"]').text();
          var Volume = $(this).find('Item[Name="Volume"]').text();
          var Pages = $(this).find('Item[Name="Pages"]').text();
          
          var eSummary = '<p class="eSum" id="' + pubmed + '">' + author_list + ' (' + PubDate + '). ' + titleLin + Source + '.  <i>' + Volume + '</i>, ' + Pages + '<br/><button class="AbsButton" onclick="eFetch(' + pubmed + ')"> More about </button><a id="pmid" target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + pubmed + '/?tool=pubmeder">PMID:' + pubmed + '</a> <img class="loadIcon Off" src="loading.gif" alt="..." /></p>';
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


function clearOnClick(ID) {
  $("#"+ID).focus(function() {
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
    if (currID === undefined) {
      currID = "18775315";
    }
  var abstractOp = localStorage.getItem("abstractOp");
    if (abstractOp == "Yes") {
      $("#result").removeClass("Off");
        eSS(currID);
    } else {
      $("#found").removeClass("Off");
    }
}


function getAllPMID() {
  var b = $("#pmidlist").text();
  var a = localStorage.getItem("localPMID");
  alert('saved pmid list: '+a+'; will saved the list: '+b);
}


function PMIDarray() {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;
  var TimePattern = /10000000\d{14}/;
  var html = '<i>output, this is for http://pubmeder.appspot.com</i><br/><br/><button onclick="savePMIDlist()">send the list below to the server</button><br/><br/><span id="pmidlist" onclick="getAllPMID()"></span>';
  $("body").html(html);
  for (var i = (localStorage.length - 1); i >= 0 ; i--) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      // alert(tempKey);
      if (dotCheck.test(tempKey) || pmcCheck.test(tempKey)) {
        var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&term=' + tempKey;
        $(document).ready(function(){
          $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function(xml) {
              var pmid = $(xml).find('Id');
              if (pmid.length == 1) {
                // alert(pmid.text());
                $("<span/>").html(pmid.text() + ',').appendTo("#pmidlist");
              } //else {
                // alert('debug: this ID has none or multiple hits in the database');
              //}
            }
          });
        });
      } else {
        // alert('direct input');
        $("<span/>").html(tempKey + ',').appendTo("#pmidlist");
      }
    }
  }
}


function savePMIDlist() {
  // alert($("#pmidlist").text());
  var aa = $("#pmidlist").text(),
    aaLen = aa.length;
  if (aaLen> 1900) {
    alert('too many items: please submit them at http://pubmeder.appspot.com/enter (login will give you option to batch input). '+aa);
    return;
  }
  aa = aa.substr(0,aaLen-1); 
  localStorage.setItem("localPMID", aa);
  // send to the pubmeder.appspot.com
  // an example http://localhost:8080/input?pmid=18775315,17456547,17350576,16027158&apikey=abcdefgh&email=test@example.com
  var urlurl = 'http://pubmeder.appspot.com/input?pmid='+aa+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp"),
    rev_proxy = localStorage.getItem("rev_proxy");
  if (rev_proxy && rev_proxy === "Yes") {
    urlurl = 'http://1.pl4.me/input?pmid='+aa+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp");
  }
  // alert('send this: '+urlurl);
  alert('When the server successfully respond, this page will change, which may take 10-50 seconds.');
  $.ajax({
    type: "GET",
    url: urlurl,
    dataType: "text",
    success: function(text) {
      $("<span/>").html(text).appendTo("#pmidlist");
    }
  });
  // location.reload();
}


function savelistquick() {
  // send to the pubmeder.appspot.com
  // an example http://localhost:8080/input?pmid=18775315,17456547,17350576,16027158&apikey=abcdefgh&email=test@example.com
  var a = $("#localPMID").val();
  if (a === '') {
    return 0;
  }
  if (a.length > 1900) {
    alert('too many items: please submit them at http://pubmeder.appspot.com/enter (login will give you option to batch input). '+a);
    return;
  }
  var url = 'http://pubmeder.appspot.com/input?pmid='+a+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp"),
    rev_proxy = localStorage.getItem("rev_proxy");
  if (rev_proxy && rev_proxy === "Yes") {
    url = 'http://1.pl4.me/input?pmid='+a+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp");
  }
  // alert(url);
  $("#sendOnline").removeClass("Off");
  alert('When the server successfully respond, this page will change, which may take 10-50 seconds.');
  $.ajax({
    type: "GET",
    url: url,
    dataType: "text",
    success: function(text) {
      $("body").html(text);
    }
  });
}


function clearPMIDarray() {
  localStorage.setItem("localPMID", '');
  location.reload();
}


function justPMIDlist() {
  var dotCheck = /\./;
  var pmcCheck = /PMC/;
  var TimePattern = /10000000\d{14}/;
  var pmidList = '';
  for (var i = (localStorage.length - 1); i >= 0 ; i--) {
    var tempKey = localStorage.key(i);
    var checkedTime = localStorage.getItem(tempKey);
    if (TimePattern.test(checkedTime)) {
      if (dotCheck.test(tempKey) || pmcCheck.test(tempKey)) {
        // should be converted automatically by eSearch or during showAll
        continue;
      } else {
        pmidList += tempKey + ',';
      }
    }
  }
  var aaLen = pmidList.length;
  pmidList = pmidList.substr(0,aaLen-1);
  localStorage.setItem("JUST_pmidList", pmidList);
}


function justSendList() {
  var a = localStorage.getItem("JUST_pmidList");
  if (a.length > 1900) {
    alert('too many items: please submit them at http://pubmeder.appspot.com/enter (login will give you option to batch input). '+a);
    return;
  }
  var url = 'http://pubmeder.appspot.com/input?pmid='+a+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp"),
    rev_proxy = localStorage.getItem("rev_proxy");
  if (rev_proxy && rev_proxy === "Yes") {
    url = 'http://1.pl4.me/input?pmid='+a+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp");
  }
  $.ajax({
    type: "GET",
    url: url,
    dataType: "text",
    success: function(text) {
      // alert(text);
      var old = localStorage.getItem("uploadedIdList");
      if (old === null) {
        old = a;
      } else {
        old = old + ',' + a;
      }
      localStorage.setItem("uploadedIdList", old);
      aList = a.split(",");
      for (var i = 1; i < aList.length; i++) {
        var b = localStorage.getItem(aList[i]);
        var bLen = b.length;
        var newA = '0' + b.substr(1,bLen);
        localStorage.setItem(aList[i], newA);
      }
    }
  });
}


function oldlistSent() {
  var IdList = localStorage.getItem("uploadedIdList");
  if (IdList === null) {
    return;
  }
  var d = IdList.split(",");
  var new_d = [];
  g:for (var i = 0; i < d.length; i++) {
      if (d[i] === "")
        { continue g; }
      for (var j = 0; j < new_d.length; j++) {
        if (new_d[j] == d[i])
          { continue g; }
      }
      new_d[new_d.length] = d[i];
    }
  IdList = new_d.join(",");
  if (IdList.length > 1900) {
    alert('too many items: please submit them at http://pubmeder.appspot.com/enter (login will give you option to batch input). '+IdList);
    return;
  }
  localStorage.setItem("uploadedIdList", IdList);
  var url = 'http://pubmeder.appspot.com/input?pmid='+IdList+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp"),
    rev_proxy = localStorage.getItem("rev_proxy");
  if (rev_proxy && rev_proxy === "Yes") {
    url = 'http://1.pl4.me/input?pmid='+IdList+'&apikey='+localStorage.getItem("apikeyOp")+'&email='+localStorage.getItem("emailOp");
  }
  // alert(url);
  $("#reSendOnline").removeClass("Off");
  alert('When the server successfully respond, this page will change, which may take 10-50 seconds.');
  $.ajax({
    type: "GET",
    url: url,
    dataType: "text",
    success: function(text) {
      $("body").html(text);
    }
  });
}