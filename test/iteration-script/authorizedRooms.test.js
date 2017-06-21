import test from 'ava';
const Helper = require('hubot-test-helper');

const helper = new Helper('../src/iteration-script.js');

test.beforeEach(t => {
  process.env.ALLOWED_ITERATION_ROOMS = ['room_1, room_2']
  process.env.JIRA_IDENTIFIER = '1234'
  process.env.PROJECT_IDENTIFIER = 'Web'
  let room = helper.createRoom();
  room.name = 'room_1';
});

test.afterEach(t => {
  room.destroy();
});

test('sets the dev complete story point commitment', t => {
  room.user.say('camden', 'hubot dev complete story points: 100');
  t.is(room.robot.brain.get('devCompleteStoryPointCommitment'), '100');
});

test.skip('sets the dev complete bug commitment', t => {

});
