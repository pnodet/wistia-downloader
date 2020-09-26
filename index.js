const fs = require("fs");

// TODO for each linl in folder pages do blablabla …

var text = fs.readFileSync(
  "/Users/pnodet/Documents/GitHub/wistia-downloader/pages/link1.html",
  "utf8"
);

var myRegexp = /wvideo=([\s\S]*?)"></;
var match = myRegexp.exec(text);

var newLink = "https://fast.wistia.net/embed/iframe/"+match[1]+"?videoFoam=true";

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

// TODO make it async
var videoFile = fs.readFileSync(
  "/Users/pnodet/Documents/GitHub/wistia-downloader/videoFiles/file_" +
    match[1] +
    "/index.html",
  "utf8"
);

// regex the link in the page
var binRegex = /url":"([\s\S]*?)","/;
var binLink = binRegex.exec(videoFile);

// print out the link
console.log(binLink[1])

// opens the url in the default browser
var opn = require("opn");
opn(binLink);

// get rid of https
var boaRegex = /https:\/\/(.*)/;
var httpLink = boaRegex.exec(binLink[1]);

// try to downlaod it via http
const http = require("http");
const file = fs.createWriteStream("video"+match[1]+".mp4");
const request = http.get("http://"+httpLink, function (response) {
  response.pipe(file);
});
