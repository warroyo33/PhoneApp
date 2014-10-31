/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 10/10/13
 * Time: 02:23 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.config.batch.DataDisplay',{
    extend: 'Ext.window.Window',
    //alias: 'widget.batchdisplayconfigdialog',
    frame: true,
    title: 'Batch Display Configuration Dialog',
    width: 500,
    height: 80,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',
    initComponent: function(){
        var me = this;
        me.listViewAction= function(){
            var model = me.model;
            var records = me.records;

            if(model){
                var config = {
                    xtype: 'customfieldset',
                    width:'500',
                    height:'400',
                    title: model.get('storeId').toUpperCase(),
                    items: []
                };
                if(model.get('source')){
                    Ext.Array.each(model.get('source').columns, function(column){
                        Ext.Array.push(config.items,{
                            xtype: 'customtextfield',
                            //value:'test',
                            configData:{
                                sourceConfig:{
                                    name: model.get('storeId'),
                                    dataIndex: column.dataIndex,
                                    field: column.name,
                                    type: column.type
                                }
                            }

                        });
                    });
                }else{
                    if(model.get('parameters')){
                        var name = model.get('name');
                        var parameters = model.get('parameters');
                        Ext.Array.each(parameters.data.items, function(parameter){
                            Ext.Array.push(config.items,{
                                xtype: 'customtextfield',
                                //value:'test',
                                configData:{
                                    sourceConfig:{
                                        name: name,
                                        field: parameter.get('text'),
                                        dataIndex: parameter.get('dataIndex'),
                                        type: parameter.get('type')
                                    }
                                }

                            });
                        });
                    }
                }

                me.close();
                me.callback.call(me, config);
            } else if(records){
                //console.log(records)
                var lastGroup="";
                var groupList=[];
                var groupCounter=-1;
                var currentCounter= -1;
                Ext.Array.each(records.records, function(record){
                    if (record.data.type!=="ALL"){
                        if (record.data.storeId!==lastGroup){
                            currentCounter=-1;
                            if (groupList.length>0){
                                var tempCurrentCounter=0;
                                Ext.Array.each(groupList,function(verify){
                                    if (record.data.storeId.toUpperCase()===verify.title){
                                        currentCounter= tempCurrentCounter
                                    }
                                    tempCurrentCounter ++;
                                })
                                if (currentCounter ===-1){
                                    var config = {
                                        xtype: 'customfieldset',
                                        width:'500',
                                        height:'400',
                                        title: record.data.storeId.toUpperCase(),
                                        items: []
                                    }
                                    lastGroup=record.data.storeId;
                                    Ext.Array.push(groupList,config);
                                    groupCounter=groupCounter+1;
                                    currentCounter = groupCounter;
                                }
                            }else{
                                var config = {
                                    xtype: 'customfieldset',
                                    width:'500',
                                    height:'400',
                                    title: record.data.storeId.toUpperCase(),
                                    items: []
                                }
                                lastGroup=record.data.storeId;
                                Ext.Array.push(groupList,config);
                                groupCounter=groupCounter+1;
                                currentCounter = groupCounter;
                            }
                        }
                        Ext.Array.push(groupList[currentCounter].items,record.data.config)
                    }
                });
                if (groupCounter>0){
                    var config = {
                        xtype: 'custompanel',
                        width:'600',
                        height:'800',
                        title: 'data',
                        items: groupList
                    }
                    me.close();
                    me.callback.call(me, config);
                }else if (groupCounter===0){
                    me.close();
                    me.callback.call(me, groupList[0]);
                }
            }
        };

        me.gridViewAction= function(){
            var model = me.model;
            var records = me.records;

            if(model){

                var gridColumns =[];
                Ext.Array.each(model.get('source').columns, function(column){
                    Ext.Array.push(gridColumns,{
                        text:column.name,
                        dataIndex:column.name,
                        flex: 1
                    })
                });

                var config = {
                    xtype: 'customgridpanel',
                    width:'500',
                    height:'400',
                    title: model.get('storeId').toUpperCase(),
                    /*columns: model.get('source').columns,
                    store: model.stores[0]
                                               */
                    configData :       {
                        name : model.get('storeId'),
                        columns : gridColumns,
                        serializedData : {
                            columns :model.get('source').columns,
                            data : Ext.JSON.encode(gridColumns)
                        }
                    }
                }
                me.close();
                me.callback.call(me, config);
            } else if(records){
                //console.log(records)
                var gridColumns =[];
                var lastGroup="";
                var groupList=[];
                var groupCounter=-1;
                var currentCounter= -1;
                Ext.Array.each(records.records, function(record){
                    if (record.data.type!=="ALL"){
                        if (record.data.storeId!==lastGroup){
                            currentCounter=-1;
                            if (groupList.length>0){
                                var tempCurrentCounter=0;
                                Ext.Array.each(groupList,function(verify){
                                    if (record.data.storeId.toUpperCase()===verify.title){
                                        currentCounter= tempCurrentCounter
                                    }
                                    tempCurrentCounter ++;
                                })
                                if (currentCounter ===-1){

                                    /*Ext.Array.each(record.data.source.columns, function(column){
                                        Ext.Array.push(gridColumns,{
                                            text:column.name,
                                            dataIndex:column.name,
                                            flex: 1
                                        })
                                    });  */
                                    var config = {
                                        xtype: 'customgridpanel',
                                        width:'500',
                                        height:'400',
                                        title: record.data.storeId.toUpperCase(),
                                        configData :       {
                                            name : record.data.storeId,
                                            columns : [],
                                            serializedData : {
                                                columns :record.data.source.columns,
                                                data : ""
                                            }
                                        }
                                    };
                                    lastGroup=record.data.storeId;
                                    Ext.Array.push(groupList,config);
                                    groupCounter=groupCounter+1;
                                    currentCounter = groupCounter;
                                }
                            }else{
                                var config = {
                                    xtype: 'customgridpanel',
                                    width:'500',
                                    height:'400',
                                    title: record.data.storeId.toUpperCase(),
                                    configData :       {
                                        name : record.data.storeId,
                                        columns : [],
                                        serializedData : {
                                            columns :record.data.source.columns,
                                            data : ""
                                        }
                                    }
                                }
                                lastGroup=record.data.storeId;
                                Ext.Array.push(groupList,config);
                                groupCounter=groupCounter+1;
                                currentCounter = groupCounter;
                            }
                        }
//                        Ext.Array.push(groupList[currentCounter].sourceConfig.serializedData.columns,record.data.config.sourceConfig)
                        Ext.Array.push(groupList[currentCounter].sourceConfig.columns,{
                            text:record.data.config.sourceConfig.field,
                            dataIndex:record.data.config.sourceConfig.field,
                            flex: 1
                        });
                        groupList[currentCounter].sourceConfig.serializedData.data = Ext.JSON.encode(groupList[currentCounter].sourceConfig.columns)

                    }
                });
                if (groupCounter>0){
                    var config = {
                        xtype: 'custompanel',
                        width:'600',
                        height:'800',
                        title: 'data',
                        items: groupList
                    };
                    me.close();
                    me.callback.call(me, config);
                }else if (groupCounter===0){
                    me.close();
                    me.callback.call(me, groupList[0]);
                }
            }
        };

        Ext.applyIf(me, {
            items: [{
                xtype: 'container',
                layout: {type: 'hbox', align: 'stretch'},
                items:[{
                    xtype: 'container',
                    flex:1,
                    items:{
                        xtype: 'button',
                        height:56,
                        width:56,
                        iconCls: 'tool-fieldset',
                        text: 'List View',
                        iconAlign: 'top'   ,
                        handler: me.listViewAction
                    }
                },{
                    xtype: 'container',
                    flex:1,
                    items:{
                        xtype: 'button',
                        height:56,
                        width:56,
                        iconCls: 'tool-simplegrid',
                        iconAlign: 'top',
                        text: 'Grid View',
                        handler: me.gridViewAction
                    }
                }]
            }]
        })
        me.callParent(arguments);
    }
})