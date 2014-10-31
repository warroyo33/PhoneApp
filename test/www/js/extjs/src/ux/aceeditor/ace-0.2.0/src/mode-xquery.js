define("ace/mode/xquery", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/xquery_highlight_rules", "ace/mode/behaviour/xquery", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./text").Mode, f = a("../tokenizer").Tokenizer, g = a("./xquery_highlight_rules").XQueryHighlightRules, h = a("./behaviour/xquery").XQueryBehaviour, i = a("../range").Range, j = function (a) {
        this.$tokenizer = new f((new g).getRules()), this.$behaviour = new h(a)
    };
    d.inherits(j, e), function () {
        this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b), e = b.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);
            return e && (d += c), d
        }, this.checkOutdent = function (a, b, c) {
            return/^\s+$/.test(b) ? /^\s*[\}\)]/.test(c) : !1
        }, this.autoOutdent = function (a, b, c) {
            var d = b.getLine(c), e = d.match(/^(\s*[\}\)])/);
            if (!e)return 0;
            var f = e[1].length, g = b.findMatchingBracket({row: c, column: f});
            if (!g || g.row == c)return 0;
            var h = this.$getIndent(b.getLine(g.row));
            b.replace(new i(c, 0, c, f - 1), h)
        }, this.$getIndent = function (a) {
            var b = a.match(/^(\s+)/);
            return b ? b[1] : ""
        }, this.toggleCommentLines = function (a, b, c, d) {
            var e, f, g = !0, h = /^\s*\(:(.*):\)/;
            for (e = c; e <= d; e++)if (!h.test(b.getLine(e))) {
                g = !1;
                break
            }
            var j = new i(0, 0, 0, 0);
            for (e = c; e <= d; e++)f = b.getLine(e), j.start.row = e, j.end.row = e, j.end.column = f.length, b.replace(j, g ? f.match(h)[1] : "(:" + f + ":)")
        }
    }.call(j.prototype), b.Mode = j
}), define("ace/mode/xquery_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("../lib/lang"), f = a("./text_highlight_rules").TextHighlightRules, g = function () {
        var a = e.arrayToMap("return|for|let|where|order|by|declare|function|variable|xquery|version|option|namespace|import|module|when|encoding|switch|default|try|catch|group|tumbling|sliding|window|start|end|at|only|using|stemming|while|external|if|then|else|as|and|or|typeswitch|case|ascending|descending|empty|in|count|updating|insert|delete|replace|value|node|attribute|text|element|into|of|with|contains".split("|"));
        this.$rules = {start: [
            {token: "text", regex: "<\\!\\[CDATA\\[", next: "cdata"},
            {token: "xml_pe", regex: "<\\?.*?\\?>"},
            {token: "comment", regex: "<\\!--", next: "comment"},
            {token: "comment", regex: "\\(:", next: "comment"},
            {token: "text", regex: "<\\/?", next: "tag"},
            {token: "constant", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},
            {token: "variable", regex: "\\$[a-zA-Z_][a-zA-Z0-9_\\-:]*\\b"},
            {token: "string", regex: '".*?"'},
            {token: "string", regex: "'.*?'"},
            {token: "text", regex: "\\s+"},
            {token: "support.function", regex: "\\w[\\w+_\\-:]+(?=\\()"},
            {token: function (b) {
                return a[b] ? "keyword" : "identifier"
            }, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},
            {token: "keyword.operator", regex: "\\*|=|<|>|\\-|\\+|and|or|eq|ne|lt|gt"},
            {token: "lparen", regex: "[[({]"},
            {token: "rparen", regex: "[\\])}]"}
        ], tag: [
            {token: "text", regex: ">", next: "start"},
            {token: "meta.tag", regex: "[-_a-zA-Z0-9:]+"},
            {token: "text", regex: "\\s+"},
            {token: "string", regex: '".*?"'},
            {token: "string", regex: "'.*?'"}
        ], cdata: [
            {token: "text", regex: "\\]\\]>", next: "start"},
            {token: "text", regex: "\\s+"},
            {token: "text", regex: "(?:[^\\]]|\\](?!\\]>))+"}
        ], comment: [
            {token: "comment", regex: ".*?-->", next: "start"},
            {token: "comment", regex: ".*:\\)", next: "start"},
            {token: "comment", regex: ".+"}
        ]}
    };
    d.inherits(g, f), b.XQueryHighlightRules = g
}), define("ace/mode/behaviour/xquery", ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour", "ace/mode/behaviour/cstyle"], function (a, b, c) {
    "use strict";
    var d = a("../../lib/oop"), e = a("../behaviour").Behaviour, f = a("./cstyle").CstyleBehaviour, g = function (a) {
        this.inherit(f, ["braces", "parens", "string_dquotes"]), this.parent = a, this.add("brackets", "insertion", function (a, b, c, d, e) {
            if (e == "\n") {
                var f = c.getCursorPosition(), g = d.doc.getLine(f.row), h = g.substring(f.column, f.column + 2);
                if (h == "</") {
                    var i = this.$getIndent(d.doc.getLine(f.row)) + d.getTabString(), j = this.$getIndent(d.doc.getLine(f.row));
                    return{text: "\n" + i + "\n" + j, selection: [1, i.length, 1, i.length]}
                }
            }
            return!1
        }), this.add("slash", "insertion", function (b, c, d, e, f) {
            if (f == "/") {
                var g = d.getCursorPosition(), h = e.doc.getLine(g.row);
                if (g.column > 0 && h.charAt(g.column - 1) == "<") {
                    h = h.substring(0, g.column) + "/" + h.substring(g.column);
                    var i = e.doc.getAllLines();
                    i[g.row] = h, a.exec("closeTag", i.join(e.doc.getNewLineCharacter()), g.row)
                }
            }
            return!1
        })
    };
    d.inherits(g, e), b.XQueryBehaviour = g
}), define("ace/mode/behaviour/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour"], function (a, b, c) {
    "use strict";
    var d = a("../../lib/oop"), e = a("../behaviour").Behaviour, f = function () {
        this.add("braces", "insertion", function (a, b, c, d, e) {
            if (e == "{") {
                var f = c.getSelectionRange(), g = d.doc.getTextRange(f);
                return g !== "" ? {text: "{" + g + "}", selection: !1} : {text: "{}", selection: [1, 1]}
            }
            if (e == "}") {
                var h = c.getCursorPosition(), i = d.doc.getLine(h.row), j = i.substring(h.column, h.column + 1);
                if (j == "}") {
                    var k = d.$findOpeningBracket("}", {column: h.column + 1, row: h.row});
                    if (k !== null)return{text: "", selection: [1, 1]}
                }
            } else if (e == "\n") {
                var h = c.getCursorPosition(), i = d.doc.getLine(h.row), j = i.substring(h.column, h.column + 1);
                if (j == "}") {
                    var l = d.findMatchingBracket({row: h.row, column: h.column + 1});
                    if (!l)return null;
                    var m = this.getNextLineIndent(a, i.substring(0, i.length - 1), d.getTabString()), n = this.$getIndent(d.doc.getLine(l.row));
                    return{text: "\n" + m + "\n" + n, selection: [1, m.length, 1, m.length]}
                }
            }
        }), this.add("braces", "deletion", function (a, b, c, d, e) {
            var f = d.doc.getTextRange(e);
            if (!e.isMultiLine() && f == "{") {
                var g = d.doc.getLine(e.start.row), h = g.substring(e.end.column, e.end.column + 1);
                if (h == "}")return e.end.column++, e
            }
        }), this.add("parens", "insertion", function (a, b, c, d, e) {
            if (e == "(") {
                var f = c.getSelectionRange(), g = d.doc.getTextRange(f);
                return g !== "" ? {text: "(" + g + ")", selection: !1} : {text: "()", selection: [1, 1]}
            }
            if (e == ")") {
                var h = c.getCursorPosition(), i = d.doc.getLine(h.row), j = i.substring(h.column, h.column + 1);
                if (j == ")") {
                    var k = d.$findOpeningBracket(")", {column: h.column + 1, row: h.row});
                    if (k !== null)return{text: "", selection: [1, 1]}
                }
            }
        }), this.add("parens", "deletion", function (a, b, c, d, e) {
            var f = d.doc.getTextRange(e);
            if (!e.isMultiLine() && f == "(") {
                var g = d.doc.getLine(e.start.row), h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == ")")return e.end.column++, e
            }
        }), this.add("string_dquotes", "insertion", function (a, b, c, d, e) {
            if (e == '"' || e == "'") {
                var f = e, g = c.getSelectionRange(), h = d.doc.getTextRange(g);
                if (h !== "")return{text: f + h + f, selection: !1};
                var i = c.getCursorPosition(), j = d.doc.getLine(i.row), k = j.substring(i.column - 1, i.column);
                if (k == "\\")return null;
                var l = d.getTokens(g.start.row, g.start.row)[0].tokens, m = 0, n, o = -1;
                for (var p = 0; p < l.length; p++) {
                    n = l[p], n.type == "string" ? o = -1 : o < 0 && (o = n.value.indexOf(f));
                    if (n.value.length + m > g.start.column)break;
                    m += l[p].value.length
                }
                if (!n || o < 0 && n.type !== "comment" && (n.type !== "string" || g.start.column !== n.value.length + m - 1 && n.value.lastIndexOf(f) === n.value.length - 1))return{text: f + f, selection: [1, 1]};
                if (n && n.type === "string") {
                    var q = j.substring(i.column, i.column + 1);
                    if (q == f)return{text: "", selection: [1, 1]}
                }
            }
        }), this.add("string_dquotes", "deletion", function (a, b, c, d, e) {
            var f = d.doc.getTextRange(e);
            if (!e.isMultiLine() && (f == '"' || f == "'")) {
                var g = d.doc.getLine(e.start.row), h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == '"')return e.end.column++, e
            }
        })
    };
    d.inherits(f, e), b.CstyleBehaviour = f
})