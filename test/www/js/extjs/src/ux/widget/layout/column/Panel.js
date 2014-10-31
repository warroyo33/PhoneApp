/**
 *Panel with layout column
 */
Ext.define("MPA.widget.layout.column.Panel",{
    extend: "MPA.widget.panel.Panel",
    alias: "widget.customlayoutcolumn",
    layout: "column",
    blockedCls: "blockDrop",
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
        me.on("firedbutton", function(){
            var w = Ext.create("MPA.widget.config.layout.Column",{callback: me.callback, myLayout : me.initialConfig}).show();
            w.on("confirmchange",function(){
                me.fireEvent("confirmchange");
            });
        }, me);
        me.callback = function(cfg){
            me.fireEvent("updatedobject");
        };
        me.callParent(arguments);
    }
})