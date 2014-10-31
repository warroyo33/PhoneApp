/**
 * Created by DELL on 10/12/13.
 */
Ext.define('Ext.ux.grid.column.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkallcolumn',

    disableColumn: false,
    disableFunction: null,
    disabledColumnDataIndex: null,
    columnHeaderCheckbox: false,
    constructor: function(config) {
        var me = this;
        Ext.applyIf(me,{
            contextColumns:[me.dataIndex]
        });
        if(config.columnHeaderCheckbox)
        {
            var store = config.store;
            store.on("load", function () {
                me.updateColumnHeaderCheckbox(true);
            });
            config.text = me.getHeaderCheckboxImage(store, config.dataIndex,config.headerText);
        }

        me.addEvents({
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'beforecheckchange': false,
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange': false,
            /**
             * @event chainedcolumns
             * Fires when the checked state of CheckAllColumn changes
             * @param {Ext.ux.model} record
             */
            'chainedcolumns': false,
            /**
             * @event beforeHeaderCheckChange
             * Fires before the header checkbox is changed
             */
            'beforecheckchangebyheader': true
        });

        me.callParent(arguments);
    },
    updateColumnHeaderCheckbox: function(isLoad){
        var Ex = Ext,column = this;
        var grid = column.up('tablepanel');
        if (!isLoad){
            Ex.Array.each(grid.columns,function(column){
                if (column.contextColumns){
                    var image = column.getHeaderCheckboxImage(column.store, column.dataIndex,column.headerText);
                    column.setText(image);
                }
            });
        }else{
            var image = column.getHeaderCheckboxImage(column.store, column.dataIndex,column.headerText);
            column.setText(image);
        }
    },
    setMask:function(callback){
        var me = this;
        var grid = me.up('tablepanel');
        var test = new Ext.LoadMask(grid.el, {msg:Ext.localization.checkAllColumn.msgText.updating});
        me.store.currentMask = test;
        me.store.currentMask.on('show', function () {
            if (callback) callback(test);
        });
        test.show();
        return true;
    },
    toggleSortState: function(){
        var me = this;
        var auxFunction= function(masked){
            Ext.defer(function(){
                if(me.columnHeaderCheckbox)
                {
                    var grid = me.up('tablepanel'),
                        store = grid.store;
                    var isAllChecked = me.getStoreIsAllChecked(store, me.dataIndex);
                    store.each(function(record){
                        if (me.fireEvent('beforecheckchangebyheader',record, !isAllChecked)){
                            record.data[me.dataIndex] = !isAllChecked;
                            me.fireEvent('chainedcolumns', record,[me.dataIndex])
                            record.dirty = true;
                        };
                    });
                    me.store.checkingAll = true;
                    me.store.checkRenderCount = 0;
                    me.updateColumnHeaderCheckbox();
                    grid.view.refresh();
                }
                else
                    me.callParent(arguments);
            },100);
        };
        me.setMask(auxFunction);
    },

    getStoreIsAllChecked: function(store, dataIndex){
        var allItems,checkedItems = 0;
        allItems = (store.snapshot || store.data).length;
        checkedItems = store.query(dataIndex,true,false,false,false);
        if (allItems === checkedItems.length && allItems>0)
            return true;
        else
            return false;
    },
    getHeaderCheckboxImage: function(store, dataIndex,text){
        var allTrue = this.getStoreIsAllChecked(store, dataIndex);
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkcolumn'];
        if (allTrue) {
            cls.push(cssPrefix + 'grid-checkcolumn-checked');
        }
        if (typeof text !== "undefined" && Ext.String.trim(text) !== "")
            return '<div class="' + cls.join(' ') + '">&#160;&#160;&#160;&#160;&#160;&#160;' + text + '</div>'
        else
            return '<div class="' + cls.join(' ') + '">&#160;</div>'
    },
    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex),
                column = view.panel.columns[cellIndex];
            if(!(column.disableColumn || record.get(column.disabledColumnDataIndex) || (column.disableFunction && column.disableFunction(checked, record))))
            {
                if(this.fireEvent('beforecheckchange', this, recordIndex, checked, record))
                {
                        record.data[dataIndex] = checked;
                        record.dirty = true;
                    if (column.contextColumns) {
                        column.fireEvent('chainedcolumns', record,[dataIndex])
                    }
                    column.updateColumnHeaderCheckbox();
                    view.refresh();
                    this.fireEvent('checkchange', this, recordIndex, checked, record);
                }
            }
            return false;
        } else {
            return this.callParent(arguments);
        }
    },
    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value, metaData, record, rowIndex, colIndex, store, view){
        var me = this;
        me.store.checkRenderCount += 1;
        var disabled = "",
            column = view.panel.columns[colIndex];
        if(column.disableColumn || column.disabledColumnDataIndex || (column.disableFunction && column.disableFunction(value, record)))
            disabled = "-disabled";
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkcolumn' + disabled];
        if (value) {
            cls.push(cssPrefix + 'grid-checkcolumn-checked' + disabled);
        }
        if (me.store.checkingAll) {
            if (me.store.checkRenderCount === store.data.length) {
                me.store.currentMask.hide();
                me.store.checkingAll = false;
                me.store.checkRenderCount = 0;
            }
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});