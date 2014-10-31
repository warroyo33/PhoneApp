/**
 * Created with JetBrains WebStorm.
 * User: WalterArroyo
 * Date: 17/04/13
 * Time: 05:07 PM
 * Monitor Plus Architect (Powered by JumLabs(c))
 */
Ext.define("Ext.ux.plugin.Json", {
    extend: 'Ext.ux.plugin.Util',
    indentString: "  ",
    readable: true,
    licenseText: null,
    jsonId: null,
    scope: {},
    evalException: true,
    defaultComponent: 'custompanel',
    fullEncode: false,
    constructor: function () {
        this.addEvents('afterallclassinvoked');
        this.callParent(arguments); // calls My.app.Panel's constructor
    },
    initialize: function () {
        this.callParent(arguments); // calls My.app.Panel's constructor
        //this.initialize.call(this);
        this.addEvents({
            beforeapply: true,
            afterapply: true
        });
    },

    getScope: function () {
        return this.scope;
    },

    isEmpty: function (B) {
        if (B instanceof Array) {
            for (var A = 0; A < B.length; A++) {
                if (!this.isEmpty(B[A])) {
                    return false
                }
            }
        } else {
            if (typeof (B) == "object") {
                for (var C in B) {
                    if ((!this.useHasOwn || B.hasOwnProperty(C)) && (!this.jsonId || C.indexOf(this.jsonId) != 0)) {
                        return false
                    }
                }
            } else {
                if (B != undefined) {
                    return false
                }
            }
        }
        return true
    },

    load: function (url, obj) {
        if (obj && obj instanceof Ext.container.Container) {
            return this.load(url, Ext.bind(function (callback) {
                this.apply(obj, callback)
            }, this))
        } else {
            if (typeof (obj) == "function") {
                Ext.Ajax.request({
                    url: url,
                    nocache: this.nocache,
                    callback: function (CallBack, Scope, Response) {
                        try {
                            if (Scope) {
                                var C = this.decode(Response.responseText);
                                if (typeof callback == "function") {
                                    callback(C)
                                }
                            } else {
                                throw new Error("Failure during load")
                            }
                        } catch (failError) {
                            this.fireEvent("error", "load", failError)
                        }
                    },
                    scope: this
                });
                return null
            } else {
                return this.decode((typeof (url) == "object") ? this.syncContent(url.url, url.nocache == undefined ? this.nocache : url.nocache) : this.syncContent(url.url, this.nocache))
            }
        }
    },

    set: function (scope, content, opciones) {
        var returns = true, container = scope || this;
        opciones = opciones || {};
        if (opciones.nocache == undefined) {
            opciones.nocache = this.nocache
        }
        if (content) {
            if (opciones.scopeOnly) {
                opciones = Ext.apply({ evalException: false }, opciones)
            }
            if (typeof (content) == "string") {
                content = this.decode(content, opciones)
            }
            for (var key in content) {
                var files = key;
                if (key == "required_js") {
                    if (content[key]) {
                        var A = content[key].replace(",", ";").split(";");
                        for (var I = 0; I < A.length; I++) {
                            if (document.getElementById(A[I])) {
                                continue
                            }
                            if (!this.scriptLoader(A[I], opciones.nocache)) {
                                var J = new Error("Failed to load javascript " + A[I]);
                                if (this.fireEvent("error", "set", J)) {
                                    throw J
                                }
                            }
                        }
                    }
                } else {
                    if (key == "required_css") {
                        if (content[key]) {
                            var A = content[key].replace(",", ";").split(";");
                            for (var I = 0; I < A.length; I++) {
                                if (document.getElementById(A[I])) {
                                    continue
                                }
                                Ext.util.CSS.swapStyleSheet(A[I], A[I])
                            }
                        }
                    } else {
                        var D = container;
                        if (key.indexOf("scope.") == 0) {
                            D = opciones.scope ? opciones.scope : this.getScope();
                            files = key.substring(6);
                            if (files.charAt(0) == "!") {
                                files = files.substring(1);
                                if (D[files]) {
                                    continue
                                }
                            }
                        } else {
                            if (opciones.scopeOnly) {
                                continue
                            }
                        }
                        var E = "set" + files.substring(0, 1).toUpperCase() + files.substring(1);
                        try {
                            if (D[E] && typeof D[E] == "function") {
                                D[E].call(container, content[key])
                            } else {
                                if (D[files] && typeof D[files] == "function") {
                                    D[files].call(container, content[key])
                                } else {
                                    D[files] = content[key]
                                }
                            }
                        } catch (J) {
                            if (opciones.ignoreError) {
                                returns = false
                            } else {
                                returns |= (this.fireEvent("error", "set(" + E + ")", J) === false)
                            }
                        }
                    }
                }
            }
        }
        return returns
    },

    clean: function (jCode) {
        var counter = 0;
        for (var item in jCode) {
            if (!this.useHasOwn || jCode.hasOwnProperty(item)) {
                if (item == "items") {
                    if (jCode[item] instanceof Array) {
                        var jChilds = [];
                        for (var x = 0, subItems = jCode[item]; x < subItems.length; x++) {
                            var cleanedChilds = this.clean(subItems[x]);
                            if (cleanedChilds != null) {
                                jChilds.push(cleanedChilds)
                            }
                        }
                        jCode[item] = (jChilds.length > 0) ? jChilds : null
                    } else {
                        jCode[item] = this.clean(jCode[item])
                    }
                }
                if (jCode[item] === undefined || jCode[item] === null || (typeof jCode[item] == "string" && jCode[item] == "")) {
                    delete jCode[item]
                } else {
                    counter++
                }
            }
        }
        return counter ? jCode : null
    },
    editable: function (jCode) {
        var code = jCode || {};
        if (typeof (code) !== "object") {
            code = this.decode(jCode)
        }
        if (!this.jsonId) {
            return code
        }
        if (code instanceof Array) {
            for (var B = 0; B < code.length; B++) {
                code[B] = this.editable(code[B])
            }
            return code
        }
        if (!code[this.jsonId]) {
            code[this.jsonId] = Ext.id();
            if (code.items) {
                code.items = this.editable(code.items)
            }
        }
        return code
    },
    apply: function (jScope, jCode, B) {
        var A;
        var me = this;
        try {
            A = this.jsonId ? this.editable(jCode) : jCode || {};
            if (typeof (A) !== "object") {
                A = this.decode(jCode)
            }
            if (A && (A instanceof Array || typeof (A) == "object")) {
                if (B !== false) {
                    A = this.clean(A);
                }
                this.fireEvent("beforeapply", jScope, A);
                if (jScope instanceof Ext.container.Container) {
                    while (jScope.items && jScope.items.first()) {
                        jScope.remove(jScope.items.first(), true);
                    }
                    if (!this.isEmpty(A)) {
                        if (A instanceof Array) {
                            me.on('afterallclassinvoked',function(config){
                                jScope.add.apply(jScope, config)
                            },me,{"single":true});
                            me.invokeRequiredClasses(A,true,true);

                        } else {
                            me.on('afterallclassinvoked',function(config){
                                jScope.add(config)
                            },me,{"single":true});
                            me.invokeRequiredClasses(A,false,true);
                        }
                        this.set(jScope, A.json)
                    }
                } else {
                    this.set(jScope, A)
                }
                if (jScope.rendered && jScope.layout && jScope.layout.layout) {
                    jScope.doLayout()
                }
            }
        } catch (E) {
            if (this.fireEvent("error", "apply", E)) {
                throw E
            }
        } finally {
            this.fireEvent("afterapply", jScope, A)
        }
        return A
    },
    getRequiredClassNames: function(config, stack){
        stack = stack||[];
        var me = this,
            Ex = Ext;
        if (config instanceof Array){
            for (var x = 0; x < config.length; x++) {
                var xtypeComponent = config[x].xtype ? config[x].xtype : this.defaultComponent;

                if (!config[x].id)
                    config[x].id =Ex.id(config[x],config[x].xtype);
                config[x].configData= config[x].configData||{};
                if (!config[x].configData.referenceName)
                    config[x].configData.referenceName = Ex.id(config[x],config[x].xtype);
                config[x].id =config[x].id.toUpperCase();
                var widget = "widget." + xtypeComponent;
                if (widget === Ex.ClassManager.getNamesByExpression(widget)[0]) {
                    var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype", xtypeComponent, 0, false, false, true);
                    if (componentDefinitionRecord) {
                        var componentClassPath = componentDefinitionRecord.data.path;
                        Ex.Array.push(stack,this.componentsPath + "." + componentClassPath);
                    }
                }
                if (config[x].items)
                    stack = me.getRequiredClassNames(config[x].items,stack);
            }
        }else{
            var xtypeComponent = config.xtype ? config.xtype : this.defaultComponent;
            if (!config.id)
                config.id =Ex.id(config,config.xtype);
            config.id =config.id.toUpperCase();
            var widget = "widget." + xtypeComponent;
            if (widget === Ex.ClassManager.getNamesByExpression(widget)[0]) {
                var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype", xtypeComponent, 0, false, false, true);
                if (componentDefinitionRecord) {
                    var componentClassPath = componentDefinitionRecord.data.path;
                    Ex.Array.push(stack,this.componentsPath + "." + componentClassPath);
                }
            }
            if (config.items)
                stack = me.getRequiredClassNames(config.items,stack);
        }
        return stack;
    },
    invokeRequiredClasses: function (config, isArray,callback) {
        var me = this;
        var stack = me.getRequiredClassNames(config);
        var loadMask = Ext.create('Ext.LoadMask', Ext.getBody(), {msg: 'Loading Required Classes...'});
        loadMask.show();
        if (stack.length){
            Ext.require(stack,function(){
                loadMask.hide();
                if (callback) me.fireEvent('afterallclassinvoked',config);
            },me);
        }else{
            loadMask.hide();
            if (callback) me.fireEvent('afterallclassinvoked',config);
        }

/*
        if (isArray){
            for (var x = 0; x < config.length; x++) {
                var xtypeComponent = config[x].xtype ? config[x].xtype : this.defaultComponent;
                if (!config[x].id)
                    config[x].id =Ext.id(config[x],config[x].xtype);
                config[x].id =config[x].id.toUpperCase();
                var widget = "widget." + xtypeComponent;
                if (widget === Ext.ClassManager.getNamesByExpression(widget)[0]) {
                    var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype", xtypeComponent, 0, false, false, true);
                    if (componentDefinitionRecord) {
                        var componentClassPath = componentDefinitionRecord.data.path;
                        if (!Ext.ClassManager.isCreated(this.componentsPath + "." + componentClassPath)) {

                            var a = Ext.create(this.componentsPath + "." + componentClassPath);
                            var waiting = false;
                            while (!Ext.ClassManager.isCreated(this.componentsPath + "." + componentClassPath)){
                                waiting = true;
                            }
                            a.destroy();
                            delete a;
                        }
                    }
                }
                *//*if (this.designing)
                 config[x].isDesign=true;
                 else
                 config[x].isDesign=false;
                if (config[x].items)
                    me.invokeRequiredClasses(config[x].items,config[x].items instanceof Array)
            }
            if (callback) me.fireEvent('afterallclassinvoked',config);
        }else{
            //for (var x = 0; x < config.length; x++) {
                var xtypeComponent = config.xtype ? config.xtype : this.defaultComponent;
                if (!config.id)
                    config.id =Ext.id(config,config.xtype);
                config.id =config.id.toUpperCase();
                var widget = "widget." + xtypeComponent;
                if (widget === Ext.ClassManager.getNamesByExpression(widget)[0]) {
                    var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype", xtypeComponent, 0, false, false, true);
                    if (componentDefinitionRecord) {
                        var componentClassPath = componentDefinitionRecord.data.path;
                        if (!Ext.ClassManager.isCreated(this.componentsPath + "." + componentClassPath)) {
                            var a = Ext.create(this.componentsPath + "." + componentClassPath);
                            var waiting = false;
                            while (!Ext.ClassManager.isCreated(this.componentsPath + "." + componentClassPath)){
                                waiting = true;
                            }
                            a.destroy();
                            delete a;
                        }
                    }
                }
                *//*if (this.designing)
                 config[x].isDesign=true;
                 else
                 config[x].isDesign=false;
                if (config.items)
                    me.invokeRequiredClasses(config.items, config.items instanceof Array)
            //}
            if (callback) me.fireEvent('afterallclassinvoked',config);
        }*/

        //if (callback) /*setTimeout(function(){*/callback(config)/*},100)*/;
        //return config;

    },

    encodeString: function (value) {
        var A = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" };
        if (/["\\\x00-\x1f]/.test(value)) {
            return '"' + value.replace(/([\x00-\x1f\\"])/g, function (D, C) {
                var E = A[C];
                if (E) {
                    return E
                }
                E = C.charCodeAt();
                return "\\u00" + Math.floor(E / 16).toString(16) + (E % 16).toString(16)
            }) + '"'
        }
        return '"' + value + '"'
    },

    indentStr: function (C) {
        var B = "", A = 0;
        while (this.readable && A < C) {
            B += this.indentString;
            A++
        }
        return B
    },

    encodeArray: function (o, indent, keepJsonId) {
        indent = indent || 0;
        var D = ["["], A, F, C = o.length, E;
        for (var F = 0; F < C; F += 1) {
            E = o[F];
            switch (typeof E) {
                case "undefined":
                case "unknown":
                    break;
                default:
                    if (A) {
                        D.push(",")
                    }
                    D.push(E === null ? "null" : this.encode(E, indent + 1, keepJsonId));
                    A = true
            }
        }
        D.push("]");
        return D.join("")
    },

    encodeDate: function (o) {
        var pad = function (n) {
            return n < 10 ? "0" + n : n;
        };
        return '"' + o.getFullYear() + "-" +
            pad(o.getMonth() + 1) + "-" +
            pad(o.getDate()) + "T" +
            pad(o.getHours()) + ":" +
            pad(o.getMinutes()) + ":" +
            pad(o.getSeconds()) + '"';
    },

    encode: function (objectDefinition, indent, keepJsonId, noLicense) {
        var A = this.readable ? "\n" : "";
        var G = this.readable ? " : " : "";
        indent = indent || 0;
        if (indent == 0) {
            var K = [], H = (!noLicense && this.licenseText) ? this.licenseText + "\n" : "";
            K.push(H, this.encode(objectDefinition, 1, keepJsonId));
            return K.join("")
        }
        if (objectDefinition == undefined || objectDefinition === null) {
            return "null"
        } else {
            if (objectDefinition instanceof Array) {
                return this.encodeArray(objectDefinition, indent, keepJsonId)
            } else {
                if (objectDefinition instanceof Date) {
                    return this.encodeDate(objectDefinition)
                } else {
                    if (typeof objectDefinition == "number") {
                        return isFinite(objectDefinition) ? String(objectDefinition) : "null"
                    } else {
                        if (typeof objectDefinition == "string" && !isNaN(objectDefinition) && objectDefinition != "") {
                            return this.encodeString(objectDefinition)
                        } else {
                            if (typeof objectDefinition == "string" && ["true", "false"].indexOf(objectDefinition) != -1) {
                                return objectDefinition
                            } else {
                                if (typeof objectDefinition == "boolean") {
                                    return String(objectDefinition)
                                } else {
                                    if (typeof objectDefinition == "string") {
                                        return this.encodeString(objectDefinition)
                                    } else {
                                        var a = [], b, i, v;
                                        a.push(this.indentStr(indent - 1), "{" + A);
                                        for (var i in objectDefinition) {
                                            v = objectDefinition[i];
                                            var B = (i.indexOf(this.jsonId) == 0 && i != this.jsonId) ? i.substring(this.jsonId.length) : null;
                                            if ((!B && this.jsonId && objectDefinition[this.jsonId + i]) || (!keepJsonId && i == this.jsonId)) {
                                                continue
                                            }
                                            if (B) {
                                                if (typeof (v) == "object" && (typeof (v.value) != "string" || String(v.value).replace(/\s+$/, ""))) {
                                                    if (b) {
                                                        a.push("," + A)
                                                    }
                                                    if (v.encode === false) {
                                                        a.push(this.indentStr(indent), B, G, v.value)
                                                    } else {
                                                        a.push(this.indentStr(indent), B, G, this.encode(v.value, indent + 1, keepJsonId))
                                                    }
                                                } else {
                                                    if (typeof (v) != "object" && String(v).replace(/\s+$/, "")) {
                                                        if (b) {
                                                            a.push("," + A)
                                                        }
                                                        a.push(this.indentStr(indent), B, G, v)
                                                    } else {
                                                        continue
                                                    }
                                                }
                                                b = true
                                            } else {
                                                if (!this.useHasOwn || objectDefinition.hasOwnProperty(i)) {
                                                    switch (typeof v) {
                                                        case "undefined":
                                                        case "unknown":
                                                            break;
                                                        case "function":
                                                            if (b) {
                                                                a.push("," + A)
                                                            }
                                                            a.push(this.indentStr(indent), i, G, "" + v);
                                                            b = true;
                                                            break;
                                                        case "object":
                                                        case "string":
                                                            if (!v) {
                                                                break
                                                            }
                                                        default:
                                                            if (b) {
                                                                a.push("," + A)
                                                            }
                                                            a.push(this.indentStr(indent), i, G, v === null ? "null" : this.encode(v, indent + 1, keepJsonId));
                                                            b = true
                                                    }
                                                }
                                            }
                                        }
                                        a.push(A + this.indentStr(indent - 2) + "}");
                                        return a.join("")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    getObjectRawValue: function (B, C) {
        if (this.jsonId && B[this.jsonId + C]) {
            var A = B[this.jsonId + C];
            return typeof (A) == "object" ? A.value : A
        }
        return B[C]
    },
    setJsonValue: function (A, C, D) {
        A = A || {};
        if (!A.json) {
            A.json = {}
        }
        var B = new Ext.create('Ext.ux.plugin.Json',{ jsonId: this.jsonId, nocache: true, evalException: false });
        var E = B.decode(A[this.jsonId + "json"]) || {};
        E[C] = D;
        A.json[C] = D;
        A[this.jsonId + "json"] = B.encode(E);
        return A
    },

    setObjectValue: function (source, id, value, content, scope, objType) {
        scope = scope || this.getScope();
        if (id == "json") {
            this.set(scope, value, { scopeOnly: true, scope: scope, nocache: this.nocache })
        }
        if (typeof (value) == "string") {
            value = value.replace(/\s+$/, "")
        }
        if (value === null || value === "") {
            delete source[id];
            if (this.jsonId) {
                delete source[this.jsonId + id]
            }
            return value
        }
        if (objType) {
            switch (objType) {
                case "string":
                    value = String(value.replace(/[$%&$%&]$/i,""));
                    break;
                case "number":
                    value = Number(value);
                    break;
                case "boolean":
                    value = Boolean(value);
                    break;
                case "float":
                    value = parseFloat(value.toString());
                    break;
            }
        }
        source[id] = value;
        if (this.jsonId) {
            if (content && typeof (content) == "object") {
                source[this.jsonId + id] = content
            } else {
                if (content) {
                    try {
                        if (typeof (content) == "string") {
                            content = content.replace(/\s+$/, "")
                        }
                        var valueAux = this.decode(content, { exceptionOnly: true, scope: scope });
                        if (objType) {
                            switch (objType) {
                                case "string":
                                    //valueAux = String(valueAux);
                                    valueAux = String(valueAux.replace(/[$%&$%&]$/i,""));

                                    break;
                                case "number":
                                    valueAux = Number(valueAux);
                                    break;
                                case "boolean":
                                    valueAux = Boolean(valueAux);
                                    break;
                                case "float":
                                    valueAux = parseFloat(valueAux.toString());
                                    break;
                            }
                        }
                        source[id] = valueAux;
                        if (typeof (source[id]) == "string" && ([value, "'" + value + "'", this.encodeString(value)].indexOf(content) != -1)) {
                            delete source[this.jsonId + id]
                        } else {
                            source[this.jsonId + id] = content
                        }
                    } catch (F) {
                        source[this.jsonId + id] = { value: content, encode: true}
                    }
                } else {
                    delete source[this.jsonId + id]
                }
            }
        }
        return value
    },
    codeEval: function (code, options) {
        options = options || {};
        var self = this;
        var scope = options.scope || this.getScope();
        var evalException = options.evalException == undefined ? this.evalException : options.evalException;
        if (!code || !String(code).replace(/\s+$/, "")) {
            return null
        }
        var myEval = Ext.bind(function (code) {
            try {
                return eval("({fix:" + code + "})").fix
            } catch (e) {
                e = new SyntaxError("Invalid code: " + code + " (" + e.message + ")");
                if (options.exceptionOnly) {
                    throw e
                }
                if (evalException && self.fireEvent("error", "codeEval", e)) {
                    throw e
                }
                return code
            }
        }, scope);
        return myEval(code)
    },
    decode: function (json, options) {
        options = options || {};
        var counter = 0, token = " ", me = this;
        var scope = options.scope || this.getScope();
        var U = options.fullDecode == undefined ? this.fullDecode : options.fullDecode;

        function errorHandler(message) {
            var stxError = new SyntaxError(message);
            stxError.at = counter - 1;
            stxError.json = json;
            throw stxError
        }

        function getNextToken() {
            token = json.charAt(counter);
            counter += 1;
            return token
        }

        function N(W) {
            counter -= W ? W : 1;
            token = json.charAt(counter);
            counter += 1;
            return token
        }

        function P(X, Y) {
            if (Y == undefined) {
                Y = -1
            }
            var W = 0;
            for (; W < X.length && json.charAt(counter + W + Y) == X.charAt(W); W++) {
            }
            if (W >= X.length) {
                counter += Y + W;
                getNextToken();
                return true
            }
            return false
        }

        function F() {
            while (token) {
                if (token <= " ") {
                    getNextToken()
                } else {
                    if (token == "/") {
                        switch (getNextToken()) {
                            case "/":
                                while (getNextToken() && token != "\n" && token != "\r") {
                                }
                                break;
                            case "*":
                                getNextToken();
                                for (; ;) {
                                    if (token) {
                                        if (token == "*") {
                                            if (getNextToken() == "/") {
                                                getNextToken();
                                                break
                                            }
                                        } else {
                                            getNextToken()
                                        }
                                    } else {
                                        errorHandler("Unterminated comment")
                                    }
                                }
                                break;
                            default:
                                N(2);
                                return
                        }
                    } else {
                        break
                    }
                }
            }
        }

        function H() {
            var W = token;
            while (getNextToken() && ": \t\n\r-+={(}[])'\"".indexOf(token) == -1) {
                W += token
            }
            return W
        }

        function A(a) {
            a = a || token;
            var b = counter - 1, Y, Z = "", X, W;
            if (token == a) {
                outer: while (getNextToken()) {
                    if (token == a) {
                        getNextToken();
                        return Z
                    } else {
                        if (token == "\\") {
                            switch (getNextToken()) {
                                case "b":
                                    Z += "\b";
                                    break;
                                case "f":
                                    Z += "\f";
                                    break;
                                case "n":
                                    Z += "\n";
                                    break;
                                case "r":
                                    Z += "\r";
                                    break;
                                case "t":
                                    Z += "\t";
                                    break;
                                case "u":
                                    W = 0;
                                    for (Y = 0; Y < 4; Y += 1) {
                                        X = parseInt(getNextToken(), 16);
                                        if (!isFinite(X)) {
                                            break outer
                                        }
                                        W = W * 16 + X
                                    }
                                    Z += String.fromCharCode(W);
                                    break;
                                default:
                                    Z += token
                            }
                        } else {
                            Z += token
                        }
                    }
                }
            }
            errorHandler("Bad string " + json.substring(b, counter - 1))
        }

        function G(X) {
            var Y = counter - 1, W = [];
            if (token == "[") {
                getNextToken();
                F();
                if (token == "]") {
                    getNextToken();
                    return W
                }
                while (token) {
                    W.push(Q(X)[0]);
                    F();
                    if (token == "]") {
                        getNextToken();
                        return W
                    } else {
                        if (token != ",") {
                            break
                        }
                    }
                    getNextToken();
                    F()
                }
            }
            errorHandler("Bad array " + json.substring(Y, counter - 1))
        }

        function V(Y) {
            var a = counter - 1, X, Z = {}, W;
            if (token == "{") {
                getNextToken();
                F();
                if (token == "}") {
                    getNextToken();
                    return Z
                }
                while (token) {
                    X = token == '"' || token == "'" ? A() : H();
                    F();
                    if (token != ":") {
                        errorHandler("Bad key(" + token + ") seprator for object " + json)
                    }
                    getNextToken();
                    F();
                    W = Q(X != "items");
                    me.setObjectValue(Z, X, W[0], W[1], scope);
                    F();
                    if (token == "}") {
                        getNextToken();
                        return Z
                    } else {
                        if (token != ",") {
                            break
                        }
                    }
                    getNextToken();
                    F()
                }
            }
            errorHandler("Bad object [" + X + "]" + json.substring(a, counter - 1))
        }

        function decodeNumber() {
            var returnNumber = "", testNumber;
            if (token == "-") {
                returnNumber = "-";
                getNextToken()
            }
            while (token >= "0" && token <= "9") {
                returnNumber += token;
                getNextToken()
            }
            if (token == ".") {
                returnNumber += ".";
                while (getNextToken() && token >= "0" && token <= "9") {
                    returnNumber += token
                }
            }
            if (token == "e" || token == "E") {
                returnNumber += "e";
                getNextToken();
                if (token == "-" || token == "+") {
                    returnNumber += token;
                    getNextToken()
                }
                while (token >= "0" && token <= "9") {
                    returnNumber += token;
                    getNextToken()
                }
            }
            testNumber = +returnNumber;
            if (!isFinite(testNumber)) {
                errorHandler("Bad number " + testNumber)
            } else {
                return testNumber
            }
        }

        function L(W) {
            while (getNextToken()) {
                F();
                switch (token) {
                    case W:
                        return;
                    case "(":
                        L(")");
                        break;
                    case "[":
                        L("]");
                        break;
                    case "{":
                        L("}");
                        break;
                    case '"':
                    case "'":
                        A(token);
                        counter--
                }
            }
            errorHandler("Unexpected end of code")
        }

        function B(Y) {
            counter--;
            var Z = counter - (Y ? 8 : 0);
            var W;
            while (getNextToken()) {
                F();
                switch (token) {
                    case "(":
                        L(")");
                        break;
                    case "[":
                        L("]");
                        break;
                    case '"':
                    case "'":
                        A(token);
                        N(2);
                        break;
                    case "{":
                        L("}");
                        if (!Y) {
                            break
                        }
                        getNextToken();
                    case ",":
                    case "]":
                    case "}":
                        var X = json.substring(Z, counter - 1);
                        return [me.codeEval(X, options), X]
                }
            }
            var X = json.substring(Z, counter - 1);
            return [me.codeEval(X, options), X]
        }

        function Q(W) {
            lastCode = null;
            F();
            switch (token) {
                case "{":
                    return W && !U ? B() : [V(false)];
                case "[":
                    return W && !U ? B() : [G(false)];
                default:
                    if (P("true")) {
                        return [true]
                    } else {
                        if (P("false")) {
                            return [false]
                        } else {
                            if (P("null")) {
                                return [null]
                            } else {
                                if ("-.0123456789".indexOf(token) >= 0) {
                                    return [decodeNumber()]
                                } else {
                                    if (P("function")) {
                                        return B(true)
                                    }
                                }
                            }
                        }
                    }
                    return B()
            }
        }

        try {
            if (!json) {
                return null
            }
            var I = Q(false)[0];
            F();
            if (token) {
                errorHandler("Invalid Json")
            }
            if (this.jsonId && typeof (I) == "object") {
                I = this.editable(I)
            }
            return I
        } catch (S) {
            if (options.exceptionOnly) {
                throw S
            }
            if (this.fireEvent("error", "decode", S)) {
                throw S
            }
        }
    },

    clone: function (o) {
        return this.decode(this.encode(o));
    }





});