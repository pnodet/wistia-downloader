const { match } = require("assert");
const fs = require("fs");
const http = require("http");
const scrape = require("website-scraper");

var files = fs.readdirSync("./pages/");

function getMatch(index) {
  return new Promise((resolve, reject) => {
    var text = fs.readFileSync("./pages/" + files[index], "utf8", () => {});
    var myRegexp = /wvideo=([\s\S]*?)"></;
    var match = myRegexp.exec(text);
    console.log(match[1]);
    return resolve(match[1]);
  });
}

function getOptions(myMatch) {
  return new Promise((resolve, reject) => {
    var newLink =
      "https://fast.wistia.net/embed/iframe/" + myMatch + "?videoFoam=true";
    var options = {
      urls: [newLink],
      directory: "./videoFiles/file_" + myMatch,
    };
    console.log(options);
    return resolve(options);
  });
}

function getVideo(params, options) {
  scrape(params, options)
    .then((result) => {
      console.log("Website succesfully downloaded");

      var videoFile = fs.readFile(
        "./videoFiles/file_" + params + "/index.html",
        "utf8",
        () => {}
      );

      // regex the link in the page
      var binRegex = /url":"([\s\S]*?)","/;
      var binLink = binRegex.exec(videoFile);

      var boaRegex = /https:\/\/(.*)/;
      var httpLink = boaRegex.exec(binLink[1]);
      var stringLink = "http://" + httpLink[1].toString();
      console.log(stringLink);

      const file = fs.createWriteStream(params + ".mp4", () => {});
      const request = http.get(stringLink, function (response) {
        response.pipe(file);
      });
    })
    .catch((err) => {
      console.log("An error ocurred", err);
    });
}

for (i = 0; i < files.length; i++) {
  getMatch(i)
    .then( alpha => {
      getOptions(alpha).then((beta) => {
        getVideo(alpha, beta);
      });
    })
        
    .catch((err) => {
      console.log("An error ocurred", err);
    });
}