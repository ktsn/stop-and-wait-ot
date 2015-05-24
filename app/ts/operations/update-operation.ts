import Operation = require('./operation');

class UpdateOperation extends Operation {
  constructor(siteId: number, seqId: number) {
    super(siteId, seqId, 'update');
  }

  clone() : Operation {
    var clone = new UpdateOperation(this.siteId, this.seqId);
    clone.position = this.position;
    clone.value = this.value;
    return clone;
  }

  transformWithAdd(op: Operation) : Operation {
    var clone = this.clone();

    if (clone.position >= op.position) {
      clone.position++;
    }

    return clone;
  }

  transformWithUpdate(op: Operation) : Operation {
    var clone = this.clone();

    if (clone.position === op.position && clone.siteId > op.siteId) {
      return null;
    }

    return clone;
  }

  transformWithRemove(op: Operation) : Operation {
    var clone = this.clone();

    if (clone.position > op.position) {
      clone.position--;
    } else if (clone.position === op.position && clone.siteId > op.siteId) {
      return null;
    }

    return clone;
  }
}

export = UpdateOperation;
