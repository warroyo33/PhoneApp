/**
 * Container **FieldSet** which implements a custom scroll-bar to be used in form Designer
 * {@img  MPA.view.controls.containers.form.FieldSet/scroll-FieldSet.png FieldSet with custom scroll-bar}
 */
Ext.define("Ext.ux.widget.form.FieldSet", {
    extend: "Ext.form.FieldSet",
    //alias: "widget.customfieldset",
    initComponent: function(){
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
            styleData:{ }, sourceConfig:{ }, extraFeatures: { }, titleStyleData: {}
        });
        Ext.applyIf(me.configData.styleData,{
            width: 400,
            height: 400,
            border: false,
            borderSize: 1,
            borderStyle: 'solid',
            borderColor: '99CCFF'
        });
        Ext.applyIf(me.configData.titleStyleData,{
            bold: false,
            italic: false,
            underline: false,
            fontColor: '000000',
            fontSize: '8'
        });
        Ext.applyIf(me.configData.extraFeatures,{
            layout: 'anchor'
        });
        me.on("afterlayout", me.doAfterLayout, me);
        me.callback = function(){
            me.fireEvent("updatedobject");
        };
        me.initialConfig.configData = me.configData;
        var defaultsValue = me.configData.extraFeatures.layout==="anchor"? { anchor: "100%"}: {};
        var titleStyle;
        if  (me.title){
            var titleStyleData = me.configData.titleStyleData,
                titleText = me.title;
            if (titleStyleData.bold)
                titleText = "<b>"+titleText+"</b>";
            //titleText = "<span style='color: white !important;'>"+titleText+"</span>";

            if (titleStyleData.italic)
                titleText = "<i>"+titleText+"</i>";
            if (titleStyleData.underline)
                titleText = "<u>"+titleText+"</u>";
            var titleHeight= parseInt(titleStyleData.fontSize);
            titleHeight = titleHeight+5;
            titleStyle = "<div style='font-family:tahoma, arial, verdana, sans-serif; !important;" +
                "font-weight: bold !important; "+
                "text-transform: none;"+
                "font-size: "+titleStyleData.fontSize+"pt !important; " +
                "line-height: "+titleHeight.toString()+"px !important; " +
                "color: #"+titleStyleData.fontColor+" !important;'>"+
                titleText+
                "</div>";
        }
        var panelStyle;
        if (me.configData.styleData.border)
            panelStyle = " border: "+me.configData.styleData.borderSize+"px "+me.configData.styleData.borderStyle+" #"+me.configData.styleData.borderColor+"!important; "+me.style;
        me.on("afterrender",function(){
            me.hidden=  !Ext.isEditMode? (me.configData.extraFeatures.hidden||false) : false;
            me.collapsed= !Ext.isEditMode? (me.configData.extraFeatures.collapsed||false): false;
        }, me, {single: true});
        Ext.apply(me,{
            title: titleStyle,
            width: typeof me.configData.styleData.width!=="string"?parseInt(me.configData.styleData.width): me.configData.styleData.width ,
            height: typeof me.configData.styleData.height!=="string"?parseInt(me.configData.styleData.height) :me.configData.styleData.height,
            border: me.configData.styleData.border || true,
            style : panelStyle || "",
            autoScroll: me.configData.extraFeatures.autoScroll,
            collapsible: !Ext.isEditMode? me.configData.extraFeatures.collapsible: false//,
            //collapsed:!Ext.isEditMode? me.configData.extraFeatures.collapsed: false
        });
        Ext.applyIf(me,{
            layout: me.configData.extraFeatures.layout,
            defaults: defaultsValue
        });
        me.callParent(arguments);
    },
    doBeforeRender: function (me) {
        if (me.autoScroll && !me.initialConfig.height && !me.initialConfig.__JSON__isFirstContainer) {
            Ext.applyIf(me, {
                height: 150
            });
            me.initialConfig.height = 150;
        }
        if (me.initialConfig.__JSON__isFirstContainer)
            delete me.initialConfig.__JSON__isFirstContainer;
        if (me.__JSON__isFirstContainer)
            delete me.__JSON__isFirstContainer;
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