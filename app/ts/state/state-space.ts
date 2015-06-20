import Operation = require('../operations/operation');
import OperationFactory = require('../operations/operation-factory');
import State = require('./state');
import Transition = require('./transition');
import SendingQueue = require('./sending-queue');
import noop = require('../utils/noop');

class StateSpace {
  private _siteId: number;
  private _opFactory: OperationFactory;
  private _sendingQueue: SendingQueue;

  root: State;
  remote: State;
  current: State;

  onApplyOperation: (op: Operation, local: boolean) => void = noop;

  constructor(siteId: number, sendingQueue: SendingQueue) {
    this._siteId = siteId;
    this._sendingQueue = sendingQueue;
    this._opFactory = new OperationFactory(this._siteId);
    this.root = this.current = this.remote = new State(0);
  }

  get siteId() : number {
    return this._siteId;
  }

  applyOperation(op: Operation, local: boolean) {
    // just apply the local operation
    if (local) {
      var context = this.current.context;

      this._updateLocalState(op);

      this.onApplyOperation(op, local);

      // enqueue the operation and its context for synchronization
      this._sendingQueue.enqueue(op, context);
      return;
    }

    // the operation is the ack operation if the siteId is same as the local one.
    // that indicates remote sites apply the local operation.
    if (op.siteId === this._siteId) {
      // ensure this.remote has the local command.
      this.remote = this.remote.local.to;

      // notify the sending queue that the next operation can be send.
      this._sendingQueue.readySend();
      return;
    }

    var head: State = this.remote;

    // ensure the operation is from a remote site.
    // update the remote state.
    this._updateRemoteState(op);

    // converge the current state with the remote operation
    while (head.local) {
      this._convergeState(head);

      // update the operations and contexts in the sending queue
      // the client must send transformed operations
      this._sendingQueue.update(head.remote.to.local.operation, head.remote.to.context);

      head = head.local.to;
    }

    this.current = head.remote.to;

    this.onApplyOperation(head.remote.operation, local);
  }

  private _updateLocalState(op: Operation) {
    var next = new State(this.current.context + 1);
    this.current.local = new Transition(op, next);
    this.current = next;
  }

  private _updateRemoteState(op: Operation) {
    var next = new State(this.remote.context + 1);
    this.remote.remote = new Transition(op, next);
    this.remote = next;
  }

  private _convergeState(head: State) {
    // return if the states are already converged.
    if (head.local.to.remote !== null) {
      return;
    }

    var local: Transition = head.local;
    var remote: Transition = head.remote;

    var newState = new State(local.to.context + 1);

    // converge to new state with transforming operations in each transition.
    local.to.remote = new Transition(remote.operation.transformWith(local.operation), newState);
    remote.to.local = new Transition(local.operation.transformWith(remote.operation), newState);
  }
}

export = StateSpace;
