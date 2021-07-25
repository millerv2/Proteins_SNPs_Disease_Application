var couchdb = 'http://localhost:5984/';
var database = 'proteins';

//web request:

function wsurl(request) {
  return couchdb + database + request;
};

var skip = 0;
var page = 10;
var sort = [{"protein_id": "asc"}];


function addtoskip(value) {
   skip += value;
   renderproteins();
}

function skiptozero() {
   skip =  0;
   renderproteins();
}

function sorttable(header) {
	var thekey = "protein_id";
	if (header.innerHTML == "Accession") {
	    thekey = "protein_id";
	} else if (header.innerHTML == "Gene") {
	    thekey = "gene";
	} 
	if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptozero();
}

function renderproteins() {
  var criteria = {"selector": {}, "sort": sort, "limit": (page+1), "skip": skip};
  var searchbox = document.getElementById("searchprot");
  if (searchbox && searchbox.value != "") {
      criteria["selector"] = {"$or": [{"protein_id": {"$regex": searchbox.value.toUpperCase() }},
                                      {"gene": {"$regex": searchbox.value.toUpperCase() }}
                                     ]};
  };
  json_ws_post(wsurl('/_find'),criteria,function(data) {
    var Header = "<h1>Proteins</h1>"
    var table = 'Search By Accession or Gene: '+'<input id="searchprot" onchange="renderproteins()"type="text"/><table>';
	table += '<tr>';
    table += '<th width="40px;">Index</th>';
    table += '<th width="70px;" onclick="sorttable(this);">Accession</th>';
    table += '<th width="70px;" onclick="sorttable(this);">Gene</th>';
    table += '</tr>';
	for (var i = 0; i < data.docs.length; i++ ) {
	  table +="<tr>";
	  table += "<td>" + (i+1+skip) + "</td>";
	  table += "<td>" + "<A href=\"#\" onclick=\"renderprotein(this.text);\">" +
	            data.docs[i].protein_id + "</A></td>";
      table += "<td>" + data.docs[i].gene + "</td>";
	  table += "</td>";
	  table += "</tr>";
	}
	table += "</table>";
	table += "<P align=\"right\">";
    if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptozero();\">Beginning</A>"; 
	  table += " - <A href=\"#\" onclick=\"addtoskip(-page);\"> Previous</A> - ";
	}
	/*table += "<A href=\"#\" onclick=\"renderproteins()\">Beginning</A> - ";*/
    table += "<A href=\"#\" onclick=\"addtoskip(page);\">Next</A>";
	/*table += "<A href=\"#\" onclick=\"renderproteins("+(skip+10)+")\">Next</A>";*/
	table += "</P>"
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').innerHTML += Header;
    document.getElementById('container').innerHTML += table
  });
}
function renderprotein(accession) {
  var criteria = {"selector": {"protein_id": accession}, "limit": 1};
  json_ws_post(wsurl('/_find'),criteria,function(data) {
    var Header = "<h1>Protein Detail Page</h1>" 
    var table = "<table>";
	table += "<tr><th>Accession</th><td>" + data.docs[0].protein_id + "</td></tr>";  
	table += "<tr><th>Gene</th><td>" + data.docs[0].gene + "</td></tr>";
    table += "<tr><th>Name</th><td>" + data.docs[0].name + "</td></tr>";
	table += "</table>";
    table += "<P align=\"right\"></P>";
    table += "<br>"
    table += "<P align=\"right\"><A href=\"#\" onclick=\"renderproteins();\">Return</A></P>";
    var SNPtable = "<table>";
    SNPtable += "<tr><th>SNPs</th><th>Associated OMIM ID</th><th>Associated Disease Name</th></tr>";
    for (var i = 0; i < data.docs[0].SNPs.length; i++ ) {
        console.log('number of SNPs:',data.docs[0].SNPs.length)
        SNPtable += "<tr>";
        SNPtable += "<td>" + "<A href=\"#\" onclick=\"rendervariant(this.text);\">" +
	            data.docs[0].SNPs[i].rs_ID + "</A></td>";
        /* SNPtable += "<td>" + data.docs[0].SNPs[i].rs_ID + "</td>";*/
        SNPtable += "<td>" + "<A href=\"#\" onclick=\"renderdisease(this.text);\">" +
	            data.docs[0].SNPs[i].Diseases[0].disease_id + "</A></td>";
        /*SNPtable += "<td>" + data.docs[0].SNPs[i].Diseases[0].disease_id + "</td>";*/
        SNPtable += "<td>" + data.docs[0].SNPs[i].Diseases[0].name + "</td>";
        SNPtable += "</tr>";  
    }
    SNPtable += "</table>";
    SNPtable += "<P align=\"right\"><A href=\"#\" onclick=\"renderproteins();\">Return</A></P>";
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').innerHTML += Header;
    document.getElementById('container').innerHTML += table;
    document.getElementById('container').innerHTML += SNPtable;
  });
}

