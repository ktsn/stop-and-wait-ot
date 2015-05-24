import Operation = require('../operations/operation');
import OperationFactory = require('../operations/operation-factory');
import State = require('./state');
import Command = require('./command');
import SendingQueue = require('./sending-queue');

class StateSpace {
  private _siteId: number;
  private _opFactory: OperationFactory;
  private _sendingQueue: SendingQueue;

  root: State;
  remote: State;
  current: State;

  constructor(siteId: number, sendingQueue: SendingQueue) {
    this._siteId = siteId;
    this._sendingQueue = sendingQueue;
    this._opFactory = new OperationFactory(this._siteId);
    this.root = this.current = this.remote = new State();
  }

  get siteId() : number {
    return this._siteId;
  }

  applyOperation(op: Operation, local: boolean) {
    // just apply the local operation
    if (local) {
      this._updateLocalState(op);

      // enqueue the operation for synchronization
      this._sendingQueue.enqueue(op);
      return;
    }

    // the operation is the ack operation if the siteId is same as the local one.
    // that indicates remote sites apply the local operation.
    if (op.siteId === this._siteId) {
      // ensure this.remote has the localCommand
      this.remote = this.remote.localCommand.toState;

      // dequeue the operation for further operation's synchronization
      this._sendingQueue.dequeue();
      return;
    }

    var head: State = this.remote;

    // ensure the operation is from a remote site.
    // update the remote state.
    this._updateRemoteState(op);

    // converge the current state with the remote operation
    while (head.localCommand) {
      this._convergeState(head);

      // update the operations in the sending queue
      // the client must send transformed operations
      this._sendingQueue.updateOperation(head.remoteCommand.toState.localCommand.operation);

      head = head.localCommand.toState;
    }

    this.current = head.remoteCommand.toState;
  }

  private _updateLocalState(op: Operation) {
    var next = new State();
    this.current.localCommand = new Command(op, next);
    this.current = next;
  }

  private _updateRemoteState(op: Operation) {
    var next = new State();
    this.remote.remoteCommand = new Command(op, next);
    this.remote = next;
  }

  private _convergeState(head: State) {
    // return if the states are already converged.
    if (head.localCommand.toState.remoteCommand !== null) {
      return;
    }

    var local: Command = head.localCommand;
    var remote: Command = head.remoteCommand;

    var newState = new State();

    local.toState.remoteCommand = new Command(local.operation.transformWith(remote.operation), newState);
    remote.toState.localCommand = new Command(remote.operation.transformWith(local.operation), newState);
  }
}

export = StateSpace;
