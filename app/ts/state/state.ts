import Transition = require('./transition');

class State {
  local: Transition = null;
  remote: Transition = null;
}

export = State;
