import Command = require('./command');

class State {
  localCommand: Command = null;
  remoteCommand: Command = null;
}

export = State;
