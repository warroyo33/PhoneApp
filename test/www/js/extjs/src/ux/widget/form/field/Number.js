/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 29/07/13
 * Time: 09:34 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Ext.ux.widget.form.field.Number",{
    extend: 'Ext.form.field.Time',
    //alias: ['widget.textclearfield', 'widget.clearfield', 'widget.cleartriggerfield'],
    sourceConfig: {},
    labelStyle:'word-wrap: break-word;',
    editable: false,
    increment: 30,
   // trigger1Cls: 'textfield-multiplerow-icon',
    trigger2Cls: 'textfield-multiplerow-icon',
    onTrigger2Click: function(event){
        Ext.Notify.msg('<b>'+Ext.localization.fieldText.msgText.multipleRow+'</b>',
            {layout: 'topright', delay: 5000, type: 'warning'});
    },
    initComponent: function(){
        var me= this,
            Ex= Ext,
            hideTrigger=true;
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
            styleData:{ }, sourceConfig:{ }, extraFeatures: { }, labelStyleData: {}, actionData: "[]"
        });
        Ext.applyIf(me.configData.styleData,{
            width: 450,
            height: 24,
            border: false,
            borderSize: 1,
            borderStyle: 'solid'
        });

        Ext.applyIf(me.configData.labelStyleData,{
            bold: false,
            italic: false,
            underline: false,
            fontColor: '000000',
            labelWidth: 150,
            backgroundColor: 'FFFFFF'
        });
        /*me.on("firedbutton", function(){
         var w = new Ext.create('Ext.ux.widget.config.form.field.Text', {callback: me.callback, myLayout : me.initialConfig}).show();
         w.on("confirmchange",function(){
         me.fireEvent("confirmchange");
         });
         }, me);*/

        me.callback = function(cfg){
            me.fireEvent("updatedobject");
        };

        if (typeof me.configData.sourceConfig.name !=='undefined'){
            if (!Ex.isEditMode){
                var store= Ex.StoreManager.lookup(me.dataOrigin);
                store.bindValue(me,me.configData.sourceConfig);
                if (store.getSourceRecordBySourceName){
                    var source = store.getSourceRecordBySourceName(me.configData.sourceConfig);
                    if(source){
                        if (source.count()>1){
                            hideTrigger= false;
                        }
                        source.on('datachanged',function(){
                            if (source.count()>1){
                                hideTrigger= false;
                            }
                        });
                    }
                }





                //var storeRecord = Ext.StoreManager.lookup('DataSourceStore').findRecord('name',me.sourceConfig.name,0,false,false,true);
                /*if (storeRecord){
                 var store= storeRecord.data.source
                 store.on('datachanged',me.updateValue);
                 me.updateValue();
                 store.un('datachanged',me.updateValue);
                 }else{
                 me.setValue("{%"+me.sourceConfig.field+"%}") ;
                 me.getAutoFieldLabel();
                 }*/
            }else{
                me.setValue("{%"+me.configData.sourceConfig.field+"%}") ;
                me.getAutoFieldLabel();
            }
        }else{
            me.setSpecifiedValues();
        }
        if (!Ex.isEditMode){
            if (me.configData.actionData){
                var actionData = Ex.JSON.decode(me.configData.actionData);
                if (actionData.length){
                    Ex.Array.each(actionData,function(item){
                        Ex.coreGlobals.getScope().addActionToQueue({'id':item.targetId,'action':item.action,'criteria':item.criteria,'textValue':me.defaultValue ? me.defaultValue: me.getValue(),'controlType': me.configData.controlType})
                    })
                }
            }
        }
        me.on('render',function(){
            var me = this,
                el;


            // me.callParent(arguments);


            el = me.triggerEl.elements[0];
            //if(hideTrigger)
              //  el.hide();
        },me,{single:true});
        var textFieldStyle;
        if (me.configData.styleData.border)
            textFieldStyle = " border: "+me.configData.styleData.borderSize+"px "+me.configData.styleData.borderStyle+" #"+me.configData.styleData.borderColor+"!important; "+me.style;
        var labelStyleText = "color : #"+me.configData.labelStyleData.fontColor+" !important; background-color: #"+me.configData.labelStyleData.backgroundColor+" !important;"
        Ext.apply(me,{
            width: parseInt(me.configData.styleData.width) || 400,
            //height: parseInt(me.configData.styleData.height) || 200,
            border: me.configData.styleData.border || true,
            style : textFieldStyle || "",
            labelStyle: labelStyleText || "",
            labelWidth: me.configData.labelStyleData.labelWidth
        });
        me.callParent(arguments);
        if(me.fieldLabel) {
            var labelStyle = me.configData.labelStyleData,
                labelText=me.fieldLabel;
            if (labelStyle.bold)
                labelText= "<b>"+labelText+"</b>";
            if (labelStyle.italic)
                labelText= "<i>"+labelText+"</i>";
            if (labelStyle.underline)
                labelText= "<u>"+labelText+"</u>";
            me.setFieldLabel(labelText);
        }
    },
    getAutoFieldLabel: function(){
        var me = this;
        if(!me.initialConfig.fieldLabel) {
            me.initialConfig.fieldLabel = me.configData.sourceConfig.field;
            me.setFieldLabel(me.configData.sourceConfig.field);
        }
    },/*
     updateValue : function(){
     var me= this;
     var store = Ext.StoreManager.lookup('DataSourceStore');
     var fieldValueBySourceAndName = store.getFieldValueBySourceAndName(me.sourceConfig.name, me.sourceConfig.field);
     me.setValue(fieldValueBySourceAndName);

     this.getAutoFieldLabel();
     },*/
    setSpecifiedValues: function () {
        var me = this;
        setTimeout(function(){
            if (me.defaultValue)
                me.setValue(me.defaultValue)

        },1000);

    }
})