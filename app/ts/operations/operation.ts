class Operation {
  private _siteId: number;
  private _seqId: number;
  private _type: string;

  position: number;
  value: string;

  constructor(siteId: number, seqId: number, type: string) {
    this._siteId = siteId;
    this._seqId = seqId;
    this._type = type;
  }

  get siteId() : number {
    return this._siteId;
  }

  get seqId() : number {
    return this._seqId;
  }

  get type() : string {
    return this._type;
  }

  clone() : Operation {
    var clone = new Operation(this._siteId, this._seqId, this._type);
    clone.position = this.position;
    clone.value = this.value;
    return clone;
  }

  transformWithAdd(op: Operation) : Operation {
    throw new Error('Class "Operation" requires inheritance');
  }

  transformWithUpdate(op: Operation) : Operation {
    throw new Error('Class "Operation" requires inheritance');
  }

  transformWithRemove(op: Operation) : Operation {
    throw new Error('Class "Operation" requires inheritance');
  }

  transformWith(op: Operation) : Operation {
    var type = op.type;

    switch (type) {
      case 'add':
        return this.transformWithAdd(op);
      case 'update':
        return this.transformWithUpdate(op);
      case 'remove':
        return this.transformWithRemove(op);
      default:
        throw new Error('Invalid Operation type');
    }
  }
}

export = Operation;
