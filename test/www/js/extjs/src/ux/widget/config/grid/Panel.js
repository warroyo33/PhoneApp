/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 10/10/13
 * Time: 02:23 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.config.grid.Panel',{
    extend: 'Ext.window.Window',
    //alias: 'widget.gridpanelconfigdialog',
    frame: true,
    title: 'Grid Panel Configuration Dialog',
    width: 500,
    height: 500,
    layout: 'fit',
    closeAction: 'destroy',
    initComponent: function(){
        var me = this;
        var sourceCombo = me.getSourceCombo();
        /**
         * Popup button that clear the selection of the connectionCombo and restart the configuration process
         * @type {Ext.button.Button}
         */
        var clearSourceButton = Ext.create('Ext.button.Button', {
            iconCls: 'icon-filtergrid',
            tooltip: 'Clear Selection',
            style: 'background: transparent; ',
            scope: me,
            hidden: true,
            width: 22,
            handler: function () {
                Ext.Msg.confirm('Monitor Plus Architect', 'You are attempting to clear the current selection, this action will permanently delete your configuration. Are you sure you want to continue?'
                    , function (response) {
                        if (response === "yes") {
                            sourceCombo.clearValue();
                            sourceCombo.setDisabled(false);
                            clearSourceButton.setVisible(false);
                            me.clearCanvas();
                        } else {
                            return;
                        }
                    })
            }
        });
        /**
         * When the connectionCombo and the typeCombo, gets value the dialog show the configuration dialog for the
         * selection given.
         * @param scope {Ext.window.Window} this dialog
         * @param connectionCombo {Ext.form.field.ComboBox} Data Connection ComboBox
         * @param typeCombo {Ext.form.field.ComboBox} Query Type ComboBox
         */
        me.initConfigPanel= function(args){
            //var me = scope;
            //var value = sourceCombo.getSelectedValue();
            var columnsGrid = me.getColumnsGrid(args);
            me.columnsGrid =columnsGrid
            var bodyPanel = Ext.getCmp('gridConfigDialogCanvas');
            me.clearCanvas();
            bodyPanel.add(columnsGrid);
            bodyPanel.doLayout();

        };
        sourceCombo.on("select", function (combo, records, eOpts) {
            combo.setDisabled(true);
            clearSourceButton.setVisible(true);
            me.initConfigPanel({columns: records[0].data.columns});
        });

        me.acceptConfig= function () {
            var form = Ext.getCmp('gridConfigDialogFormPanel').getForm();
            if (form.isValid()) {
                var serializedData = me.columnsGrid.getSerializedData()

                if (!me.myConfig){
                    var config = {
                        xtype: 'customgridpanel',
                        border : true,
                        title: sourceCombo.getValue().toString().toUpperCase(),
                        sourceConfig:{
                            name:sourceCombo.getValue(),
                            columns: Ext.JSON.decode(serializedData.data),
                            serializedData:serializedData
                        },
                        width: 400,
                        height: 300,
                        pageSize: 10,
                        viewConfig : {
                            forceFit : true
                        }
                    };
                    me.close();
                    me.callback.call(me, config);
                }else{
                    me.fireEvent("confirmchange");
                    me.myConfig.title= sourceCombo.getValue().toString().toUpperCase();
                    me.myConfig.sourceConfig={
                        name:sourceCombo.getValue(),
                        columns: Ext.JSON.decode(serializedData.data),
                        serializedData:serializedData
                    };
                    me.myConfig.width= 400;
                    me.myConfig.height= 300;
                    me.myConfig.pageSize= 10;
                    me.close();
                    me.callback.call(me,me.myConfig.initialConfig);
                }
            }
        };

        Ext.applyIf(me,{

            items:[{
                xtype: 'form',
                frame: true,
                id: 'gridConfigDialogFormPanel',
                items:[{
                    xtype: 'container',
                    layout: 'anchor',
                    region: 'north',
                    height: 25,
                    items: [{
                        xtype: 'container',
                        frame: true,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items:[{
                            xtype:sourceCombo
                        },{
                            xtype:clearSourceButton
                        }
                        ]
                    }]
                },{
                    xtype: 'container',
                    id: 'gridConfigDialogCanvas',
                    layout: 'fit',
                    region: 'center',
                    frame : true
                }]
            }],
            buttons: [{
                text:'OK',
                scope: me,
                handler: this.acceptConfig
            },{
                text:'CANCEL',
                handler: function(){
                    me.close();
                }
            }]
        })
        me.callParent(arguments);
        if (me.myConfig){
            var model = me.myConfig;
            sourceCombo.clearValue();
            sourceCombo.select(sourceCombo.getStore().findRecord('name',model.sourceConfig.name,0,false,false,true));
            sourceCombo.setDisabled(true);
            clearSourceButton.setVisible(true);
            me.initConfigPanel(model.sourceConfig.serializedData);
        }
    },
    getSourceCombo: function(){
        var source = Ext.StoreManager.lookup('DataSourceStore');
        var sourceCombo = new Ext.create('Ext.form.field.ComboBox',{
            store: source,
            editable: false,
            allowBlank: false,
            fieldLabel: 'DataSource',
            queryMode: 'local',
            flex: 1,
            displayField: 'name',
            valueField: 'name'
        });
        return sourceCombo;
    },
    getColumnsGrid: function (args) {

        /**
         * in this store we'll save the configuration of the filter criteria for this table/view
         * @type {Ext.create} Ext.data.Store
         */
        var columnsStore = new Ext.create("Ext.data.Store", {
            fields: [
                'text',
                'dataIndex',
                'flex'
            ],

            data: args.data ? (Ext.JSON.decode(args.data).length>0 ? Ext.JSON.decode(args.data):[
                {text: 'column',flex:1}
            ]):[
                {text: 'column',flex:1}
            ],
            proxy: {
                type: 'memory',
                reader: 'json'
            }
        })

        var columnsGrid = Ext.create("Ext.grid.Panel", {
            store: columnsStore,
            selType: 'rowmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            tbar: [
                {
                    text: 'Add',
                    handler: function () {
                        columnsStore.add({text:'column',flex:1});
                    }

                },
                {
                    text: 'Remove',
                    handler: function () {
                        var selection= columnsGrid.selModel.getSelection()
                        if(selection.length>0){
                            if(columnsStore.data.items.length===1){
                                columnsStore.remove(selection);
                                columnsStore.add({text:'column',flex:1});
                            }else
                                columnsStore.remove(selection);
                        }else
                            Ext.Msg.alert("MonitorPlus Architect", "Please select a row to remove first.")
                    }

                }
            ],
            columns: [
                {
                    text: 'Text',
                    dataIndex: 'text',
                    sortable: false,
                    draggable: false,
                    flex: 3 ,
                    editor: {
                        xtype: 'textfield'
                    }
                },
                {
                    text: 'DataIndex',
                    dataIndex: 'dataIndex',
                    sortable: false,
                    draggable: false,
                    flex: 2,
                    editor: {
                        store: Ext.create("Ext.data.Store", {
                            fields: [
                                'name',
                                'length',
                                'type'
                            ],
                            data: args.columns ? (typeof args.columns==='string' ? Ext.JSON.decode(args.columns):args.columns)  : [
                                {name: '', name: ''}
                            ],
                            proxy: {
                                type: 'memory',
                                reader: 'json'
                            }
                        }),
                        editable: false,
                        displayField: 'name',
                        valueField: 'name',
                        xtype: 'combobox'
                    }
                },
                {
                    text: 'Flex',
                    dataIndex: 'flex',
                    sortable: false,
                    draggable: false,
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        maxValue: 20,
                        minValue: 1
                    }
                }
            ],
            getSerializedData: function(){
                var dataArray=[]

                Ext.Array.each(columnsStore.data.items,function(item){
                    if(item.data.text && item.data.dataIndex)
                        Ext.Array.push(dataArray,item.data);
                })
                var returnArray= {columns: args.columns, data:Ext.JSON.encode(dataArray)};
                return returnArray;
            }
        });

        return columnsGrid;
    },
    clearCanvas: function(){
        Ext.getCmp('gridConfigDialogCanvas').removeAll();
    }
})