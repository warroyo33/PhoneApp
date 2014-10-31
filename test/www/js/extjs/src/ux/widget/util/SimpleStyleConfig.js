/**
 * Created by Desar_6 on 02/04/2014.
 */
Ext.define('Ext.ux.widget.util.SimpleStyleConfig',{
    extend: 'Ext.panel.Panel',
    mixins:['Ext.ux.widget.util.GeneralStyleFactory'],
    frame: true,
    bodyPadding: 2,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    height: 200,
    width: 800,
    initComponent: function(){
        var me = this;
        me.initFactory(me);
        me.callParent(arguments);

    }
});
