/**
 * Created by Desar_6 on 24/06/2014.
 */
Ext.define("Ext.ux.form.field.FieldColorPicker",{
    extend: 'Ext.container.Container',
    value: '000000',
    labelWidth: 100,
    fieldLabel: 'ColorPicker',
    layout: 'hbox',
    xtype:'fieldcolorpicker',
    initComponent: function(){
        var me=this;

        me.colorPicker=Ext.create('Ext.menu.ColorPicker', {
            value: me.value,
            getValue: function () {
                return me.colorPicker.items.items[0].value;
            }
        });
        var colorButton = Ext.create('Ext.button.Split',{
            text: '<div style="background-color: #'+me.value+'; width: 16px; height:16px"></div>',
            menu: me.colorPicker
        });
        me.colorButton=colorButton;
        me.colorPicker.on('select', function(obj, color){
            colorButton.setText('<div style="background-color: #'+color+'; width: 16px; height:16px"></div>');
            //backgroundColorButton.setValue(color);

        });
        var fieldLabel = me.fieldLabel.trim();
        if (fieldLabel.indexOf(":")===fieldLabel.length-1)
            fieldLabel = fieldLabel.slice(0,fieldLabel.length-1);

        var fieldLabelObject= Ext.create('Ext.draw.Text',{
            padding: '4 0 0 0',
            text: fieldLabel+':',
            flex: 1
        });
        me.fieldLabelObject= fieldLabelObject;

        Ext.applyIf(me,{
            width: parseInt(me.labelWidth) +26
        });

        Ext.apply(me,{
            items: [
                fieldLabelObject,
                colorButton
            ]
        });

        me.getFieldLabel= function(){
            return me.fieldLabel;
        };
        me.setFieldLabel= function(value){
            value = value.trim();
            if (value.indexOf(":")=== value.length-1)
                value = value.slice(0,value.length-1);
            me.fieldLabel = value;
            fieldLabelObject.setText(value);
        };
        me.getLabelWidth= function(){
            return me.labelWidth;
        };
        me.setLabelWidth= function(value){
            me.labelWidth= parseInt(me.labelWidth);
            me.setWidth(parseInt(me.labelWidth) +26);
        };
        me.getValue= function(){
            return me.colorPicker.getValue();
        };
        me.setValue= function(value){
            me.colorPicker.items.items[0].select(value);
            colorButton.setText('<div style="background-color: #'+value+'; width: 16px; height:16px"></div>');
        };
        me.callParent(arguments);

    }
});