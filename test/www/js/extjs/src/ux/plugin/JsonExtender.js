/**
 * Created with JetBrains WebStorm.
 * User: WalterArroyo
 * Date: 18/04/13
 * Time: 10:41 AM
 * Monitor Plus Architect (Powered by JumLabs(c))
 */
Ext.define("Ext.ux.plugin.JsonExtender", {
    //extend: "Ext.AbstractPlugin",
    extend: "Ext.util.Observable",
    require: ["Ext.ux.plugin.Json"],
    mixins: { mxsJson: "Ext.ux.plugin.Json" },
    alias: "widget.masterplugin",
    constructor: function (config) {
        //Ext.apply(this, config);
        this.callParent(arguments);
        this.initialConfig = config;
    },/*
    *//**
     * When true the toolbox is show on init
     * @type {Boolean}
     *//*
    autoShow: true,

    *//**
     * true if this panel is used in the release mode, false if is used in the design mode
     *//*
    isReleaseMode: false,

    *//**
     * Should caching be disabled when JSON are loaded (defaults false).
     * @type {Boolean}
     *//*
    jsonPath: "js/mpa/design/app/view/ux/plugin/",

    disableCaching: false,

    *//**
     * When toolboxTarget is set, this will be used to render toolbox to not window
     * @type {String/Element}
     *//*
    toolboxTarget: false,

    *//**
     * When navPanelTarget is set, this will be used to render the navigation Panel to not window
     * @type {String/Element}
     *//*
    navPanelTarget: false,

    *//**
     * Url used to load toolbox json from defaults to <this.file>/Ext.ux.plugin.Designer.json
     * @type {String}
     *//**//*
   // toolboxJson: false,

    *//**//**
     * Enable or disable the usage of customProperties (defaults false).
     * When disabled only properties which are defined within Ext.ux.Designer.ComponentsDoc.json are available.
     * @type {Boolean}
     *//*
    toolboxJson: "{0}MPA.ux.plugin.Designer.json",

    customProperties: false,

    //Menu buttons
    *//**
     * Enable or disable the Copy menu button (defaults true).
     * @type {Boolean}
     *//*
    enableCopy: true,

    *//**
     * Enable or disable the Show menu button (defaults true).
     * @type {Boolean}
     *//*
    enableShow: true,

    *//**
     * Enable or disable the Edit Json menu button (defaults true).
     * @type {Boolean}
     *//*
    enableEdit: true,
*/
    /**
     * Enable or disable the Help/Version information menu button (defaults true).
     * @type {Boolean}
     */
   /* enableVersion: true,
    autoLoad: false,
    enableOptions: true,
    optionsUrl: "{0}Designer.Options.json",
    autoResize: false,
    propertyDefinitionFiles: null,
    propertyDefinitions: ["{0}MPA.ux.plugin.Designer.Properties.json"],
    componentFiles: null,
    components: ["{0}MPA.ux.plugin.Designer.Components.json"],

    licenseText: Ext.localization.apiLicenseText,
    version:  Ext.localization.apiVersion,
    undoBtnId: Ext.id(),
    redoBtnId: Ext.id(),*/
    jsonId: '__JSON__',
    undoHistoryMax: 20,
    undoHistory: [],
    undoHistoryMark: 0,
    controlPrefix: "custom",
    componentsPath: 'MPA.widget',
    widgetDefinition: null,
    actionQueue: [],
    /* repository: null,

       designing: true,*/
    formatPath: function (path) {
        return Ext.String.format(path, Ext.coreGlobals.jsonPath || ""/*, this.wizardPath || this.jsonPath || "", this.thirdpartyPath || "", this.docPath || "", this.cssPath || "", this.version, this.repositoryPath*/);
    },

    /**
     * Init the plugin ad assoiate it to a field
     * @param {Component} field The component to connect this plugin to
     */
    init: function (field) {
        var me = this,Ex=Ext,Globals= Ex.coreGlobals;
        var lastSelectedComponent = null;
        me.initIsArray();
        me.container = field;
        me.container.codeConfig = {};
        me.jsonScope = me.scope || me.container;
        Globals.licenseText = this.formatPath(Globals.licenseText);
        Globals.toolboxJson = this.formatPath(Globals.toolboxJson);
        //me.optionsUrl = this.formatPath(this.optionsUrl);
        //this.helpUrl = this.formatPath(this.helpUrl);
        //this.codePressPath = this.formatPath(this.codePressPath);
        for (var A = 0; A < Globals.propertyDefinitions.length; A++) {
            Globals.propertyDefinitions[A] = me.formatPath(Globals.propertyDefinitions[A]);
        }
        for (var B = 0; B < Globals.components.length; B++) {
            Globals.components[B] = me.formatPath(Globals.components[B]);
        }

        me.addEvents({
            "beforeshow": true,
            "beforehide": true,
            "add": true,
            "remove": true,
            "change": true,
            "newconfig": true,
            "selectelement": true,
            "menuupdate": true,
            "loadfailed": false,
            "undo": true,
            "redo": true
        });

        me.container.on('render', function () {

            /*me.drag = new Ext.dd.DragZone(me.container.el, {
             ddGroup: 'designerddgroup',
             getDragData: Ext.bind(me.getDragData,this)
             });
             me.drop = new Ext.dd.DropZone(me.container.el, {
             ddGroup: 'designerddgroup',
             notifyOver: Ext.bind(me.notifyOver,this),
             notifyDrop: Ext.bind(me.notifyDrop,this)
             });*/
            if(!Globals.isReleaseMode){
                //if(!Ext.isIE9m){
                    me.dragZone = new Ex.dd.DragZone(me.container.el, {
                        ddGroup: 'designerddgroup',
                        getDragData: Ex.bind(me.getDragData, me),
                        onMouseDown: Ex.bind(function (e) {
                            lastSelectedComponent = this.getTarget(e, true);
                            //e.preventDefault();
                        }, me),
                        afterDragOut: Ex.bind(function (target, e, id) {
                            this.selectElement(lastSelectedComponent);
                        }, me)
                    });

                    me.dropZone = new Ex.dd.DropZone(me.container.el, {
                        ddGroup: 'designerddgroup',
                        notifyOver: Ex.bind(me.notifyOver, me),
                        notifyDrop: Ex.bind(me.notifyDrop, me)
                    });
               // }
                me.initContextMenu();
            }
            /*me.resizeLayer = new Ext.Layer({ cls: "resizeLayer", html: "Resize me" });
             me.resizeLayer.setOpacity(0.7);
             me.resizeLayer.resizer = new Ext.resizer.Resizer({ el: me.resizeLayer, handles: "se,s,e", draggable: true, dynamic: true, pinned: true });
             me.resizeLayer.resizer.on("resize", this.resizeElement, this);
             me.showToolbox = me.autoShow;*/
            me.createConfig();

            if (Globals.autoLoad) {
                if (typeof Globals.autoLoad !== "object") {
                    Globals.autoLoad = { url:  Globals.autoLoad };
                }
                if (Globals.autoLoad.nocache === 'undefined') {
                    Globals.autoLoad.nocache = Globals.nocache;
                }
                me.loadConfig(Globals.autoLoad.url);
            }

        },me,{"single": true});

      /*  me.container.on("afterrender", function () {
            Ex.tip.QuickTipManager.init(true, { width: 600, autoWidth: false, listeners: { show: function () {
                this.width = 500;
            } } });
        },me,{"single":true});*/
        me.widgetDefinition = new Ex.create('Ext.data.Store', {
            storeId: "widgetDefinition",
            fields: ['xtype', 'path'],
            proxy: {
                url: 'js/mpa/design/app/widget/config/PathManager.json',
                type: 'ajax',
                reader: {
                    type: 'json'
                }
            }
        });
        me.widgetDefinition.load();
    },
    addActionToQueue: function(action) {
        Ext.Array.push(this.actionQueue, action);
    },
    initIsArray: function () {
        if (!Array.isArray) {
            Array.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]' ;
            }
        }
    },
    deleteComponent: function () {
        this.removeElement(this.activeElement);
    },
    getMenu: function (eDelete){
        var me = this;
        var items = eDelete ? [{
            text: "Delete this element",
            iconCls: "icon-deleteEl",
            scope: this,
            handler: function (B) {
                this.removeElement(contextMenu.element);
            }
        }]:[];
        Ext.Array.push(items,{
            text: "Config Component",
            iconCls: 'icon-layoutconfig',
            handler: function(){
                me.activeElement.on("updatedobject", function () {
                    me.redrawElement(me.activeElement);
                }, me,{single: true});
                me.activeElement.on("confirmchange", function () {
                    me.markUndo();
                }, me,{single: true});
                me.activeElement.fireEvent("firedbutton",me,{single: true});

            }
        });
        var contextMenu = new Ext.menu.Menu({ items: items });
        return contextMenu;
    },
    initContextMenu: function () {
        var me = this;

        this.container.el.on("contextmenu", function (e) {
            e.preventDefault();
            var target = this.getTarget(e);
            this.selectElement(target);
             var B = this.getDesignElement(target);
            //var B = this.getDesignElement(this.getTarget(e,true));
            if (B) {
                var contextMenu = me.getMenu(target.cls !=="blockDDRegion");
                contextMenu.element = B;
                contextMenu.showAt(e.getXY());
            }
        }, this);
    },

    removeElement: function (source, internal) {
        if (!source) return false;
        if (source.xtype) {
            if (source.xtype === "chart")
                if (source.ownerCt)
                    source = source.ownerCt;
        }
        var own = this.getContainer(source.ownerCt);
        if (!internal) this.markUndo();
        for (var i = 0; i < own.items.length; i++) {
            if (own.items.items[i] == source) {
                own.codeConfig.items.splice(i, 1);
                own.remove(source, true);

                //if (!own.codeConfig) own.codeConfig = this.getConfig(own);
                //own.codeConfig.items.splice(i, 1);
                if (own.codeConfig.items.length === 0) delete own.codeConfig.items;
                if (!internal || internal == "noundo") {
                    this.redrawElement(own, this.getJsonId(this.activeElement == source ? own : this.activeElement));
                    this.fireEvent("remove");
                } else {
                    this.redrawContainer = true;
                }

                return true;
            }
        }
        return false;
    },

    //itemBegin
    menuUpdate: function () {
        var menu;
        var actionButtons = Ext.ComponentQuery.query('button[action="undo"]');
        var actionMenus = Ext.ComponentQuery.query('menuitem[action="undo"]');
        var btns = Ext.Array.merge(actionButtons,actionMenus);
        if (Array.isArray(btns)) {
            for (var x = 0; x < btns.length; x++) {
                menu = btns[x];
                if (menu) if (this.undoHistoryMark > 0) menu.setDisabled(false); else menu.setDisabled(true);
            }
        } else if (btns) if (this.undoHistoryMark > 0) btns.setDisabled(false); else btns.setDisabled(true);
        actionButtons = Ext.ComponentQuery.query('button[action="redo"]');
        actionMenus = Ext.ComponentQuery.query('menuitem[action="redo"]');
        btns = Ext.Array.merge(actionButtons,actionMenus);
        if (Array.isArray(btns)) {
            for (var y = 0; y < btns.length; y++) {
                menu = btns[y];
                if (menu) if (this.undoHistory.length > this.undoHistoryMark + 1) menu.setDisabled(false); else menu.setDisabled(true);
            }
        } else if (btns) if (this.undoHistory.length > this.undoHistoryMark + 1) btns.setDisabled(false); else btns.setDisabled(true);
    },
    //itemEnd
    //itemBegin
    markUndo: function () {
        while (this.undoHistory.length > this.undoHistoryMark) this.undoHistory.pop();
        this.undoHistory.push({ config: this.encode(this.getConfig(), 0, true), activeId: this.getJsonId() });
        //this.undoHistory.push(this.encode(this.getConfig(), 0, true));
        while (this.undoHistory.length > this.undoHistoryMax) this.undoHistory.shift();
        this.undoHistoryMark = this.undoHistory.length;
        this.menuUpdate();
    },
    //itemEnd
    /**
     * Append the config to the element
     * @param {Element} el The element to which the config would be added
     * @param {Object} config The config object to be added
     * @return {Component} The component added
     */
    appendConfig: function (el, config, select, dropLocation, source, E) {
        var me = this,
            Ex= Ext,
            ExArray= Ex.Array,
            ExJSON = Ex.JSON,
            ExBind = Ex.bind,
                Globals= Ex.coreGlobals;
        if (!el) return false;
        this.markUndo();

        //Custom function for adding stuff to a container
        var addObjectToCanvas = ExBind(function (src, comp, at, before,clearId) {
            /*var xtypeComponent = comp.xtype? comp.xtype : "custompanel";
             var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype",xtypeComponent,0,false,false,true);
             if (componentDefinitionRecord){
             var componentClassPath = componentDefinitionRecord.data.path;
             if (!Ext.ClassManager.isCreated(this.componentsPath+"."+componentClassPath))
             Ext.create(this.componentsPath+"."+componentClassPath)
             }      */
            clearId = clearId || false;
            if (clearId){
                comp=  this.clearObjectChildrenId(comp);
            }
            if (!src.items) src.initItems();
            var pos = src.items.length;
            for (var i = 0; i < src.items.length; i++) {
                if (src.items.items[i] == at) {
                    pos = (before) ? i : i + 1;
                    i = src.items.length;
                }
            }
            //if (!src.codeConfig) src.codeConfig = this.getConfig(src);
            if (!src.codeConfig.items || !(src.codeConfig.items instanceof Array))
                src.codeConfig.items = [];
            delete src.codeConfig.html; //items and html go not together in IE
            if (pos > src.codeConfig.items.length)
                src.codeConfig.items.push(comp);
            else
                src.codeConfig.items.splice(pos, 0, comp);
        }, this);


        if (typeof config == 'function') {
            config.call(this, ExBind(function (config) {
                this.appendConfig(el, config, true, dropLocation, source, E);
            }, this), this);
        } else {
            //Get the config of the items
            var ccmp, cmp = this.getDesignElement(el, true);
            var items = this.editable(Ex.applyIf(this.clone(config), E || {}));
            //var items = this.editable(Ext.applyIf(Ext.JSON.decode(Ext.JSON.encode(config)), E || {}));
            //Find the container that should be changed
            var G = ExBind(function (M, L) {
                if (!M) {
                    return;
                }
                if (items.xtype == "form" && M instanceof Ext.form.FormPanel) {
                    delete items.xtype;
                    items.layout = "form";
                }
                G(this.getContainer(M.ownerCt), M);
            }, this);
            // G(cmp);

            ccmp = this.getContainer(cmp);

            switch (dropLocation) {
                case "abovecode":
                case "belowcode":
                    ccmp = this.isContainer(cmp) ? this.getContainer(cmp.ownerCt) : ccmp;
                    break;
                case "appendcode":
                    this.removeElement(source, true);
                    addObjectToCanvas(ccmp, items, cmp, dropLocation == "abovecode",true);
                    break;
                case "appendafter":
                    addObjectToCanvas(ccmp, items, cmp, false,true);
                    break;
                case "appendbefore":
                    addObjectToCanvas(ccmp, items, cmp, true,true);
                    break;
                case "moveafter":
                    this.removeElement(source, true);
                    addObjectToCanvas(ccmp, items, cmp, false);
                    break;
                case "movebefore":
                    this.removeElement(source, true);
                    addObjectToCanvas(ccmp, items, cmp, true);
                    break;
                case "move":
                    this.removeElement(source, true);
                    addObjectToCanvas(ccmp, items);
                    break;
                case "copyAppend":
                    addObjectToCanvas(ccmp,items,null, null,true);
                    break;
                default:
                    var obj, container = [];
                    try {
                        if (config.xtype.toString().indexOf('Ext.') == -1 || config.xtype.toString().indexOf('MPA.') == -1) {
                            if (config.xtype.toString().indexOf(this.controlPrefix) >-1){//== -1)
                                //obj = new Ext.widget(config.xtype.toString());
                                // else {
                                var componentDefinitionRecord = me.widgetDefinition.findRecord("xtype", config.xtype.toString(), 0, false, false, true);
                                if (componentDefinitionRecord) {
                                    var componentClassPath = componentDefinitionRecord.data.path;
                                    if (!Ext.ClassManager.isCreated(me.componentsPath + "." + componentClassPath)) {
                                        var a = Ext.create(me.componentsPath + "." + componentClassPath);
                                        a.destroy();
                                    }
                                }
                                obj = new Ext.widget(config.xtype.toString());
                            }
                        } else
                            obj = new Ext.create(config.xtype.toString());
                    }
                    catch (e) {
                    }
                    if (cmp.xtype == 'jsonpanel' && !this.isContainer(obj)) {
                        container = this.editable(Ex.applyIf(this.clone({ xtype: "custompanel", title: "Panel", items: [], configData: {
                            styleData:{
                                width: 200,
                                height: 200,
                                border: false,
                                borderSize: 1,
                                borderStyle: 'solid'
                            },
                            extraFeatures: {

                            }
                        } }, E || {})));
                        //container.__JSON__isFirstContainer = true;
                        Ext.Array.push(container.items, items);

                    } else
                        container = items;
                    addObjectToCanvas(ccmp, container ,null,null,false);
                //add(ccmp, items)
            }
            this.modified = true;
            this.redrawElement(ccmp, items[Globals.jsonId]);
            this.fireEvent('add');
        }
        return false;
    },
    /**
     *
     */
    clearObjectChildrenId: function(items){
        if (items.id)
            delete items.id;
        if (items.configData){
            delete items.configData.referenceName;
            delete items.configData.referenceNameReady;
        }

        if (items.items) {
            for (var x=0; x<items.items.length; x++)   {
                items.items[x] = this.clearObjectChildrenId(items.items[x]);
            }
        }
        return items;
    },

    /**
     * Create the codeConfig object and apply it to the field
     */
    createConfig: function () {
        if (this.container.items && this.container.items.first()) {
            var items = [];
            while (this.container.items.first()) {
                items.push(this.container.items.first());
                this.container.items.remove(this.container.items.first());
            }
            //Re create a panel with items from config editable root
            var config = { 'border': false, 'layout': this.container.getLayout(), 'items': this.editableJson(items) };
            config[Ext.coreGlobals.jsonId] = Ext.id();
            var el = this.container.add(config);
            el.codeConfig = config;
        }
    },

    isModified: function (A) {
        if (A !== 'undefined') {
            this.modified = A;
        }
        return this.modified;
    },

    loadConfig: function (url) {
        if (this.loadMask && this.container.ownerCt)
            this.container.ownerCt.el.mask(this.loadMsg, this.msgCls);
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            callback: function (options, success, response) {
                if (success) {
                    this.setConfig(response.responseText, false);
                    this.modified = false;
                } else {
                    if (!this.fireEvent('loadfailed', url, response))
                        Ext.Msg.alert('Failure', 'Failed to load url :' + url);
                }
                if (this.loadMask && this.container.ownerCt)
                    this.container.ownerCt.el.unmask();
            },
            scope: this
        });
    },

    /**
     * Get the config as string of the specified element
     * @param {Element} el The element for which to get the config object
     * @return {String} The config string
     */
    getCode: function (el) {
        return this.encode(this.getConfig(el));
    },

    /**
     * Get the config of the specified element
     * @param {Element} el The element for which to get the config object
     * @return {Object} The config object
     */
    getConfig: function (el) {
        var Ex = Ext,
            Globals = Ex.coreGlobals;
        if (!el && this.container.items) {
            el = this.container.items.items;
            if (el.length > 1) {
                var B = [];
                for (var C = 0; C < el.length; C++) {
                    B.push(this.getConfig(el[C]));
                }
                return B;
            }
            el = el[0];
        }
        if (!el) {
            return {};
        }
        if (!el.codeConfig && el[Globals.jsonId]) {
            var findIn = Ex.bind(function (o) {
                if (!o) {
                    return null;
                }
                if (o[Globals.jsonId] == el[Globals.jsonId]) {
                    return o;
                }
                if (o.items) {
                    for (var E = 0; E < o.items.length; E++) {
                        var F = findIn(o.items[E]);
                        if (F) {
                            return F;
                        }
                    }
                }
                return null;
            }, this);
            el.codeConfig = findIn(this.codeConfig);
        }
        return el.codeConfig || el.initialConfig;
    },

    /**
     * Set the config to the design element
     * @param {String/Object} json The json to be applied
     * @param {Boolean} newConfig Flag that indicates if the current config is a new config or an update
     * @return {Boolean} true when succesfull applied

     */
    setConfig: function (json, newConfig) {
        /*var id = this.activeElement ? this.activeElement[this.jsonId] : null;
         var items = (typeof (json) == 'object' ? json : this.decode(json)) || {};
         if (!this.container.codeConfig) this.container.codeConfig = this.getConfig(this.container);
         items = this.deleteJsonNull(items);
         this.container.codeConfig.items = [this.editableJson(items)];
         this.applyJson(items, this.container); //Recreate childs
         this.redrawContainer = false;
         this.modified = true;
         this.fireEvent('newconfig');
         this.selectElement(this.findByJsonId(id));
         return true;         */
        if (!newConfig) {
            this.markUndo();
        }
        var items = (typeof (json) == "object" ? json : this.decode(json)) || null;
        this.container.codeConfig = items ? { items: (items instanceof Array ? this.editable(items) : [this.editable(items)])} : {};
        this.redrawElement(this.container);
        this.modified = true;
        this.fireEvent("newconfig", newConfig);
        return true;
    },

    /**
     * Refresh the content of the designer
     */
    refresh: function () {
        //this.setConfig(this.getConfig());
        var me = this;
        var newCanvasConfig = this.getCode();
        var filterConfig = newCanvasConfig.replace(Ext.coreGlobals.licenseText, '');
        filterConfig = filterConfig.replace('{', '');
        filterConfig = filterConfig.replace('}', '');
        if (filterConfig.trim() !== "")
            me.setConfig(newCanvasConfig, true);
        else
            me.setConfig("", true);
    },

    //Find parent which is of type container
    getContainer: function (el) {
        var p = el;
        while (p && p != this.container && !this.isContainer(p)) {
            p = p.ownerCt;
        }
        if (p && !p.codeConfig) {
            p.codeConfig = this.getConfig(p);
        }
        return p;
    },

    getJsonId: function (element) {
        element = element || this.activeElement;
        if (!element) {
            return null;
        }
        return element[this.jsonId] ? element[this.jsonId] : null;
    },

    /**
     * redraw an element with the changed config
     * @param {Element} element The elmenent to update
     * @param {Object} config The config
     * @return {Boolean} Indicator that update was applied
     */
    redrawElement: function (element, selectId) {
        var me = this;
        //this.hideVisualResize();
        var el = element || this.activeElement;
        if (el) {
            try {
                var id = selectId || this.getJsonId();
                var p = this.container; //Redraw whole canvas
                if (!this.redrawContainer && el != p) {
                    //Check if whe can find parent which can be redraw
                    var c = '';

                    p = this.getContainer(el);
                    //Search if whe find a layout capeble contianer
                    while (p != this.container && !c) {

                        if (!p.codeConfig) p.codeConfig = this.getConfig(p);
                        c = p.codeConfig.layout;
                        //if (!c || (p == el && c))
                        p = this.getContainer(p.ownerCt);
                    }
                    //p = c ? p : this.getContainer(el.ownerCt);
                }
                var conf = this.getConfig(p).items;
                /*if (conf) {
                    if (!conf[0].__JSON__isFirstContainer)
                        conf[0].__JSON__isFirstContainer = true;
                }*/

                this.apply(p, conf);
                this.redrawContainer = false;
                this.selectElement(id);
            } catch (e) {
                if (this.fireEvent("error", "redrawElement", e)) {
                    Ext.Msg.alert("Failure", "Failed to redraw element " + e);
                }
                return false;
            }

            this.fireEvent('change', el);
            /*this.on('afterapply',function(){
                this.processQueue();
            },this,{"single":true})*/
            //this.processQueue();
            this.modified = true;
            Ext.SourceStore.verifyGridBindings();
            return true;
        }
        return false;
    },
    processQueue: function(){
        var Ex = Ext,
            me = this;
        Ex.Array.each(this.actionQueue,function(actionItem){
            var affectedCmp = Ex.getCmp(actionItem.id);
            if (affectedCmp){
                if (actionItem.criteria){
                    var criteriaData = Ex.JSON.decode(actionItem.criteria),
                        criteriaToApply = 'if (';
                    if (criteriaData.length){
                        Ex.Array.each(criteriaData,function(item){
                            var controlType = actionItem.controlType,
                                getConditionValue=function(controlType,value){
                                    switch (controlType){
                                        case 0:
                                            return '"' + value + '"'
                                        case 1:
                                            return value
                                        default:
                                            return '"' + value + '"'
                                    }
                                };
                            if (item.criteriaIndex>0){
                                switch (item.connector){
                                    case "AND":
                                        criteriaToApply += ' && ';
                                        break;
                                    case "OR":
                                        criteriaToApply += ' || ';
                                        break
                                }
                            }
                            if (item.parenthesisI === 1)
                                criteriaToApply += '('
                            //if (actionItem.textValue)
                            criteriaToApply += getConditionValue(controlType,actionItem.textValue);//'"' + actionItem.textValue + '"';
                            if (item.operator){
                                switch  (item.operator){
                                    case "=":
                                        criteriaToApply += " == ";
                                        break;
                                    case "<>":
                                        criteriaToApply += " !== ";
                                        break;
                                    default :
                                        criteriaToApply += " " + item.operator + " ";
                                        break;
                                }
                            }
                            if (criteriaToApply)
                                criteriaToApply += getConditionValue(controlType,item.value);//'"' + item.value + '"';
                            else
                                criteriaToApply += '"" ';
                            if (item.parenthesisF ===1)
                                criteriaToApply += ')';
                        });
                        criteriaToApply += '){var affectedCmp = Ext.getCmp(actionItem.id);';
                            //'affectedCmp.setVisible(false);}';
                        criteriaToApply += me.processAction(actionItem.action);
                        criteriaToApply += "}"
                        eval(criteriaToApply);
                    }
                }

                //affectedCmp.setVisible(false);
            }
        });
        this.actionQueue = [];
    },
    processAction:function(action){
        var actionArray = action.split(';'),
            actionName = actionArray[0].split(':')[1],
            criteriaToApply;
        switch (actionName) {
            case "hide":
                criteriaToApply = 'affectedCmp.setVisible(false);';
                break;
            case "show":
                criteriaToApply = 'affectedCmp.setVisible(true);';
                break;
        }
        return criteriaToApply
    },
    focusElement: function (A) {
        var B = this.selectElement(A);
        if (B && B.innerWrap) {
            B.innerWrap.focus();
        } else {
            if (B) {
                B.focus();
            }
        }
    },
    /**
     * Select a designElement
     * @param {Element} el The element of the item to select
     * @param {Boolean} fieldOnNull Use the designer field when element not found
     * @return {Component} The selected component
     */
    selectElement: function (el, isDropTarget) {
        if (typeof (el) == 'string')
            el = this.findByJsonId(el);
        if (el) {
            if (el.xtype) {
                if (el.xtype === "chart")
                    if (el.ownerCt)
                        el = el.ownerCt;
            }
        }
        var lastTarget = null;
        if (this.activeElement)
            lastTarget = this.activeElement;
        var cmp = this.getDesignElement(el);

        this.highlightElement(cmp, isDropTarget);
        /*if (this.autoResize && !this.isContainer(cmp)) {
            this.visualResize(cmp, false);
        }*/ /*else {
         this.hideVisualResize()
         }*/
        if (cmp && cmp == this.activeElement) {
            return cmp;
        }
        this.activeElement = cmp;
        if (cmp) {
            var A = Ext.bind(function (cmp, F) {
                if (!cmp) {
                    return;
                }
                var D = cmp instanceof Ext.TabPanel ? cmp : null;
                if (D) {
                    if (F && F != D.getActiveTab()) {
                        D.setActiveTab(F);
                    }
                    for (var E = 0; E < D.items.items.length; E++) {
                        if (D.items.items[E] == D.getActiveTab() && D.codeConfig.activeTab != E) {
                            D.codeConfig.activeTab = E;
                            D.doLayout();
                        }
                    }
                }
                A(this.getContainer(cmp.ownerCt), cmp);
            }, this);
            A(cmp, null);
            if (this.propertyGrid) {
                this.propertyFilter();
                this.propertyGrid.enable();
                this.propertyGrid.showAdvanced = this.showAdvanced;
                //this.propertyGrid.setSource(this.getConfig(this.activeElement),this.getActiveElementConfigInterface(this.activeElement));
                this.propertyGrid.setSource(this.propertyGrid.getExtendedConfig(this.getConfig(this.activeElement), this.getActiveElementConfigInterface(this.activeElement)));

            }
        } else {
            if (this.propertyGrid) {
                this.propertyGrid.disable();
                this.propertyGrid.setSource({});
            }
        }
        this.fireEvent('selectelement', cmp);
        return cmp;
    },

    //partBegin: ExtendedConfig <Object_Type>:Set-up
    //itemBegin: getActiveElementConfigInterface
    /**
     * Returns, if any, the configuration interface exposed by the object class
     * @param {Element} element  Active Element in the canvas
     * @return {Array} configuration interface, or null
     */
    getActiveElementConfigInterface: function (element) {
        if (element.interface) return element.interface;
        return null;
    },
    //itemEnd
    //partEnd

    /**
     * Highlight a element within the component, removing old highlight
     * @param {Element} el The element to highlight
     * @return {Boolean} True when element highlighted
     */
    highlightElement: function (el, isDropTarget) {
        //Remove old highlight and drag support
        if (!isDropTarget) isDropTarget = false;
        if (Ext.isIE8m){
            if (this.container.el) {
                this.container.el.removeCls('selectedElementIE8m');
                this.container.el.select('.selectedElementIE8m').removeCls('selectedElementIE8m');
                this.container.el.select('.designerddgroup').removeCls('designerddgroup');
            }
            if (el) {
                if (el.innerWrap) {
                    el.innerWrap.addClass("selectedElementIE8m");
                    if (el.id != this.container.id) {
                        el.innerWrap.addClass("designerddgroup");
                    }
                } else {
                    el.addClass("selectedElementIE8m");
                    if (el.id != this.container.id) {
                        el.addClass("designerddgroup");
                    }
                }
                return el;
            }
        }else{
            if (this.container.el) {
                this.container.el.removeCls('selectedElement');
                this.container.el.select('.selectedElement').removeCls('selectedElement');
                this.container.el.select('.designerddgroup').removeCls('designerddgroup');
            }
            if (el) {
                if (el.innerWrap) {
                    el.innerWrap.addClass("selectedElement");
                    if (el.id != this.container.id) {
                        el.innerWrap.addClass("designerddgroup");
                    }
                } else {
                    el.addClass("selectedElement");
                    if (el.id != this.container.id) {
                        el.addClass("designerddgroup");
                    }
                }
                return el;
            }
        }
        return el;
    },

    /**
     * Check if a element is contained within a other element
     * @param {Element} cmp The component to search
     * @param {Element} container The component to search within
     * @return {Component} The ExtJs component found, false when not valid
     */
    isElementOf: function (cmp, container) {
        container = container || this.container;
        var loops = 50, c = cmp, id = container.getId();
        while (loops && c) {
            if (c.id == id) return cmp;
            c = c.ownerCt;
            loops--;
        }
        return false;
    },

    /**
     * Find a designElement, this is a ExtJs component which is embedded within this.container
     * @param {Element} el The element to search the designelement for
     * @return {Component} The ExtJs component found, false when not valid
     */
    getDesignElement: function (el, allowField) {
        var cmp, loops = 10, ExCmp= Ext.getCmp;
        while (loops && el) {
            cmp = ExCmp(el.id);
            if (cmp) {
                var id = this.container.getId(), c = cmp;
                loops = 50;
                while (loops && c && c.id != id) {
                    if (c instanceof Ext.Panel && c.autoLoad) {
                        cmp = c;
                    }
                    c = c.ownerCt;
                    loops--;
                }
                var ccmp = c && c.id == id;
                if (!cmp.codeConfig) {
                    cmp.codeConfig = this.getConfig(cmp);
                }

                if (!allowField && cmp == this.container) return false;
                return ccmp ? cmp : (allowField ? this.container : false);
            }
            el = el.parentNode;
            loops--;
        }
        return allowField ? this.container : false;
    },

    findByJsonId: function (id) {
        return this.container.queryBy(function (c, p) {
            return (c[this.jsonId] == id ? true : false);
        }, this)[0];
    },

    /**
     * Create the drag data for a element on designerpanel
     * @param {Event} e The drag event
     * @return {Object} the drag data
     */
    getDragData: function (e) {
        this.scope.isDraggable = true;
        var cmp = this.selectElement(this.getTarget(e, true));
        var el = e.getTarget('.designerddgroup');
        if (el && cmp) {
            return {
                ddel: el,
                config: cmp.initialConfig,
                internal: true,
                source: cmp
            };
        }
    },

    /**
     * Check if the given component is a container which can contain other xtypes
     * @param {Component} cmp The component to validate if it is in the list
     * @return {Boolean} True indicates the xtype is a container capable of contain other elements
     */
    isContainer: function (cmp) {
        return cmp instanceof Ext.Container;
        /*var xtype = cmp ? cmp.xtype : null;
         return  (xtype && ['jsonpanel','panel','viewport','form','window','tabpanel','toolbar','fieldset'].indexOf(xtype) !== -1);*/
    },

    /**
     * @private Fix a problem in firefox with drop getTarget by finding a component
     * using xy coordinates.
     * @param {Event} event The event for which a node should be searched
     * @return {Node} The node that is located by xy coordinates or null when none.
     * @param {Boolean} isDrag
     */
    getTarget: function (event, isDrag) {
        if (!event) return;
        var C = event.getTarget();
        if (C.className == "vscrollerbar scrollgeneric" || C.className == "vscrollerrest scrollgeneric" || C.className == "vscrollerfill scrollgeneric" ||
            C.className == "vscrollerbarbeg scrollgeneric" || C.className == "vscrollerbarmid scrollgeneric" || C.className == "vscrollerbarend scrollgeneric" ||
            C.className == "vscrollerbasebeg scrollgeneric" || C.className == "vscrollerbaseend scrollgeneric" || C.className == "vscrollerbasemid scrollgeneric" ||
            C.className == "hscrollerbar scrollgeneric" || C.className == "hscrollerrest scrollgeneric" || C.className == "hscrollerfill scrollgeneric" ||
            C.className == "hscrollerbarbeg scrollgeneric" || C.className == "hscrollerbarmid scrollgeneric" || C.className == "hscrollerbarend scrollgeneric"||
            C.className == "hscrollerbasebeg scrollgeneric" || C.className == "hscrollerbaseend scrollgeneric" || C.className == "hscrollerbasemid scrollgeneric" ||
            C.className.toString().match(/blockDDRegion/) == "blockDDRegion") {
            this.scope.isDraggable = false;
        } else {
            this.scope.isDraggable = true;
        }
        if ((!Ext.isGecko || Ext.isGecko3 || Ext.isGecko4 || Ext.isGecko5 || Ext.isGecko10) && event.lastTarget && event.lastTarget == C) {
            return C;
        }
        var n, findNode = function (c) {
            if (c && c.getPosition && c.getSize) {
                var I, G;
                if (c.innerWrap) {
                    I = c.innerWrap.getXY();
                    G = c.innerWrap.getSize();
                } else {
                    I = c.getPosition();
                    G = c.getSize();
                }
                var eventX, eventY;
                eventX = event.browserEvent.clientX;
                eventY = event.browserEvent.clientY;
                if (eventX >= I[0] && eventX <= I[0] + G.width && eventY >= I[1] && eventY <= I[1] + G.height) {
                    n = c;
                    if (c.items && c.items.items) {
                        var H = c.items.items;
                        for (var F = 0, E = H.length; F < E && !findNode(H[F]); F++) {
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        findNode(this.container);
        if (isDrag) {
            if (n && n.cls == "blockDDRegion")
                this.scope.isDraggable = false;
        } else {
            if (n && n.cls == "borderScroll")
                this.scope.isDraggable = false;
        }
        event.lastTarget = n || C;
        //if (this.scope.isDraggable || !isDrag)
        if (this.scope.isDraggable)
            return event.lastTarget;
        else {
            if (!this.scope.isDraggable && !isDrag)
                return event.lastTarget;
            else
                return false;
        }
    },

    /**
     * Called when a element is dragged over the component
     * @param {Object} src The source element
     * @param {Event} e The drag event
     * @param {Object} data The dataobject of event
     * @return {Boolean} return true to accept or false to reject
     */
    notifyOver: function (src, e, data) {
        var controlData;
        if (data.records === undefined)
            controlData = data;
        else
            controlData = data.records[0].data;
        controlData.processed = "";
        if (controlData.config) {
            var cmp = this.getDesignElement(this.getTarget(e), true);
            this.selectElement(cmp, true);
            if (cmp) {
                if (cmp.xtype) {
                    if (cmp.xtype === "chart")
                        if (cmp.ownerCt)
                            cmp = cmp.ownerCt;
                }
                if (cmp.id !== 'MPABodyCanvas'){
                    if (cmp.configData.extraFeatures.layout === "fit" && cmp.items.length){
                        controlData.drop = Ext.dd.DropZone.prototype.dropNotAllowed;
                        return controlData.drop;
                    }else{
                        if (!this.isContainer(cmp)){
                            var cmpParent = this.getContainer(cmp);
                            if (cmpParent.configData.extraFeatures.layout === 'fit'){
                                controlData.drop = Ext.dd.DropZone.prototype.dropNotAllowed;
                                return controlData.drop;
                            }
                        }
                    }
                }
            }
            //this.selectElement(cmp, true);
            if (cmp.blockedCls == "blockDrop") {
                controlData.drop = Ext.dd.DropZone.prototype.dropNotAllowed;
                return controlData.drop;
            }
            var el = cmp.getEl();
            if (controlData.internal && !e.shiftKey) {
                //Only allow move if not within same container
                if (this.isElementOf(cmp, controlData.source, true)) {
                    controlData.drop = null;
                    this.selectElement(cmp);
                    return false;
                }
                controlData.drop = this.isContainer(cmp) ? "move" :
                    (el.getX() + (el.getWidth() / 2) > Ext.EventManager.getPageX(e) ? "movebefore" : "moveafter");
                return (controlData.drop == 'movebefore' ? "icon-element-move-before" :
                    (controlData.drop == 'moveafter' ? "icon-element-move-after" : "icon-element-move"));
            } else { //Clone
                if(e.shiftKey){
                    controlData.drop = this.isContainer(cmp) ? "copyAppend" :
                        (el.getX() + (el.getWidth() / 2) > Ext.EventManager.getPageX(e) ? "appendbefore" : "appendafter");
                    return (controlData.drop == 'appendbefore' ? "icon-element-add-before" :
                        (controlData.drop == 'appendafter' ? "icon-element-add-after" : "icon-element-add"));
                }else{
                    controlData.drop = this.isContainer(cmp) ? "append" :
                        (el.getX() + (el.getWidth() / 2) > Ext.EventManager.getPageX(e) ? "appendbefore" : "appendafter");
                    return (controlData.drop == 'appendbefore' ? "icon-element-add-before" :
                        (controlData.drop == 'appendafter' ? "icon-element-add-after" : "icon-element-add"));
                }
            }
        }
        controlData.drop = null;
        return false;
    },

    /**
     * Called when a element is dropped on the component
     * @param {Object} src The source element
     * @param {Event} e The drag event
     * @param {Object} data The dataobject of event
     * @return {Boolean} return true to accept or false to reject                                   */
    notifyDrop: function (src, e, data) {
        var el = this.getTarget(e);
        var me = this;
        var controlData;
        var doAppendConfig= function(controlData){
            if (controlData.config && !controlData.processed && controlData.drop && controlData.drop != "x-dd-drop-nodrop") {
                me.appendConfig(el, controlData.config, true, controlData.drop, controlData.source);
                controlData.processed = true;
            } else {
                return false;
            }
        };
        if (data.records === undefined){
            controlData = data;
            doAppendConfig(controlData);
        }else{

            if (data.records.length>1){
                controlData = data.records[0].data;
                var callback =Ext.bind(function (config) {
                    this.appendConfig(el, config, true, controlData.drop, controlData.source);
                }, me);
                var w = Ext.create('MPA.widget.config.batch.DataDisplay',{
                    callback: callback,
                    records: data
                });
                w.show();
                return false;
            }else{
                controlData = data.records[0].data;
                doAppendConfig(controlData);
            }
        }



        return true;
    },

    /**
     * @private Function called to initalize the property editor which can be used to edit properties
     * @param {PropertyGrid} propertyGrid The property grid which is used to edit
     */

    setPropertyGrid: function (propertyGrid) {
        this.propertyGrid = propertyGrid;
        this.propertyGrid.jsonScope = this.getScope();
        propertyGrid.on('beforepropertychange', function (source, id, value, oldvalue) {
            this.markUndo();
        }, this);
        propertyGrid.on("propertyvalue", function (source, id, value, type, D) {
            this.setObjectValue(source, id, value, value, null, type);
            return false;
        }, this);
        propertyGrid.on('propertychange', function (source, id, value, oldvalue) {
            /*if (id == 'json') this.jsonInit(this.decode(value));*/
            this.redrawElement(this.activeElement);
            //Ext.Function.defer(this.redrawElement, 150, this)

        }, this);
        propertyGrid.on('firebutton', function (that) {
            this.activeElement.on("updatedobject", function () {
                this.redrawElement(this.activeElement);
            }, this);
            this.activeElement.on("confirmchange", function () {
                this.markUndo();
            }, this);
            this.activeElement.fireEvent("firedbutton");

            //Ext.Function.defer(this.redrawElement, 150, this)

        }, this);
    },
    remoteAppendConfigInterface: function(config,target){
        var scope= this;
        if(target){
            scope.appendConfig(target,config,true,"append");
        }else{
            if(scope.activeElement){
                scope.appendConfig(scope.activeElement,config,true,"append");
            }else{
                var canvas= Ext.getCmp("MPABodyCanvas");
                if(canvas.items && canvas.items.items && canvas.items.items.length){
                    var containerElement= this.getAvailableItem(canvas);
                    scope.appendConfig(containerElement,config,true,"append");
                }else{
                    scope.appendConfig(canvas,config,true,"append");
                }
            }
        }

    },
    getAvailableItem : function(canvas){
        if (canvas.items && canvas.items.items && canvas.items.items.length){
            if (canvas.items.items[0].layout.hasOwnProperty("centerRegion")){
                return this.getAvailableItem(canvas.items.items[0].layout.centerRegion);
            }else{
                return canvas.items.items[0]
            }
        }else{
            return canvas
        }

    }
});