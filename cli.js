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
