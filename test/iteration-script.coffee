Helper = require('hubot-test-helper')
chai = require 'chai'
expect = chai.expect

helper = new Helper('../src/iteration-script.js')
process.env.ALLOWED_ITERATION_ROOMS = ['room_1, room_2']
process.env.JIRA_IDENTIFIER = '1234'
process.env.PROJECT_IDENTIFIER = 'Web'

describe 'iteration-script', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  describe 'when room is authorized', ->
    beforeEach ->
      @room.name = 'room_1'

    it 'sets the dev complete story point commitment', ->
      @room.user.say('camden', 'hubot dev complete story points: 100').then =>
        expect(@room.robot.brain.get('devCompleteStoryPointCommitment')).to.eql('100')

    it 'sets the dev complete bug commitment', ->
      @room.user.say('camden', 'hubot dev complete bugs: 10').then =>
        expect(@room.robot.brain.get('devCompleteBugCommitment')).to.eql('10')

    xit 'returns the commitment result for the current iteration', ->
        @room.user.say('camden', 'hubot commitment').then =>


  describe 'when room is unauthorized', ->
    beforeEach ->
      @room.name = 'room_3'

    it 'does not set the dev complete story point commitment', ->
      @room.user.say('camden', 'hubot dev complete story points: 100').then =>
        expect(@room.robot.brain.get('devCompleteStoryPointCommitment')).to.eql(null)

    it 'does not set the dev complete bug commitment', ->
      @room.user.say('camden', 'hubot dev complete bugs: 10').then =>
        expect(@room.robot.brain.get('devCompleteBugCommitment')).to.eql(null)

    xit 'does not return the commitment result for the current iteration', ->
        @room.user.say('camden', 'hubot commitment').then =>
