/**
 * @class Ext.ux.Exporter.Button
 * @extends Ext.Component
 * @author Nige White, with modifications from Ed Spencer, with modifications from iwiznia.
 * Specialised Button class that allows downloading of data via data: urls.
 * Internally, this is just a link.
 * Pass it either an Ext.Component subclass with a 'store' property, or just a store or nothing and it will try to grab the first parent of this button that is a grid or tree panel:
 * new Ext.ux.Exporter.Button({component: someGrid});
 * new Ext.ux.Exporter.Button({store: someStore});
 * @cfg {Ext.Component} component The component the store is bound to
 * @cfg {Ext.data.Store} store The store to export (alternatively, pass a component with a getStore method)
 */
/*Ext.define("Ext.ux.exporter.Button", {
    extend: "Ext.Component",
    alias: "widget.exporterbutton",
    html: '<p></p>',
    config: {
        swfPath: '/flash/downloadify.swf',
        downloadImage: '/images/ext_reports/download.png',
        width: 62,
        height: 22,
        downloadName: "download"
    },

    constructor: function(config) {
      config = config || {};

      this.initConfig();
      Ext.ux.exporter.Button.superclass.constructor.call(this, config);

      var self = this;
      this.on("afterrender", function() { // We wait for the combo to be rendered, so we can look up to grab the component containing it
          self.setComponent(self.store || self.component || self.up("gridpanel") || self.up("treepanel"), config);
      });
    },

    setComponent: function(component, config) {
        this.component = component;
        this.store = !component.is ? component : component.getStore(); // only components or stores, if it doesn't respond to is method, it's a store
        this.setDownloadify(config);
    },

    setDownloadify: function(config) {
        var self = this;
        Downloadify.create(this.el.down('p').id,{
            filename: function() {
              return self.getDownloadName() + "." + Ext.ux.exporter.Exporter.getFormatterByName(self.formatter).extension;
            },
            data: function() {
              return Ext.ux.exporter.Exporter.exportAny(self.component, self.formatter, config);
            },
            transparent: false,
            swf: this.getSwfPath(),
            downloadImage: this.getDownloadImage(),
            width: this.getWidth(),
            height: this.getHeight(),
            transparent: true,
            append: false
        });
    }
});*/

Ext.define("Ext.ux.exporter.Button", {
    extend: "Ext.button.Button",
    //extend: 'Ext.Component',
    alias: "widget.exporterbutton",

    //renderTpl: '<a href="{url}">{text}</a>',
    /*renderTpl: '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>' +
        '<td class="x-btn-left"><i> </i></td><td class="x-btn-center"><a class="x-btn-text" href="{url}" target="{text}">{0}</a></td><td class="x-btn-right"><i> </i></td>' +
        '</tr></tbody></table>',    */
   /* renderSelectors: {
        linkEl: 'a'
    },*/

    initComponent: function() {
        this.callParent();
        this.renderData = {
            url: this.url,
            text: this.text
        }
    },
    constructor: function(config) {
        config = config || {};
        var me= this;

        Ext.applyIf(config, {
            exportFunction: 'exportGrid',
            text          : 'Download',
            cls           : 'download'
        });

        if (config.store == undefined && config.component != undefined) {
            Ext.applyIf(config, {
                store: config.component.store
            });
        } else {
            Ext.applyIf(config, {
                component: {
                    store: config.store
                }
            });
        }

        me.superclass.constructor.call(me, config);
        console.log("AAAAAAAAAAAAAAAAAAASLKDFLKASJDKLFJALKÑSJDFLKÑJASKLÑDFJLÑKASJDFÑ");
        if (me.store && Ext.isFunction(me.store.on)) {

            var setLink = function() {
                if (me.getEl()){
                    //me.getEl().child('a', true).href = 'data:application/vnd.ms-excel;base64,' + Ext.ux.exporter.Exporter[config.exportFunction](this.component, null, config);
                    me.encodedText=Ext.ux.exporter.Exporter[config.exportFunction](this.component, null, config);
                    me.enable();
                }else{
                    me.un('render',setLink);
                    me.store.un('load',setLink);
                }
            };

            if (me.el) {
                setLink.call(me);
            } else {
                me.on('render', setLink, me);
            }

            me.store.on('load', setLink, me);
        }
    }/*,

    template: new Ext.Template(
        '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
        '<td class="x-btn-left"><i> </i></td><td class="x-btn-center"><a class="x-btn-text" href="{1}" target="{2}">{0}</a></td><td class="x-btn-right"><i> </i></td>',
        "</tr></tbody></table>"),

    onRender:   function(ct, position){
        var btn, targs = [this.text || ' ', this.href, this.target || "_self"];
        if (position){
            btn = this.template.insertBefore(position, targs, true);
        }else{
            btn = this.template.append(ct, targs, true);
        }
        var btnEl = btn.down("a:first");
        this.btnEl = btnEl;
        btnEl.on('focus', this.onFocus, this);
        btnEl.on('blur', this.onBlur, this);

        //this.initButtonEl(btn, btnEl);
        //Ext.ButtonToggleMgr.register(this);
    },
    initButtonEl : function(btn, btnEl){
        this.el = btn;
        this.setIcon(this.icon);
        this.setText(this.text);
        //this.setIconClass(this.iconCls);
        if(Ext.isDefined(this.tabIndex)){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            this.setTooltip(this.tooltip, true);
        }

        if(this.handleMouseEvents){
            this.mon(btn, {
                scope: this,
                mouseover: this.onMouseOver,
                mousedown: this.onMouseDown
            });

            // new functionality for monitoring on the document level
            //this.mon(btn, 'mouseout', this.onMouseOut, this);
        }

        if(this.menu){
            this.mon(this.menu, {
                scope: this,
                show: this.onMenuShow,
                hide: this.onMenuHide
            });
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn, Ext.isObject(this.repeat) ? this.repeat : {});
            this.mon(repeater, 'click', this.onRepeatClick, this);
        }else{
            this.mon(btn, this.clickEvent, this.onClick, this);
        }
    }*/,
    onClick : function(e){
        /*if (e.button != 0) return;

        if (!this.disabled){
            this.fireEvent("click", this, e);

            if (this.handler) this.handler.call(this.scope || this, this, e);
        }  */
        console.log(this.encodedText);
        /*Ext.Ajax.request({
            url: 'handler/util/ExcelExporter.aspx',
            params: {
                encodedText: this.encodedText
            }
        })         */
        if (theForm && !Ext.isEditMode){
            theForm.action='handler/util/ExcelExporter.aspx'
            theForm.__EVENTTARGET.value = 'ExportExcel';
            theForm.__EVENTARGUMENT.value = this.encodedText;
            theForm.submit();
        }

    }
});