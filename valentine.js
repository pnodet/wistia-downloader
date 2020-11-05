const fs = require("fs");
const csv = require("csv-parser");
const opn = require("open");

var readline = require("readline-sync");
var inputFilePath = readline.question("Input file path : ");

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", function (data) {
    try {
      //perform the operation
      opn(data.URL);
    } catch (err) {
      console.log(err);
    }
  })
  .on("end", function () {
    console.log("success");
  });