var couchdb2 = 'http://localhost:5984/';
var database2 = 'variant2';

function wsurl2(request2) {
  return couchdb2 + database2 + request2;
};

var skip = 0;
var page = 10;
var sort2 = [{"rs_ID": "asc"}];


function addtoskip2(value) {
   skip += value;
   rendervariants();
}

function skiptozero2() {
   skip =  0;
   rendervariants();
}

function sorttable2(header) {
	var thekey = "rs_ID";
	if (header.innerHTML == "rsID") {
	    thekey = "rs_ID";
	} else if (header.innerHTML == "VarAlleleFrequency") {
	    thekey = "MAFs[0].Frequency";
	} 
	if (sort2.length == 0 || sort2[0][thekey] != "asc") {
		sort2 = [{[thekey]: "asc"}];
	} else {
		sort2 = [{[thekey]: "desc"}];
	}
	skiptozero2();
}

function rendervariants() {
  var criteria = {"selector": {}, "sort": sort2, "limit": (page+1), "skip": skip};
  var searchbox = document.getElementById("searchvar");
  if (searchbox && searchbox.value != "") {
      criteria["selector"] = {"rs_ID": parseInt(searchbox.value,10) };
  };
  json_ws_post(wsurl2('/_find'),criteria,function(data) {
    var Header = "<h1>Variants</h1>"
    var table = 'Search by rsID: '+'<input id="searchvar" onchange="rendervariants()"type="text"/><table>';
	table += "<tr>";
    table += "<th>Index</th>";
    table += '<th width="70px;" onclick="sorttable2(this);">rsID</th>';
    table += "<th>Location</th>";
    table += "<th>AAChange</th>";
    table += '<th width="70px;">VarAlleleFrequency</th>';
    table += "<th>Source</th>";
    table += "</tr>";
	for (var i = 0; i < data.docs.length; i++ ) {
	  table += "<tr>";
	  table += "<td>" + (i+1+skip) + "</td>";
	  table += "<td>" + "<A href=\"#\" onclick=\"rendervariant(this.text);\">" +
	            data.docs[i].rs_ID + "</A></td>";
      table += "<td>" + data.docs[i].Location + "</td>";
      table += "<td>" + data.docs[i].AAChange + "</td>";
      if (data.docs[i].MAFs[0] && data.docs[i].MAFs[0].Frequency) {
	    table += "<td>" + data.docs[i].MAFs[0].Frequency + "</td>";
        table += "<td>" + data.docs[i].MAFs[0].Source + "</td>";
	  }  else {
		table += "<td>" + 'undefined' + "</td>";
        table += "<td>" + '1000Genomes' + "</td>";
	  }
	  table += "</tr>";
	}
	table += "</table>";
	table += "<P align=\"right\">";
	/*table += "<A href=\"#\" onclick=\"rendervariants()\">Beginning</A> - "; 
    table += "<A href=\"#\" onclick=\"renderproteins("+(skip+10)+")\">Next</A>"*/
	if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptozero2();\">Beginning</A>"; 
	  table += " - <A href=\"#\" onclick=\"addtoskip2(-page);\"> Previous</A> - ";
	}
    table += "<A href=\"#\" onclick=\"addtoskip2(page);\">Next</A>";
    table += "</P>"
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').innerHTML += Header;  
    document.getElementById('container').innerHTML += table;
  });
}
function rendervariant(rsID) {
  var criteria = {"selector": {"rs_ID": parseInt(rsID,10)}, "limit": 1};
  json_ws_post(wsurl2('/_find'),criteria,function(data) {
    var Header = "<h1>Variant Detail Page</h1>" 
    var table = "<table>";
	table += "<tr><th>rsID</th><td>" + data.docs[0].rs_ID + "</td></tr>";  
	table += "<tr><th>Location</th><td>" + data.docs[0].Location + "</td></tr>";
    /*table += "<tr><th>Reference Allele</th><td>" + data.docs[0].MAFs[0].RefAllele + "</td></tr>";
    table += "<tr><th>Reference Allele</th><td>" + data.docs[0].MAFs[0].VarAllele + "</td></tr>";*/
    if (data.docs[0].MAFs[0]) {
	    table += "<tr><th>Frequency</th><td>" + data.docs[0].MAFs[0].Frequency + "</td></tr>";
        table += "<tr><th>Source</th><td>" + data.docs[0].MAFs[0].Source + "</td></tr>"; 
        table += "<tr><th>Reference Allele</th><td>" + data.docs[0].MAFs[0].RefAllele + "</td></tr>";
        table += "<tr><th>Reference Allele</th><td>" + data.docs[0].MAFs[0].VarAllele + "</td></tr>";
	  } 
    table += "<tr><th>AAChange</th><td>" + data.docs[0].AAChange + "</td></tr>";
    table += "<tr><th>Consequence</th><td>" + data.docs[0].Consequence + "</td></tr>";
	table += "</table>";
    table += "<P align=\"right\"></P>";
    table += "<br>"
    var ProtTable = "<table>";
    ProtTable += "<tr><th>Implicated Protein</th><th>Associated OMIM ID</th><th>Associated Disease Name</th></tr>";
    for (var i = 0; i < 1; i++ ) {
        console.log('number of Proteins:',data.docs[0].Proteins.length)
        ProtTable += "<tr>";
        ProtTable += "<td>" + "<A href=\"#\" onclick=\"renderprotein(this.text);\">" +
	            data.docs[0].Proteins[0].protein_id + "</A></td>";
        ProtTable += "<td>" + "<A href=\"#\" onclick=\"renderdisease(this.text);\">" +
	            data.docs[0].Diseases[0].disease_id + "</A></td>";
        /*ProtTable += "<td>" + data.docs[0].Proteins[i].protein_id + "</td>";
        ProtTable += "<td>" + data.docs[0].Diseases[i].disease_id + "</td>";*/
        ProtTable += "<td>" + data.docs[0].Diseases[0].name + "</td>";
        ProtTable += "</tr>";  
    }
    ProtTable += "</table>";
    ProtTable += "<P align=\"right\"><A href=\"#\" onclick=\"rendervariants();\">Return</A></P>"
    if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptozero2();\">Beginning</A>"; 
	  table += " - <A href=\"#\" onclick=\"addtoskip2(-page);\"> Previous</A> - ";
	}
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').innerHTML += Header;
    document.getElementById('container').innerHTML += table;
    document.getElementById('container').innerHTML += ProtTable;
  });
}

