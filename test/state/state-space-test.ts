var expect = require('chai').expect;
import AddOperation = require('../../app/ts/operations/add-operation');
import StateSpace = require('../../app/ts/state/state-space');
import State = require('../../app/ts/state/state');
import Command = require('../../app/ts/state/command');
import SendingQueue = require('../../app/ts/state/sending-queue');

describe('StateSpace', function() {
  var space;
  var siteId = 1;

  beforeEach(function() {
    space = new StateSpace(siteId, new SendingQueue());
  });

  it('just update the local state if the local flag is up', function() {
    var local = new AddOperation(siteId, 1);
    space.applyOperation(local, true);

    expect(space.current).to.equal(space.root.localCommand.toState);
  });

  it('update the remote state if the operation is ack operation', function() {
    var local = new AddOperation(siteId, 1);
    var localState = new State();
    space.current.localCommand = new Command(local, localState);
    space.current = space.current.localCommand.toState;

    var remote = space.remote;
    space.applyOperation(local);

    expect(space.remote).to.equal(remote.localCommand.toState);
  });

  it('just appends new state if the remote operation is generated on the same state', function() {
    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.remote).to.equal(space.root.remoteCommand.toState);
  });

  it('converges if the remote operation conflicts with the local one', function() {
    var localState = new State();
    space.current = localState;
    space.root.localCommand = new Command(new AddOperation(siteId, 1), localState);

    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.current).to.equal(localState.remoteCommand.toState);
    expect(space.current).to.equal(space.remote.localCommand.toState);
  });

  it('transforms commands until the states are completely converged', function() {
    var localState1 = new State();
    space.current.localCommand = new Command(new AddOperation(siteId, 1), localState1);
    space.current = space.current.localCommand.toState;

    var localState2 = new State();
    space.current.localCommand = new Command(new AddOperation(siteId, 2), localState2);
    space.current = space.current.localCommand.toState;

    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.current).to.equal(localState2.remoteCommand.toState);
    expect(space.current).to.equal(space.remote.localCommand.toState.localCommand.toState);
  });
});
