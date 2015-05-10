var expect = require('chai').expect;
import Operation = require('../../app/ts/operations/operation');
import UpdateOperation = require('../../app/ts/operations/update-operation');

describe('UpdateOperation', function() {
  var op: UpdateOperation;

  before(function() {
    op = new UpdateOperation(2, 3);
    op.position = 4;
  });

  describe('transformWithAdd()', function() {
    it('increments the position if that is more than or equal to the corresponding insert operation', function() {
      var op2 = new Operation(3, 4, 'add');
      op2.position = 4;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position + 1);
    });

    it('does not transform if the position is less than the corresponding insert operation', function() {
      var op2 = new Operation(3, 4, 'add');
      op2.position = 5;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position);
    });
  });

  describe('transformWithUpdate()', function() {
    it('does no operation if the corresponding update is for same position and the site id is less than originate one', function() {
      var op2 = new Operation(1, 2, 'update');
      op2.position = 4;

      var t = op.transformWithUpdate(op2);
      expect(t).to.be.null;
    });

    it('does not transform if the position is different from the corresponding update operation', function() {
      var op2 = new Operation(1, 2, 'update');
      op2.position = 3;

      var t = op.transformWithUpdate(op2);
      expect(t.position).to.equal(op.position);

      op2 = new Operation(1, 3, 'update');
      op2.position = 5;

      t = op.transformWithUpdate(op2);
      expect(t.position).to.equal(op.position);
    });

    it('does not transform if the position is equal but the site id is less than or equal to the corresponding update operation', function() {
      var op2 = new Operation(3, 3, 'update');
      op2.position = 4;

      var t = op.transformWithUpdate(op2);
      expect(t.position).to.equal(op.position);
    });
  });

  describe('transformWithRemove()', function() {
    it('decriments the position if that is more than the corresponding remove operation', function() {
      var op2 = new Operation(3, 3, 'remove');
      op2.position = 3;

      var t = op.transformWithRemove(op2);
      expect(t.position).to.equal(op.position - 1);
    });

    it('does not transform if the position is more than the corresponding remove operation', function() {
      var op2 = new Operation(3, 3, 'remove');
      op2.position = 5;

      var t = op.transformWithRemove(op2);
      expect(t.position).to.equal(op.position);
    });

    it('does no operation if the position is same and the site id is more than the corresponding remove operation', function() {
      var op2 = new Operation(1, 3, 'remove');
      op2.position = 4;

      var t = op.transformWithRemove(op2);
      expect(t).to.be.null;
    });

    it('does not transform if the position is same and the site id is less than the corresponding remove operation', function() {
      var op2 = new Operation(3, 3, 'remove');
      op2.position = 4;

      var t = op.transformWithRemove(op2);
      expect(t.position).to.equal(op.position);
    });
  });
});
