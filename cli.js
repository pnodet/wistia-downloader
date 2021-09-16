#!/usr/bin/env node
import {
	existsSync,
	accessSync,
	readFileSync,
	createWriteStream,
	rmSync,
	constants,
} from 'node:fs';
import {promisify} from 'node:util';
import {get} from 'node:http';
import process from 'node:process';
import {pipeline, finished} from 'node:stream';
import meow from 'meow';
import chalk from 'chalk';
import ora from 'ora';
import scrape from 'website-scraper';
import logSymbols from 'log-symbols';

const log = (message, type) => {
	switch (type) {
		case 'success':
			console.log(`${logSymbols.success} ${message}`);
			break;

		case 'error':
			console.log(`${logSymbols.error} ${chalk.red(message)}`);
			break;

		default:
			console.log(`${logSymbols.info} ${message}`);
			break;
	}
};

const cli = meow(
	`Usage
	Right click on a wistia video and hit "Copy Link and Thumbnail".
	  $ wistia-downloader 'https://...'`,
	{
		importMeta: import.meta,
	},
);

const {input} = cli;

if (input.length === 0) {
	log(`Specify an url.`, 'error');
	process.exit(1);
}

const videoID = /wvideo=([\s\S]*?)"></.exec(input)[1];
const videoUrl = `https://fast.wistia.net/embed/iframe/${videoID}?videoFoam=true`;
const directory = `./videoFiles/file_${videoID}`;

log(`Retrieving video ${videoID}`, 'success');

let spinner = ora(`Checking directory...`).start();

try {
	accessSync(`./videoFiles`, constants.R_OK | constants.W_OK);
} catch (error) {
	log('no access!', 'error');
	log(error, 'error');
	process.exit(1);
}

try {
	if (existsSync(directory)) {
		rmSync(directory, {recursive: true});
	}
} catch (error) {
	log(error, 'error');
	process.exit(1);
}

spinner.succeed(`Can read/write in the directory`);

const options = {
	urls: [videoUrl],
	directory,
};

const finishedStream = promisify(finished);

(async () => {
	spinner = ora(`Downloading website...`).start();
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
		pipeline(response, file, (error) => {
			if (error) console.error('Pipeline failed.', error);
		});
	});

	await finishedStream(file);
	spinner.succeed(`Video succesfully downloaded`);

	spinner = ora(`Removing website files...`).start();
	rmSync(directory, {recursive: true}, () => {
		log('done');
	});
	spinner.succeed(`Website files succesfully removed`);
	log(`Video availabe here: ${import.meta.url}/${videoID}.mp4`, 'success');
})().catch((error) => {
	log(error, 'error');
	process.exit(1);
});
