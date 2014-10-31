define("ace/mode/liquid", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/liquid_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function (a, b, c) {
    var d = a("../lib/oop"), e = a("./text").Mode, f = a("../tokenizer").Tokenizer, g = a("./liquid_highlight_rules").LiquidHighlightRules, h = a("./matching_brace_outdent").MatchingBraceOutdent, i = a("../range").Range, j = function () {
        this.$tokenizer = new f((new g).getRules()), this.$outdent = new h
    };
    d.inherits(j, e), function () {
        this.toggleCommentLines = function (a, b, c, d) {
            var e = !0, f = [], g = /^(\s*)#/;
            for (var h = c; h <= d; h++)if (!g.test(b.getLine(h))) {
                e = !1;
                break
            }
            if (e) {
                var j = new i(0, 0, 0, 0);
                for (var h = c; h <= d; h++) {
                    var k = b.getLine(h), l = k.match(g);
                    j.start.row = h, j.end.row = h, j.end.column = l[0].length, b.replace(j, l[1])
                }
            } else b.indentRows(c, d, "#")
        }, this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b), e = this.$tokenizer.getLineTokens(b, a), f = e.tokens, g = e.state;
            if (f.length && f[f.length - 1].type == "comment")return d;
            if (a == "start") {
                var h = b.match(/^.*[\{\(\[]\s*$/);
                h && (d += c)
            }
            return d
        }, this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c)
        }, this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c)
        }
    }.call(j.prototype), b.Mode = j
}), define("ace/mode/liquid_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/css_highlight_rules", "ace/mode/javascript_highlight_rules", "ace/lib/lang", "ace/mode/xml_util", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./css_highlight_rules").CssHighlightRules, f = a("./javascript_highlight_rules").JavaScriptHighlightRules, g = a("../lib/lang"), h = a("./xml_util"), i = a("./text_highlight_rules").TextHighlightRules, j = function () {
        var a = g.arrayToMap("date|capitalize|downcase|upcase|first|last|join|sort|map|size|escape|escape_once|strip_html|strip_newlines|newline_to_br|replace|replace_first|truncate|truncatewords|prepend|append|minus|plus|times|divided_by|split".split("|")), b = g.arrayToMap("capture|endcapture|case|endcase|when|comment|endcomment|cycle|for|endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|endunless|style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow".split("|")), c = g.arrayToMap(["forloop"]), d = g.arrayToMap("assign".split("|"));
        this.$rules = {start: [
            {token: "variable", regex: "{%", next: "liquid_start"},
            {token: "variable", regex: "{{", next: "liquid_start"},
            {token: "meta.tag", merge: !0, regex: "<\\!\\[CDATA\\[", next: "cdata"},
            {token: "xml_pe", regex: "<\\?.*?\\?>"},
            {token: "comment", merge: !0, regex: "<\\!--", next: "comment"},
            {token: "meta.tag", regex: "<(?=\\s*script\\b)", next: "script"},
            {token: "meta.tag", regex: "<(?=\\s*style\\b)", next: "style"},
            {token: "meta.tag", regex: "<\\/?", next: "tag"},
            {token: "text", regex: "\\s+"},
            {token: "text", regex: "[^<]+"}
        ], cdata: [
            {token: "text", regex: "\\]\\]>", next: "start"},
            {token: "text", merge: !0, regex: "\\s+"},
            {token: "text", merge: !0, regex: ".+"}
        ], comment: [
            {token: "comment", regex: ".*?-->", next: "start"},
            {token: "comment", merge: !0, regex: ".+"}
        ], liquid_start: [
            {token: "variable", regex: "}}", next: "start"},
            {token: "variable", regex: "%}", next: "start"},
            {token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},
            {token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},
            {token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b"},
            {token: "constant.numeric", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},
            {token: "constant.language.boolean", regex: "(?:true|false)\\b"},
            {token: function (e) {
                return a.hasOwnProperty(e) ? "support.function" : b.hasOwnProperty(e) ? "keyword" : c.hasOwnProperty(e) ? "variable.language" : d.hasOwnProperty(e) ? "keyword.definition" : "identifier"
            }, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},
            {token: "keyword.operator", regex: "/|\\*|\\-|\\+|=|!=|\\?\\:"},
            {token: "paren.lparen", regex: /[\[\({]/},
            {token: "paren.rparen", regex: /[\])}]/},
            {token: "text", regex: "\\s+"}
        ]}, h.tag(this.$rules, "tag", "start"), h.tag(this.$rules, "style", "css-start"), h.tag(this.$rules, "script", "js-start"), this.embedRules(f, "js-", [
            {token: "comment", regex: "\\/\\/.*(?=<\\/script>)", next: "tag"},
            {token: "meta.tag", regex: "<\\/(?=script)", next: "tag"}
        ]), this.embedRules(e, "css-", [
            {token: "meta.tag", regex: "<\\/(?=style)", next: "tag"}
        ])
    };
    d.inherits(j, i), b.LiquidHighlightRules = j
}), define("ace/mode/css_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("../lib/lang"), f = a("./text_highlight_rules").TextHighlightRules, g = function () {
        var a = e.arrayToMap("animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index".split("|")), b = e.arrayToMap("rgb|rgba|url|attr|counter|counters".split("|")), c = e.arrayToMap("absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|font-size|font|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero".split("|")), d = e.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|")), f = e.arrayToMap("arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace".split("|")), g = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))", h = "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b", i = "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b", j = [
            {token: "comment", merge: !0, regex: "\\/\\*", next: "ruleset_comment"},
            {token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},
            {token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},
            {token: ["constant.numeric", "keyword"], regex: "(" + g + ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)"},
            {token: ["constant.numeric"], regex: "([0-9]+)"},
            {token: "constant.numeric", regex: "#[a-f0-9]{6}"},
            {token: "constant.numeric", regex: "#[a-f0-9]{3}"},
            {token: ["punctuation", "entity.other.attribute-name.pseudo-element.css"], regex: h},
            {token: ["punctuation", "entity.other.attribute-name.pseudo-class.css"], regex: i},
            {token: function (e) {
                return a.hasOwnProperty(e.toLowerCase()) ? "support.type" : b.hasOwnProperty(e.toLowerCase()) ? "support.function" : c.hasOwnProperty(e.toLowerCase()) ? "support.constant" : d.hasOwnProperty(e.toLowerCase()) ? "support.constant.color" : f.hasOwnProperty(e.toLowerCase()) ? "support.constant.fonts" : "text"
            }, regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}
        ], k = e.copyArray(j);
        k.unshift({token: "paren.rparen", regex: "\\}", next: "start"});
        var l = e.copyArray(j);
        l.unshift({token: "paren.rparen", regex: "\\}", next: "media"});
        var m = [
            {token: "comment", merge: !0, regex: ".+"}
        ], n = e.copyArray(m);
        n.unshift({token: "comment", regex: ".*?\\*\\/", next: "start"});
        var o = e.copyArray(m);
        o.unshift({token: "comment", regex: ".*?\\*\\/", next: "media"});
        var p = e.copyArray(m);
        p.unshift({token: "comment", regex: ".*?\\*\\/", next: "ruleset"}), this.$rules = {start: [
            {token: "comment", merge: !0, regex: "\\/\\*", next: "comment"},
            {token: "paren.lparen", regex: "\\{", next: "ruleset"},
            {token: "string", regex: "@.*?{", next: "media"},
            {token: "keyword", regex: "#[a-z0-9-_]+"},
            {token: "variable", regex: "\\.[a-z0-9-_]+"},
            {token: "string", regex: ":[a-z0-9-_]+"},
            {token: "constant", regex: "[a-z0-9-_]+"}
        ], media: [
            {token: "comment", merge: !0, regex: "\\/\\*", next: "media_comment"},
            {token: "paren.lparen", regex: "\\{", next: "media_ruleset"},
            {token: "string", regex: "\\}", next: "start"},
            {token: "keyword", regex: "#[a-z0-9-_]+"},
            {token: "variable", regex: "\\.[a-z0-9-_]+"},
            {token: "string", regex: ":[a-z0-9-_]+"},
            {token: "constant", regex: "[a-z0-9-_]+"}
        ], comment: n, ruleset: k, ruleset_comment: p, media_ruleset: l, media_comment: o}
    };
    d.inherits(g, f), b.CssHighlightRules = g
}), define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/unicode", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("../lib/lang"), f = a("../unicode"), g = a("./doc_comment_highlight_rules").DocCommentHighlightRules, h = a("./text_highlight_rules").TextHighlightRules, i = function () {
        var a = e.arrayToMap("Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document".split("|")), b = e.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|const|yield|import|get|set".split("|")), c = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield", d = e.arrayToMap("__parent__|__count__|escape|unescape|with|__proto__".split("|")), h = e.arrayToMap("const|let|var|function".split("|")), i = e.arrayToMap("null|Infinity|NaN|undefined".split("|")), j = e.arrayToMap("class|enum|extends|super|export|implements|private|public|interface|package|protected|static".split("|")), k = "[" + f.packages.L + "\\$_][" + f.packages.L + f.packages.Mn + f.packages.Mc + f.packages.Nd + f.packages.Pc + "\\$_]*\\b", l = "\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)";
        this.$rules = {start: [
            {token: "comment", regex: /\/\/.*$/},
            g.getStartRule("doc-start"),
            {token: "comment", merge: !0, regex: /\/\*/, next: "comment"},
            {token: "string", regex: "'(?=.)", next: "qstring"},
            {token: "string", regex: '"(?=.)', next: "qqstring"},
            {token: "constant.numeric", regex: /0[xX][0-9a-fA-F]+\b/},
            {token: "constant.numeric", regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/},
            {token: ["storage.type", "punctuation.operator", "support.function", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"], regex: "(" + k + ")(\\.)(prototype)(\\.)(" + k + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()", next: "function_arguments"},
            {token: ["storage.type", "punctuation.operator", "support.function", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text"], regex: "(" + k + ")(\\.)(prototype)(\\.)(" + k + ")(\\s*)(=)(\\s*)", next: "function_arguments"},
            {token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"], regex: "(" + k + ")(\\.)(" + k + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()", next: "function_arguments"},
            {token: ["entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"], regex: "(" + k + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()", next: "function_arguments"},
            {token: ["storage.type", "text", "entity.name.function", "text", "paren.lparen"], regex: "(function)(\\s+)(" + k + ")(\\s*)(\\()", next: "function_arguments"},
            {token: ["entity.name.function", "text", "punctuation.operator", "text", "storage.type", "text", "paren.lparen"], regex: "(" + k + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()", next: "function_arguments"},
            {token: ["text", "text", "storage.type", "text", "paren.lparen"], regex: "(:)(\\s*)(function)(\\s*)(\\()", next: "function_arguments"},
            {token: "constant.language.boolean", regex: /(?:true|false)\b/},
            {token: "keyword", regex: "(?:" + c + ")\\b", next: "regex_allowed"},
            {token: ["punctuation.operator", "support.function"], regex: /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:opzzzz|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/},
            {token: ["punctuation.operator", "support.function.dom"], regex: /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/},
            {token: ["punctuation.operator", "support.constant"], regex: /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/},
            {token: ["storage.type", "punctuation.operator", "support.function.firebug"], regex: /(console)(\.)(warn|info|log|error|time|timeEnd|assert)\b/},
            {token: function (c) {
                return a.hasOwnProperty(c) ? "variable.language" : d.hasOwnProperty(c) ? "invalid.deprecated" : h.hasOwnProperty(c) ? "storage.type" : b.hasOwnProperty(c) ? "keyword" : i.hasOwnProperty(c) ? "constant.language" : j.hasOwnProperty(c) ? "invalid.illegal" : c == "debugger" ? "invalid.deprecated" : "identifier"
            }, regex: k},
            {token: "keyword.operator", regex: /!|\$|%|&|\*|\-\-|\-|\+\+|\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|\*=|%=|\+=|\-=|&=|\^=|\b(?:in|instanceof|new|delete|typeof|void)/, next: "regex_allowed"},
            {token: "punctuation.operator", regex: /\?|\:|\,|\;|\./, next: "regex_allowed"},
            {token: "paren.lparen", regex: /[\[({]/, next: "regex_allowed"},
            {token: "paren.rparen", regex: /[\])}]/},
            {token: "keyword.operator", regex: /\/=?/, next: "regex_allowed"},
            {token: "comment", regex: /^#!.*$/},
            {token: "text", regex: /\s+/}
        ], regex_allowed: [g.getStartRule("doc-start"), {token: "comment", merge: !0, regex: "\\/\\*", next: "comment_regex_allowed"}, {token: "comment", regex: "\\/\\/.*$"}, {token: "string.regexp", regex: "\\/", next: "regex", merge: !0}, {token: "text", regex: "\\s+"}, {token: "empty", regex: "", next: "start"}], regex: [
            {token: "regexp.keyword.operator", regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},
            {token: "string.regexp", regex: "/\\w*", next: "start", merge: !0},
            {token: "string.regexp", regex: "[^\\\\/\\[]+", merge: !0},
            {token: "string.regexp.charachterclass", regex: "\\[", next: "regex_character_class", merge: !0},
            {token: "empty", regex: "", next: "start"}
        ], regex_character_class: [
            {token: "regexp.keyword.operator", regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},
            {token: "string.regexp.charachterclass", regex: "]", next: "regex", merge: !0},
            {token: "string.regexp.charachterclass", regex: "[^\\\\\\]]+", merge: !0},
            {token: "empty", regex: "", next: "start"}
        ], function_arguments: [
            {token: "variable.parameter", regex: k},
            {token: "punctuation.operator", regex: "[, ]+", merge: !0},
            {token: "punctuation.operator", regex: "$", merge: !0},
            {token: "empty", regex: "", next: "start"}
        ], comment_regex_allowed: [
            {token: "comment", regex: ".*?\\*\\/", merge: !0, next: "regex_allowed"},
            {token: "comment", merge: !0, regex: ".+"}
        ], comment: [
            {token: "comment", regex: ".*?\\*\\/", merge: !0, next: "start"},
            {token: "comment", merge: !0, regex: ".+"}
        ], qqstring: [
            {token: "constant.language.escape", regex: l},
            {token: "string", regex: '[^"\\\\]+', merge: !0},
            {token: "string", regex: "\\\\$", next: "qqstring", merge: !0},
            {token: "string", regex: '"|$', next: "start", merge: !0}
        ], qstring: [
            {token: "constant.language.escape", regex: l},
            {token: "string", regex: "[^'\\\\]+", merge: !0},
            {token: "string", regex: "\\\\$", next: "qstring", merge: !0},
            {token: "string", regex: "'|$", next: "start", merge: !0}
        ]}, this.embedRules(g, "doc-", [g.getEndRule("start")])
    };
    d.inherits(i, h), b.JavaScriptHighlightRules = i
}), define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (a, b, c) {
    "use strict";
    var d = a("../lib/oop"), e = a("./text_highlight_rules").TextHighlightRules, f = function () {
        this.$rules = {start: [
            {token: "comment.doc.tag", regex: "@[\\w\\d_]+"},
            {token: "comment.doc", merge: !0, regex: "\\s+"},
            {token: "comment.doc", merge: !0, regex: "TODO"},
            {token: "comment.doc", merge: !0, regex: "[^@\\*]+"},
            {token: "comment.doc", merge: !0, regex: "."}
        ]}
    };
    d.inherits(f, e), f.getStartRule = function (a) {
        return{token: "comment.doc", merge: !0, regex: "\\/\\*(?=\\*)", next: a}
    }, f.getEndRule = function (a) {
        return{token: "comment.doc", merge: !0, regex: "\\*\\/", next: a}
    }, b.DocCommentHighlightRules = f
}), define("ace/mode/xml_util", ["require", "exports", "module", "ace/lib/lang"], function (a, b, c) {
    function g(a) {
        return[
            {token: "string", regex: '".*?"'},
            {token: "string", merge: !0, regex: '["].*', next: a + "_qqstring"},
            {token: "string", regex: "'.*?'"},
            {token: "string", merge: !0, regex: "['].*", next: a + "_qstring"}
        ]
    }

    function h(a, b) {
        return[
            {token: "string", merge: !0, regex: ".*?" + a, next: b},
            {token: "string", merge: !0, regex: ".+"}
        ]
    }

    "use strict";
    var d = a("../lib/lang"), e = d.arrayToMap("button|form|input|label|select|textarea".split("|")), f = d.arrayToMap("table|tbody|td|tfoot|th|tr".split("|"));
    b.tag = function (a, b, c) {
        a[b] = [
            {token: "text", regex: "\\s+"},
            {token: function (a) {
                return a === "a" ? "meta.tag.anchor" : a === "img" ? "meta.tag.image" : a === "script" ? "meta.tag.script" : a === "style" ? "meta.tag.style" : e.hasOwnProperty(a.toLowerCase()) ? "meta.tag.form" : f.hasOwnProperty(a.toLowerCase()) ? "meta.tag.table" : "meta.tag"
            }, merge: !0, regex: "[-_a-zA-Z0-9:]+", next: b + "_embed_attribute_list"},
            {token: "empty", regex: "", next: b + "_embed_attribute_list"}
        ], a[b + "_qstring"] = h("'", b + "_embed_attribute_list"), a[b + "_qqstring"] = h('"', b + "_embed_attribute_list"), a[b + "_embed_attribute_list"] = [
            {token: "meta.tag", merge: !0, regex: "/?>", next: c},
            {token: "keyword.operator", regex: "="},
            {token: "entity.other.attribute-name", regex: "[-_a-zA-Z0-9:]+"},
            {token: "constant.numeric", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},
            {token: "text", regex: "\\s+"}
        ].concat(g(b))
    }
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
})