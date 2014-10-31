/**
 * Panel with layout border
 */
Ext.define('Ext.ux.widget.layout.border.Panel',{
    extend:'Ext.ux.widget.panel.Panel',
    //alias: 'widget.customlayoutborder',
    layout:'border' ,
    border: false,
    blockedCls:"blockDrop",
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
            var w = new Ext.create ('MPA.widget.config.layout.Border',{callback: me.callback, myLayout : me.initialConfig}).show();
            w.on("confirmchange",function(){
                me.fireEvent("confirmchange");
            });
        }, me);
        me.callback = function(cfg){
            me.fireEvent("updatedobject");
        };
        me.callParent(arguments);
    }
});