import Transition = require('./transition');

class State {
  context: number;
  local: Transition = null;
  remote: Transition = null;

  constructor(context: number) {
    this.context = context;
  }
}

export = State;
