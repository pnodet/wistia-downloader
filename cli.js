#!/usr/bin/env node
import {readFileSync, createWriteStream} from 'node:fs';
import {get} from 'node:http';
import meow from 'meow';
import scrape from 'website-scraper';
import {question} from 'readline-sync';

const cli = meow(
	`
	Usage
	  $ get-emails <file>
	  $ cat <file> | get-emails
	Example
	  $ get-emails file.txt
	  sindresorhus@gmail.com
	  unicorn@rainbow.com
`,
	{
		importMeta: import.meta,
	},
);

const text = question('Paste your link and press enter : ');

const myRegexp = /wvideo=([\s\S]*?)"></;
const match = myRegexp.exec(text);

const newLink =
	'https://fast.wistia.net/embed/iframe/' + match[1] + '?videoFoam=true';

const options = {
	urls: [newLink],
	directory: './videoFiles/file_' + match[1],
};

const main = async () => {
	await scrape(options);
	console.log('Website succesfully downloaded');

	const videoFile = readFileSync(
		'./videoFiles/file_' + match[1] + '/index.html',
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
	const file = createWriteStream(match[1] + '.mp4');
	get(stringLink, (response) => {
		response.pipe(file);
	});
};

main();