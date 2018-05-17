/**
 * @fileoverview This file provides functionality for a searchbar using
 * progressive search.
 */

/**
 * @param {string} address A raw string that is presumed to be an
 * address, or at least an attempt at an address with potential
 * errors of input.
 * @return {Object} Returns an array of addresses that hold
 * similarity to the input address.
 */
function addressQuery(input_address) {
  var mapServerUrl =
    "http://cityplan2014maps.brisbane.qld.gov.au/arcgis/rest/services/CityPlan/Cadastre/MapServer/0/query?where=";
  var suffix =
    "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&f=pjson";

  var split_address = parseInput_(input_address);
  mapServerUrl += formatRequest_(split_address) + suffix;

  // Send request to server

  return httpClient_("GET", mapServerUrl);
}

function parseInput_(input_address) {
  input_address = input_address.split(/([^/]+\/[^ ]+|\d*[^\s])[\s,]([^,]+)[\s,]([^,]+)/); // ([^/]+\/[^ ]+|\d*[^\s])([^,]+).([^,]+)
  var new_address = [];
  new_address = input_address
    .filter(v => v !== "")
    .filter(v => v !== undefined)
    .filter(v => v !== " ");
  return new_address;
}

function formatRequest_(addressObject) {
  console.log(addressObject);

  var unit = "";
  var addressNumber = "";
  var addressNumberSuffix = "";
  var streetName = "";
  var streetType = "";
  var suburb = "";

  // Structuring the query e.g. for address "[7/105, Annie Street, Auchenflower]"
  for (i = 0; i < addressObject.length; i++) {
    // If unit/addressNumber
    if (i == 0 && addressObject[i].includes("/")) {
      unit += "UNIT_NUMBER+%3D+" + addressObject[i].split("/")[0] + "+AND+";
      addressNumber += "HOUSE_NUMBER+%3D+" + addressObject[i].split("/")[1] + "+AND+";
    }
    // If only addressNumber
    else if (i == 0) {
      addressNumber += "HOUSE_NUMBER+%3D+" + addressObject[i] + "+AND+";
    }
    if (parseInt(addressNumber[-1]) === NaN) {
      addressNumberSuffix += "HOUSE_NUMBER_SUFFIX+%3D+" + addressNumber[addressNumber.length - 1] + "+AND+";
    }
    // If streetName streetType
    if (i == 1 && addressObject[i].includes(" ")) {
      var length = addressObject[i].split(" ").length;
      streetName +=
        "CORRIDOR_NAME+LIKE+%27" +
        addressObject[i]
          .split(" ")[0]
          .trim()
          .toUpperCase() +
        "%25%27+AND+";
      streetType += streetTypeFormat_(addressObject[i].split(" ")[length - 1]);
    }
    // If only streetName
    else if (i == 1) {
      streetName +=
        "CORRIDOR_NAME+LIKE+%27" +
        addressObject[i]
          .split(" ")[0]
          .trim()
          .toUpperCase() +
        "%25%27+AND+";
    }
    // If Suburb
    if (i == 2) {
      suburb += "SUBURB+LIKE+%27" + addressObject[i].trim().toUpperCase() + "%25%27";
    }
  }
  var requestString = unit + addressNumber + addressNumberSuffix + streetName + streetType + suburb;
  console.log(encodeURIComponent(requestString));
  return requestString;
}

function httpClient_(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

function streetTypeFormat_(streetType) {
  if (streetType.toLowerCase() === "avenue") {
    streetType = "AVE";
  } else if (streetType.toLowerCase() === "bend") {
    streetType = "BEND";
  } else if (streetType.toLowerCase() === "boulevard") {
    streetType = "BLVD";
  } else if (streetType.toLowerCase() === "close") {
    streetType = "CL";
  } else if (streetType.toLowerCase() === "circuit") {
    streetType = "CRCT";
  } else if (streetType.toLowerCase() === "crescent") {
    streetType = "CRES";
  } else if (streetType.toLowerCase() === "corso") {
    streetType = "CSO";
  } else if (streetType.toLowerCase() === "court") {
    streetType = "CT";
  } else if (streetType.toLowerCase() === "drive") {
    streetType = "DR";
  } else if (streetType.toLowerCase() === "esplanade") {
    streetType = "ESP";
  } else if (streetType.toLowerCase() === "freeway") {
    streetType = "FRWY";
  } else if (streetType.toLowerCase() === "grove") {
    streetType = "GR";
  } else if (streetType.toLowerCase() === "highway") {
    streetType = "HWY";
  } else if (streetType.toLowerCase() === "island") {
    streetType = "ISL";
  } else if (streetType.toLowerCase() === "lane") {
    streetType = "LANE";
  } else if (streetType.toLowerCase() === "motorway") {
    streetType = "MWY";
  } else if (streetType.toLowerCase() === "outlook") {
    streetType = "OTLK";
  } else if (streetType.toLowerCase() === "parade") {
    streetType = "PDE";
  } else if (streetType.toLowerCase() === "parkway") {
    streetType = "PKY";
  } else if (streetType.toLowerCase() === "place") {
    streetType = "PL";
  } else if (streetType.toLowerCase() === "quay") {
    streetType = "QUAY";
  } else if (streetType.toLowerCase() === "road") {
    streetType = "RD";
  } else if (streetType.toLowerCase() === "rise") {
    streetType = "RISE";
  } else if (streetType.toLowerCase() === "row") {
    streetType = "ROW";
  } else if (streetType.toLowerCase() === "square") {
    streetType = "SQ";
  } else if (streetType.toLowerCase() === "street") {
    streetType = "ST";
  } else if (streetType.toLowerCase() === "terrace") {
    streetType = "TCE";
  } else if (streetType.toLowerCase() === "walk") {
    streetType = "WALK";
  } else if (streetType.toLowerCase() === "way") {
    streetType = "WAY";
  }
  else {
    streetType = "";
  }

  if (streetType !== "") {
    streetType = "CORRIDOR_SUFFIX_CODE+%3D+%27" + streetType + "%27+AND+";
  }
  return streetType;
}
