#!/usr/bin/env node
/* eslint-disable no-warning-comments */
import {readFileSync, createWriteStream, access, constants} from 'node:fs';
import {get} from 'node:http';
import process from 'node:process';
import {finished} from 'node:stream';
import meow from 'meow';
import chalk from 'chalk';
import ora from 'ora';
import scrape from 'website-scraper';
import logSymbols from 'log-symbols';

const log = (message, type) => {
	switch (type) {
		case 'success':
			console.log(`${logSymbols.success} ${chalk.bold.green(message)}`);
			break;

		case 'error':
			console.log(`${logSymbols.error} ${chalk.bold.red(message)}`);
			break;

		default:
			console.log(`${logSymbols.info} ${chalk.bold(message)}`);
			break;
	}
};

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

const {input} = cli;

if (input.length === 0) {
	log(`Specify an url.`, 'error');
	process.exit(1);
}

const myRegexp = /wvideo=([\s\S]*?)"></;
const match = myRegexp.exec(input);

const videoID = match[1];
const videoUrl = `https://fast.wistia.net/embed/iframe/${videoID}?videoFoam=true`;
const directory = `./videoFiles/file_${videoID}`;

log(`Retrieving video ${videoID}`, 'success');

// FIXME:
try {
	log('Checking directory...');
	access(directory, constants.R_OK | constants.W_OK);
	log('can read/write');
} catch {
	log('no access!', 'error');
}

(async () => {
	const options = {
		urls: [videoUrl],
		directory,
	};
	let spinner = ora(`Downloading website...`).start();
	await scrape(options);
	spinner.succeed(`Website succesfully downloaded`);

	const videoFile = readFileSync(
		`./videoFiles/file_${videoID}/index.html`,
		'utf8',
	);

	// Regex the link in the page
	const binLink = /url":"([\s\S]*?)","/.exec(videoFile);
	const httpLink = /https:\/\/(.*)/.exec(binLink[1]);
	const stringLink = `http://${httpLink[1].toString()}`;

	// Download the video
	spinner = ora(`Downloading video...`).start();
	const file = createWriteStream(`${videoID}.mp4`);
	get(stringLink, (response) => {
		response.pipe(file);
	});

	finished(file, (error) => {
		if (error) {
			spinner.warn('Stream failed.');
			log(error, 'error');
		} else {
			spinner.succeed(`Video succesfully downloaded`);
		}
	});
})().catch((error) => {
	log(error, 'error');
	process.exit(1);
});
