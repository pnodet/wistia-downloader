const fs = require("fs");
const http = require("http")
const scrape = require("website-scraper");

var files = fs.readdirSync("./pages/");
console.log(files);

for (i=0; i < files.length ; i++) {
  var text = fs.readFileSync(
    "./pages/"+files[i],
    "utf8"
  );
  var myRegexp = /wvideo=([\s\S]*?)"></;
  var match = myRegexp.exec(text);
  console.log(match[1]);

  var newLink =
    "https://fast.wistia.net/embed/iframe/" + match[1] + "?videoFoam=true";

  var options = {
    urls: [newLink],
    directory: "./videoFiles/file_" + match[1],
  };

  scrape(options)
    .then((result) => {
      console.log("Website " + match[1] + " succesfully downloaded");

      var videoFile = fs.readFileSync(
        "./videoFiles/file_" +
          match[1] +
          "/index.html",
        "utf8"
      );

      // regex the link in the page
      var binRegex = /url":"([\s\S]*?)","/;
      var binLink = binRegex.exec(videoFile);

      // print out the link
      console.log(binLink[1]);

      const file = fs.createWriteStream("file.mp4");
      const request = http.get(binLink[1], function (response) {
        response.pipe(file);
      });
    })
    .catch((err) => {
      console.log("An error ocurred", err);
  });
}