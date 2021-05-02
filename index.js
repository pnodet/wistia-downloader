import { readFileSync, createWriteStream } from "fs";
import { get } from "http";
import scrape from "website-scraper";

import { question } from "readline-sync";
let text = question("Paste your link and press enter : ");

//let text = fs.readFileSync("./pages/00.html", "utf8");

let myRegexp = /wvideo=([\s\S]*?)"></;
let match = myRegexp.exec(text);

let newLink =
  "https://fast.wistia.net/embed/iframe/" + match[1] + "?videoFoam=true";

let options = {
  urls: [newLink],
  directory: "./videoFiles/file_" + match[1],
};

scrape(options)
  .then((result) => {
    console.log("Website succesfully downloaded");

    let videoFile = readFileSync(
      "./videoFiles/file_" + match[1] + "/index.html",
      "utf8"
    );

    // regex the link in the page
    let binRegex = /url":"([\s\S]*?)","/;
    let binLink = binRegex.exec(videoFile);

    let boaRegex = /https:\/\/(.*)/;
    let httpLink = boaRegex.exec(binLink[1]);
    let stringLink = "http://"+httpLink[1].toString();
    console.log(stringLink);

    // download the video
    const file = createWriteStream(match[1] + ".mp4");
    const request = get(stringLink, function (response) {
      response.pipe(file);
    });

  })
  .catch((err) => {
    console.log("An error ocurred", err);
  });