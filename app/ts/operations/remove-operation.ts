import Operation = require('./operation');

class RemoveOperation extends Operation {
  constructor(siteId: number, seqId: number) {
    super(siteId, seqId, 'remove');
  }

  clone() : Operation {
    var clone = new RemoveOperation(this.siteId, this.seqId);
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
    } else if (clone.position === op.position && clone.siteId > op.siteId) {
      return null;
    }

    return clone;
  }
}

export = RemoveOperation;
