/**
 * Container **Panel** which implements a custom scroll-bar to be used in form designer
 */
Ext.define('Ext.ux.widget.panel.5050Panel', {
    extend: "Ext.panel.Panel",
    //alias: "widget.custompanel",
    blockedCls: 'blockDrop',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        flex:1,
        height:'100%'
    },
    interface: [
        {
            name: "title",
            value: "panel"
        },
        {
            name: "autoScroll",
            value: false
        }
    ],
    initComponent: function () {
        var me = this;
        me.addEvents(
            /**
             * @event firedbutton fires when configuration button in the property grid was clicked
             * this event can change the layout border initial configuration.
             */
            "firedbutton",
            /**
             * @event fires redrawElement function in MasterPlugin class.
             */
            "updatedobject"
        );
        if(me.initialConfig){
            delete me.initialConfig.__JSON__configData;
            /*delete me.initialConfig.__JSON__;*/
        }
        me.configData = me.configData|| {};
        Ext.applyIf(me.configData,{
            styleData:{ }, sourceConfig:{ }, extraFeatures: { }
        });
        Ext.applyIf(me.configData.styleData,{
            width: 400,
            height: 400,
            border: false,
            borderSize: 1,
            borderStyle: 'solid'
        });
        me.initialConfig.configData = me.configData;
        me.on("afterlayout", me.doAfterLayout, me);
        me.callback = function(){
            me.fireEvent("updatedobject");
        };
        var panelStyle;
        if (me.configData.styleData.border)
            panelStyle = " border: "+me.configData.styleData.borderSize+"px "+me.configData.styleData.borderStyle+"!important; "+me.style;
        me.on("afterrender",function(){
            me.hidden=  !Ext.isEditMode? (me.configData.extraFeatures.hidden||false) : false;
            me.collapsed= !Ext.isEditMode? (me.configData.extraFeatures.collapsed||false): false;
        }, me, {single: true});
        Ext.applyIf(me,{

            width: parseInt(me.configData.styleData.width) || 400,
            height: parseInt(me.configData.styleData.height) || 200,
            border: me.configData.styleData.border || true,
            style : panelStyle || "",
            //hidden: true,//!Ext.isEditMode? me.configData.extraFeatures.hidden : false,
            autoScroll: me.configData.extraFeatures.autoScroll,
            collapsible: !Ext.isEditMode? me.configData.extraFeatures.collapsible: false,
            // collapsed:!Ext.isEditMode? me.configData.extraFeatures.collapsed: false,
            collapseDirection: me.configData.extraFeatures.collapseDirection || "top"

        });
        me.callParent(arguments)
    },
    /**
     * Set custom scroll to container if configured as `autoScroll`
     * @param me {object} container body
     * @protected
     */
    doAfterLayout: function (me) {
        if (me.autoScroll) {
            fleXenv.fleXcrollMain(me.body.dom);
        }

    },
    /**
     * Overloading of method in abstractComponent class
     * this method search for existing scroll divs and hide them with attribute `display = none`, copy the `contentwrapper` content
     * to component body to finally sets autoScroll property to body to resize the container.
     * @protected
     */
    beforeLayout: function () {
        var me = this;
        if (me.autoScroll) {
            var wrapperContent = Ext.get(me.id).select("div.contentwrapper");
            var scrollWrapper = Ext.get(me.id).select("div.scrollwrapper");
            var xParentId;
            for (var scrollItem in scrollWrapper.elements) {
                var scrollElement = Ext.get(scrollWrapper.elements[scrollItem].id);
                if (scrollElement) {
                    xParentId = scrollWrapper.elements[scrollItem].id.substring(0, scrollWrapper.elements[scrollItem].id.length - 19);
                    if (me.id == xParentId) {
                        scrollElement.dom.style.width = "100%";
                        scrollElement.dom.style.display = "none";
                    }

                }
            }
            for (var item in wrapperContent.elements) {
                var contentElement = Ext.get(wrapperContent.elements[item].id);
                if (contentElement) {
                    xParentId = wrapperContent.elements[item].id.substring(0, wrapperContent.elements[item].id.length - 20);
                    if (me.id == xParentId) {
                        contentElement.parent("div.mcontentwrapper").dom.style.display = "none";
                        contentElement.parent("div.mcontentwrapper").dom.style.width = "100%";
                        while (wrapperContent.elements[item].firstChild) {
                            me.body.dom.appendChild(wrapperContent.elements[item].firstChild);
                        }

                    }
                }
            }
            me.body.dom.style.overflow = "auto";
        }
        me.callParent(arguments);
    },
    /**
     * Overloading of method in abstractComponent class
     * Set display attribute to `block` to display scroll divs after the resize event has occurred, finally copy the body content
     * to `contentwrapper` element.
     * @protected
     */
    afterComponentLayout: function () {
        var me = this;
        if (me.autoScroll) {
            var wrapperContent = Ext.get(me.id).select("div.contentwrapper");
            var scrollWrapper = Ext.get(me.id).select("div.scrollwrapper");
            var xParentId;
            for (var scrollItem in scrollWrapper.elements) {
                var scrollElement = Ext.get(scrollWrapper.elements[scrollItem].id);
                if (scrollElement) {
                    xParentId = scrollWrapper.elements[scrollItem].id.substring(0, scrollWrapper.elements[scrollItem].id.length - 19);
                    if (me.id == xParentId)
                        scrollElement.dom.style.display = "block";
                }
            }
            if (wrapperContent.elements.length) {
                var contentElement = Ext.get(wrapperContent.elements[0].id);
                if (contentElement) {
                    xParentId = wrapperContent.elements[0].id.substring(0, wrapperContent.elements[0].id.length - 20);
                    if (me.id == xParentId) {
                        var divContent = me.body.dom.firstChild;
                        while (divContent) {
                            if (divContent.className == "mcontentwrapper" || divContent.className == "scrollwrapper") {
                                divContent = divContent.nextSibling;
                            } else {
                                var prevSibling = divContent.previousSibling;
                                wrapperContent.elements[0].appendChild(divContent);
                                divContent = prevSibling.nextSibling;
                            }

                        }
                        contentElement.parent("div.mcontentwrapper").dom.style.display = "block";
                    }
                }
            }
            me.body.dom.style.overflow = "hidden";
        }
        this.callParent(arguments);
    }

});