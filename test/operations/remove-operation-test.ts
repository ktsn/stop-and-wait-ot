var expect = require('chai').expect;
import Operation = require('../../app/ts/operations/operation');
import RemoveOperation = require('../../app/ts/operations/remove-operation');

describe('RemoveOperation', function() {
  var op: RemoveOperation;

  before(function() {
    op = new RemoveOperation(2, 3);
    op.position = 4;
  });

  describe('transformWithAdd()', function() {
    it('increments the position if that is more than the corresponding add operation', function() {
      var op2 = new Operation(3, 3, 'add');
      op2.position = 2;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position + 1);
    });

    it('increments the position with an add operation having equal position and less site id', function() {
      var op2 = new Operation(1, 3, 'add');
      op2.position = 4;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position + 1);
    });

    it('does not transform with an add operation having equal position and more site id', function() {
      var op2 = new Operation(5, 3, 'add');
      op2.position = 4;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position);
    });

    it('does not transform with an add operation having more position', function() {
      var op2 = new Operation(3, 3, 'add');
      op2.position = 5;

      var t = op.transformWithAdd(op2);
      expect(t.position).to.equal(op.position);
    });
  });

  describe('transformWithUpdate()', function() {
    it('does not transform with any update operations', function() {
      var op2 = new Operation(1, 3, 'update');
      op2.position = 1;

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
