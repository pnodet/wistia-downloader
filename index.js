import {readFileSync, createWriteStream} from 'fs';
import {get} from 'http';
import scrape from 'website-scraper';
import {question} from 'readline-sync';

const text = question('Paste your link and press enter : ');

//let text = fs.readFileSync("./pages/00.html", "utf8");

const myRegexp = /wvideo=([\s\S]*?)"></;
const match = myRegexp.exec(text);

const newLink =
	'https://fast.wistia.net/embed/iframe/' + match[1] + '?videoFoam=true';

const options = {
	urls: [newLink],
	directory: './videoFiles/file_' + match[1],
};

scrape(options)
	.then((result) => {
		console.log('Website succesfully downloaded');

		const videoFile = readFileSync(
			'./videoFiles/file_' + match[1] + '/index.html',
			'utf8',
		);

		// regex the link in the page
		const binRegex = /url":"([\s\S]*?)","/;
		const binLink = binRegex.exec(videoFile);

		const boaRegex = /https:\/\/(.*)/;
		const httpLink = boaRegex.exec(binLink[1]);
		const stringLink = 'http://' + httpLink[1].toString();
		console.log(stringLink);

		// download the video
		const file = createWriteStream(match[1] + '.mp4');
		const request = get(stringLink, function (response) {
			response.pipe(file);
		});
	})
	.catch((err) => {
		console.log('An error ocurred', err);
	});
