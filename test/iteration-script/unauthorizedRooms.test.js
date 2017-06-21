import test from 'ava';
Helper = require('hubot-test-helper');

helper = new Helper('../src/iteration-script.js');


test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});
