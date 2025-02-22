/* jslint node: true */
"use strict";

function isDefined(x) {
  return x !== undefined && x !== null;
}

function tablify(options) {
  options = options || {};
  var tableData = options.data || [];
  var header = options.header;
  var border = isDefined(options.border) ? options.border : 1;
  var cellspacing = isDefined(options.cellspacing) ? options.cellspacing : 0;
  var cellpadding = isDefined(options.cellpadding) ? options.cellpadding : 0;
  var background = "#e8e8e8"
  var color = "black"
  var tableId = options.table_id || "tablify";
  var tableClass = options.table_class || "tablify";
  var header_mapping = options.header_mapping || {};
  var pretty = options.pretty;
  if (pretty === undefined) {
    pretty = true;
  }
  var isSingleRow = false;
  if (!Array.isArray(tableData)) {
    isSingleRow = true;
    tableData = [tableData];
  }

  console.log("tableData")
  console.log(tableData)

  // If header exists in options use that else create it.
  if (!Array.isArray(header)) {
    var headerObj = {};
    tableData.forEach(function (json) {
      var keys = Object.keys(json);
      keys.forEach(function (key) {
        headerObj[key] = true;
      });
    });
    header = Object.keys(headerObj);
  }

  if (isSingleRow && tableData.length === 1) {
    // Don't create row if value is not defined for the header (key for objects)
    header = header.filter(function (h) {
      return tableData[0][h];
    });
  }

  // Generate table
  var htmlTable = "";
  var cellArray = [];
  var cellRow = [];
  cellArray.push(cellRow);
  header.forEach(function (key) {
    cellRow.push("<th>" + (header_mapping[key] || key) + "</th>");
  });
  tableData.forEach(function (json) {
    cellRow = [];
    cellArray.push(cellRow);
    header.forEach(function (key) {
      var value = json[key];
      var style = "";
      if (value === "Healthy") {
        style = "background-color: #e6ffe6; color: black";
      } else if (value === "Unhealthy") {
        style = "background-color: #ffe6e6; color: black";
      } else {
        style = "white; color: black";
      }
      if (value === undefined) {
        value = "";
      } else if(typeof value === "object") {
        value = value.join('    ')
        console.log("TRIGGERED")
      } else if (typeof value !== "string") {
        value = JSON.stringify(value);
      }
      cellRow.push(`<td style="${style}; text-align: center"> ${value} </td>`);
    });
  });

  var i, j;
  if (isSingleRow && cellArray.length) {
    // Transpose the array to show object as key-value pair instead of table
    cellArray = cellArray[0].map(function (col, i) {
      return cellArray.map(function (row) {
        return row[i];
      });
    });
  }

  var newLine = "";
  var indent = "";
  if (pretty) {
    newLine = "\n";
    indent = "  ";
  }
  if (options.css) {
    htmlTable += `<style>${newLine}${indent}${options.css}${newLine}</style>${newLine}`;
  }
  if (tableData.length) {
    htmlTable +=
      '<table id="' +
      tableId +
      '" class="' +
      tableClass +
      '" border="' +
      border +
      '" cellspacing="' +
      cellspacing +
      '" cellpadding="' +
      cellpadding +
      '"style="background-color:' +
      background +
      '; color:' +
      color +
      '">';
    for (i = 0; i < cellArray.length; i++) {
      htmlTable += newLine;
      htmlTable += indent;
      htmlTable += "<tr>";
      for (j = 0; j < cellArray[i].length; j++) {
        htmlTable += newLine;
        htmlTable += indent;
        htmlTable += indent;
        htmlTable += cellArray[i][j];
      }
      htmlTable += newLine;
      htmlTable += indent;
      htmlTable += "</tr>";
    }
    htmlTable += newLine;
    htmlTable += "</table>";
  }
  return htmlTable;
}

var html_tablify = {
  tablify: tablify,
};

module.exports = html_tablify;