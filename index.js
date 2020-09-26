const fs = require("fs");
const scrape = require("website-scraper");
const http = require("http");


// TODO for each link in folder pages do blablabla …

var text = fs.readFileSync("./pages/00.html", "utf8");

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
    let stringLink = binLink[1].toString();
    console.log(stringLink);
    
    const file = fs.createWriteStream(match[1] + ".mp4");
    const request = http.get(stringLink, function (response) {
      response.pipe(file);
    });
  })
  .catch((err) => {
    console.log("An error ocurred", err);
  });