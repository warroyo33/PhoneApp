/**
 * Created by Desar_6 on 26/02/14.
 */
Ext.define('Ext.ux.widget.grid.CriteriaPanel',{
    extend: 'Ext.grid.Panel',
    //mixins: ['js.mpa.lib.CriteriaUtil'],
    xtype:'wheregrid',
   // id: 'whereGrid',
    initComponent: function(){
        var me = this;
        var args = me.args,
            Ex = Ext,
            ExArray= Ex.Array,
            ExJSON = Ex.JSON,
            ELocale= Ex.localization,
            fieldComboStoreId= Ext.id();

        args = me.initArguments(args,fieldComboStoreId);
        var fieldComboStore =  Ex.create("Ext.data.Store", {
            storeId: fieldComboStoreId,
            fields: [
                'dataIndex',
                'alias',
                'length',
                'tableid',
                'type'
            ],
            data: typeof args.fieldComboData === 'string' ? ExJSON.decode(args.fieldComboData) : args.fieldComboData,
            proxy: {
                type: 'memory',
                reader: 'json'
            }
        });

        if (typeof args.data ==="string")
            args.data = ExJSON.decode (args.data);
        ExArray.each(args.data, function(item){
            item.fieldCombo = fieldComboStoreId;
        });


        /**
         * in this store we'll save the configuration of the filter criteria for this table/view
         * @type {Object} Ext.data.Store
         */
        var whereStore = new Ex.create('Ext.ux.widget.grid.store.CriteriaStore', {
            data: args.data,
            fieldComboStore: fieldComboStoreId
        });


        var callback= function(){
            Ext.Array.each(whereStore.data.items,function(model){
                var fieldRecord = fieldComboStore.findRecord ('dataIndex',model.get('field'),0,false,false,true);
                if (fieldRecord){
                    var alias = fieldRecord.get('alias');
                    model.data.alias=alias
                }
            });

        };
        fieldComboStore.on('datachanged',callback);
        /**
         * checks whether the configuration of the brackets is valid or not, and if the number of open parentheses
         * corresponds to the number of closing parentheses
         * @returns {boolean}
         */
        me.isValid = function(){
            var openParenthesis = 0, closedParenthesis= 0;
            Ex.Array.each(whereStore.data.items, function(record){
                if (record.get('connector')!=="" && record.get('field')!=="" && record.get('operator')!=="" && record.get('value')!==""){
                    if (record.get('parenthesisI'))
                        openParenthesis++;
                    if (record.get('parenthesisF'))
                        closedParenthesis++;
                }
            });
            return (openParenthesis-closedParenthesis) === 0;
        };

        var whereGridCellEditing = Ex.create('Ext.ux.widget.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        whereGridCellEditing.on('edit',function( editor, e){
            if (e.field==='field'){
                if(e.value!== e.originalValue){
                    e.record.set('value','');
                }
                e.record.set('alias', e.column.getEditor().getDisplayValue());
            }
        });
        whereGridCellEditing.on('displayadvanceddialog',function( rec, parameters){
            Ex.create('MPA.vgiew.ux.datamanager.config.ValueConfigurationDialog', {
                gridRecord: rec,
                actualConfig: parameters
            }).show();
        });
        var getOpenedParenthesisRemaining = function (rowIndex ){
            var openParenthesisAbove = 0, closedParenthesisAbove= 0, closedParenthesisBelow = 0;
            Ex.Array.each(whereStore.data.items, function(record,index){
                if (record.get('parenthesisI') && index <= rowIndex){
                    openParenthesisAbove++;
                }
                if (record.get('parenthesisF')){
                    if(index <= rowIndex){
                        closedParenthesisAbove++;
                    }else{
                        closedParenthesisBelow++;
                    }
                }
            });
            return openParenthesisAbove-closedParenthesisAbove;
        };
        var getClosedParenthesisRemaining = function (rowIndex){
            var lastClosedParenthesisRow = -1, openParenthesisAbove = 0, closedParenthesisAbove= 0, openParenthesisBelow= 0,closedParenthesisBelow = 0 ;
            Ex.Array.each(whereStore.data.items, function(record,index){
                if (record.get('parenthesisF')){
                    if (index <= rowIndex){
                        closedParenthesisAbove++;
                    }else{
                        closedParenthesisBelow++;
                    }
                    lastClosedParenthesisRow = index;
                }
            });
            if (lastClosedParenthesisRow>-1){
                if (rowIndex <= lastClosedParenthesisRow){
                    Ex.Array.each(whereStore.data.items, function(record,index){
                        if ( index <= lastClosedParenthesisRow){
                            if (record.get('parenthesisI') ){
                                if (index < rowIndex){
                                    openParenthesisAbove++;
                                }
                                if (index > rowIndex){
                                    openParenthesisBelow++;
                                }
                            }
                        }
                    });
                    return openParenthesisAbove>=closedParenthesisAbove? (openParenthesisAbove-closedParenthesisAbove)+(openParenthesisBelow-closedParenthesisBelow):-1;
                }else{
                    return 1;
                }
            }else{
                return 1;
            }

        };
        var onParenthesisFClick= function (record, value,rowIndex ) {
            if (!record.get('parenthesisF')){
                if (getOpenedParenthesisRemaining(rowIndex )){
                    record.set('parenthesisF', value ? 0 : 1);
                    this.text = value ? ')' : '';
                    this.tooltip = value ? Ext.localization.buttons.remove : Ext.localization.buttons._add;
                }else{

                }
            }else{
                record.set('parenthesisF', value ? 0 : 1);
                this.text = value ? ')' : '';
                this.tooltip = value ? Ext.localization.buttons.remove : Ext.localization.buttons._add;
            }

        };
        var onParenthesisIClick= function (record, value,rowIndex ) {
            if (record.get('parenthesisI')){
                if (getClosedParenthesisRemaining(rowIndex )>=0){
                    record.set('parenthesisI', value ? 0 : 1);
                    this.text = value ? '(' : '';
                    this.tooltip = value ? Ext.localization.buttons.remove : Ext.localization.buttons._add;
                }else{

                }
            }else{
                record.set('parenthesisI', value ? 0 : 1);
                this.text = value ? '(' : '';
                this.tooltip = value ? Ext.localization.buttons.remove : Ext.localization.buttons._add;
            }


        };
        var fieldComboBox = Ex.create('Ext.form.ComboBox',{
                store: fieldComboStore,
                displayField: 'alias',
                valueField: 'dataIndex',
                //xtype: 'combobox',
                disabled: args.gridColumnsConfig.field.disabled,
                queryMode: args.gridColumnsConfig.field.queryMode,
                forceSelection: args.gridColumnsConfig.field.forceSelection
            });
        me.updateFieldComboBox = function(data){
            fieldComboBox.store.loadData(data);
            me.getView().refresh();
            console.log(me.getSerializedData());
        };
        Ex.applyIf(me,{
            store: whereStore,
            selType: 'cellmodel',
            listeners: {
                'validateedit': function (editor, e) {
                    if (args.externalValue){
                        if (e.field === 'value') {
                            if (!me.validateValueExpression()) {
                                whereGridCellEditing.startEdit(e.record, e.field);
                            }
                        }
                    }
                }
            },
            plugins: [
                whereGridCellEditing
            ],
            tbar: [
                {
                    iconCls: 'mpaUI-addStroke',
                    style: 'color: gray; font-size: 16px !important; font-weight: bold; ',
                    scope: me,
                    hidden: !args.buttons._add,
                    //iconCls: 'icon-whereGridAdd',
                    handler: function () {
                        whereStore.add({"connector": 'AND', "operator": '=', "fieldCombo": fieldComboStoreId});
                    }

                },
                {
                    iconCls: 'mpaUI-minusStroke',
                    style: 'color: gray; font-size: 16px !important; font-weight: bold;',
                    scope: me,
                    hidden: !args.buttons._delete,
                    handler: function () {
                        var selection = me.selModel.getSelection();
                        if (selection.length > 0) {
                            if (whereStore.data.items.length === 1) {
                                whereStore.remove(selection);
                                whereStore.add({"connector": 'AND'});
                            } else
                                whereStore.remove(selection);
                            me.view.refresh();
                        } else
                            Ex.Msg.alert(ELocale.apiName, ELocale.criteriaPanel.msgText.selectRowToDeleteFirst);
                    }

                }
            ],
            columns: [
                {
                    text: args.gridColumnsConfig.connector.text,
                    hidden: args.gridColumnsConfig.connector.hidden,
                    editable : args.gridColumnsConfig.connector.editable,
                    dataIndex: 'connector',
                    sortable: false,
                    menuDisabled : true,
                    draggable: false,
                    width: 58,
                    editor: {
                        store: ['AND', 'OR'],
                        editable: false,
                        xtype: 'combobox'
                    },
                    renderer:function(value,metadata,record,rowIndex){
                        if (rowIndex === 0)
                            return "";
                        else
                            return value;
                    }
                },{

                    text: args.gridColumnsConfig.parenthesisI.text,
                    hidden: args.gridColumnsConfig.parenthesisI.hidden,
                    editable : args.gridColumnsConfig.parenthesisI.editable,
                    dataIndex: 'parenthesisI',
                    sortable: false,
                    draggable: false,
                    menuDisabled : true,
                    width: 24,
                    renderer: function (value, metadata, record, rowIndex) {
                        var id = Ext.id();
                        Ex.defer(function (id, record) {
                            if (Ex.getDom(id)) {
                                var container = Ex.create('Ext.container.Container', {
                                    renderTo: id
                                });
                                var button = Ex.create("Ext.button.Button", {
                                    width: 8,
                                    height: 13,
                                    //ui: 'plain',
                                    //style:'background-color:red',
                                    text: value ? '(' : '',
                                    tooltip: value ? Ext.localization.buttons.remove : Ext.localization.buttons._add,
                                    handler: function () {
                                        onParenthesisIClick(record,value,rowIndex);
                                    },
                                    listeners: {
                                        'added': function (button) {
                                            if (Ex.isIE10m) {
                                                button.width = 15;
                                                button.height = 20;
                                            } else
                                                button.ui = 'plain'
                                        }
                                    }

                                });
                                container.add(button);
                            }
                        }, 20, this, [id, record]);
                        return '<div id="' + id + '"></div>';
                    }
                },
                {
                    text: args.gridColumnsConfig.field.text,
                    hidden: args.gridColumnsConfig.field.hidden,
                    editable : args.gridColumnsConfig.field.editable,
                    dataIndex: 'field',
                    sortable: false,
                    menuDisabled : true,
                    draggable: false,
                    flex: 3,
                    editor: {
                        xtype:fieldComboBox
                    },
                    renderer:function(value,metadata,record){
                        if (record.get('alias'))
                            return record.get('alias');
                        else
                            return value
                    }
                },
                {
                    text: args.gridColumnsConfig.operator.text,
                    hidden: args.gridColumnsConfig.operator.hidden,
                    editable : args.gridColumnsConfig.operator.editable,
                    dataIndex: 'operator',
                    sortable: false,
                    menuDisabled : true,
                    draggable: false,
                    width: 57,
                    editor: {
                        store: ['=', '<', '>', '<>', '<=', '>=', 'LIKE', 'NOT LIKE'],
                        editable: false,
                        xtype: 'combobox'
                    }
                },
                {
                    text: ELocale.criteriaPanel.column.config,
                    menuDisabled : true,
                    columns: [{
                        text: args.gridColumnsConfig.value.text,
                        hidden: args.gridColumnsConfig.value.hidden,
                        editable : args.gridColumnsConfig.value.editable,
                        dataIndex: 'value',
                        sortable: false,
                        draggable: false,
                        width: 168,
                        menuDisabled : true,
                        editor: {
                            xtype: 'textfield'
                        }
                    },
                        {
                            xtype: 'actioncolumn',
                            width: 31,
                            text: ELocale.criteriaPanel.column.edit,
                            menuDisabled : true,
                            hidden: args.gridColumnsConfig.editValueColumn.hidden,
                            //hidden: args.complete? !args.complete: true,
                            iconCls: 'mpaUI-pencil3',
                            altText: '...',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                if (!rec.get('value')) {
                                    if (!rec.get('field')) {
                                        Ex.Msg.alert(ELocale.apiName, ELocale.criteriaPanel.msgText.selectFieldValueFirst);
                                        return false;
                                    } else {
                                        Ex.create('MPA.view.ux.datamanager.config.ValueConfigurationDialog', {
                                            gridRecord: rec
                                        }).show();
                                        return true;
                                    }
                                } else {
                                    if (typeof rec.get('value') ==="string"){
                                        if (rec.get('value').indexOf('{{') !== -1 && rec.get('value').indexOf('}}') !== -1) {
                                            var parameters,
                                                value = rec.get('value').replace('{{', '').replace('}}', '');
                                            parameters = value.split('.');
                                            if (parameters.length === 3) {
                                                if (parameters[0].trim() === "Parameter" || parameters[0].trim() === "DataSource" || parameters[0].trim() === "Variable" || parameters[0].trim() === 'Constant') {
                                                    var fieldDataStoreName = parameters[0].toString() + 'DisplayStore',
                                                        fieldDataStore = Ext.StoreManager.lookup(fieldDataStoreName),
                                                        actualValueInDisplayStore = fieldDataStore.query('dataIndex', parameters[2].toString(), false, false, true);
                                                    if (actualValueInDisplayStore.length) {
                                                        Ext.create('MPA.view.ux.datamanager.config.ValueConfigurationDialog', {
                                                            gridRecord: rec,
                                                            actualConfig: parameters
                                                        }).show();
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                            }
                                            return false;
                                        } else {
                                            Ex.create('MPA.view.ux.datamanager.config.ValueConfigurationDialog', {
                                                gridRecord: rec
                                            }).show();
                                            return true;
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 31,
                            text: ELocale.criteriaPanel.column._delete,
                            menuDisabled : true,
                            hidden: args.gridColumnsConfig.deleteValueColumn.hidden,
                            //hidden: args.complete? !args.complete: true,
                            iconCls: 'mpaUI-deleteStroke',
                            altText: '...',
                            iconStyle: 'color: rgb(228, 99, 99); ',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                rec.set('value','');
                            }
                        }]
                },

                {
                    text: args.gridColumnsConfig.parenthesisF.text,
                    hidden: args.gridColumnsConfig.parenthesisF.hidden,
                    editable : args.gridColumnsConfig.parenthesisF.editable,
                    menuDisabled : true,
                    dataIndex: 'parenthesisF',
                    sortable: false,
                    draggable: false,
                    width: 24,
                    renderer: function (value, metadata, record, rowIndex) {
                        var id = Ext.id();
                        Ex.defer(function (id, record) {
                            if (Ext.getDom(id)) {
                                var container = Ex.create('Ext.container.Container', {
                                    renderTo: id
                                });
                                var button = Ex.create("Ext.button.Button", {
                                    width: 8,
                                    height: 13,
                                    //ui: 'plain',
                                    text: value ? ')' : '',
                                    tooltip: value ? Ext.localization.buttons.remove : Ext.localization.buttons._add,
                                    handler: function () {
                                        onParenthesisFClick(record,value,rowIndex);
                                    },
                                    listeners: {
                                        'added': function (button) {
                                            if (Ex.isIE10m) {
                                                button.width = 15;
                                                button.height = 20;
                                            } else
                                                button.ui = 'plain'
                                        }
                                    }
                                });
                                container.add(button);
                            }
                        }, 20, this, [id, record]);
                        return '<div id="' + id + '"></div>';
                    }
                }
            ],
            getSerializedData: function () {
                var dataArray = [];
                var rowCount = 0;
                ExArray.each(whereStore.data.items, function (item) {

                    if (item.data.connector && item.data.field && item.data.operator && item.data.value){

                        item.data.criteriaIndex=rowCount;
                        ExArray.push(dataArray, item.data);
                        rowCount++;
                    }

                });
                console.log(dataArray);
                return { data: dataArray};
            },
            reconfigureFieldComboData: function(fieldComboData){
                me.updateFieldComboBox(typeof fieldComboData === 'string' ? ExJSON.decode(fieldComboData) : fieldComboData);
                whereStore.removeAll();
            },
            setSerializedData: function(serialData){
                serialData = typeof serialData==="string"? Ext.JSON.decode(serialData): serialData
                me.updateFieldComboBox(typeof serialData.fieldComboData === 'string' ? ExJSON.decode(serialData.fieldComboData) : serialData.fieldComboData);
                whereStore.removeAll();
                var criteriaData = serialData.data;
                whereStore.loadData(typeof  criteriaData==="string"?Ext.JSON.decode(criteriaData):criteriaData);
            }
        });
        me.callParent(arguments);
    },
    validateValueExpression: function () {
        var me = this,
            Ex= Ext,
            ExLocale = Ex.localization;
        var field = me.columns[2].getEditor().value,
            value = me.columns[4].getEditor().value,
            parameters;
        if (value && field) {
            var fieldStore = me.columns[2].getEditor().store,
                fieldType = fieldStore.query('dataIndex', field, false, false, true).items[0].get('type');
            if (value.indexOf('{{') !== -1 && value.indexOf('}}') !== -1) {
                value = value.replace('{{', '').replace('}}', '');
                parameters = value.split('.');
                if (parameters.length === 3) {
                    if (parameters[0].trim() === "Parameter" || parameters[0].trim() === "DataSource" || parameters[0].trim() === "Variable" || parameters[0].trim() === 'Constant') {
                        var fieldDataStoreName = parameters[0].toString() + 'DisplayStore',
                            fieldDataStore = Ext.StoreManager.lookup(fieldDataStoreName),
                            actualValueInDisplayStore = fieldDataStore.query('dataIndex', parameters[2].toString(), false, false, true);
                        if (actualValueInDisplayStore.length) {
                            var actualValueType = actualValueInDisplayStore.items[0].get('type');
                            if (actualValueType !== fieldType) {
                                Ex.Msg.alert(ExLocale.apiName, ExLocale.criteriaPanel.validateValueExpression.typeMismatch);
                                return false;
                            }
                        } else {
                            Ex.Msg.alert(ExLocale.apiName,  ExLocale.criteriaPanel.validateValueExpression.valueDoesNotExist(parameters[0].toString()));
                            return false;
                        }
                    } else {
                        if (fieldType !== 0) {
                            Ex.Msg.alert(ExLocale.apiName, ExLocale.criteriaPanel.validateValueExpression.typeMismatch);
                            return false;
                        }
                    }
                }
                else {
                    if (fieldType !== 0) {
                        Ex.Msg.alert(ExLocale.apiName, ExLocale.criteriaPanel.validateValueExpression.typeMismatch);
                        return false;
                    }
                }
            }
        } else {
            if (!field && value) {
                me.columns[4].getEditor().setValue('');
                Ex.Msg.alert(ExLocale.apiName, ExLocale.criteriaPanel.validateValueExpression.selectFieldFirst);
                return false;
            }
        }
        return true;
    },
    initArguments: function(args,fieldComboStoreId){
        var Ex = Ext,
            ExLocale = Ex.localization.criteriaPanel.column;
        Ex.applyIf(args,{
            "externalValue": true,
            "data": [
                {connector: 'AND', operator: '=', fieldCombo: fieldComboStoreId}
            ],
            "fieldComboData": [
                {alias: '', dataIndex: ''}
            ],
            "gridColumnsConfig": {},
            "buttons": {}
        });
        Ex.applyIf(args.gridColumnsConfig,{
            "connector": {},
            "parenthesisI": {},
            "field": {},
            "operator": {},
            "value": {},
            "editValueColumn": {},
            "deleteValueColumn": {},
            "parenthesisF": {}
        });
        Ex.applyIf(args.gridColumnsConfig.connector,{
            text : ExLocale.connector,
            hidden : false,
            editable : true
        });
        Ex.applyIf(args.gridColumnsConfig.parenthesisI,{
            text: '(',
            hidden : false,
            editable : true
        });
        Ex.applyIf(args.gridColumnsConfig.field,{
            text: ExLocale.field,
            hidden : false,
            editable: true,
            "disabled": false,
            "queryMode": 'remote',
            "forceSelection": false
        });
        Ex.applyIf(args.gridColumnsConfig.operator,{
            text: ExLocale.operator,
            hidden : false,
            editable : true
        });
        Ext.applyIf(args.gridColumnsConfig.value,{
            text: ExLocale.value,
            hidden : false,
            editable : true
        });
        Ex.applyIf(args.gridColumnsConfig.editValueColumn,{
            hidden : false
        });
        Ex.applyIf(args.gridColumnsConfig.deleteValueColumn,{
            hidden : false
        });
        Ex.applyIf(args.gridColumnsConfig.parenthesisF,{
            text: ')',
            hidden : false,
            editable : true
        });
        Ex.applyIf(args.buttons,{
            "_add": true,
            "_delete": true
        });
        return args;
    }
});