const fs = require("fs");
const csv = require("csv-parser");
const opn = require("open");

var readline = require("readline-sync");
var inputFilePath = readline.question("Input file path : ");

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", function (row) {
    try {
      //perform the operation
      console.log(row.URL);
      opn(row.URL, { app: "microsoft-edge" });
    } catch (err) {
      console.log(err);
    }
  })
  .on("end", function () {
    console.log("success");
  });