var couchdb3 = 'http://localhost:5984/';
var database3 = 'diseases';

function wsurl3(request3) {
  return couchdb3 + database3 + request3;
};

var skip = 0;
var page = 10;
var sort3 = [{"disease_id": "asc"}];

function addtoskip3(value) {
   skip += value;
   renderdiseases();
}

function skiptozero3() {
   skip =  0;
   renderdiseases();
}

function sorttable3(header) {
	var thekey = "disease_id";
	if (header.innerHTML == "OMIM_ID") {
	    thekey = "disease_id";
	} else if (header.innerHTML == "Name") {
	    thekey = "name";
	} 
	if (sort3.length == 0 || sort3[0][thekey] != "asc") {
		sort3 = [{[thekey]: "asc"}];
	} else {
		sort3 = [{[thekey]: "desc"}];
	}
	skiptozero3();
}
function renderdiseases() {
  var criteria = {"selector": {}, "sort": sort3, "limit": (page+1), "skip": skip}
  var searchbox = document.getElementById("searchdis");
  if (searchbox && searchbox.value != "") {
      criteria["selector"] = {"$or": [{"disease_id": searchbox.value },
                                      {"name": {"$regex": searchbox.value.toUpperCase() }}
                                     ]};
    }
  json_ws_post(wsurl3('/_find'),criteria,function(data) {
    var Header = "<h1>Diseases</h1>"
    var table = 'Search by OMIM_ID or Disease Name: '+'<input id="searchdis" onchange="renderdiseases()"type="text"/><table>';
    table += '<tr>';
    table += '<th width="40px;">Index</th>';
    table += '<th width="70px;" onclick="sorttable3(this);">OMIM_ID</th>';
    table += '<th width="70px;" onclick="sorttable3(this);">Name</th>';
    table += '</tr>';
	for (var i = 0; i < data.docs.length; i++ ) {
	  table +="<tr>";
	  table += "<td>" + (i+1+skip) + "</td>";
	  table += "<td>" + "<A href=\"#\" onclick=\"renderdisease(this.text);\">" +
	            data.docs[i].disease_id + "</A></td>";
	  table += "<td>" + data.docs[i].name + "</td>";
	  /* if (data.docs[i].SNPs[0]) {
	    table +=  "<td>" + "<A href=\"#\" onclick=\"renderSNP(this.text);\">" + data.docs[i].SNPs[0].rs_ID + "</A></td>";
	  }*/ 
	  table += "</tr>";
	}
	table += "</table>";
	table += "<P align=\"right\">";
    if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptozero3();\">Beginning</A>"; 
	  table += " - <A href=\"#\" onclick=\"addtoskip3(-page);\"> Previous</A> - ";
	}
    table += "<A href=\"#\" onclick=\"addtoskip3(page);\">Next</A>";
	table += "</P>"
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').innerHTML += Header;
    document.getElementById('container').innerHTML += table;
  });
}


