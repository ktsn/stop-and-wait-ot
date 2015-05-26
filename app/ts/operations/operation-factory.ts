import Operation = require('./operation');
import AddOperation = require('./add-operation');
import UpdateOperation = require('./update-operation');
import RemoveOperation = require('./remove-operation');

class OperationFactory {
  private _siteId: number;
  private _maxSeqId: number = 0;

  constructor(siteId: number) {
    this._siteId = siteId;
  }

  create(type: string, position: number, value: string) {
    this._maxSeqId++;
    return this._create(type, position, value, this._siteId, this._maxSeqId);
  }

  createFromObj(obj: any) : Operation {
    return this._create(obj.type, obj.position, obj.value, obj.siteId, obj.seqId);
  }

  private _create(type: string, position: number, value: string, siteId: number, seqId: number) : Operation {
    var op;

    switch (type) {
      case 'add':
        op = new AddOperation(siteId, seqId);
        break;
      case 'update':
        op = new UpdateOperation(siteId, seqId);
        break;
      case 'remove':
        op = new RemoveOperation(siteId, seqId);
        break;
      default:
        throw new Error('Invalid operation type: ' + type);
    }

    op.position = position;
    op.value = value;

    return op;
  }
}

export = OperationFactory;
