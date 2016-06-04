'use strict';

var OPTIONS = {
	nl2br: true,
	maxplen: 400,
	minplen: 200,
	stringify: true
};

function defaults(source, target) {
	for (var prop in target) {
		if (typeof source[prop] === 'undefined') {
			source[prop] = target[prop];
		}
	}

	return source;
}

function splitLongLines(lines, maxplen, position) {
	if (position >= lines.length) {
		return lines;
	}

	var line = lines[position];

	if (line.length > maxplen) {
		var result = /[!?.][\n\r\t ]/.exec(line.substr(maxplen));
		if (result) {
			var start = line.substr(0, maxplen + result.index + 1);
			var end = line.substr(maxplen + result.index + 1).trim();
			lines = lines.slice(0, position).concat([start, end]);
			if (end.length <= maxplen) {
				position++;
			}
		}
	}

	return splitLongLines(lines, maxplen, ++position);
}

module.exports = function convert(text, options) {
	if (typeof text !== 'string') {
		throw new Error('`text` must be a string');
	}
	options = defaults(defaults({}, options || {}), OPTIONS);
	text = text.replace(/\r/g, '').trim();
	var lines, paragraphs = [];
	if (options.nl2br) {
		lines = text.split(/\n([ \t]*\n)+/g)
			.map(function(line) {
				return line.replace(/\n/g, '<br />');
			});
	} else {
		lines = text.split(/\n[ \t]*\n*/g);
	}

	paragraphs = splitLongLines(lines, options.maxplen, 0);

	if (options.stringify) {
		return '<p>' + paragraphs.join('</p><p>') + '</p>';
	}
	return paragraphs;
};
