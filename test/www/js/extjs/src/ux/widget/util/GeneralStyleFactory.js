/**
 * Created by Desar_6 on 20/06/2014.
 */
Ext.define('Ext.ux.widget.util.GeneralStyleFactory',{
    initFactory: function(me){
        var Ex= Ext,
            ExLocale =  Ex.localization.simpleStyleConfig;
        var widthField = Ex.create('Ext.form.field.Number',{
                fieldLabel: ExLocale.fieldLabel.width,
                id: "widthText",
                name: "widthText",
                labelWidth: 40,
                disabled: me.noWidth || false,
                minValue: 0,
                allowBlank: false,
                maxValue: 4000,
                flex: 1,
                value: 300

            }),
            widthUnitField = Ex.create('Ext.form.field.ComboBox',{
                editable: false,
                //id: "borderStyleText",
                name: "widthUnitField",
                fieldLabel:  'Unit',
                disabled: me.noWidth || false,
                labelWidth: 95,
                padding: '0 0 0 30',
                flex: 1,
                height: 24,
                value: 'px',
                store: [
                    [ 'px', 'Pixels' ],
                    [ 'percent', 'Percent' ],
                    [ 'proportional', 'Proportional' ]
                ]
            }),
            heightField= Ex.create('Ext.form.field.Number',{
                fieldLabel:  ExLocale.fieldLabel.height,
                labelWidth: 40,
                id: "heightText",
                name: "heightText",
                padding: me.myConfig?(me.myConfig.isColumn?'0':'0 0 0 30'):'0 0 0 30',
                minValue: 0,
                allowBlank: false,
                maxValue: 4000,
                maxLength: 4,
                flex: 1,
                value: 300,
                disabled: me.noHeight||false

            }),
            heightUnitField = Ex.create('Ext.form.field.ComboBox',{
                editable: false,
                //id: "borderStyleText",
                name: "heightUnitField",
                fieldLabel:  'Unit',
                labelWidth: 95,
                disabled: me.noHeight||false,
                padding: '0 0 0 30',
                flex: 1,
                height: 24,
                value: 'px',
                store: [
                    [ 'px', 'Pixels' ],
                    //[ 'percent', 'Percent' ],
                    [ 'proportional', 'Proportional' ]
                ]
            }),

            borderSizeField= Ex.create('Ext.form.field.Number',{
                fieldLabel:  ExLocale.fieldLabel.borderSize,
                id: "borderSizeText",
                name: "borderSizeText",
                //labelWidth: 60,
                minValue: 1,
                allowBlank: false,
                maxValue: 10,
                flex: 1,
                value: 1

            }),
            borderStyleField = Ex.create('Ext.form.field.ComboBox',{
                editable: false,
                id: "borderStyleText",
                name: "borderStyleText",
                fieldLabel:  ExLocale.fieldLabel.borderStyle,
                labelWidth: 95,
                padding: '0 0 0 30',
                flex: 1,
                height: 24,
                value: 'solid',
                store: [
                    [ 'solid', ExLocale.fieldLabel.borderStyleValue.solid ],
                    [ 'dashed', ExLocale.fieldLabel.borderStyleValue.dashed ],
                    [ 'dotted', ExLocale.fieldLabel.borderStyleValue.dotted ],
                    [ 'double', ExLocale.fieldLabel.borderStyleValue.double ]
                ]
            }),
            borderField = Ext.create('Ext.form.field.Checkbox',{
                fieldLabel: ExLocale.fieldLabel.borderTitle,
                //padding: '0 0 0 10',
                flex: 1,
                name: 'borderChx',
                //labelWidth: 150,
                value: false
            });
        borderField.on('change',function(field,value){
            borderFieldSet.setVisible(value);
            colorPickerField.setVisible(value);
        });

        var borderFieldSet = Ext.create('Ext.container.Container',{
            id: 'boderFieldSet',
            layout: 'hbox',
            bodyPadding: '0 0 10 0',
            items: [
                borderSizeField,
                borderStyleField
            ],
            hidden: me.myConfig? !me.myConfig.border: true
        });
        var innerForm = Ex.create('Ext.form.Panel', {
            xtype: 'form',
            id: 'sizeConfig',
            frame: true,
            bodyPadding: 2,
            items: [],
            height: 110
        });

        var colorPickerField = Ext.create('Ext.ux.form.field.FieldColorPicker',{
            hidden: me.myConfig? !me.myConfig.border: true,
            padding: "0 0 0 15",
            fieldLabel: 'Border Color'
        });
        var items = [];
        if (typeof me.myConfig!=="undefined" && (me.myConfig?me.myConfig.isColumn:false)){
            Ext.Array.push(items,{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        widthField,
                        widthUnitField
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        heightField,
                        heightUnitField
                    ]
                });
        }else{
            Ext.Array.push(items,{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        widthField,
                        heightField
                    ]
                });
        }
        Ext.Array.push(items,{
                xtype: 'container',
                layout: 'hbox',
                padding: "5 0 5 0",
                defaults: {flex: 1},
                items:[
                    borderField,
                    colorPickerField
                ]
            },

            borderFieldSet);
        Ex.applyIf(me,{
            items: items// innerForm
        });
        me.setSerializedData= function(serialData){
            widthField.setValue(serialData.width);
            widthUnitField.setValue(serialData.widthUnit||"px");
            heightField.setValue(serialData.height);
            heightUnitField.setValue(serialData.heightUnit||"px");
            borderStyleField.setValue(serialData.borderStyle);
            borderSizeField.setValue(serialData.borderSize);
            borderField.setValue(serialData.border);
            me.myConfig=me.myConfig||{};
            me.myConfig.height= serialData.height;
            me.myConfig.heightUnit= serialData.heightUnit||"px";
            me.myConfig.widthUnit= serialData.widthUnit||"px";
            me.myConfig.width= serialData.width;
            me.myConfig.border= serialData.border;
            me.myConfig.borderSize= serialData.borderSize;
            me.myConfig.borderStyle= serialData.borderStyle;
            if (!serialData.borderColor)
                serialData.borderColor= "000000";
            colorPickerField.setValue(serialData.borderColor);
        };
        me.getSerializedData= function(){
            var myConfig = me.myConfig;
            if (!myConfig){
                return {
                    height: heightField.getValue(),
                    heightUnit: heightUnitField.getValue(),
                    width: widthField.getValue(),
                    widthUnit: widthUnitField.getValue(),
                    border: borderField.getValue() ? true : false,
                    borderSize: borderSizeField.getValue(),
                    borderStyle: borderStyleField.getValue(),
                    borderColor: colorPickerField.getValue()
                };
            }else{
                me.fireEvent("confirmchange");
                myConfig.width= widthField.getValue();
                myConfig.widthUnit= widthUnitField.getValue();
                myConfig.height= heightField.getValue();
                myConfig.heightUnit= heightUnitField.getValue();
                myConfig.border= borderField.getValue() ? true : false;
                myConfig.borderSize= borderSizeField.getValue();
                myConfig.borderStyle= borderStyleField.getValue();
                myConfig.borderColor= colorPickerField.getValue();
                return myConfig;
            }
        };
        me.isValid= function(){
            var form = innerForm.getForm();
            return form.isValid();
        };
        if (me.myConfig){
            var args= me.myConfig;
            heightField.setValue(args.height);
            widthUnitField.setValue(args.widthUnit||"px");
            heightUnitField.setValue(args.heightUnit||"px");
            widthField.setValue(args.width);
            borderSizeField.setValue(args.borderSize);
            borderStyleField.setValue(args.borderStyle);
            borderField.setValue(args.border);
            if (!args.borderColor)
                args.borderColor= "000000";
            colorPickerField.setValue(args.borderColor);
        }

    }
});