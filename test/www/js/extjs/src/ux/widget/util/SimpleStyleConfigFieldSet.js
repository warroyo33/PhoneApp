/**
 * Created by Desar_6 on 20/06/2014.
 */
Ext.define('Ext.ux.widget.util.SimpleStyleConfigFieldSet',{
    extend: 'Ext.form.FieldSet',
    mixins:['Ext.ux.widget.util.GeneralStyleFactory'],
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    collapsible: true,
    height: 130,
    width: 800,
    initComponent: function(){
        var me = this;
        me.initFactory(me);
        me.callParent(arguments);

    }
});