import Operation = require('../operations/operation');
import State = require('./state');

class Command {
  operation: Operation;
  toState: State;

  constructor(op: Operation, to: State) {
    this.operation = op;
    this.toState = to;
  }
}

export = Command;
