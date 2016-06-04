'use strict';

var assert = require('assert');
var t2p = require('./index');

describe('text-to-paragraphs', function() {
	it('should throw invalid text error', function() {
		assert.throws(function() {
			t2p();
		});
	});
	it('should stringify paragraphs', function() {
		var ps = t2p('text');
		assert.equal('string', typeof ps);
		ps = t2p('text', { stringify: true });
		assert.equal('string', typeof ps);
	});

	it('No BRs', function() {
		var ps = t2p('text1\ntext2', { nl2br: false, stringify: false });
		assert.equal(2, ps.length);
	});

	it('should split long paragraphs', function() {
		var ps = t2p('Too long text? New text. Old text!', { stringify: false, maxplen: 6 });
		assert.equal(3, ps.length);
	});
});
