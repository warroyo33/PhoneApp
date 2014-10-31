define("ace/mode/latex", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/latex_highlight_rules", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./text").Mode, f = a("../tokenizer").Tokenizer, g = a("./latex_highlight_rules").LatexHighlightRules, h = a("../range").Range, i = function () {
        this.$tokenizer = new f((new g).getRules())
    };
    d.inherits(i, e), function () {
        this.toggleCommentLines = function (a, b, c, d) {
            var e = !0, f = /^(\s*)\%/;
            for (var g = c; g <= d; g++)if (!f.test(b.getLine(g))) {
                e = !1;
                break
            }
            if (e) {
                var i = new h(0, 0, 0, 0);
                for (var g = c; g <= d; g++) {
                    var j = b.getLine(g), k = j.match(f);
                    i.start.row = g, i.end.row = g, i.end.column = k[0].length, b.replace(i, k[1])
                }
            } else b.indentRows(c, d, "%")
        }, this.getNextLineIndent = function (a, b, c) {
            return this.$getIndent(b)
        }
    }.call(i.prototype), b.Mode = i
}), define("ace/mode/latex_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./text_highlight_rules").TextHighlightRules, f = function () {
        this.$rules = {start: [
            {token: "keyword", regex: "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)"},
            {token: "lparen", regex: "[[({]"},
            {token: "rparen", regex: "[\\])}]"},
            {token: "string", regex: "\\$(?:(?:\\\\.)|(?:[^\\$\\\\]))*?\\$"},
            {token: "comment", regex: "%.*$"}
        ]}
    };
    d.inherits(f, e), b.LatexHighlightRules = f
})