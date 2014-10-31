define("ace/mode/less", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/less_highlight_rules", "ace/mode/matching_brace_outdent", "ace/mode/folding/cstyle"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./text").Mode, f = a("../tokenizer").Tokenizer, g = a("./less_highlight_rules").LessHighlightRules, h = a("./matching_brace_outdent").MatchingBraceOutdent, i = a("./folding/cstyle").FoldMode, j = function () {
        this.$tokenizer = new f((new g).getRules(), "i"), this.$outdent = new h, this.foldingRules = new i
    };
    d.inherits(j, e), function () {
        this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b), e = this.$tokenizer.getLineTokens(b, a).tokens;
            if (e.length && e[e.length - 1].type == "comment")return d;
            var f = b.match(/^.*\{\s*$/);
            return f && (d += c), d
        }, this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c)
        }, this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c)
        }
    }.call(j.prototype), b.Mode = j
}), define("ace/mode/less_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("../lib/lang"), f = a("./text_highlight_rules").TextHighlightRules, g = function () {
        var a = e.arrayToMap(function () {
            var a = "-webkit-|-moz-|-o-|-ms-|-svg-|-pie-|-khtml-".split("|"), b = "appearance|background-clip|background-inline-policy|background-origin|background-size|binding|border-bottom-colors|border-left-colors|border-right-colors|border-top-colors|border-end|border-end-color|border-end-style|border-end-width|border-image|border-start|border-start-color|border-start-style|border-start-width|box-align|box-direction|box-flex|box-flexgroup|box-ordinal-group|box-orient|box-pack|box-sizing|column-count|column-gap|column-width|column-rule|column-rule-width|column-rule-style|column-rule-color|float-edge|font-feature-settings|font-language-override|force-broken-image-icon|image-region|margin-end|margin-start|opacity|outline|outline-color|outline-offset|outline-radius|outline-radius-bottomleft|outline-radius-bottomright|outline-radius-topleft|outline-radius-topright|outline-style|outline-width|padding-end|padding-start|stack-sizing|tab-size|text-blink|text-decoration-color|text-decoration-line|text-decoration-style|transform|transform-origin|transition|transition-delay|transition-duration|transition-property|transition-timing-function|user-focus|user-input|user-modify|user-select|window-shadow|border-radius".split("|"), c = "azimuth|background-attachment|background-color|background-image|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|box-sizing|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|opacity|orphans|outline-color|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|position|quotes|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|"), d = [];
            for (var e = 0, f = a.length; e < f; e++)Array.prototype.push.apply(d, (a[e] + b.join("|" + a[e])).split("|"));
            return Array.prototype.push.apply(d, b), Array.prototype.push.apply(d, c), d
        }()), b = e.arrayToMap("hsl|hsla|rgb|rgba|url|attr|counter|counters|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|hue|saturation|lightness|alpha|round|ceil|floor|percentage|color|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem".split("|")), c = e.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|border-box|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|content-box|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|")), d = e.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|")), f = e.arrayToMap("@mixin|@extend|@include|@import|@media|@debug|@warn|@if|@for|@each|@while|@else|@font-face|@-webkit-keyframes|if|and|!default|module|def|end|declare|when|not|and".split("|")), g = e.arrayToMap("a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp".split("|")), h = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";
        this.$rules = {start: [
            {token: "comment", regex: "\\/\\/.*$"},
            {token: "comment", merge: !0, regex: "\\/\\*", next: "comment"},
            {token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},
            {token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},
            {token: "constant.numeric", regex: h + "(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)"},
            {token: "constant.numeric", regex: "#[a-f0-9]{6}"},
            {token: "constant.numeric", regex: "#[a-f0-9]{3}"},
            {token: "constant.numeric", regex: h},
            {token: function (a) {
                return f.hasOwnProperty(a) ? "keyword" : "variable"
            }, regex: "@[a-z0-9_\\-@]*\\b"},
            {token: function (e) {
                return a.hasOwnProperty(e.toLowerCase()) ? "support.type" : f.hasOwnProperty(e) ? "keyword" : c.hasOwnProperty(e) ? "constant.language" : b.hasOwnProperty(e) ? "support.function" : d.hasOwnProperty(e.toLowerCase()) ? "support.constant.color" : g.hasOwnProperty(e.toLowerCase()) ? "variable.language" : "text"
            }, regex: "\\-?[@a-z_][@a-z0-9_\\-]*"},
            {token: "variable.language", regex: "#[a-z0-9-_]+"},
            {token: "variable.language", regex: "\\.[a-z0-9-_]+"},
            {token: "variable.language", regex: ":[a-z0-9-_]+"},
            {token: "constant", regex: "[a-z0-9-_]+"},
            {token: "keyword.operator", regex: "<|>|<=|>=|==|!=|-|%|#|\\+|\\$|\\+|\\*"},
            {token: "paren.lparen", regex: "[[({]"},
            {token: "paren.rparen", regex: "[\\])}]"},
            {token: "text", regex: "\\s+"}
        ], comment: [
            {token: "comment", regex: ".*?\\*\\/", next: "start"},
            {token: "comment", merge: !0, regex: ".+"}
        ]}
    };
    d.inherits(g, f), b.LessHighlightRules = g
}), define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../range").Range, e = function () {
    };
    (function () {
        this.checkOutdent = function (a, b) {
            return/^\s+$/.test(a) ? /^\s*\}/.test(b) : !1
        }, this.autoOutdent = function (a, b) {
            var c = a.getLine(b), e = c.match(/^(\s*\})/);
            if (!e)return 0;
            var f = e[1].length, g = a.findMatchingBracket({row: b, column: f});
            if (!g || g.row == b)return 0;
            var h = this.$getIndent(a.getLine(g.row));
            a.replace(new d(b, 0, b, f - 1), h)
        }, this.$getIndent = function (a) {
            var b = a.match(/^(\s+)/);
            return b ? b[1] : ""
        }
    }).call(e.prototype), b.MatchingBraceOutdent = e
}), define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (a, b, c) {
    "use strict";
    var d = a("../../lib/oop"), e = a("../../range").Range, f = a("./fold_mode").FoldMode, g = b.FoldMode = function () {
    };
    d.inherits(g, f), function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.getFoldWidgetRange = function (a, b, c) {
            var d = a.getLine(c), f = d.match(this.foldingStartMarker);
            if (f) {
                var g = f.index;
                if (f[1])return this.openingBracketBlock(a, f[1], c, g);
                var h = a.getCommentFoldRange(c, g + f[0].length);
                return h.end.column -= 2, h
            }
            if (b !== "markbeginend")return;
            var f = d.match(this.foldingStopMarker);
            if (f) {
                var g = f.index + f[0].length;
                if (f[2]) {
                    var h = a.getCommentFoldRange(c, g);
                    return h.end.column -= 2, h
                }
                var i = {row: c, column: g}, j = a.$findOpeningBracket(f[1], i);
                if (!j)return;
                return j.column++, i.column--, e.fromPoints(j, i)
            }
        }
    }.call(g.prototype)
}), define("ace/mode/folding/fold_mode", ["require", "exports", "module", "ace/range"], function (a, b, c) {
    "use strict";
    var d = a("../../range").Range, e = b.FoldMode = function () {
    };
    (function () {
        this.foldingStartMarker = null, this.foldingStopMarker = null, this.getFoldWidget = function (a, b, c) {
            var d = a.getLine(c);
            return this.foldingStartMarker.test(d) ? "start" : b == "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(d) ? "end" : ""
        }, this.getFoldWidgetRange = function (a, b, c) {
            return null
        }, this.indentationBlock = function (a, b, c) {
            var e = /^\s*/, f = b, g = b, h = a.getLine(b), i = c || h.length, j = h.match(e)[0].length, k = a.getLength();
            while (++b < k) {
                h = a.getLine(b);
                var l = h.match(e)[0].length;
                if (l == h.length)continue;
                if (l <= j)break;
                g = b
            }
            if (g > f) {
                var m = a.getLine(g).length;
                return new d(f, i, g, m)
            }
        }, this.openingBracketBlock = function (a, b, c, e) {
            var f = {row: c, column: e + 1}, g = a.$findClosingBracket(b, f);
            if (!g)return;
            var h = a.foldWidgets[g.row];
            return h == null && (h = this.getFoldWidget(a, g.row)), h == "start" && (g.row--, g.column = a.getLine(g.row).length), d.fromPoints(f, g)
        }
    }).call(e.prototype)
})