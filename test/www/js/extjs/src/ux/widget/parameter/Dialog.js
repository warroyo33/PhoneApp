/**
 * Created by Desar_6 on 14/01/14.
 */
Ext.define('Ext.ux.widget.parameter.Dialog',{
    extend : 'Ext.window.Window',
    mixins: ['Ext.ux.widget.parameter.Util'],
    requires: ['Ext.ux.Msg.DetailBubble'],
    title : 'Parameters',
    layout : 'anchor',
    width : 400,
    height : 400,
    autoScroll : true,
    plain : true,
    modal : true,
    closable : false,
    /**
     * At the init of the object this dialog needs a vector like this to create automatically a form to setup the values of the parameters of the dialog.
     * [{
     *       "name" : "test",
     *       "parameters" : [{
     *           "alias":"CAMPO",
     *           "dataIndex":"CAMPO",
     *           "type":1
     *       },{
     *           "alias":"FECHA",
     *           "dataIndex":"FECHA",
     *           "type":1
     *       },{
     *           "alias":"UUID",
     *           "dataIndex":"UUID",
     *           "type":0
     *       },{
     *           "alias":"UUID_MATRIZ_ENTIDAD",
     *           "dataIndex":"UUID_MATRIZ_ENTIDAD",
     *           "type":0
     *       }]
     *   }]
     */
    initComponent: function() {
        var me = this,
            initParameterVector = me.initParameterVector||[],
            Ex = Ext,
            ExArray= Ex.Array,
            ExLocale= Ex.localization;
        //[{"name":"test","description":"","grid":"[{\"name\":\"CAMPO\",\"alias\":\"CAMPO\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"CONDICION\",\"alias\":\"CONDICION\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"FECHA\",\"alias\":\"FECHA\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"UUID\",\"alias\":\"UUID\",\"type\":\"\",\"length\":32,\"advancedSearch\":false},{\"name\":\"UUID_MATRIZ_ENTIDAD\",\"alias\":\"UUID_MATRIZ_ENTIDAD\",\"type\":\"\",\"length\":32,\"advancedSearch\":false},{\"name\":\"UUID_ESTRUCTURA_ODS\",\"alias\":\"UUID_ESTRUCTURA_ODS\",\"type\":\"\",\"length\":32,\"advancedSearch\":\"\"}]","sourceConfig":{"params":{"targetName":"DMTT_MATRIZ_VERIFICACION","columns":"[{\"name\":\"CAMPO\",\"alias\":\"CAMPO\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"CONDICION\",\"alias\":\"CONDICION\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"FECHA\",\"alias\":\"FECHA\",\"type\":\"\",\"length\":4,\"advancedSearch\":false},{\"name\":\"UUID\",\"alias\":\"UUID\",\"type\":\"\",\"length\":32,\"advancedSearch\":false},{\"name\":\"UUID_MATRIZ_ENTIDAD\",\"alias\":\"UUID_MATRIZ_ENTIDAD\",\"type\":\"\",\"length\":32,\"advancedSearch\":false},{\"name\":\"UUID_ESTRUCTURA_ODS\",\"alias\":\"UUID_ESTRUCTURA_ODS\",\"type\":\"\",\"length\":32,\"advancedSearch\":\"\"}]","unusedColumns":"[]","allColumns":"[{\"name\":\"CAMPO\",\"alias\":\"CAMPO\",\"type\":\"\",\"length\":4,\"grid\":true,\"parameter\":true,\"advancedSearch\":false},{\"name\":\"CONDICION\",\"alias\":\"CONDICION\",\"type\":\"\",\"length\":4,\"grid\":true,\"parameter\":true,\"advancedSearch\":false},{\"name\":\"FECHA\",\"alias\":\"FECHA\",\"type\":\"\",\"length\":4,\"grid\":true,\"parameter\":true,\"advancedSearch\":false},{\"name\":\"UUID\",\"alias\":\"UUID\",\"type\":\"\",\"length\":32,\"grid\":true,\"parameter\":true,\"advancedSearch\":false},{\"name\":\"UUID_MATRIZ_ENTIDAD\",\"alias\":\"UUID_MATRIZ_ENTIDAD\",\"type\":\"\",\"length\":32,\"grid\":true,\"parameter\":true,\"advancedSearch\":false},{\"name\":\"UUID_ESTRUCTURA_ODS\",\"alias\":\"UUID_ESTRUCTURA_ODS\",\"type\":\"\",\"length\":32,\"grid\":true,\"parameter\":\"\",\"advancedSearch\":\"\"}]","searchParams":[{"text":"CAMPO","dataIndex":"CAMPO","type":""},{"text":"CONDICION","dataIndex":"CONDICION","type":""},{"text":"FECHA","dataIndex":"FECHA","type":""},{"text":"UUID","dataIndex":"UUID","type":""},{"text":"UUID_MATRIZ_ENTIDAD","dataIndex":"UUID_MATRIZ_ENTIDAD","type":""}],"targetType":"TV","requestType":"sourceAction","sourceId":"test","description":"","token":"ec9e846f-198a-4dd2-8a79-c7b2f530a3d2","connectionType":"DQM"},"proxy":{"storeId":"defaultProxyDQMHibertane","name":"Data Quality Manager (Hibernate)","type":"DQM","url":"handler/connection/Util.aspx"}},"parameters":[{"text":"CAMPO","dataIndex":"CAMPO","type":"int"},{"text":"FECHA","dataIndex":"FECHA","type":"int"},{"text":"UUID","dataIndex":"UUID","type":"varchar"},{"text":"UUID_MATRIZ_ENTIDAD","dataIndex":"UUID_MATRIZ_ENTIDAD","type":"varchar"}]}]
        var items = [];
        ExArray.each(initParameterVector, function(category){
            var categoryItems = [];
            var grid = category.params ? category.params.columns:[];
            if (typeof grid ==="string")
                grid = Ex.JSON.decode(grid);

            ExArray.each(grid,function(parameter){
                if (parameter.parameter){
                    var parameterEditor = me.getEditorByType(parameter.type,parameter);
                    ExArray.push(categoryItems,parameterEditor);
                }

            });
            var afterAdvancedDialogCallBack= function(data){
              ExArray.each(categoryItems,function(item){
                  if (item)
                    item.setValue(data[item.dataIndex]);
              })
            };
            var searchItems= [];

            ExArray.each(grid, function(field){
                if (field.advancedSearch)
                    ExArray.push(searchItems,field);
            });

            var advancedTools= (category.proxy && searchItems.length) ? [{
                iconCls:'advanced-search-icon',
                border: true,
                style: 'border: 1px solid gray',
               // text: ExLocale.parameterSetupDialog.buttons.searchIt,
                tooltip: ExLocale.parameterSetupDialog.advancedSearchTooltip,
                handler: function(){
                    Ex.create('Ext.ux.widget.parameter.advancedsearch.Dialog',{
                        initParameterVector: category,
                        callback:afterAdvancedDialogCallBack
                    }).show();
                }
            }]:[];
            var categoryFieldsetConfig= {
                title : '<b>'+(category.description?category.description:"")+'</b>[<i>'+category.name+'</i>]',
                categoryName: category.name,
                categoryDescription: category.description,
                items : categoryItems,
                bodyPadding: '5 10 0 10',
                layout : 'anchor',
                anchor: '100%'
            }
            if (searchItems.length){
                categoryFieldsetConfig.rbar= advancedTools;
            }
            var categoryFieldSet = Ex.create('Ext.panel.Panel',categoryFieldsetConfig);

            ExArray.push(items,categoryFieldSet);
        });
        Ex.applyIf(me,{
            title: ExLocale.parameterSetupDialog.title.parameters,
            items : [{
                xtype: 'form',
                id: 'parameterDialogForm',
                border: false,
                items: items
            }],
            buttons : [{
                text : ExLocale.parameterSetupDialog.buttonText._continue,
                handler : function(){
                    var dialogForm = Ext.getCmp('parameterDialogForm').getForm();
                    if (dialogForm.isValid()){
                        var returnSerializedVector = [];
                        ExArray.each(items, function(category){
                            var categorySerializedVector = {};
                            categorySerializedVector.name = category.categoryName;
                            categorySerializedVector.description = category.categoryDescription;
                            categorySerializedVector.parameters = [];
                            ExArray.each(category.items.items,function(parameter){
                                ExArray.push(categorySerializedVector.parameters, parameter.getSerializedData())
                            });
                            ExArray.push(returnSerializedVector, categorySerializedVector);

                        });
                        console.log(returnSerializedVector);
                        me.close();
                        if (me.callback) me.callback(returnSerializedVector);
                    }else{
                         //me.getInvalidAlert(dialogForm).show();
                        Ext.widget( 'detailBubbleCallout', {
                            type: 'error',
                            form: dialogForm,
                            target: this,
                            calloutArrowLocation: 'bottom-left',
                            relativePosition: 'bl-tr',
                            relativeOffsets: [-30,0],
                            dismissDelay: 0
                        }).show();
                        this.focus();
                        //Ex.Msg.alert(ExLocale.apiName,errorText.toString()/*ExLocale.parameterSetupDialog.msgText.allFieldsRequired*/);
                    }

                }
            },{
                text:  ExLocale.parameterSetupDialog.buttonText.cancel,
                handler : function(){
                    me.close();
                    if (me.closeCallback) me.closeCallback();
                    return false;
                }
            }]
        });
        me.callParent(arguments);
    },
    getInvalidAlert : function(form,data,eMessage){
        var me = form,
            invalid,
            eMessage= eMessage || '<b>The following errors prevent to continue the process</b>';
        Ext.define('errorDetailModel',{
            extend: 'Ext.data.Model',
            fields: ['text', 'group']
        });
        var errorStore= Ext.create('Ext.data.Store',{
            model: 'errorDetailModel',
            groupers: ['group'],
            proxy: {
                type: 'memory',
                reader: 'json'
            }
        });
        if (!data){
            Ext.suspendLayouts();
            invalid = me.getFields().filterBy(function(field) {
                return !field.validate();
            });
            Ext.resumeLayouts(true);
            var errorData= [];
            if (invalid.length){
                Ext.Array.each(invalid.items, function(item){
                    Ext.Array.each(item.activeErrors,function(error){
                        Ext.Array.push(errorData, {text: error, group: item.fieldLabel});
                    });
                });
                errorStore.loadData(errorData);
            }
        }else{
            errorStore.loadData(data);
        }

        var errorGrid = Ext.create('Ext.grid.Panel',{
            //title: 'The following errors prevent to continue the process',
            store: errorStore,
            region: 'center',
            features: [{ftype:'grouping'}],
            width: 200,
            height: 275,
            columns: [{
                text: 'Description',
                dataIndex: 'text',
                flex: 1
            }]
        });

        var errorMessage = Ext.create('Ext.container.Container',{
            region: 'north',
            //heigth: 40,
            html: '<table style="width:100%" border=0>' +
                '<tr>' +
                '<td style="width: 34px">' +
                '<img src= "js/lib/resources/images/monitorLogoHD.png" class ="monitorLogoHD" />'+
                '</td>'+
                '<td >' +
                //'<b>' + t + '</b>' +
                '<p>' + eMessage + '</p>' +
                '</td>' +
                '<td style="width:20px" align="right">' +

                '</td>' +
                '</tr>' +
                '</table>'
        });
        var errorWindow = Ext.create('Ext.window.Window',{
            modal: true,
            title: Ext.localization.apiName+" - "+Ext.localization.msgText.errorHeader,
            layout:'border',
            bodyCls: 'jumerror',
            items:[errorMessage,errorGrid],
            width: 400,
            height: 500
        });
        return errorWindow;
    }
})