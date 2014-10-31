define("ace/keyboard/keybinding/emacs", ["require", "exports", "module", "ace/keyboard/state_handler"], function (a, b, c) {
    "use strict";
    var d = a("../state_handler").StateHandler, e = a("../state_handler").matchCharacterOnly, f = {start: [
        {key: "ctrl-x", then: "c-x"},
        {regex: ["(?:command-([0-9]*))*", "(down|ctrl-n)"], exec: "golinedown", params: [
            {name: "times", match: 1, type: "number", defaultValue: 1}
        ]},
        {regex: ["(?:command-([0-9]*))*", "(right|ctrl-f)"], exec: "gotoright", params: [
            {name: "times", match: 1, type: "number", defaultValue: 1}
        ]},
        {regex: ["(?:command-([0-9]*))*", "(up|ctrl-p)"], exec: "golineup", params: [
            {name: "times", match: 1, type: "number", defaultValue: 1}
        ]},
        {regex: ["(?:command-([0-9]*))*", "(left|ctrl-b)"], exec: "gotoleft", params: [
            {name: "times", match: 1, type: "number", defaultValue: 1}
        ]},
        {comment: "This binding matches all printable characters except numbers as long as they are no numbers and print them n times.", regex: ["(?:command-([0-9]*))", "([^0-9]+)*"], match: e, exec: "inserttext", params: [
            {name: "times", match: 1, type: "number", defaultValue: "1"},
            {name: "text", match: 2}
        ]},
        {comment: "This binding matches numbers as long as there is no meta_number in the buffer.", regex: ["(command-[0-9]*)*", "([0-9]+)"], match: e, disallowMatches: [1], exec: "inserttext", params: [
            {name: "text", match: 2, type: "text"}
        ]},
        {regex: ["command-([0-9]*)", "(command-[0-9]|[0-9])"], comment: "Stops execution if the regex /meta_[0-9]+/ matches to avoid resetting the buffer."}
    ], "c-x": [
        {key: "ctrl-g", then: "start"},
        {key: "ctrl-s", exec: "save", then: "start"}
    ]};
    b.Emacs = new d(f)
})