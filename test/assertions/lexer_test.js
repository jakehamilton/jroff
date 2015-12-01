var assert = require('assert'),
  jroff = require('../../dist/jroff');

describe('Lexer', function () {
  beforeEach(function () {
    var source = '.TH TITLE \n .SH TEST';

    this.lexer = new jroff.Lexer(source);
  });

  describe('instantiation', function () {
    it('splits the source by withespaces and newlines', function () {
      assert.deepEqual(this.lexer.source, ['.TH', 'TITLE', '\n', '.SH', 'TEST']);
    });

    it('creates instance variables with useful values to track the current line and column', function () {
      assert.equal(this.lexer.col, 0);
      assert.equal(this.lexer.line, 1);
    });
  });

  describe('#lex', function () {
    it('returns an array of token instances', function () {
      var allTokens = this.lexer.lex()
        .every(function (token) {
          return token instanceof jroff.Token;
        });

      assert.ok(allTokens);
    });

    it('returns an array of tokens with the correct values', function () {
      var tokens = this.lexer.lex();

      assert.equal(tokens[0].kind, jroff.MACRO);
      assert.equal(tokens[0].value, 'TH');

      assert.equal(tokens[1].kind, jroff.TEXT);
      assert.equal(tokens[1].value, 'TITLE');
    });
  });

  describe('#next', function () {
    it('properly returns the next item in the `source` array', function () {
      var first = this.lexer.next(),
        second = this.lexer.next();

      assert.equal(first, '.TH');
      assert.equal(second, 'TITLE');
    });

    it('increases the value of sourceIdx on each call', function () {
      this.lexer.next();
      this.lexer.next();

      assert.equal(this.lexer.sourceIdx, 2);
    });

    it('keeps updated the `col` and `line` instance variables', function () {
      this.lexer.next();
      assert.equal(this.lexer.col, 3);
      assert.equal(this.lexer.line, 1);

      this.lexer.next();
      assert.equal(this.lexer.col, 8);
      assert.equal(this.lexer.line, 1);

      this.lexer.next();
      assert.equal(this.lexer.col, 0);
      assert.equal(this.lexer.line, 2);
    });

  });
});