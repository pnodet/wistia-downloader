const fs = require("fs");

var text = fs.readFileSync(
  "/Users/pnodet/Documents/GitHub/wistia-downloader/pages/link1.html",
  "utf8"
);

var myRegexp = /wvideo=(..........)/;
var match = myRegexp.exec(text);
//console.log(match[1]);

var newLink = "https://fast.wistia.net/embed/iframe/"+match[1]+"?videoFoam=true";

//console.log(newLink);

const scrape = require("website-scraper");

let options = {
  urls: [newLink],
  directory: "./videoFiles/file_"+match[1],
};

scrape(options)
  .then((result) => {
    console.log("Website succesfully downloaded");
  })
  .catch((err) => {
    console.log("An error ocurred", err);
  });

var videoFile = fs.readFileSync(
  "/Users/pnodet/Documents/GitHub/wistia-downloader/videoFiles/file_" +
    match[1] +
    "/index.html",
  "utf8"
);

console.log(videoFile);