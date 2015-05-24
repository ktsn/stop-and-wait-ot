import Operation = require('./operation');

class AddOperation extends Operation {
  constructor(siteId: number, seqId: number) {
    super(siteId, seqId, 'add');
  }

  clone() : Operation {
    var clone = new AddOperation(this.siteId, this.seqId);
    clone.position = this.position;
    clone.value = this.value;
    return clone;
  }

  transformWithAdd(op: Operation) : Operation {
    var clone = this.clone();

    if (clone.position > op.position || clone.position === op.position && clone.siteId > op.siteId) {
      clone.position++;
    }

    return clone;
  }

  transformWithUpdate(op: Operation) : Operation {
    return this.clone();
  }

  transformWithRemove(op: Operation) : Operation {
    var clone = this.clone();

    if (clone.position > op.position) {
      clone.position--;
    }

    return clone;
  }
}

export = AddOperation;
