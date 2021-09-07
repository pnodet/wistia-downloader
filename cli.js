#!/usr/bin/env node
import {readFileSync, createWriteStream} from 'node:fs';
import {get} from 'node:http';
import meow from 'meow';
import scrape from 'website-scraper';
import {question} from 'readline-sync';
import logSymbols from 'log-symbols';

const cli = meow(
	`
	Usage
	Right click on a wistia video and hit "Copy Link and Thumbnail"
	  $ wistia-downloader <url>
`,
	{
		importMeta: import.meta,
	},
);
let {input} = cli;
if (input.length === 0) {
	console.error('Specify the url');
	process.exit(1);
}

const myRegexp = /wvideo=([\s\S]*?)"></;
const match = myRegexp.exec(input);

const videoID = match[1];
const videoIDChalk = chalk.bold(match[1]);
const videoUrl = `https://fast.wistia.net/embed/iframe/${videoID}?videoFoam=true`;

const options = {
	urls: [videoUrl],
	directory: `./videoFiles/file_${videoID}`,
};

const spinner = ora(`Downloading website…`).start();

(async () => {
	await scrape(options);
	spinner.text(`${logSymbols.success} Website succesfully downloaded`);

	const videoFile = readFileSync(
		`./videoFiles/file_${videoID}/index.html`,
		'utf8',
	);

	// Regex the link in the page
	const binRegex = /url":"([\s\S]*?)","/;
	const binLink = binRegex.exec(videoFile);

	const boaRegex = /https:\/\/(.*)/;
	const httpLink = boaRegex.exec(binLink[1]);
	const stringLink = 'http://' + httpLink[1].toString();
	console.log(stringLink);

	// Download the video
	const file = createWriteStream(`${videoID}.mp4`);
	get(stringLink, (response) => {
		response.pipe(file);
	});
})().catch((error) => {
	spinner.stop();
	console.error(error);
	process.exit(1);
});
