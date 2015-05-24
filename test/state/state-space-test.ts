var expect = require('chai').expect;
import AddOperation = require('../../app/ts/operations/add-operation');
import StateSpace = require('../../app/ts/state/state-space');
import State = require('../../app/ts/state/state');
import Transition = require('../../app/ts/state/transition');
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

    expect(space.current).to.equal(space.root.local.to);
    expect(space.current.context).to.equal(1);
  });

  it('update the remote state if the operation is ack operation', function() {
    var local = new AddOperation(siteId, 1);
    var localState = new State(1);
    space.current.local = new Transition(local, localState);
    space.current = space.current.local.to;

    var remote = space.remote;
    space.applyOperation(local);

    expect(space.remote).to.equal(remote.local.to);
  });

  it('just appends new state if the remote operation is generated on the same state', function() {
    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.remote).to.equal(space.root.remote.to);
    expect(space.remote.context).to.equal(1)
  });

  it('converges if the remote operation conflicts with the local one', function() {
    var localState = new State(1);
    space.current = localState;
    space.root.local = new Transition(new AddOperation(siteId, 1), localState);

    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.current).to.equal(localState.remote.to);
    expect(space.current).to.equal(space.remote.local.to);
    expect(space.current.context).to.equal(2);
  });

  it('transforms operations until the states are completely converged', function() {
    var localState1 = new State(1);
    space.current.local = new Transition(new AddOperation(siteId, 1), localState1);
    space.current = space.current.local.to;

    var localState2 = new State(2);
    space.current.local = new Transition(new AddOperation(siteId, 2), localState2);
    space.current = space.current.local.to;

    var remote = new AddOperation(2, 1);
    space.applyOperation(remote);

    expect(space.current).to.equal(localState2.remote.to);
    expect(space.current).to.equal(space.remote.local.to.local.to);
    expect(space.current.context).to.equal(3);
  });
});
