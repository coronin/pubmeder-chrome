function eFetch(term) {
  var webenvCheck = /[a-zA-Z]/;
  if (webenvCheck.test(term)) {
    var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&query_key=1&webenv=' + term;
  } else {
    var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&tool=pubmeder&email=i@cail.cn&retmode=xml&id=' + term;
  }

  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: url,
      dataType: "xml",
      success: function(xml) {
        $(xml).find('PubmedArticle').each(function(){
          $('#AbsButton').addClass('Off');

          var abstract = '<p onclick="hideMore()" class="moreAbout" style="font-size:0.8em;"><b><u>Abstract</u>: </b>' + $(this).find("AbstractText").text() + '</p>';
          $("<div/>").html(abstract).appendTo('#result');

          var ref_list = '<p onclick="hideMore()" class="moreAbout" style="font-size:0.8em;color:#666"><b><u>References</u>: </b>';
          $(this).find('CommentsCorrections').each(function(){
            var j = 0;
            if ( j == 0 ) {
              j = 1;
              ref_list += '<a style="text-decoration:none;color:#666;" target="blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + $(this).find('PMID').text() + '/?tool=pubmeder">' + $(this).find('RefSource').text().replace(/([a-zA-Z]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            } else {
              ref_list += '; <a style="text-decoration:none;color:#666;" target="blank" href="http://www.ncbi.nlm.nih.gov/pubmed/' + $(this).find('PMID').text() + '/?tool=pubmeder">' + $(this).find('RefSource').text().replace(/([a-zA-Z()]+). (\d{4})( [A-Z]|;).+/g,"$1 <font style=\"color:#999;\">$2</font>") + '</a>';
            }
          });
          ref_list += '</p>';
          $("<div/>").html(ref_list).appendTo('#result');

          var grant_list = '<p onclick="hideMore()" class="moreAbout" style="font-size:0.8em;color:#696969"><b><u>Fund By</u>: </b>';
          $(this).find('Grant').each(function(){
            var j = 0;
            if ( j == 0 ) {
              j = 1;
              grant_list += $(this).find('Agency').text() + ': ' + $(this).find('GrantID').text();
            }
            else {
              grant_list += '; ' + $(this).find('Agency').text() + ': ' + $(this).find('GrantID').text();
            }
          });
          grant_list += '</p>';
          $("<div/>").html(grant_list).appendTo('#result');
          
          var keyChem = '<p onclick="hideMore()" class="moreAbout" style="font-size:0.8em;color:#6a6a6a"><b><u>Chemical</u>: </b>';
          $(this).find('Chemical').each(function(){
            var j = 0;
            if ( j == 0 ) {
              j = 1;
              keyChem += $(this).find('NameOfSubstance').text();
            }
            else {
              keyChem += '; ' + $(this).find('NameOfSubstance').text();
            }
          });
          keyChem += '</p>';
          $("<div/>").html(keyChem).appendTo('#result');

          var keyHead = '<p onclick="hideMore()" class="moreAbout" style="font-size:0.8em;color:#6a6a6a"><b><u>MeshHeading</u>: </b>';
          $(this).find('MeshHeading').each(function(){
            var j = 0;
            if ( j == 0 ) {
              j = 1;
              keyHead += $(this).find('DescriptorName').text();
            }
            else {
              keyHead += '; ' + $(this).find('DescriptorName').text();
            }
          });
          keyHead += '</p>';
          $("<div/>").html(keyHead).appendTo('#result'); 
        });
      }
    });
  });
}