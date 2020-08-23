'use strict';
/*exported createAnimeSearchRegexQuery*/

const ANIME_REGEX_REPLACE_RULES = [
	{
		input: 'ou',
		replace: '(ou|ō)'
	},
	{
		input: 'oo',
		replace: '(oo|ō)'
	},
	{
		input: 'o',
		replace: '[oōóòöôøΦ]'
	},
	{
		input: 'uu',
		replace: '(uu|ū)'
	},
	{
		input: 'u',
		replace: '[uūûúùüǖ]'
	},
	{
		input: 'a',
		replace: '[aä@âàáạåæā]'
	},
	{
		input: 'c',
		replace: '[cč]'
	},
	{
		input: ' ',
		replace: '([★☆\\/\\*=\\+·♥∽・〜†×♪→␣:;]* |(☆|★|\\/|\\*|=|\\+|·|♥|∽|・|〜|†|×|♪|→|␣|:|;)+)'
	},
	{
		input: 'e',
		replace: '[eéêëèæ]'
	},
	{
		input: '\'',
		replace: '[\'’]'
	},
	{
		input: 'n',
		replace: '[nñ]'
	},
	{
		input: '2',
		replace: '[2²]'
	},
	{
		input: 'i',
		replace: '[ií]'
	},
	{
		input: '3',
		replace: '[3³]'
	},
	{
		input: 'x',
		replace: '[x×]'
	},
	{
		input: 'b',
		replace: '[bß]'
	},
	{
		input: '\\\\-',
		replace: '[\\-–]'
	}
];

function createAnimeSearchRegexQuery(query) {
	let escapedValue = escapeRegExp(query);
	ANIME_REGEX_REPLACE_RULES.forEach(rule => {
		escapedValue = escapedValue.replace(new RegExp(rule.input, 'gi'), rule.replace);
	});
	return escapedValue;
}