'use strict';

var grunt = require('grunt');
var gm = require("gm");

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.unretina = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  resize: function (test) {
    test.expect(1);

    gm("tmp/test.png")
    .size(function (err, destSize) {
      gm("test/fixtures/test@2x.png")
      .size(function (err, srcSize) {
        test.ok(srcSize.width / 2 === destSize.width && srcSize.height / 2 === destSize.height, "should resize in half");

        test.done();
      });
    });
  },
  resizeNested: function (test) {
    test.expect(1);

    gm("tmp/nested/nested/test.png")
    .size(function (err, destSize) {
      gm("test/fixtures/nested/nested/test@2x.png")
      .size(function (err, srcSize) {
        test.ok(srcSize.width / 2 === destSize.width && srcSize.height / 2 === destSize.height, "should resize in half");

        test.done();
      });
    });
  }
};
