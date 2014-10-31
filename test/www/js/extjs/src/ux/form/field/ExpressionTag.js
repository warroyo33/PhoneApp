/**
 * Created by Desar_6 on 06/10/2014.
 */
Ext.define('Ext.form.field.ExpressionTag',{
    extend: 'Ext.form.field.Tag',
    xtype: 'expressionTagField',
    assertField: 'assertName',
    hideTrigger: true,
    getMultiSelectItemMarkup: function() {
        var me = this;

        if (!me.multiSelectItemTpl) {
            if (!me.labelTpl) {
                me.labelTpl = '{' + me.assertField + '}:{' + me.displayField + '}';
            }
            me.labelTpl = me.getTpl('labelTpl');

            me.multiSelectItemTpl = new Ext.XTemplate([
                '<tpl for=".">',
                    '<li class="    ' + Ext.baseCSSPrefix + 'tagfield-item ',
                '<tpl if="this.isSelected(values)">',
                ' selected',
                '</tpl>',
                '{%',
                'values = values.data;',
                '%}',
                    '" qtip="{' + me.displayField + '}">' ,
                    '<div class="' + Ext.baseCSSPrefix + 'tagfield-item-text">{[this.getItemLabel(values)]}</div>',
                    '<div class="' + Ext.baseCSSPrefix + 'tagfield-item-close"></div>' ,
                '</li>' ,
                '</tpl>',
                {
                    isSelected: function(rec) {
                        return me.selectionModel.isSelected(rec);
                    },
                    getItemLabel: function(values) {
                        return me.labelTpl.apply(values);
                    }
                }
            ]);
        }
        if (!me.multiSelectItemTpl.isTemplate) {
            me.multiSelectItemTpl = me.getTpl('multiSelectItemTpl');
        }

        return me.multiSelectItemTpl.apply(me.valueStore.getRange());
    },
    setValue: function(value, doSelect, skipLoad) {
        var me = this,
            valueStore = me.valueStore,
            valueField = me.valueField,
            record, len, i, valueRecord, h,
            unknownValues = [];

        if (Ext.isEmpty(value)) {
            value = null;
        }
        if (Ext.isString(value) && me.multiSelect) {
            value = value.split(me.delimiter);
        }
        value = Ext.Array.from(value, true);

        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                valueRecord = valueStore.findExact(valueField, record);

                    valueRecord = me.findRecord(valueField, record);
                    if (!valueRecord) {
                        if (me.forceSelection) {
                            unknownValues.push(record);
                        } else {
                            valueRecord = {};
                            valueRecord[me.valueField] = record;
                            valueRecord[me.displayField] = record;
                            valueRecord = new me.valueStore.model(valueRecord);
                        }
                    }
                    if (valueRecord) {
                        value[i] = valueRecord;
                    }

            }
        }

        if ((skipLoad !== true) && (unknownValues.length > 0) && (me.queryMode === 'remote')) {
            var params = {};
            params[me.valueParam || me.valueField] = unknownValues.join(me.delimiter);
            me.store.load({
                params: params,
                callback: function() {
                    if (me.itemList) {
                        me.itemList.unmask();
                    }
                    me.setValue(value, doSelect, true);
                    me.autoSize();
                    me.lastQuery = false;
                }
            });
            return false;
        }

        // For single-select boxes, use the last good (formal record) value if possible
        if (!me.multiSelect && (value.length > 0)) {
            for (i = value.length - 1; i >= 0; i--) {
                if (value[i].isModel) {
                    value = value[i];
                    break;
                }
            }
            if (Ext.isArray(value)) {
                value = value[value.length - 1];
            }
        }

        return me.callParent([value, doSelect]);
    }
});