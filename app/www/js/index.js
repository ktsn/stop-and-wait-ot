var StateSpace = require('../../ts/state/state-space');
var Operation = require('../../ts/operations/operation');
var OperationFactory = require('../../ts/operations/operation-factory');
var SendingQueue = require('../../ts/state/sending-queue');

var _socket = io();
var _siteId = -1;
var _factory = null;
var _stateSpace = null;
var _queue = new SendingQueue();
_queue.onReadySend = sendOperation;

var _doc = document.getElementById('document');
var _prev = _doc.value;

_doc.addEventListener('input', function(event) {
  event.preventDefault();
  var pos, value, operation;

  if (_doc.value.length < _prev.length) { // delete
    pos = event.target.selectionStart;
    value = '';
    operation = _factory.create('remove', pos, value);
  } else {
    pos = event.target.selectionStart - 1;
    value = event.target.value.charAt(pos);
    operation = _factory.create('add', pos, value);
  }

  _prev = _doc.value;
  console.log(operation, _stateSpace.current.context);

  _stateSpace.applyOperation(operation, true);
});

_socket.on('init', function(data) {
  console.log('siteId: ' + data.siteId);
  _siteId = data.siteId;
  _stateSpace = new StateSpace(_siteId, _queue);
  _factory = new OperationFactory(_siteId);

  _stateSpace.onApplyOperation = applyOperation;

  data.operations.forEach(function(op) {
    _stateSpace.applyOperation(_factory.createFromObj(op), false);
  });
});

_socket.on('operation', function(data) {
  console.log('<=== received:');
  console.log(data);
  _stateSpace.applyOperation(_factory.createFromObj(data), false);
});

function sendOperation(op, ctx) {
  var data = {
    operation: op.parameters(),
    context: ctx
  };
  console.log('===> sent:');
  console.log(data);
  _socket.emit('operation', data);
}

function applyOperation(op, local) {
  if (local) {
    return;
  }

  var text = _doc.value;
  var start = _doc.selectionStart;
  var end = _doc.selectionEnd;

  switch (op.type) {
    case 'add':
      text = insertChar(text, op.position, op.value);
      if (op.position < start) {
        start++;
      }
      if (op.position < end) {
        end++;
      }
      break;
    case 'remove':
      text = removeChar(text, op.position);
      if (op.position < start) {
        start--;
      }
      if (op.position < end) {
        end--;
      }
      break;
    default:
      throw new Error('Invalid Operation Type: ' + op.type);
  }

  _prev = _doc.value = text;
  _doc.selectionStart = start;
  _doc.selectionEnd = end;
}

function insertChar(str, index, char) {
  return str.slice(0, index) + char + str.slice(index);
}

function removeChar(str, index) {
  return str.slice(0, index) + str.slice(index + 1);
}
