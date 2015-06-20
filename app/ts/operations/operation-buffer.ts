import Operation = require('./operation');
import noop = require('../utils/noop');

class OperationBuffer {
  private _buffer: Operation[] = [];

  /**
   * append the operation with transformations against context.
   * context: the count of operations that were executed before the target operation.
   */
  append(op: Operation, context: number, onAppend: (op: Operation) => void) {
    if (this._buffer.length < context) {
      throw new Error('Invalid context: the context size is larger than the buffer size');
    }

    var transformed = op;
    for (var i = context, ii = this._buffer.length; i < ii; i++) {
      transformed = transformed.transformWith(this._buffer[i]);
    }

    this._buffer.push(transformed);
    onAppend(transformed);
  }

  getLast() : Operation {
    return this._buffer[this._buffer.length - 1];
  }

  getAll() : Operation[] {
    return this._buffer.concat();
  }
}

export = OperationBuffer;
