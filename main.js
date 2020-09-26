const fs = require("fs");
const scrape = require("website-scraper");

// TODO for each link in folder pages do blablabla …
var text = fs.readFileSync(
  "/Users/pnodet/Documents/GitHub/wistia-downloader/pages/link1.html",
  "utf8"
);

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
      "/Users/pnodet/Documents/GitHub/wistia-downloader/videoFiles/file_" +
        match[1] +
        "/index.html",
      "utf8"
    );

    // regex the link in the page
    var binRegex = /url":"([\s\S]*?)","/;
    var binLink = binRegex.exec(videoFile);

    // print out the link
    console.log(binLink[1]);
  })
  .catch((err) => {
    console.log("An error ocurred", err);
  });
