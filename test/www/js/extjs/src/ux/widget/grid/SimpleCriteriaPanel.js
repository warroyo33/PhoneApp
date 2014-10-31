/**
 * Created by DELL on 04/06/2014.
 */
Ext.define('Ext.ux.widget.grid.SimpleCriteriaPanel',{
    extend:'Ext.grid.Panel',
    id:'MpaSimpleCriteriaPanel',
    initComponent: function(){
        var me = this;
        var args = me.args,
            Ex = Ext,
            ExArray= Ex.Array,
            ExJSON = Ex.JSON,
            ELocale= Ex.localization;

        args = me.initArguments(args);
        /**
         * in this store we'll save the configuration of the filter criteria for this table/view
         * @type {Object} Ext.data.Store
         */
        var whereStore = new Ex.create('Ext.ux.widget.grid.store.SimpleCriteriaStore', {
            data: args.data
        });
        /**
         * checks whether the configuration of the brackets is valid or not, and if the number of open parentheses
         * corresponds to the number of closing parentheses
         * @returns {boolean}
         */
        me.isValid = function(){
            var openParenthesis = 0, closedParenthesis= 0;
            Ex.Array.each(whereStore.data.items, function(record){
                if (record.get('connector')!=="" && record.get('operator')!=="" && record.get('value')!==""){
                    if (record.get('parenthesisI'))
                        openParenthesis++;
                    if (record.get('parenthesisF'))
                        closedParenthesis++;
                }
            });
            return (openParenthesis-closedParenthesis) === 0;
        };

        var whereGridCellEditing =  Ex.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
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
        Ex.applyIf(me,{
            store: whereStore,
            selType: 'cellmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            tbar: [
                {

                    iconCls:'criteria-add',
                    hidden: !args.buttons._add,
                    handler: function () {
                        whereStore.add({"connector": 'AND', "operator": '='});
                    }

                },
                {
                    iconCls: 'criteria-remove',
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
                    width: 75,
                    editor: {
                        store: ['AND', 'OR'],
                        editable: false,
                        xtype: 'combobox'
                    },
                    renderer:function(value,metadata,record,rowIndex){
                        console.log(record);
                        console.log(rowIndex);
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
                    text: args.gridColumnsConfig.operator.text,
                    hidden: args.gridColumnsConfig.operator.hidden,
                    editable : args.gridColumnsConfig.operator.editable,
                    dataIndex: 'operator',
                    sortable: false,
                    menuDisabled : true,
                    draggable: false,
                    width: 71,
                    editor: {
                        store: ['=', '<', '>', '<>', '<=', '>='/*, 'LIKE', 'NOT LIKE'*/],
                        editable: false,
                        xtype: 'combobox'
                    }
                },
                {
                    text: args.gridColumnsConfig.value.text,
                    hidden: args.gridColumnsConfig.value.hidden,
                    editable : args.gridColumnsConfig.value.editable,
                    dataIndex: 'value',
                    sortable: false,
                    draggable: false,
                    width: 160,
                    menuDisabled : true,
                    editor: {
                        xtype: 'textfield'
                    }
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
                    if (item.data.connector && item.data.operator && item.data.value){
                        item.data.criteriaIndex=rowCount;
                        ExArray.push(dataArray, item.data);
                        rowCount++;
                    }

                });
                return {columns: args.columns, data: ExJSON.encode(dataArray)};
            }
        });
        me.callParent(arguments);
    },
    initArguments: function(args){
        var Ex = Ext,
            ExLocale = Ex.localization.criteriaPanel.column;
        Ex.applyIf(args,{
            "externalValue": true,
            "data": [
                {connector: 'AND', operator: '='}
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
})