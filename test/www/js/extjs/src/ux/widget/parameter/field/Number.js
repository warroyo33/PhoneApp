/**
 * Created by Desar_6 on 14/01/14.
 */
Ext.define('Ext.ux.widget.parameter.field.Number',{
    extend : 'Ext.form.field.Number',
    alias : 'widget.parameterdialogfieldnumber',
    allowBlank: false,

    initComponent : function(){
        var me = this;
        if (me.text){
            me.setFieldLabel(me.text);
        }
        me.callParent(arguments);
    },
    getSerializedData : function (){
        var me = this;
        var serialReturnValue= {
            text : me.text,
            dataIndex : me.dataIndex,
            value : me.getValue() || 0
        }

        return serialReturnValue
    },
    setSerializedData : function(text, dataIndex, value){
        var me = this;
        me.text = text;
        me.dataIndex = dataIndex;
        me.setValue(value);
    }
})