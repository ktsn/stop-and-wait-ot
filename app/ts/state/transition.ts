import Operation = require('../operations/operation');
import State = require('./state');

class Transition {
  operation: Operation;
  to: State;

  constructor(op: Operation, to: State) {
    this.operation = op;
    this.to = to;
  }
}

export = Transition;
