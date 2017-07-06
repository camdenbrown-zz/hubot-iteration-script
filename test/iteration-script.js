const Helper = require('hubot-test-helper');
const chai = require('chai');
const { expect } = chai;
const helper = new Helper('../src/iteration-script.js');

process.env.ALLOWED_ITERATION_ROOMS = ['room_1, room_2'];
process.env.JIRA_IDENTIFIER = '1234';
process.env.PROJECT_IDENTIFIER = 'Web';

describe('iteration-script', function() {
  beforeEach(function() {
    this.room = helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe('when room is authorized', function() {
    beforeEach(function() {
      this.room.name = 'room_1';
    });

    it('sets the dev complete story point commitment', function() {
      this.room.user.say('camden', 'hubot dev complete story points: 100').then(() => {
        expect(this.room.robot.brain.get('devCompleteStoryPointCommitment')).to.eql('100');
        expect(this.room.messages).to.eql([[ 'camden', 'hubot dev complete story points: 100' ],
                                           ['hubot', '@camden Updated to 100']
                                          ]);
      })
    });

    it('sets the dev complete bug commitment', function() {
      this.room.user.say('camden', 'hubot dev complete bugs: 10').then(() => {
        expect(this.room.robot.brain.get('devCompleteBugCommitment')).to.eql('10');
        expect(this.room.messages).to.eql([[ 'camden', 'hubot dev complete bugs: 10' ],
                                           ['hubot', '@camden Updated to 10']
                                          ]);
      });
    });

    xit('returns the commitment result for the current iteration', function() {
        this.room.user.say('camden', 'hubot commitment').then(() => {});
    });
  });

  describe('when room is unauthorized', function() {
    beforeEach(function() {
      this.room.name = 'room_3';
    });

    it('does not set the dev complete story point commitment', function() {
      this.room.user.say('camden', 'hubot dev complete story points: 100').then(() => {
        expect(this.room.robot.brain.get('devCompleteStoryPointCommitment')).to.eql(null);
      });
    });

    it('does not set the dev complete bug commitment', function() {
      this.room.user.say('camden', 'hubot dev complete bugs: 10').then(() => {
        expect(this.room.robot.brain.get('devCompleteBugCommitment')).to.eql(null);
      });
    });

    xit('does not return the commitment result for the current iteration', function() {
        this.room.user.say('camden', 'hubot commitment').then(() => {});
    });
  });
});