function renderdisease(disease_id) {
  var criteria = {"selector": {"disease_id": parseInt(disease_id,10)}, "limit": 1};
  json_ws_post(wsurl3('/_find'),criteria,function(data) {
    var Header = "<h1>Disease Detail Page</h1>" 
    var table = "<table>";
	table += "<tr><th>OMIM_ID</th><td>" + data.docs[0].disease_id + "</td></tr>"; 
	table += "<tr><th>Name</th><td>" + data.docs[0].name + "</td></tr>"; 
	table += "</table>";
	table += "<P align=\"right\"><A href=\"#\" onclick=\"renderdiseases();\">Return</A></P>"
    table += "<br>"
    var SNPtable = "<table>";
    SNPtable += "<tr><th>SNPs</th><th>Associated Protein Accession</th><th>Associated Protein Name</th></tr>";
    for (var i = 0; i < data.docs[0].SNPs.length; i++ ) {
        console.log('number of SNPs:',data.docs[0].SNPs.length)
        SNPtable += "<tr>";
        SNPtable += "<td>" + "<A href=\"#\" onclick=\"rendervariant(this.text);\">" +
	            data.docs[0].SNPs[i].rs_ID + "</A></td>";
        SNPtable += "<td>" + "<A href=\"#\" onclick=\"renderprotein(this.text);\">" +
	            data.docs[0].SNPs[i].Proteins[0].protein_id + "</A></td>";
        /*SNPtable += "<td>" + data.docs[0].SNPs[i].rs_ID + "</td>";
        SNPtable += "<td>" + data.docs[0].SNPs[i].Proteins[0].protein_id + "</td>";*/
        SNPtable += "<td>" + data.docs[0].SNPs[i].Proteins[0].name + "</td>";
        SNPtable += "</tr>";  
    }
    SNPtable += "</table>";
    SNPtable += "<P align=\"right\"><A href=\"#\" onclick=\"renderdiseases();\">Return</A></P>"
    if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptozero3();\">Beginning</A>"; 
	  table += " - <A href=\"#\" onclick=\"addtoskip3(-page);\"> Previous</A> - ";
	}
    table += "<A href=\"#\" onclick=\"addtoskip3(page);\">Next</A>";
    document.getElementById('container').innerHTML = "";
    /*document.getElementById('container').innerHTML += "<title>Protein:accession</title>;*/
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').innerHTML += Header;
    document.getElementById('container').innerHTML += table;
    document.getElementById('container').innerHTML += SNPtable;
  });
}





