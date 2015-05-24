import noop = require('../utils/noop');
import Operation = require('../operations/operation');

class SendingQueue {
  private _queue = [];

  // called when an opration is ready to send
  onReadySend: (op: Operation, context: number) => void = noop;

  enqueue(op: Operation, context: number) {
    if (this._queue.length === 0) {
      this.onReadySend(op, context);
      return;
    }

    this._queue.push({
      operation: op,
      context: context
    });
  }

  readySend() {
    if (this._queue.length === 0) {
      return;
    }

    var data = this._queue.shift();

    this.onReadySend(data.operation, data.context);
  }

  update(op: Operation, context: number) {
    for (var i = 0, ii = this._queue.length; i < ii; i++) {
      var data = this._queue[i];
      if (data.operation.seqId === op.seqId) {
        data.operation = op;
        data.context = context;
        return;
      }
    }
  }
}

export = SendingQueue;
