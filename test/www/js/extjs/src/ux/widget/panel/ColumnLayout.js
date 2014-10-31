/**
 * Created by Desar_6 on 03/07/2014.
 */
/**
 * Container **Panel** which implements a custom scroll-bar to be used in form designer
 */
Ext.define('Ext.ux.widget.panel.ColumnLayout', {
    extend: "Ext.panel.Panel",
    blockedCls: 'blockDrop',
    border: 0,
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
        var items= me.items||[];
        Ext.applyIf(me.configData,{
            styleData:{ },
            titleStyleData:{ },
            extraFeatures: { }
        });
        Ext.applyIf(me.configData.styleData,{
            width: 400,
            height: 400,
            border: true,
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
        if (!items.length){
            me.initDefaultColumns(items);
        }
        me.initialConfig.configData = me.configData;
       // me.on("afterlayout", me.doAfterLayout, me);
        me.callback = function(){
            me.fireEvent("updatedobject");
        };
        var panelStyle;
        if (me.configData.styleData.border)
            panelStyle = " border: "+me.configData.styleData.borderSize+"px "+me.configData.styleData.borderStyle+" #"+me.configData.styleData.borderColor+"!important; "+me.style;
        else
            panelStyle=null;
        me.on("afterrender",function(){
            me.hidden=  !Ext.isEditMode? (me.configData.extraFeatures.hidden||false) : false;
            me.collapsed= !Ext.isEditMode? (me.configData.extraFeatures.collapsed||false): false;
        }, me, {single: true});
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

        Ext.apply(me,{
            title : titleStyle,
            border: 0,
            width: typeof me.configData.styleData.width!=="string"?parseInt(me.configData.styleData.width): me.configData.styleData.width ,
            height: typeof me.configData.styleData.height!=="string"?parseInt(me.configData.styleData.height) :me.configData.styleData.height,
            style : panelStyle || "",
            autoScroll: me.configData.extraFeatures.autoScroll,
            collapsible: !Ext.isEditMode? me.configData.extraFeatures.collapsible: false,
            collapseDirection: me.configData.extraFeatures.collapseDirection || "top",
            items: items
        });

        me.initialConfig.items=items;
        me.callParent(arguments)
    },
    initDefaultColumns:function(columns){
        Ext.Array.push(columns,{
            noTitle: true,
            xtype: 'columnpanel',
            configData: {
                styleData: {
                    border: false,
                    borderSize: 1,
                    borderStyle: 'solid',
                    borderColor: '99CCFF'
                },
                extraFeatures:{
                    collapsed: false,
                    layout: 'anchor',
                    collapsible: false,
                    collapseDirection: 'top'
                },
                titleStyleData: {
                    bold: false,
                    italic: false,
                    underline: false,
                    fontColor: '000000',
                    fontSize: '8'
                }
            }
        },{
            noTitle: true,
            xtype: 'columnpanel',
            configData: {
                styleData: {
                    border: false,
                    borderSize: 1,
                    borderStyle: 'solid',
                    borderColor: '99CCFF'
                },
                extraFeatures:{
                    layout: 'anchor'
                },
                titleStyleData: {
                    bold: false,
                    italic: false,
                    underline: false,
                    fontColor: '000000',
                    fontSize: '8'
                }
            }
        });
    }

});