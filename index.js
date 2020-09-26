const fs = require("fs");
const http = require("http");
const scrape = require("website-scraper");

var readline = require("readline-sync");
var text = readline.question("Paste your link and press enter : ");

//var text = fs.readFileSync("./pages/00.html", "utf8");

var myRegexp = /wvideo=([\s\S]*?)"></;
var match = myRegexp.exec(text);

var newLink =
  "https://fast.wistia.net/embed/iframe/" + match[1] + "?videoFoam=true";

let options = {
  urls: [newLink],
  directory: "./videoFiles/file_" + match[1],
};

scrape(options)
  .then((result) => {
    console.log("Website succesfully downloaded");

    var videoFile = fs.readFileSync(
      "./videoFiles/file_" + match[1] + "/index.html",
      "utf8"
    );

    // regex the link in the page
    var binRegex = /url":"([\s\S]*?)","/;
    var binLink = binRegex.exec(videoFile);
    
    var boaRegex = /https:\/\/(.*)/;
    var httpLink = boaRegex.exec(binLink[1]);
    var stringLink = "http://"+httpLink[1].toString();
    console.log(stringLink);
    
    // download the video
    const file = fs.createWriteStream(match[1] + ".mp4");
    const request = http.get(stringLink, function (response) {
      response.pipe(file);
    });

  })
  .catch((err) => {
    console.log("An error ocurred", err);
  });