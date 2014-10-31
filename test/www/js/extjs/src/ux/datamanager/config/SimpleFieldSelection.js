/**
 * Created by Desar_6 on 26/08/2014.
 */
Ext.define('Ext.ux.datamanager.config.SimpleFieldSelection', {
    extend: 'Ext.container.Container',
    layout: {type: 'hbox', align: 'stretch'},
    xtype: 'simpleselectionfield',
    columnData: [],
    allColumnsList: [],
    selectedType: 'Source',
    unselectedType: 'Unused',
    initComponent: function () {
        var me = this;
        var columnList = me.getColumnList();
        var selectedList = me.getSelectedList();
        //me.selectedList = selectedList;
        //me.columnList = columnList;
        me.addEvents("aliasedit","datachanged");
        Ext.applyIf(me, {
            items: [
                columnList,
                {
                    /**
                     * manual column (field) selection controls  to exist in the application if they are not all required.
                     */
                    xtype: 'toolbar',
                    border: 1,
                    items: [  '->',
                        {
                            /**
                             * {Ext.button.Button} Move one to the right, move the current selected column (field)
                             * to the selected columns list.
                             */
                            iconCls: 'mpaUI-oneRight',
                            style: 'color: gray; font-size: 15px !important; ',
                            scope: me,
                            handler: function () {
                                selectedList.addRecord(columnList.getSelectedRecord(), columnList.removeSelectedRecord());

                            }
                        },
                        {
                            /**
                             * {Ext.button.Button} Move all to the right, move all the columns on the column list to the
                             * selected columns list
                             */
                            iconCls: 'mpaUI-allRight',
                            style: 'color: gray; font-size: 15px !important; ',
                            scope: me,
                            handler: function () {
                                columnList.selectAllRecords();
                                selectedList.addRecord(columnList.getSelectedRecord(), columnList.removeSelectedRecord());
                            }
                        }, '-',
                        {
                            /**
                             * {Ext.button.Button} Move one to the left, returns the current selected column (field) on the
                             * selected columns list to the table columns list.
                             */
                            iconCls: 'mpaUI-oneLeft',
                            style: 'color: gray; font-size: 15px !important;',
                            scope: me,
                            handler: function () {
                                columnList.addRecord(selectedList.getSelectedRecord(), selectedList.removeSelectedRecord());

                            }
                        },
                        {
                            /**
                             * {Ext.button.Button} Move all to the left, returns all the columns on the selected column list to the
                             * table columns list
                             */
                            iconCls: 'mpaUI-allLeft',
                            style: 'color: gray; font-size: 15px !important;',
                            scope: me,
                            handler: function () {
                                selectedList.selectAllRecords();
                                columnList.addRecord(selectedList.getSelectedRecord(), selectedList.removeSelectedRecord());
                            }
                        }, '->'],
                    vertical: true
                },
                selectedList
            ],
            /**
             * Set a table UUID to get the column list in the database schema, if the UUID is invalid it
             * returns an empty list
             * @param uuid {string} Table UUID
             * @param callback {function} optional function that is invoked after the completion of the column load and
             * the column list is passed as argument to the callback function
             */
            setTableUUID: function (uuid, callback) {
                var subCallback = function (records, operation, success) {
                    var allColumnsList = [];
                    if (success) {
                        Ext.Array.each(records, function (record) {
                            Ext.Array.push(allColumnsList, record.data)
                        });
                        me.allColumnsList = allColumnsList;
                        if (callback) callback(allColumnsList);
                    }
                };
                columnList.setUUID(uuid, subCallback);
                me.clearAll();
            },
            /**
             * return the complete list of the columns used in the list
             * @returns {array} list of columns
             */
            getAllColumnsList: function () {
                return me.allColumnsList;
            },
            setConnectionProxy: function (proxy) {
                columnList.setConnectionProxy(proxy);
            },
            clearAll: function () {
                columnList.clearData();
                selectedList.clearData();
            },
            getSerializedData: function () {
                var unselectedFields = columnList.getUnselectedFields();
                var selectedFields = selectedList.getSelectedFields();
                return Ext.Array.merge(unselectedFields, selectedFields);
            },
            isValid: function () {
                var selectedFields = selectedList.getSelectedFields();
                if (selectedFields.length > 0) {
                    var countKeys = selectedList.countKeys();
                    if (countKeys[0]>0) //PrimaryKeys counter
                        return {valid : true, msg: ''};
                    else {
                        if(countKeys[1]===selectedFields.length)
                            return {valid : true, msg: ''};
                        else
                            return {valid: false, msg: 'You need to select at least one column as primary key, or all the columns as foreign keys'};
                    }
                }else
                    return {valid : false, msg: 'You need to select at least one column as output'};

            },
            loadData: function (columns) {
                columns = columns || {};
                var unusedColumns = [], selectedColumns = [], Ex = Ext, ExArray = Ex.Array;
                ExArray.each(columns, function (column) {
                    switch(column.key){
                        case 'primary':
                            column.primaryKey=true;
                            column.foreignKey=false;
                            break;
                        case 'foreign':
                            column.primaryKey=false;
                            column.foreignKey=true;
                            break;
                        default :
                            column.primaryKey=false;
                            column.foreignKey=false;
                            break;
                    }
                    delete column.key;
                    if (column.fieldType === me.selectedType)
                        ExArray.push(selectedColumns, column);
                    if (column.fieldType === me.unselectedType)
                        ExArray.push(unusedColumns, column);
                });
                if (unusedColumns.length > 0)
                    columnList.loadData(unusedColumns);
                else
                    columnList.clearData();

                selectedList.loadData(selectedColumns);
            }
        });
        me.callParent();

    },
    getColumnList: function () {
        var me = this;
        Ext.define('ColumnListDataStoreModel', {
            extend: 'Ext.data.Model',
            fields: ['dataIndex',
                {'name': 'alias', convert: function (value, model) {
                    return value === "" ? model.get('dataIndex') : value
                }},
                'tableid',
                'type',
                'length',
                'precision',
                'scale',
                'nullable',
                {
                    name: 'editable',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                },
                {
                    name: 'primaryKey',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                },
                {
                    name: 'foreignKey',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                }
            ]
        });
        var columnStore = new Ext.create('Ext.data.Store', {
            storeId: 'ColumnStoreDataStore',
            model: 'ColumnListDataStoreModel',
            autoLoad: false,
            params: {
                requestType: 'getTable'
            },
            proxy: me.connectionProxy
        });
        var columnList = new Ext.create('Ext.grid.Panel', {
            title: Ext.localization.configTableViewNewSource.title.fieldList,
            columns: [
                {
                    text: Ext.localization.configTableViewNewSource.text.name,
                    dataIndex: 'dataIndex',
                    sortable: false,
                    hideable: false,
                    flex: 1
                }
            ],
            selType: 'cellmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            selModel: Ext.create('Ext.selection.RowModel', {
                mode: 'MULTI'
            }),
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'columnList',
                    dropGroup: 'selectedList'
                }
            },
            store: columnStore,
            width: 200,
            tbar: [
                {
                    xtype: 'container',
                    layout: {type: 'hbox', align: 'strech'},
                    items: [
                        {
                            flex: 1,
                            xtype: 'searchfield',
                            id: 'columnSearchField',
                            paramName: 'dataIndex',
                            store: columnStore
                        }
                    ],
                    width: '100%'
                }
            ],
            setConnectionProxy: function (proxy) {
                columnStore.setProxy(proxy);
            },
            setUUID: function (id, callback) {
                columnStore.params.id = id;
                if (callback)
                    columnStore.load({
                        callback: callback
                    });
                else
                    columnStore.load();
            },
            getSelectedRecord: function () {
                return this.selModel.getSelection();
            },
            isRowSelected: function () {
                return this.selModel.getSelection().length > 0
            },
            selectAllRecords: function () {
                this.selModel.selectAll();
            },
            removeSelectedRecord: function () {
                me.doRemoveSelectedRecord(columnStore, columnList);
            },
            addRecord: function (record, callback) {
                me.doAddRecord(columnStore, record, callback)
            },
            clearRecords: function () {
                columnStore.removeAll();
            },
            getCount: function () {
                return columnStore.getCount();
            },
            getUnselectedFields: function () {
                var fields = [],
                    searchField = Ext.getCmp('columnSearchField');
                searchField.setValue('');
                searchField.hasSearch = false;
                searchField.triggerCell.item(0).setDisplayed(false);
                columnStore.clearFilter();
                Ext.Array.each(columnStore.data.items, function (item, index, allitems) {
                    Ext.Array.push(fields, {
                        dataIndex: item.data.dataIndex,
                        alias: item.data.alias,
                        type: item.data.type,
                        length: item.data.length,
                        fieldType: me.unselectedType,
                        editable: false,
                        precision: item.data.precision,
                        scale: item.data.scale,
                        nullable: item.data.nullable,
                        key: 'none'
                    });
                });
                return fields;
            },
            loadData: function (data) {
                columnStore.loadData(data);
            },
            clearData: function () {
                columnStore.removeAll();
            }

        });
        columnList.on('edit', function (editor, e) {
            var merged = Ext.Array.merge(e.store.data.items, Ext.StoreManager.lookup('SelectedStoreDataStore').data.items);
            me.fireEvent("aliasedit", merged);
        });
        return columnList
    },
    getSelectedList: function () {
        var me = this;
        Ext.define('SelectedListDataStoreModel', {
            extend: 'Ext.data.Model',
            fields: ['dataIndex', 'name',
                {'name': 'alias', convert: function (value, model) {
                    return value === "" ? model.get('dataIndex') : value
                }},
                'tableid',
                'type',
                'length',
                'precision',
                'scale',
                'nullable',
                {
                    name: 'editable',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                },
                {
                    name: 'primaryKey',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                },
                {
                    name: 'foreignKey',
                    type: 'boolean',
                    convert: function (value) {
                        return value === "" ? false : value
                    }
                }]
        });
        var selectedStore = new Ext.create('Ext.data.Store', {
            storeId: 'SelectedStoreDataStore',
            model: 'SelectedListDataStoreModel',
            autoLoad: false,
            params: {
                requestType: 'getTable'
            },
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        var selectedList = new Ext.create('Ext.grid.Panel', {
            title: Ext.localization.configTableViewNewSource.title.selectedFieldList,
            columns: {
                defaults: {
                    hideable: false,
                    sortable: false,
                    flex: 1
                },
                items: [
                    {
                        text: Ext.localization.configTableViewNewSource.text.name,
                        dataIndex: 'dataIndex'
                    },
                    {
                        text: Ext.localization.configTableViewNewSource.text.aliasText,
                        dataIndex: 'alias',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false,
                            maxLength: 150
                        }
                    },
                    {
                        headerText: Ext.localization.configTableViewNewSource.text.isPrimaryKey,
                        xtype: 'checkallcolumn',
                        columnHeaderCheckbox: true,
                        store: selectedStore,
                        dataIndex: 'primaryKey',
                        //contextColumns: ['grid'],
                        listeners: {
                            'chainedcolumns': function (record, modifiedFieldNames) {
                                if (record.get('primaryKey')) {
                                    record.data['foreignKey'] = false;
                                    record.dirty = true;
                                }
                            },
                            'beforecheckchangebyheader': function (record, value) {
                                return true
                            }
                        }
                    },
                    {
                        headerText: Ext.localization.configTableViewNewSource.text.isForeignKey,
                        xtype: 'checkallcolumn',
                        columnHeaderCheckbox: true,
                        store: selectedStore,
                        dataIndex: 'foreignKey',
                        listeners: {
                            'chainedcolumns': function (record, modifiedFieldNames) {
                                if (record.get('foreignKey')) {
                                    record.data['primaryKey'] = false;
                                    record.dirty = true;
                                }
                            },
                            'beforecheckchangebyheader': function (record, value) {
                                return true
                            }
                        }
                    },
                    {
                        headerText: Ext.localization.configTableViewNewSource.text.isEditable,
                        xtype: 'checkallcolumn',
                        columnHeaderCheckbox: true,
                        store: selectedStore,
                        dataIndex: 'editable',
                        listeners: {
                            'beforecheckchangebyheader': function (record, value) {
                                return true
                            }
                        }
                    }
                ]
            },
            selType: 'cellmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'selectedList',
                    dropGroup: 'columnList'
                }
            },
            store: selectedStore,
            flex: 3,
            tbar: [
                {
                    xtype: 'container',
                    layout: {type: 'hbox', align: 'strech'},
                    items: [
                        {
                            flex: 1,
                            xtype: 'searchfield',
                            id: 'selectedSearchField',
                            paramName: 'dataIndex',
                            store: selectedStore
                        }
                    ],
                    width: '100%'
                }
            ],
            selModel: Ext.create('Ext.selection.RowModel', {
                mode: 'MULTI'
            }),
            getSelectedRecord: function () {
                return this.selModel.getSelection();
            },
            isRowSelected: function () {
                return this.selModel.getSelection().length > 0
            },
            selectAllRecords: function () {
                this.selModel.selectAll();
            },
            removeSelectedRecord: function () {
                me.doRemoveSelectedRecord(selectedStore, selectedList);
            },
            addRecord: function (record, callback) {
                me.doAddRecord(selectedStore, record, callback)
            },
            clearRecords: function () {
                selectedStore.removeAll();
            },
            getCount: function () {
                return selectedStore.getCount();
            },
            getSelectedFields: function () {
                var fields = [],
                    searchField = Ext.getCmp('selectedSearchField');
                searchField.setValue('');
                searchField.hasSearch = false;
                searchField.triggerCell.item(0).setDisplayed(false);
                selectedStore.clearFilter();
                Ext.Array.each(selectedStore.data.items, function (item, index, allitems) {
                    Ext.Array.push(fields, {
                        dataIndex: item.data.dataIndex,
                        alias: item.data.alias,
                        type: item.data.type,
                        precision: item.data.precision,
                        scale: item.data.scale,
                        length: item.data.length,
                        fieldType: me.selectedType,
                        editable: item.data.editable,
                        nullable: item.data.nullable,
                        key: item.data.primaryKey? 'primary': (item.data.foreignKey? 'foreign': 'none')

                    });
                });
                return fields;
            },
            getSelectedFieldToPreviewWindow: function () {
                var fields = [];
                Ext.Array.each(selectedStore.data.items, function (item) {
                    Ext.Array.push(fields, {
                        name: item.data.dataIndex,
                        alias: item.data.alias,
                        type: item.data.type,
                        length: item.data.length
                    });
                });
                return fields;
            },
            countKeys: function(){
                var primaryKeys = 0, foreignKeys = 0;
                Ext.Array.each(selectedStore.data.items, function (item) {
                    if (item.get('primaryKey'))
                        primaryKeys++;
                    if (item.get('foreignKey'))
                        foreignKeys ++;
                });
                return [primaryKeys,foreignKeys];
            },
            loadData: function (data) {
                selectedStore.loadData(data);
            },
            clearData: function () {
                selectedStore.removeAll();
            }
        });
        selectedList.on('edit', function (editor, e) {
            var merged = Ext.Array.merge(Ext.StoreManager.lookup('ColumnStoreDataStore').data.items, e.store.data.items);
            var serializedData= selectedList.getSelectedFields();
            me.fireEvent("aliasedit", merged,serializedData);
        });
        selectedStore.on("datachanged",function(){
            var serializedData = selectedList.getSelectedFields();
            me.fireEvent("datachanged", serializedData);
        });
        return selectedList
    },
    doRemoveSelectedRecord: function (store, datatable) {
        try {
            if (datatable.isRowSelected()) {
                store.remove(datatable.getSelectedRecord());
                datatable.selModel.select(0);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },

    doAddRecord: function (dataStore, record, callback) {
        dataStore.add(record);
        if (callback) {
            if (typeof callback === 'function')
                callback();
        }
    }
});