/*
 * Copyright (c) 2010 Liang Cai . All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var a = document.body.innerText;

var regpmid = /pmid\s*:?\s*(\d+)\s*/i;
var regdoi = /doi\s*:?\s*/i;
var doipattern = /(\d{2}\.\d{4}\/[\w./]+\w)\s*\W?/;
var regpmc = /pmcid\s*:?\s*(PMC\d+)\s*/i;
var ID = "";

if (regpmid.test(a)) {
  ID = regpmid.exec(a);
  chrome.extension.sendRequest({sendID: ID[1]}, function(response) {});
} else if (regdoi.test(a) || doipattern.test(a)) {
  ID = doipattern.exec(a);
  if (ID !== null) {
    chrome.extension.sendRequest({sendID: ID[1]}, function(response) {});
  }
} else if (regpmc.test(a)) {
  ID = regpmc.exec(a);
  ID[1] = ID[1].toUpperCase();
  chrome.extension.sendRequest({sendID: ID[1]}, function(response) {});
} else {
  // no pattern matched
}
